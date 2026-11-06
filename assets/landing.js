(function () {
  const { $, $$, esc, rub } = K;
  let D = null, CFG = null;

  $('#hero-fig').innerHTML = K.fig('prompt');
  $('#access-fig').innerHTML = K.fig('access');
  $('#roadmap').innerHTML = K.fig('roadmap');
  K.observe();

  const sampleQuiz = { id: 'demo', quiz: [
    { q: 'Модель назвала номер статьи закона. Что делать?', a: ['Доверять: модель обучена на законах', 'Попросить источник, открыть и сверить с официальным текстом', 'Спросить ту же модель, уверена ли она'], c: 1, e: 'Номера, даты и цифры — зона частых ошибок ИИ. Факт без проверенного источника не используем.' },
    { q: 'Какой формат картинки нужен для карточки Wildberries?', a: ['16:9', '3:4', '21:9'], c: 1, e: 'Маркетплейсы используют вертикальный формат 3:4.' }
  ] };

  const tabs = {
    fig: () => `<div class="tab-grid">${K.fig('tokens')}${K.fig('automation')}</div>`,
    tools: () => '<div class="dash-slot" data-dash="tools"></div>',
    costs: () => '<div class="dash-slot" data-dash="costs"></div>',
    prompt: () => {
      const free = D ? D.prompts.filter(p => !p.locked).slice(0, 2) : [];
      const locked = D ? D.prompts.filter(p => p.locked).slice(0, 4) : [];
      return `<div class="tab-grid">${free.map(p => K.promptCard(p.title, p.text, { meta: 'Из модуля «' + esc(p.cat) + '»' })).join('')}</div>
        <div class="locked-list">${locked.map(p => `<div class="ll-item"><span class="lock-pill">В полном доступе</span><b>${esc(p.title)}</b><small>${esc(p.cat)}</small></div>`).join('')}</div>`;
    },
    quiz: () => '<div class="quiz" id="demo-quiz"></div>'
  };
  const showTab = t => {
    $$('.tab').forEach(b => { const on = b.dataset.t === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const body = $('#tab-body'); body.innerHTML = tabs[t]();
    if (D) K.mountDash(body, D);
    if (t === 'quiz') { try { const q = K.store.get('quiz', {}); delete q.demo; K.store.set('quiz', q); } catch { } K.quiz($('#demo-quiz'), sampleQuiz); }
    K.observe(body);
  };
  $$('.tab').forEach(b => b.addEventListener('click', () => showTab(b.dataset.t)));

  const renderProgram = () => {
    $('#program-list').innerHTML = D.modules.map(m => `<details class="mod reveal"${m.free ? ' open' : ''}>
      <summary><span class="mod-n">${m.num}</span><span class="mod-t"><b>${esc(m.title)}</b><small>${esc(m.sub)}</small></span>
      <span class="mod-meta">${m.lessons.length} ${m.lessons.length < 5 ? 'урока' : 'уроков'} · ${m.lessons.reduce((s, l) => s + l.min, 0)} мин${m.free ? ' <span class="free">Бесплатно</span>' : ''}</span></summary>
      <ol class="mod-ls">${m.lessons.map(l => `<li><span>${l.id}</span>${m.free ? `<a href="/app#l-${l.id}">${esc(l.title)}</a>` : esc(l.title)}<em>${l.min} мин</em></li>`).join('')}${m.quizCount ? `<li class="mod-quiz"><span>Тест</span>${m.quizCount} вопроса для самопроверки</li>` : ''}</ol></details>`).join('');
    K.observe($('#program-list'));
  };

  const renderTariffs = () => {
    const ts = CFG.tariffs;
    $('#tariffs').innerHTML = ts.map((t, i) => `<article class="tariff reveal${i === 0 ? ' main' : ''}">
      ${i === 0 ? '<span class="tariff-flag">Выбирают чаще</span>' : ''}<h3>${esc(t.name)}</h3><p class="t-lead">${esc(t.lead)}</p>
      <div class="t-price">${rub(t.price)}</div>
      <ul class="list">${t.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <button class="btn btn-lg ${i === 0 ? 'btn-red' : 'btn-ghost'}" type="button" data-buy="${t.id}">Купить</button></article>`).join('');
    $('#tar-opts').innerHTML = ts.map((t, i) => `<label class="tar-opt"><input type="radio" name="tariff" value="${t.id}"${i === 0 ? ' checked' : ''}><span><b>${esc(t.name)}</b><small>${esc(t.lead)}</small></span><span class="num">${rub(t.price)}</span></label>`).join('');
    $('#pay-note').textContent = CFG.mode === 'off' ? 'Приём оплаты скоро откроется.' : 'Платёж проходит на защищённой странице ЮKassa. Чек придёт на почту.';
    $('#buy-mode').innerHTML = CFG.mode === 'demo' ? '<span class="test-badge">Тестовый режим</span> Оплата имитируется, деньги не списываются.' : CFG.mode === 'live' ? 'Вы перейдёте на защищённую страницу оплаты ЮKassa.' : '';
    const s = CFG.seller; $('#seller-line').textContent = `© 2026 ${s.name}${s.inn ? ', ИНН ' + s.inn : ''}`;
    K.observe($('#tariffs'));
  };

  const modal = $('#buy');
  const open = id => { modal.hidden = false; const r = $(`#tar-opts input[value="${id}"]`); if (r) r.checked = true; setTimeout(() => $('#buy-email').focus(), 50); };
  const close = () => { modal.hidden = true; };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-buy]'); if (b) { e.preventDefault(); open(b.dataset.buy); }
    if (e.target.closest('[data-close]') || e.target === modal) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  $('#buy-form').addEventListener('submit', async e => {
    e.preventDefault();
    const go = $('#buy-go'), err = $('#buy-err'); err.textContent = '';
    const tariff = ($('#tar-opts input:checked') || {}).value, email = $('#buy-email').value.trim(), consent = $('#buy-consent').checked;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Проверьте адрес почты: на него придёт чек.'; return; }
    if (!consent) { err.textContent = 'Отметьте согласие с офертой и политикой обработки данных.'; return; }
    go.disabled = true; go.textContent = 'Создаём платёж…';
    try { const r = await K.api('checkout', { body: { tariff, email, consent } }); location.href = r.url; }
    catch (x) { err.textContent = x.message; go.disabled = false; go.textContent = 'Перейти к оплате'; }
  });

  // мягкая подсветка активного раздела
  const links = $$('.top-nav a');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    ['program', 'inside', 'money', 'pricing', 'faq'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  Promise.all([K.api('content'), K.api('config')]).then(([d, c]) => {
    D = d; CFG = c;
    const st = d.stats;
    const set = (i, v) => { const el = $$('#stats dd')[i]; el.dataset.count = v; el.textContent = v; };
    set(0, st.modules); set(1, st.lessons); set(2, Math.round(st.minutes / 60)); set(3, st.prompts); set(4, st.tools); set(5, st.money);
    $$('#stats dd').forEach(el => { el._counted = 0; });
    renderProgram(); renderTariffs(); K.mountDash(document, D); showTab('fig'); K.observe();
  }).catch(() => { $('#program-list').innerHTML = '<p class="err">Не удалось загрузить программу. Обновите страницу.</p>'; showTab('fig'); });
})();
