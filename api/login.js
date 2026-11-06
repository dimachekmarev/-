const L = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, {});
  const key = String(L.body(req).key || '').trim().toUpperCase();
  if (!/^AI-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(key)) return L.send(res, 400, { error: 'Ключ выглядит так: AI-XXXX-XXXX-XXXX' });
  try {
    const o = await L.rpc('course_find_key', { p_key: key });
    if (!o) return L.send(res, 404, { error: 'Ключ не найден или заказ ещё не оплачен' });
    return L.send(res, 200, { token: L.tokenFor(o), tariff: o.tariff, key: o.access_key });
  } catch (e) { console.error('login', e.message); return L.send(res, 502, { error: 'Сервис входа недоступен, попробуйте через минуту' }); }
};
