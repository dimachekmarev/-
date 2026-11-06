const L = require('./_lib');
// Панель автора: статистика продаж и выдача ключей вручную
module.exports = async (req, res) => {
  const b = req.method === 'POST' ? L.body(req) : {};
  const secret = b.secret || req.query.secret;
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) return L.send(res, 403, { error: 'Неверный пароль администратора' });
  try {
    if (req.method === 'POST' && b.action === 'keys') {
      const t = L.TARIFFS[b.tariff] || L.TARIFFS.base;
      const n = Math.min(Math.max(parseInt(b.count, 10) || 1, 1), 50);
      const keys = [];
      for (let i = 0; i < n; i++) {
        const o = await L.rpc('course_create_order', { p_tariff: t.id, p_amount: 0, p_source: 'manual' });
        await L.rpc('course_set_status', { p_id: o.id, p_status: 'paid' });
        keys.push(o.access_key);
      }
      return L.send(res, 200, { keys, tariff: t.name });
    }
    return L.send(res, 200, { stats: await L.rpc('course_stats', {}), mode: L.mode(), tariffs: Object.values(L.TARIFFS) });
  } catch (e) { console.error('admin', e.message); return L.send(res, 502, { error: e.message }); }
};
