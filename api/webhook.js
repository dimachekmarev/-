const L = require('./_lib');
// Уведомления ЮKassa: проверяем платёж запросом к API и только потом открываем доступ
module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, {});
  const b = L.body(req);
  try {
    const obj = b.object || {};
    const id = obj.metadata && obj.metadata.order_id;
    if (!L.isUuid(id) || L.mode() !== 'live') return L.send(res, 200, { ok: true });
    const o = await L.rpc('course_get_order', { p_id: id });
    if (o && o.payment_id === obj.id) await L.sync(o);
    return L.send(res, 200, { ok: true });
  } catch (e) { console.error('webhook', e.message); return L.send(res, 500, { ok: false }); }
};
