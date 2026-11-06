const L = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { error: 'Метод не поддерживается' });
  const b = L.body(req);
  const t = L.TARIFFS[b.tariff];
  const email = String(b.email || '').trim().toLowerCase();
  if (!t) return L.send(res, 400, { error: 'Выберите тариф' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return L.send(res, 400, { error: 'Проверьте адрес почты: на него придёт чек' });
  if (!b.consent) return L.send(res, 400, { error: 'Нужно согласие с офертой и политикой обработки данных' });
  const mode = L.mode();
  if (mode === 'off') return L.send(res, 503, { error: 'Приём оплаты временно закрыт. Попробуйте позже.' });
  try {
    const o = await L.rpc('course_create_order', { p_tariff: t.id, p_amount: t.price, p_source: mode === 'live' ? 'yookassa' : 'demo' });
    const back = L.origin(req) + '/pay?order=' + o.id;
    if (mode === 'demo') return L.send(res, 200, { url: back + '&demo=1' });
    const pay = {
      amount: { value: t.price.toFixed(2), currency: 'RUB' },
      capture: true,
      confirmation: { type: 'redirect', return_url: back },
      description: ('Курс «ИИ. Полный доступ», тариф «' + t.name + '»').slice(0, 128),
      metadata: { order_id: o.id, tariff: t.id }
    };
    if (process.env.YOOKASSA_RECEIPT === '1') {
      pay.receipt = { customer: { email }, items: [{ description: ('Доступ к онлайн-курсу «ИИ. Полный доступ». Ключ ' + o.access_key).slice(0, 128), quantity: '1.00', amount: { value: t.price.toFixed(2), currency: 'RUB' }, vat_code: Number(process.env.YOOKASSA_VAT || 1), payment_mode: 'full_payment', payment_subject: 'service' }] };
    }
    const p = await L.yk('POST', '/payments', pay, o.id);
    await L.rpc('course_set_payment', { p_id: o.id, p_payment_id: p.id });
    return L.send(res, 200, { url: p.confirmation.confirmation_url });
  } catch (e) {
    console.error('checkout', e.message);
    return L.send(res, 502, { error: 'Не удалось создать платёж. Попробуйте ещё раз через минуту.' });
  }
};
