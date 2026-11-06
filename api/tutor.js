// ИИ-наставник курса: отвечает по материалам уроков через любой OpenAI-совместимый API
const L = require('./_lib');
const C = require('./_course');
const E = process.env;
const LIMIT = Number(E.TUTOR_DAILY_LIMIT || 40);
const used = new Map();
let index = null;

const STOP = new Set('как что это для или при без где когда какой какие какая надо нужно можно мне меня есть все его они она оно так уже еще тоже чтобы если the and how what'.split(' '));
const SYN = { telegram: 'телег', телеграм: 'телег', тг: 'телег', bot: 'бот', бота: 'бот', боты: 'бот', ботов: 'бот', botfather: 'бот', chatgpt: 'chatg', гпт: 'chatg', чатгпт: 'chatg', брать: 'цена', стоит: 'цена', стоимость: 'цена', сколько: 'цена', цену: 'цена', цены: 'цена', заработать: 'зараб', деньги: 'зараб', n8n: 'n8n', впн: 'vpn', оплатить: 'оплат', оплата: 'оплат', карта: 'оплат', сайт: 'сайт', сайта: 'сайт', лендинг: 'сайт', картинку: 'карти', фото: 'карти', видео: 'видео', промпт: 'промп', промпты: 'промп', запрос: 'промп' };
const words = s => (s.toLowerCase().replace(/ё/g, 'е').match(/[a-zа-я0-9]{2,}/g) || []).filter(w => !STOP.has(w)).map(w => SYN[w] || (w.length > 5 ? w.slice(0, 5) : w)).filter(w => w.length > 2);

function build() {
  if (index) return index;
  const chunks = [];
  for (const m of C.parse().modules) for (const l of m.lessons) {
    const text = l.md.replace(/::(fig|dash|howto) \S+/g, '').replace(/::prompt /g, 'Промпт: ').replace(/::(end|table|quiz)/g, '');
    let buf = '';
    for (const part of text.split(/\n\s*\n/)) {
      if ((buf + part).length > 900 && buf) { chunks.push({ id: l.id, title: l.title, mod: m.title, text: buf.trim() }); buf = ''; }
      buf += part + '\n\n';
    }
    if (buf.trim()) chunks.push({ id: l.id, title: l.title, mod: m.title, text: buf.trim() });
  }
  const df = new Map();
  chunks.forEach(c => { c.w = new Map(); words(c.title + ' ' + c.title + ' ' + c.text).forEach(w => c.w.set(w, (c.w.get(w) || 0) + 1)); c.w.forEach((_, w) => df.set(w, (df.get(w) || 0) + 1)); });
  index = { chunks, df, n: chunks.length };
  return index;
}

function search(q, k = 5) {
  const { chunks, df, n } = build();
  const qs = [...new Set(words(q))];
  return chunks.map(c => ({ c, s: qs.reduce((s, w) => s + (c.w.has(w) ? (1 + Math.log(c.w.get(w))) * Math.log(1 + n / (df.get(w) || 1)) : 0), 0) }))
    .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map(x => x.c);
}

const SYSTEM = `Ты — наставник онлайн-курса «ИИ. Полный доступ» для новичков. Отвечай по-русски, простыми словами, коротко и по делу: 3–8 предложений или короткий список шагов.
Правила:
- Опирайся на материалы курса ниже. Когда используешь урок, называй его номер: «см. урок 3.2».
- Если в материалах нет ответа, отвечай из общих знаний, но прямо скажи, что в курсе этого нет.
- Не выдумывай цены, номера законов, даты и названия тарифов. Если не уверен, так и скажи и посоветуй проверить на официальном сайте.
- Не рекомендуй и не рекламируй средства обхода блокировок. Предлагай легальные маршруты из модуля 3.
- Не проси и не обрабатывай персональные данные: напоминай обезличивать данные клиентов.
- Помогай учиться: если человек застрял, дай следующий конкретный шаг.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, {});
  const who = L.bearer(req);
  if (!who) return L.send(res, 401, { error: 'Наставник доступен в полной версии курса' });
  if (!E.TUTOR_API_URL || !E.TUTOR_API_KEY) return L.send(res, 503, { error: 'Наставник подключается и скоро заработает' });
  const b = L.body(req);
  const q = String(b.q || '').trim().slice(0, 1500);
  if (q.length < 2) return L.send(res, 400, { error: 'Напишите вопрос' });
  const day = new Date().toISOString().slice(0, 10), u = used.get(who.o) || { day, n: 0 };
  if (u.day !== day) { u.day = day; u.n = 0; }
  if (u.n >= LIMIT) return L.send(res, 429, { error: `Лимит ${LIMIT} вопросов в день исчерпан. Продолжим завтра.` });
  const hits = search(q + ' ' + (b.lesson || ''));
  const ctx = hits.map(h => `### Урок ${h.id}. ${h.title} (модуль «${h.mod}»)\n${h.text}`).join('\n\n');
  const hist = Array.isArray(b.history) ? b.history.slice(-6).filter(m => m && (m.r === 'u' || m.r === 'a') && typeof m.t === 'string').map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t.slice(0, 1500) })) : [];
  const messages = [{ role: 'system', content: SYSTEM + (b.lesson ? `\nУченик сейчас на уроке ${String(b.lesson).slice(0, 8)}.` : '') + '\n\nМатериалы курса:\n' + (ctx || 'Подходящих материалов не найдено.') }, ...hist, { role: 'user', content: q }];
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 45000);
    const r = await fetch(E.TUTOR_API_URL.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST', signal: ctl.signal,
      headers: { Authorization: 'Bearer ' + E.TUTOR_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: E.TUTOR_MODEL || 'gpt-4o-mini', messages, temperature: 0.3, max_tokens: 800 })
    });
    clearTimeout(t);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('tutor api', r.status, JSON.stringify(j).slice(0, 300)); return L.send(res, 502, { error: 'Наставник сейчас недоступен, попробуйте через минуту' }); }
    const answer = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || '').trim();
    if (!answer) return L.send(res, 502, { error: 'Пустой ответ, попробуйте переформулировать вопрос' });
    u.n++; used.set(who.o, u);
    const seen = new Set();
    return L.send(res, 200, { answer, left: LIMIT - u.n, refs: hits.filter(h => !seen.has(h.id) && seen.add(h.id)).slice(0, 3).map(h => ({ id: h.id, title: h.title })) });
  } catch (e) { console.error('tutor', e.message); return L.send(res, 502, { error: 'Наставник не ответил вовремя, попробуйте ещё раз' }); }
};
module.exports.search = search;
