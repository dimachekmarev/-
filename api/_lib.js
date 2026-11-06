// Общие функции: тарифы, токены доступа, база заказов (Supabase RPC), ЮKassa
const crypto = require('crypto');
const E = process.env;

const TARIFFS = {
  base: {
    id: 'base', name: 'Полный доступ', price: Number(E.PRICE_BASE || 14900),
    lead: 'Весь курс для самостоятельного прохождения',
    features: ['12 модулей, 52 урока, около 9 часов', 'Все промпты с копированием в один клик', 'Интерактивные панели: инструменты, подписки, заработок, цена услуги', 'Тесты и трекер прогресса', 'PDF-учебник', 'Обновления курса в течение года']
  },
  pro: {
    id: 'pro', name: 'Доступ + разбор проекта', price: Number(E.PRICE_PRO || 29900),
    lead: 'Курс и личный разбор вашего направления с автором',
    features: ['Всё из тарифа «Полный доступ»', 'Созвон 60 минут: выбор направления и стека под вас', 'Разбор вашего первого проекта, КП или сайта', 'План запуска на 30 дней под вашу ситуацию']
  }
};

const TOKEN_SECRET = E.TOKEN_SECRET || 'dev-only-secret';
const b64u = s => Buffer.from(s).toString('base64url');
function sign(payload) {
  const p = b64u(JSON.stringify(payload));
  return p + '.' + crypto.createHmac('sha256', TOKEN_SECRET).update(p).digest('base64url');
}
function verify(tok) {
  if (!tok || typeof tok !== 'string') return null;
  const [p, s] = tok.split('.');
  if (!p || !s) return null;
  const e = crypto.createHmac('sha256', TOKEN_SECRET).update(p).digest('base64url');
  if (e.length !== s.length || !crypto.timingSafeEqual(Buffer.from(e), Buffer.from(s))) return null;
  try {
    const d = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (d.e && d.e < Date.now() / 1000) return null;
    return d;
  } catch { return null; }
}
const tokenFor = o => sign({ o: o.id, t: o.tariff, e: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 3 });
const bearer = req => {
  const h = req.headers.authorization || '';
  return verify(h.startsWith('Bearer ') ? h.slice(7) : (req.query && req.query.t));
};

// База: функции Postgres, защищённые секретом. Тестовый режим — память процесса.
const mem = new Map();
async function rpc(fn, args) {
  if (!E.SUPABASE_URL) return memRpc(fn, args);
  const r = await fetch(`${E.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: E.SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_secret: E.DB_SECRET, ...args })
  });
  const t = await r.text();
  if (!r.ok) throw new Error('db ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : null;
}
function memRpc(fn, a) {
  const key = () => 'AI-' + [0, 0, 0].map(() => crypto.randomBytes(2).toString('hex').toUpperCase()).join('-');
  if (fn === 'course_create_order') { const o = { id: crypto.randomUUID(), tariff: a.p_tariff, amount: a.p_amount, source: a.p_source, status: 'pending', access_key: key(), payment_id: null }; mem.set(o.id, o); return { ...o }; }
  if (fn === 'course_get_order') { const o = mem.get(a.p_id); return o ? { ...o } : null; }
  if (fn === 'course_set_payment') { const o = mem.get(a.p_id); o.payment_id = a.p_payment_id; return { ...o }; }
  if (fn === 'course_set_status') { const o = mem.get(a.p_id); if (!o) return null; if (o.status === 'paid') return { order: { ...o }, changed: false }; const ch = o.status !== a.p_status; o.status = a.p_status; return { order: { ...o }, changed: ch }; }
  if (fn === 'course_find_key') { for (const o of mem.values()) if (o.access_key === String(a.p_key).trim().toUpperCase() && o.status === 'paid') return { ...o }; return null; }
  if (fn === 'course_stats') { const all = [...mem.values()]; const paid = all.filter(o => o.status === 'paid'); return { paid: paid.filter(o => o.source === 'yookassa').length, revenue: paid.filter(o => o.source === 'yookassa').reduce((s, o) => s + o.amount, 0), manual: paid.filter(o => o.source === 'manual').length, demo: paid.filter(o => o.source === 'demo').length, pending: all.filter(o => o.status === 'pending').length, recent: all.slice(-50).reverse() }; }
}

function mode() {
  if (E.YOOKASSA_SHOP_ID && E.YOOKASSA_SECRET_KEY) return 'live';
  return E.DEMO_MODE === '1' ? 'demo' : 'off';
}

async function yk(method, path, body, idem) {
  const headers = { Authorization: 'Basic ' + Buffer.from(E.YOOKASSA_SHOP_ID + ':' + E.YOOKASSA_SECRET_KEY).toString('base64'), 'Content-Type': 'application/json' };
  if (idem) headers['Idempotence-Key'] = idem;
  const r = await fetch('https://api.yookassa.ru/v3' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error('yookassa ' + r.status + ' ' + (j.description || j.code || ''));
  return j;
}

async function notify(order) {
  if (!E.N8N_WEBHOOK_URL) return;
  try {
    await fetch(E.N8N_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'course.paid', order_id: order.id, tariff: order.tariff, amount: order.amount, access_key: order.access_key, source: order.source, paid_at: new Date().toISOString() }) });
  } catch (e) { console.error('notify failed', e.message); }
}

async function markPaid(id) {
  const r = await rpc('course_set_status', { p_id: id, p_status: 'paid' });
  if (r && r.changed) await notify(r.order);
  return r && r.order;
}

// Проверяем статус платежа в ЮKassa (не доверяем телу уведомления)
async function sync(order) {
  if (!order || order.status === 'paid' || !order.payment_id || mode() !== 'live') return order;
  const p = await yk('GET', '/payments/' + order.payment_id);
  if (p.status === 'succeeded' && p.metadata && p.metadata.order_id === order.id) return await markPaid(order.id);
  if (p.status === 'canceled') { const r = await rpc('course_set_status', { p_id: order.id, p_status: 'canceled' }); return r.order; }
  return order;
}

const origin = req => E.SITE_URL || ('https://' + (req.headers['x-forwarded-host'] || req.headers.host));
const isUuid = s => /^[0-9a-f-]{36}$/i.test(String(s || ''));
const body = req => (typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {}));
function send(res, code, obj) { res.statusCode = code; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); }
function seller() { return { name: E.SELLER_NAME || 'Чекмарёв Дмитрий', inn: E.SELLER_INN || '', email: E.SELLER_EMAIL || '', status: E.SELLER_STATUS || 'самозанятый' }; }

module.exports = { TARIFFS, sign, verify, tokenFor, bearer, rpc, mode, yk, notify, markPaid, sync, origin, isUuid, body, send, seller };
