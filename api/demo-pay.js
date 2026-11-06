const L = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, {});
  if (L.mode() !== 'demo') return L.send(res, 403, { error: 'Тестовая оплата отключена' });
  const id = L.body(req).order;
  if (!L.isUuid(id)) return L.send(res, 400, { error: 'Неверный заказ' });
  const o = await L.rpc('course_get_order', { p_id: id });
  if (!o || o.source !== 'demo') return L.send(res, 404, { error: 'Заказ не найден' });
  await L.markPaid(id);
  return L.send(res, 200, { ok: true });
};
