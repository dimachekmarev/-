const L = require('./_lib');
module.exports = async (req, res) => {
  const id = req.query.id;
  if (!L.isUuid(id)) return L.send(res, 400, { error: 'Неверный номер заказа' });
  try {
    let o = await L.rpc('course_get_order', { p_id: id });
    if (!o) return L.send(res, 404, { error: 'Заказ не найден' });
    o = await L.sync(o);
    const out = { status: o.status, tariff: o.tariff, amount: o.amount, demo: o.source === 'demo', mode: L.mode() };
    if (o.status === 'paid') { out.key = o.access_key; out.token = L.tokenFor(o); }
    return L.send(res, 200, out);
  } catch (e) { console.error('order', e.message); return L.send(res, 502, { error: 'Не удалось проверить оплату, обновите страницу' }); }
};
