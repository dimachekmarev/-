(function () {
  const { $, $$, esc, rub } = K;
  let D = null;
  const main = $('#main'), side = $('#side');
  const prog = () => K.store.get('done', {});
  const allLessons = () => D.modules.flatMap(m => m.lessons.map(l => ({ ...l, m })));
  const word = (n, a, b, c) => { const k = n % 100, j = n % 10; return k > 10 && k < 20 ? c : j === 1 ? a : j > 1 && j < 5 ? b : c; };

  async function load() {
    try { D = await K.api('content'); }
    catch (e) { main.innerHTML = `<div class="view"><p class="err">Не удалось загрузить курс: ${esc(e.message)}. Обновите страницу.</p></div>`; return; }
    if (!D.paid && K.store.get('token', null)) { K.store.set('token', null); }
    const pill = $('#pill'); pill.hidden = false;
    pill.className = 'access-pill ' + (D.paid ? 'paid' : 'trial');
    pill.textContent = D.paid ? 'Полный доступ' : 'Пробный доступ';
    $('#buy-top').hidden = D.paid; $('#login-top').hidden = D.paid;
    route();
  }

  // ---------- оглавление ----------
  function drawSide(cur) {
    const done = prog(), ls = allLessons(), n = ls.filter(l => done[l.id]).length;
    const curMod = cur && cur.m ? cur.m.id : null;
    const view = location.hash.slice(1) || 'home';
    side.innerHTML = `<div class="side-prog"><b><span>Пройдено</span><span>${n} из ${ls.length}</span></b><div class="bar"><i style="--w:${(n / ls.length * 100).toFixed(1)}%"></i></div></div>
      ${D.modules.map(m => {
      const md = m.lessons.filter(l => done[l.id]).length;
      return `<div class="s-mod${m.locked ? ' locked' : ''}${m.id === curMod ? ' cur open' : ''}" data-m="${m.id}"><button type="button" aria-expanded="${m.id === curMod}"><span class="s-num">${m.num}</span><span>${esc(m.title)}</span><span class="s-st${md === m.lessons.length ? ' done' : ''}">${m.locked ? 'закрыт' : md + '/' + m.lessons.length}</span></button>
        <ul class="s-ls">${m.lessons.map(l => `<li><a href="#l-${l.id}" class="${cur && cur.id === l.id ? 'on' : ''}${done[l.id] ? ' done' : ''}${m.locked ? ' lk' : ''}"><span class="ck"></span><span>${l.id} ${esc(l.title)}</span></a></li>`).join('')}</ul></div>`;
    }).join('')}
      <nav class="side-sec" aria-label="Разделы">${[['home', 'Главная'], ['prompts', 'Промпты', D.prompts.length], ['tools', 'Инструменты и ссылки', D.tools.length], ['money', 'Заработок'], ['glossary', 'Глоссарий', D.glossary.length], ['progress', 'Мой прогресс'], ['book', 'Учебник и PDF']].map(([k, t, c]) => `<a href="#${k}" class="${view === k ? 'on' : ''}">${t}${c ? `<small>${c}</small>` : ''}</a>`).join('')}</nav>`;
  }
  side.addEventListener('click', e => {
    const b = e.target.closest('.s-mod > button'); if (b) { const m = b.parentElement; m.classList.toggle('open'); b.setAttribute('aria-expanded', m.classList.contains('open')); return; }
    if (e.target.closest('a')) toggleSide(false);
  });
  const toggleSide = v => { side.classList.toggle('show', v); $('#toc-btn').setAttribute('aria-expanded', v); };
  $('#toc-btn').addEventListener('click', () => toggleSide(!side.classList.contains('show')));

  // ---------- маршрутизация ----------
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    let cur = null;
    if (h.startsWith('l-')) { cur = allLessons().find(l => l.id === h.slice(2)); }
    drawSide(cur);
    const V = { home, prompts, tools, money, glossary, progress, book, login };
    if (cur) lesson(cur); else (V[h] || home)();
    $('#m-where').textContent = cur ? `Урок ${cur.id}` : '';
    window.scrollTo(0, 0);
    K.observe(main);
  }
  window.addEventListener('hashchange', route);
  const setView = (html, wide) => { main.innerHTML = `<div class="view${wide ? ' wide' : ''}">${html}</div>`; return main.firstChild; };

  // ---------- главная ----------
  function home() {
    const done = prog(), ls = allLessons(), n = ls.filter(l => done[l.id]).length;
    const next = ls.find(l => !done[l.id] && !l.m.locked) || ls.find(l => !done[l.id]) || ls[0];
    const q = K.store.get('quiz', {});
    const qs = Object.values(q).filter(x => x && x.n); const qAvg = qs.length ? Math.round(qs.reduce((s, x) => s + x.s / x.n, 0) / qs.length * 100) : 0;
    setView(`<div class="page-h"><span class="eyebrow">${D.paid ? 'Полный доступ открыт' : 'Пробный доступ: модули 00 и 01'}</span><h1 class="l-title" style="margin:0">${n ? 'С возвращением' : 'Добро пожаловать в курс'}</h1>
      <p>${D.stats.modules} модулей, ${D.stats.lessons} уроков, около ${Math.round(D.stats.minutes / 60)} часов материала. Каждый урок заканчивается действием — так знания превращаются в навык.</p></div>
      <div class="row" style="display:flex;gap:.6em;flex-wrap:wrap"><a class="btn btn-lg" href="#l-${next.id}">${n ? 'Продолжить' : 'Начать'}: урок ${next.id}</a>${D.paid ? '' : '<a class="btn btn-lg btn-ghost" href="/#pricing">Открыть все модули</a>'}</div>
      <div class="pr-tiles"><div class="tile"><span>Уроков пройдено</span><b data-count="${n}">${n}</b></div><div class="tile"><span>Прогресс курса</span><b data-count="${Math.round(n / ls.length * 100)}" data-suffix="%">${Math.round(n / ls.length * 100)}%</b></div><div class="tile"><span>Средний результат тестов</span><b data-count="${qAvg}" data-suffix="%">${qAvg}%</b></div><div class="tile"><span>Сервисов попробовано</span><b data-count="${Object.values(K.store.get('tried', {})).filter(Boolean).length}">0</b></div></div>
      ${K.fig('roadmap')}
      <div class="lk-list">${[['#prompts', 'Библиотека промптов', D.prompts.length + ' шаблонов с копированием в один клик'], ['#tools', 'Инструменты и ссылки', D.tools.length + ' сервисов: что бесплатно, что платно, доступ из России'], ['#money', 'Карта заработка', D.money.length + ' направлений с чеками и сроками'], ['#book', 'Учебник и PDF', 'Весь курс одной страницей для печати']].map(([h, t, s]) => `<a class="lk-item" href="${h}" style="text-decoration:none"><b style="font-family:var(--f-d)">${t}</b><small>${s}</small></a>`).join('')}</div>`, true);
  }

  // ---------- урок ----------
  function lesson(l) {
    const m = l.m, idx = m.lessons.findIndex(x => x.id === l.id);
    const ls = allLessons(), gi = ls.findIndex(x => x.id === l.id), prev = ls[gi - 1], next = ls[gi + 1];
    const head = `<div class="l-eyebrow"><b>Модуль ${m.num}</b><span>${esc(m.title)}</span><span>Урок ${idx + 1} из ${m.lessons.length}</span><span>${l.min} мин</span></div><h1 class="l-title">${esc(l.title)}</h1>`;
    if (m.locked) {
      setView(`${head}<div class="paywall reveal"><span class="eyebrow">Модуль в полном доступе</span><h3>${esc(m.sub)}</h3>
        <ul class="pw-ls">${m.lessons.map(x => `<li><span>${x.id}</span>${esc(x.title)} · ${x.min} мин</li>`).join('')}</ul>
        <div class="row"><a class="btn btn-red btn-lg" href="/#pricing">Купить полный доступ</a><a class="btn btn-ghost" href="#l-0.1">Бесплатные уроки</a></div>
        <form class="key-form" id="key-form"><input class="inp" id="key-in" placeholder="AI-XXXX-XXXX-XXXX" aria-label="Ключ доступа" autocomplete="off"><button class="btn" type="submit">Войти по ключу</button></form><p class="err" id="key-err" role="alert"></p></div>`);
      bindKey(); return;
    }
    const done = prog();
    const last = idx === m.lessons.length - 1;
    const v = setView(`${head}<article class="prose">${K.md(l.md)}</article>
      ${last && m.quiz.length ? `<section class="quiz-sec"><h3><span class="eyebrow">Тест</span> Проверьте себя по модулю ${m.num}</h3><div class="quiz" id="quiz"></div></section>` : ''}
      <div class="l-foot">${prev ? `<a class="btn btn-ghost" href="#l-${prev.id}">← ${prev.id}</a>` : ''}<span class="sp"></span>
        <button class="btn btn-done${done[l.id] ? ' is' : ''}" type="button" id="done">${done[l.id] ? 'Урок пройден' : 'Отметить пройденным'}</button>
        ${next ? `<a class="btn" href="#l-${next.id}">${next.m.locked ? 'Дальше: модуль ' + next.m.num : 'Следующий урок →'}</a>` : ''}</div>`);
    K.mountDash(v, D);
    if (last && m.quiz.length) K.quiz($('#quiz'), m, () => drawSide(l));
    $('#done').addEventListener('click', () => {
      const d = prog(); d[l.id] = !d[l.id]; K.store.set('done', d);
      const b = $('#done'); b.classList.toggle('is', d[l.id]); b.textContent = d[l.id] ? 'Урок пройден' : 'Отметить пройденным'; drawSide(l);
      if (d[l.id] && next && !next.m.locked) setTimeout(() => { location.hash = 'l-' + next.id; }, 450);
    });
  }

  function bindKey() {
    const f = $('#key-form'); if (!f) return;
    f.addEventListener('submit', async e => {
      e.preventDefault(); const err = $('#key-err'); err.textContent = '';
      const btn = f.querySelector('button'); btn.disabled = true;
      try { const r = await K.api('login', { body: { key: $('#key-in').value } }); K.store.set('token', r.token); K.store.set('key', r.key); location.reload(); }
      catch (x) { err.textContent = x.message; btn.disabled = false; }
    });
  }

  function login() {
    setView(`<div class="page-h"><span class="eyebrow">Вход</span><h1 class="l-title" style="margin:0">Вход по ключу доступа</h1><p>Ключ выдаётся после оплаты и выглядит так: AI-XXXX-XXXX-XXXX. Он работает на любом устройстве.</p></div>
      <div class="paywall"><form class="key-form" id="key-form"><input class="inp" id="key-in" placeholder="AI-XXXX-XXXX-XXXX" aria-label="Ключ доступа" autocomplete="off"><button class="btn" type="submit">Войти</button></form><p class="err" id="key-err" role="alert"></p>
      <p class="fine">Нет ключа? <a href="/#pricing">Купите доступ</a> или начните с <a href="#l-0.1">бесплатных уроков</a>. Потеряли ключ — он указан в чеке об оплате или напишите автору.</p></div>`);
    bindKey();
  }

  // ---------- промпты ----------
  function prompts() {
    const cats = ['Все', ...new Set(D.prompts.map(p => p.cat))];
    let cat = 'Все', q = '';
    const v = setView(`<div class="page-h"><span class="eyebrow">Библиотека</span><h1 class="l-title" style="margin:0">Промпты</h1><p>${D.prompts.length} шаблонов. Скопируйте, замените слова в квадратных скобках на свои — и отправляйте.</p></div>
      <div class="pg-filters"><input class="inp" type="search" id="pq" placeholder="Поиск по промптам" aria-label="Поиск"><div class="chips">${cats.map(c => `<button type="button" class="fchip${c === 'Все' ? ' on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div></div><div class="pg-grid" id="pg"></div>`, true);
    const draw = () => {
      const s = q.toLowerCase();
      const list = D.prompts.filter(p => (cat === 'Все' || p.cat === cat) && (!s || (p.title + ' ' + (p.text || '')).toLowerCase().includes(s)));
      $('#pg').innerHTML = list.map(p => K.promptCard(p.title, p.text, { locked: p.locked, meta: (p.lesson ? `Урок <a href="#l-${p.lesson}">${p.lesson}</a> · ` : '') + esc(p.cat) })).join('') || '<p class="hint">Ничего не найдено.</p>';
      K.observe($('#pg'));
    };
    v.addEventListener('click', e => { const b = e.target.closest('.fchip'); if (b) { cat = b.dataset.c; $$('.fchip', v).forEach(x => x.classList.toggle('on', x === b)); draw(); } });
    $('#pq').addEventListener('input', e => { q = e.target.value; draw(); });
    draw();
  }

  function tools() {
    const v = setView(`<div class="page-h"><span class="eyebrow">Справочник</span><h1 class="l-title" style="margin:0">Инструменты и ссылки</h1><p>Что даёт бесплатная версия, что добавляет платная и как сервис доступен из России. Отмечайте, что уже попробовали. Данные проверены в ноябре 2026: тарифы сервисов меняются, перед оплатой сверяйтесь с сайтом.</p></div>
      <div class="dash-slot" data-dash="tools"></div><div class="dash-slot" data-dash="costs"></div>
      ${D.links.map(g => `<section class="links-g reveal"><h3>${esc(g.g)}</h3><div class="lk-list">${g.items.map(([t, u, n]) => `<a class="lk-item" href="${u}" target="_blank" rel="noopener"><b>${esc(t)}</b><small>${esc(n)}</small><code>${esc(u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</code></a>`).join('')}</div></section>`).join('')}`, true);
    K.mountDash(v, D);
  }

  function money() {
    const v = setView(`<div class="page-h"><span class="eyebrow">Заработок</span><h1 class="l-title" style="margin:0">Карта заработка и цена услуги</h1><p>Ориентиры рынка на 2026 год. Методика проверки цен в вашей нише — в уроке 10.3.</p></div>
      <div class="dash-slot" data-dash="money"></div><div class="dash-slot" data-dash="price"></div>`, true);
    K.mountDash(v, D);
  }

  function glossary() {
    const v = setView(`<div class="page-h"><span class="eyebrow">Словарь</span><h1 class="l-title" style="margin:0">Глоссарий</h1><p>${D.glossary.length} терминов простыми словами.</p></div><input class="inp" type="search" id="gq" placeholder="Найти термин" aria-label="Поиск термина"><div class="gl" id="gl"></div>`, true);
    const draw = (s = '') => { s = s.toLowerCase(); $('#gl').innerHTML = D.glossary.filter(([t, d]) => !s || (t + d).toLowerCase().includes(s)).sort((a, b) => a[0].localeCompare(b[0], 'ru')).map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join(''); };
    $('#gq').addEventListener('input', e => draw(e.target.value)); draw();
  }

  function progress() {
    const done = prog(), q = K.store.get('quiz', {}), ls = allLessons(), n = ls.filter(l => done[l.id]).length;
    const mins = ls.filter(l => done[l.id]).reduce((s, l) => s + l.min, 0);
    const key = K.store.get('key', '');
    setView(`<div class="page-h"><span class="eyebrow">Прогресс</span><h1 class="l-title" style="margin:0">Мой прогресс</h1><p>Прогресс хранится в этом браузере. На другом устройстве войдите по ключу — уроки откроются, отметки начнутся заново.</p></div>
      <div class="pr-tiles"><div class="tile"><span>Пройдено уроков</span><b data-count="${n}">${n}</b></div><div class="tile"><span>Курс завершён на</span><b data-count="${Math.round(n / ls.length * 100)}" data-suffix="%">0%</b></div><div class="tile"><span>Минут изучено</span><b data-count="${mins}">0</b></div><div class="tile"><span>Тестов пройдено</span><b data-count="${Object.keys(q).filter(k => k !== 'demo').length}">0</b></div></div>
      <div class="pr-mods reveal">${D.modules.map((m, i) => {
      const md = m.lessons.filter(l => done[l.id]).length, qq = q[m.id];
      return `<div class="pr-row" style="--d:${i}"><b>${m.num}</b><a href="#l-${m.lessons[0].id}">${esc(m.title)}</a><div class="bar"><i style="--w:${(md / m.lessons.length * 100).toFixed(0)}%;width:${(md / m.lessons.length * 100).toFixed(0)}%"></i></div><span class="num">${md}/${m.lessons.length}</span><span class="pr-q${qq && qq.s === qq.n ? ' ok' : ''}">${qq ? 'тест ' + qq.s + '/' + qq.n : m.locked ? 'закрыт' : '—'}</span></div>`;
    }).join('')}</div>
      ${D.paid ? `<div class="paywall" style="border-color:var(--line)"><span class="eyebrow">Ваш доступ</span>${key ? `<div class="keybox" data-copy-root><code class="copy-src">${esc(key)}</code><button class="btn-copy" data-copy type="button">Скопировать</button></div>` : ''}<p class="fine">Сохраните ключ — по нему можно войти на любом устройстве.</p><div class="row"><button class="btn btn-ghost" type="button" id="reset">Сбросить отметки</button><button class="btn btn-ghost" type="button" id="logout">Выйти на этом устройстве</button></div></div>` : `<div class="paywall"><h3>Откройте все ${D.stats.modules} модулей</h3><div class="row"><a class="btn btn-red" href="/#pricing">Купить доступ</a><a class="btn btn-ghost" href="#login">У меня есть ключ</a></div></div>`}`, true);
    const r = $('#reset'); if (r) r.addEventListener('click', e => { if (e.target.dataset.sure) { K.store.set('done', {}); K.store.set('quiz', {}); route(); } else { e.target.dataset.sure = 1; e.target.textContent = 'Нажмите ещё раз для сброса'; } });
    const lo = $('#logout'); if (lo) lo.addEventListener('click', () => { K.store.set('token', null); location.hash = ''; location.reload(); });
  }

  function book() {
    const mods = D.modules.filter(m => !m.locked);
    const v = setView(`<div class="no-print page-h"><span class="eyebrow">Учебник</span><h1 class="l-title" style="margin:0">Весь курс одной страницей</h1>
      <p>Нажмите «Сохранить в PDF» и в окне печати выберите «Сохранить как PDF». Схемы и таблицы сохранятся, интерактивные панели — в онлайн-версии.</p>
      <div class="row" style="display:flex;gap:.6em;flex-wrap:wrap"><button class="btn btn-lg" type="button" id="print">Сохранить в PDF</button>${D.paid ? '' : '<a class="btn btn-lg btn-ghost" href="/#pricing">Полная версия учебника</a>'}</div></div>
      <div class="book"><div class="book-cover"><div class="bc-top"><span class="brand-mark">ИИ</span><span class="eyebrow">Учебник курса · 2026</span></div>
        <div class="bc-title"><h1>ИИ.<br>Полный доступ</h1><p>Нейросети для работы и заработка: инструменты, доступ из России, промпты, сайты, автоматизация, первые клиенты</p></div>
        <ol class="bc-toc">${D.modules.map(m => `<li><span>${m.num}</span>${esc(m.title)}</li>`).join('')}</ol>
        <dl class="bc-stats"><div><dt>модулей</dt><dd>${D.stats.modules}</dd></div><div><dt>уроков</dt><dd>${D.stats.lessons}</dd></div><div><dt>часов</dt><dd>${Math.round(D.stats.minutes / 60)}</dd></div><div><dt>промптов</dt><dd>${D.stats.prompts}</dd></div></dl>
        <p class="bc-foot">${D.paid ? 'Полная версия' : 'Пробная версия: модули 00 и 01'} · Автор — Дмитрий Чекмарёв, Smart Agent AI</p></div>
      ${mods.map(m => `<section class="book-mod"><span class="eyebrow">Модуль ${m.num}</span><h2>${esc(m.title)}</h2><p class="sec-lead">${esc(m.sub)}</p>
        ${m.lessons.map(l => `<div class="book-l"><h3 class="bl-t">${l.id}. ${esc(l.title)}</h3><div class="prose">${K.md(l.md)}</div></div>`).join('')}
        ${m.quiz.length ? `<div class="book-l"><h3 class="bl-t">Вопросы для самопроверки</h3><ol class="steps">${m.quiz.map(q => `<li><b>${esc(q.q)}</b><br>Ответ: ${esc(q.a[q.c])}. ${esc(q.e)}</li>`).join('')}</ol></div>` : ''}</section>`).join('')}
      <section class="book-mod"><span class="eyebrow">Приложение</span><h2>Глоссарий</h2><div class="gl">${D.glossary.map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('')}</div></section></div>`, true);
    $('#print').addEventListener('click', () => window.print());
    $$('.reveal', v).forEach(x => x.classList.add('in')); K.still(v);
  }

  load();
})();
