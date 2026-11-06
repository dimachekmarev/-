/* ИИ. Полный доступ — общий движок: разметка уроков, схемы, панели, тесты */
(function () {
  const K = window.K = {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  K.RM = RM;
  const esc = K.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rub = K.rub = n => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
  const $ = K.$ = (s, r = document) => r.querySelector(s);
  const $$ = K.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  K.store = {
    get(k, d) { try { const v = localStorage.getItem('aipd.' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('aipd.' + k, JSON.stringify(v)); } catch { } }
  };
  K.copy = async (text, btn) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch { } ta.remove();
    }
    if (btn) { const t = btn.textContent; btn.textContent = ok ? 'Скопировано' : 'Выделите вручную'; btn.classList.add('done'); setTimeout(() => { btn.textContent = t; btn.classList.remove('done'); }, 1600); }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (b) { const src = b.closest('.prompt') || b.closest('[data-copy-root]'); const pre = src && src.querySelector('pre, .copy-src'); K.copy(pre ? pre.textContent : b.dataset.copy, b); }
  });

  // ---------- inline markdown ----------
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (m, t, u) => `<a href="${u}" target="_blank" rel="noopener" class="ext">${t}</a>`);
  K.inline = inline;

  // ---------- блочная разметка урока ----------
  K.md = function (src) {
    const lines = src.split('\n'); const out = []; let i = 0;
    const para = [];
    const flush = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para.length = 0; } };
    while (i < lines.length) {
      const raw = lines[i]; const l = raw.trim();
      if (!l) { flush(); i++; continue; }
      if (l.startsWith('::fig ')) { flush(); out.push(K.fig(l.slice(6).trim())); i++; continue; }
      if (l.startsWith('::howto ')) { flush(); out.push(`<div class="howto-slot" data-howto="${l.slice(8).trim()}"></div>`); i++; continue; }
      if (l.startsWith('::dash ')) { flush(); out.push(`<div class="dash-slot" data-dash="${l.slice(7).trim()}"></div>`); i++; continue; }
      if (l.startsWith('::prompt ')) {
        flush(); const title = l.slice(9); const buf = [];
        while (++i < lines.length && lines[i].trim() !== '::end') buf.push(lines[i]);
        out.push(K.promptCard(title, buf.join('\n').trim())); i++; continue;
      }
      if (l === '::table') {
        flush(); const rows = [];
        while (++i < lines.length && lines[i].trim() !== '::end') rows.push(lines[i].split('|').map(x => x.trim()));
        out.push(K.table(rows)); i++; continue;
      }
      if (l.startsWith('> ')) { flush(); out.push(`<aside class="note reveal"><span class="note-mark">Важно</span><p>${inline(l.slice(2))}</p></aside>`); i++; continue; }
      if (/^\*\*[^*]+\*\*$/.test(l)) { flush(); out.push(`<h3>${inline(l.slice(2, -2))}</h3>`); i++; continue; }
      if (/^- /.test(l)) {
        flush(); const it = [];
        while (i < lines.length && /^- /.test(lines[i].trim())) { it.push('<li>' + inline(lines[i].trim().slice(2)) + '</li>'); i++; }
        out.push('<ul class="list">' + it.join('') + '</ul>'); continue;
      }
      if (/^\d+\. /.test(l)) {
        flush(); const it = [];
        while (i < lines.length && /^\d+\. /.test(lines[i].trim())) { it.push('<li>' + inline(lines[i].trim().replace(/^\d+\. /, '')) + '</li>'); i++; }
        out.push('<ol class="steps">' + it.join('') + '</ol>'); continue;
      }
      para.push(l); i++;
    }
    flush();
    return out.join('\n');
  };

  K.promptCard = (title, text, opts = {}) => `<div class="prompt reveal">
    <div class="prompt-head"><span class="prompt-tag">Промпт</span><span class="prompt-title">${esc(title)}</span>
    ${opts.locked ? '<span class="lock-pill">В полном доступе</span>' : '<button class="btn-copy" data-copy type="button">Скопировать</button>'}</div>
    ${opts.locked ? '<div class="prompt-locked">Текст промпта открывается после покупки курса</div>' : `<pre>${esc(text).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>')}</pre>`}
    ${opts.meta ? `<div class="prompt-meta">${opts.meta}</div>` : ''}</div>`;

  K.table = rows => {
    const [h, ...b] = rows;
    return `<div class="tbl-wrap reveal"><table class="tbl"><thead><tr>${h.map(x => `<th>${inline(x)}</th>`).join('')}</tr></thead>
      <tbody>${b.map((r, ri) => `<tr style="--d:${ri}">${r.map((x, ci) => `<td${ci === 0 ? ' class="td-key"' : ''}>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  };

  // ---------- схемы ----------
  const figWrap = (name, title, body, cap) => `<figure class="fig fig-${name} reveal" data-fig="${name}">
    <figcaption class="fig-head"><span class="eyebrow">Схема</span><b>${title}</b></figcaption>${body}${cap ? `<p class="fig-cap">${cap}</p>` : ''}</figure>`;

  const FIG = {
    tokens: () => figWrap('tokens', 'Как модель пишет ответ: токен за токеном',
      `<div class="tk-line" aria-label="Пример предложения, разбитого на токены"></div>
       <div class="tk-cands"><div class="tk-cap">Модель оценивает вероятность каждого варианта следующего токена</div><div class="tk-bars"></div></div>`,
      'Модель выбирает вероятный вариант и повторяет шаг. Она не сверяется со справочником, поэтому может уверенно ошибиться.'),
    context: () => figWrap('context', 'Контекстное окно — рабочий стол модели',
      `<div class="ctx"><div class="ctx-desk"><div class="ctx-pin">Инструкция</div><div class="ctx-cards"></div></div>
       <div class="ctx-meter"><span>Заполнено</span><div class="bar"><i></i></div><b class="ctx-pct">40%</b></div></div>`,
      'Новые сообщения ложатся на стол. Когда места не хватает, самые старые «падают» — модель их больше не видит. Закреплённая инструкция проекта остаётся.'),
    ecosystem: () => figWrap('ecosystem', 'Модель, продукт, агрегатор, API',
      `<div class="eco">
        <div class="eco-col"><h4>Модели</h4>${['GPT · OpenAI', 'Claude · Anthropic', 'Gemini · Google', 'DeepSeek', 'Qwen · Alibaba', 'GigaChat · Сбер', 'YandexGPT · Яндекс'].map(x => `<span class="chip">${x}</span>`).join('')}</div>
        <div class="eco-flow" aria-hidden="true"><i></i></div>
        <div class="eco-col"><h4>Способ доступа</h4>
          <div class="eco-card"><b>Продукт</b><span>chatgpt.com, claude.ai, giga.chat — подписка, удобный интерфейс</span></div>
          <div class="eco-card"><b>Агрегатор</b><span>Много моделей в одном окне, оплата в рублях</span></div>
          <div class="eco-card"><b>API</b><span>Ключ для ботов и автоматизаций, оплата за токены</span></div>
          <div class="eco-card"><b>Своя установка</b><span>Открытая модель на вашем сервере</span></div></div>
        <div class="eco-flow" aria-hidden="true"><i></i></div>
        <div class="eco-col"><h4>Что вы делаете</h4>${['Пишете в чат', 'Запускаете бота', 'Строите автоматизацию', 'Делаете сайт или сервис'].map(x => `<span class="chip chip-blue">${x}</span>`).join('')}</div>
      </div>`),
    access: () => figWrap('access', 'Четыре легальных маршрута к нейросетям из России',
      `<div class="routes">${[
        ['01', 'Российские сервисы', 'ГигаЧат, Алиса AI, Шедеврум, Kandinsky', [5, 5, 3, 1]],
        ['02', 'Открытые зарубежные', 'DeepSeek, Qwen, Kling', [4, 5, 4, 2]],
        ['03', 'Агрегаторы', 'Десятки моделей, оплата в рублях', [5, 3, 4, 3]],
        ['04', 'Оригинальная подписка', 'Через посредника или зарубежную карту', [2, 2, 5, 3]]
      ].map(([n, t, d, m]) => `<div class="route"><span class="route-n">${n}</span><b>${t}</b><p>${d}</p>
        ${['Простота', 'Цена', 'Возможности', 'Риски'].map((lab, i) => `<div class="meter${i === 3 ? ' risk' : ''}"><span>${lab}</span><em>${[1, 2, 3, 4, 5].map(k => `<i class="${k <= m[i] ? 'on' : ''}" style="--k:${k}"></i>`).join('')}</em></div>`).join('')}</div>`).join('')}</div>`,
      'Оценки условные, от 1 до 5. «Цена»: чем больше точек, тем дешевле.'),
    prompt: () => figWrap('prompt', 'Формула промпта из шести блоков',
      `<div class="pf"><ol class="pf-keys">${['Роль', 'Задача', 'Контекст', 'Формат', 'Ограничения', 'Пример'].map((x, i) => `<li data-i="${i}"><span>${i + 1}</span>${x}</li>`).join('')}</ol>
       <div class="pf-card"><div class="pf-bar"><i></i><i></i><i></i><span>Новый чат</span></div><div class="pf-text"></div><div class="pf-res">Результат с первой попытки</div></div></div>`),
    agent: () => figWrap('agent', 'Цикл работы ИИ-агента',
      `<div class="agent"><svg viewBox="0 0 360 300" role="img" aria-label="Цикл: цель, план, инструмент, результат, проверка">
        <circle cx="180" cy="150" r="104" class="ag-ring"/>
        <circle r="7" class="ag-dot">${RM ? '' : '<animateMotion dur="6s" repeatCount="indefinite" path="M180,46 a104,104 0 1,1 -0.1,0"/>'}</circle>
        ${[['Цель', 0], ['План', 72], ['Инструмент', 144], ['Результат', 216], ['Проверка', 288]].map(([t, a], i) => {
        const r = (a - 90) * Math.PI / 180, x = 180 + 104 * Math.cos(r), y = 150 + 104 * Math.sin(r);
        return `<g class="ag-node" style="--i:${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="30"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${t}</text></g>`;
      }).join('')}
        <text x="180" y="146" text-anchor="middle" class="ag-c1">Модель</text><text x="180" y="166" text-anchor="middle" class="ag-c2">+ инструменты и память</text>
      </svg>
      <ul class="agent-tools"><li>Поиск в интернете</li><li>Таблицы и CRM</li><li>Почта и мессенджеры</li><li>Запуск кода</li><li>Браузер и файлы</li></ul></div>`,
      'Агент повторяет цикл, пока цель не достигнута. Действия с деньгами и отправкой клиентам — только с подтверждением человека.'),
    automation: () => figWrap('automation', 'Автоматизация в n8n: заявка проходит путь за секунды',
      `<div class="flow">${[['Триггер', 'Новое сообщение в Telegram'], ['ИИ-агент', 'Понимает запрос, классифицирует'], ['Таблица / CRM', 'Сохраняет заявку'], ['Уведомление', 'Менеджер получает карточку']].map(([a, b], i) =>
        `<div class="node" style="--i:${i}"><span class="node-k">${String(i + 1).padStart(2, '0')}</span><b>${a}</b><span>${b}</span></div>${i < 3 ? '<div class="wire"><i></i></div>' : ''}`).join('')}</div>`,
      'Каждый блок — узел сценария. Триггер запускает цепочку, данные передаются от узла к узлу.'),
    site: () => figWrap('site', 'Путь сайта: от идеи до живого адреса',
      `<ol class="pipe">${['ТЗ', 'Тексты', 'Сборка', 'Домен', 'Хостинг', 'DNS', 'SSL', 'Почта', 'Заявки', 'Аналитика', 'SEO'].map((x, i) => `<li style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${x}</li>`).join('')}</ol>`),
    roadmap: () => figWrap('roadmap', 'Маршрут курса',
      `<div class="rm">${[['Фундамент', '00–04', 'Как устроен ИИ, инструменты, доступ из России, промптинг'], ['Практика', '05–09', 'Работа и учёба, картинки, видео, сайты, автоматизация'], ['Результат', '10–11', 'Заработок, первые клиенты, проект за 30 дней']].map(([t, n, d], i) =>
        `<div class="rm-stage" style="--i:${i}"><span class="rm-n">${n}</span><b>${t}</b><p>${d}</p><div class="rm-line"><i></i></div></div>`).join('')}</div>`),
    roadmap30: () => figWrap('roadmap30', 'План на 30 дней',
      `<div class="gantt"><div class="g-head"><span></span>${[1, 2, 3, 4].map(w => `<b>Неделя ${w}</b>`).join('')}</div>${[
        ['Выбор направления', 0, 3], ['Проверка спроса и цен', 1, 3], ['Портфолио: 3 работы', 2, 6], ['Витрина и пакеты', 6, 4], ['30 сообщений знакомым', 7, 5],
        ['Отклики на биржах', 8, 12], ['Первые заказы', 14, 7], ['Шаблоны и автоматизация', 21, 5], ['Подъём цены, итоги', 25, 3]].map(([t, s, d], i) =>
          `<div class="g-row" style="--i:${i}"><span>${t}</span><div class="g-track"><i style="left:${(s / 28 * 100).toFixed(1)}%;width:${(d / 28 * 100).toFixed(1)}%"></i></div></div>`).join('')}</div>`)
  };
  K.fig = name => (FIG[name] ? FIG[name]() : '');

  // анимации схем — запускаются, когда схема видна
  const PLAY = {
    tokens(el) {
      const steps = [
        { t: ['Нейро', 'сети'], c: [[' помогают', 52], [' пишут', 21], [' умеют', 15], [' стоят', 4]] },
        { t: ['Нейро', 'сети', ' помогают'], c: [[' малому', 38], [' людям', 27], [' учиться', 12], [' кошкам', 2]] },
        { t: ['Нейро', 'сети', ' помогают', ' малому'], c: [[' бизнесу', 81], [' городу', 6], [' брату', 3], [' слону', 1]] },
        { t: ['Нейро', 'сети', ' помогают', ' малому', ' бизнесу'], c: [[' экономить', 44], [' расти', 23], [' продавать', 18], [' спать', 2]] }
      ];
      let k = 0; const line = $('.tk-line', el), bars = $('.tk-bars', el);
      const draw = () => {
        const s = steps[k % steps.length];
        line.innerHTML = s.t.map((x, i) => `<span class="tok${i === s.t.length - 1 ? ' new' : ''}">${esc(x.replace(/^ /, '·'))}</span>`).join('') + '<span class="tk-caret"></span>';
        bars.innerHTML = s.c.map(([w, p], i) => `<div class="tk-row${i === 0 ? ' top' : ''}"><span>${esc(w.trim())}</span><div class="bar"><i style="--w:${p}%"></i></div><b>${p}%</b></div>`).join('');
        k++;
      };
      draw(); return setInterval(draw, 2600);
    },
    context(el) {
      const msgs = ['Вы: задача', 'ИИ: план', 'Файл: договор.pdf', 'Вы: уточнение', 'ИИ: черновик', 'Вы: правки', 'ИИ: версия 2', 'Вы: новый вопрос'];
      const box = $('.ctx-cards', el), pct = $('.ctx-pct', el), bar = $('.ctx-meter i', el); let n = 0;
      const step = () => {
        const c = document.createElement('div'); c.className = 'ctx-card'; c.textContent = msgs[n % msgs.length]; n++;
        box.appendChild(c);
        const live = $$('.ctx-card:not(.gone)', box);
        if (live.length > 5) { live[0].classList.add('gone'); setTimeout(() => live[0].remove(), 700); }
        const p = Math.min(100, 30 + Math.min(live.length, 5) * 14);
        pct.textContent = p + '%'; bar.style.width = p + '%'; bar.classList.toggle('full', p >= 95);
      };
      for (let i = 0; i < 3; i++) step();
      return setInterval(step, 1500);
    },
    prompt(el) {
      const parts = ['Ты — SMM-специалист для локального бизнеса.', ' Напиши 3 поста для Telegram.', ' Кофейня у дома, аудитория — мамы и студенты, утреннее комбо за 290 ₽.', ' До 600 знаков, в конце — призыв зайти до 11:00.', ' Без слов «уникальный» и «лучший».', ' Образец удачного поста: …'];
      const txt = $('.pf-text', el), keys = $$('.pf-keys li', el), res = $('.pf-res', el);
      let p = 0, c = 0, t;
      const tick = () => {
        if (p >= parts.length) { res.classList.add('on'); t = setTimeout(() => { p = 0; c = 0; txt.innerHTML = ''; res.classList.remove('on'); keys.forEach(k => k.classList.remove('on', 'cur')); tick(); }, 2600); return; }
        keys.forEach((k, i) => { k.classList.toggle('on', i < p); k.classList.toggle('cur', i === p); });
        c += 2;
        const done = parts.slice(0, p).map((s, i) => `<span class="pf-s s${i}">${esc(s)}</span>`).join('');
        txt.innerHTML = done + `<span class="pf-s s${p}">${esc(parts[p].slice(0, c))}</span><span class="tk-caret"></span>`;
        if (c >= parts[p].length) { p++; c = 0; t = setTimeout(tick, 260); } else t = setTimeout(tick, 22);
      };
      tick(); return { stop: () => clearTimeout(t) };
    },
    site(el) { const li = $$('.pipe li', el); let i = 0; return setInterval(() => { li.forEach((x, k) => { x.classList.toggle('on', k <= i % li.length); }); i++; }, 600); }
  };
  const running = new Map();
  K.observe = function (root = document) {
    if (!('IntersectionObserver' in window)) return;
    const io = K._io || (K._io = new IntersectionObserver(es => {
      es.forEach(e => {
        const el = e.target;
        if (e.isIntersecting) {
          el.classList.add('in');
          const f = el.dataset.fig;
          if (f && PLAY[f] && !RM && !running.has(el)) running.set(el, PLAY[f](el));
          if (el.dataset.count && !el._counted) { el._counted = 1; K.countUp(el); }
          if (el.hasAttribute('data-mock')) K.playMock(el);
        } else if (el._play) { clearTimeout(el._t); el._play = 0; }
        else if (running.has(el)) {
          const h = running.get(el); if (h && h.stop) h.stop(); else clearInterval(h); running.delete(el);
        }
      });
    }, { threshold: 0.2 }));
    $$('.reveal, [data-fig], [data-count], [data-mock]', root).forEach(el => io.observe(el));
    $$('[data-fig]', root).forEach(el => { if (RM && PLAY[el.dataset.fig] && !el._static) { el._static = 1; const h = PLAY[el.dataset.fig](el); if (h && h.stop) h.stop(); else clearInterval(h); } });
  };
  K.still = root => $$('[data-fig]', root).forEach(el => { const f = PLAY[el.dataset.fig]; if (f && !el._static) { el._static = 1; const h = f(el); if (h && h.stop) h.stop(); else clearInterval(h); } });
  K.countUp = el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (RM) { el.textContent = to.toLocaleString('ru-RU') + suf; return; }
    const t0 = performance.now(), d = 1100;
    const f = t => { const k = Math.min(1, (t - t0) / d), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v.toLocaleString('ru-RU') + suf; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };

  // ---------- интерактивные панели ----------
  const ACCESS = { ru: 'Российский', open: 'Работает напрямую', pay: 'Зарубежная оплата или агрегатор' };
  const PRICE = { free: 'Бесплатно', freemium: 'Есть бесплатный тариф', paid: 'Только платно' };

  K.dash = {
    tools(el, D) {
      const tried = K.store.get('tried', {});
      const cats = ['Все', ...new Set(D.tools.map(t => t.c))];
      let f = { c: 'Все', a: 'all', p: 'all', q: '' };
      el.innerHTML = `<div class="dash reveal"><div class="dash-head"><span class="eyebrow">Интерактивная панель</span><b>Карта инструментов</b><span class="dash-sub"><span class="d-count"></span> · попробовано <span class="d-tried"></span></span></div>
        <div class="filters"><input class="inp" type="search" placeholder="Найти сервис или задачу" aria-label="Поиск" id="tools-q">
        <div class="chips" data-k="c">${cats.map(c => `<button type="button" class="fchip${c === 'Все' ? ' on' : ''}" data-v="${c}">${c}</button>`).join('')}</div>
        <div class="chips" data-k="a"><button type="button" class="fchip on" data-v="all">Любой доступ</button>${Object.entries(ACCESS).map(([k, v]) => `<button type="button" class="fchip" data-v="${k}">${v}</button>`).join('')}</div>
        <div class="chips" data-k="p"><button type="button" class="fchip on" data-v="all">Любая цена</button>${Object.entries(PRICE).map(([k, v]) => `<button type="button" class="fchip" data-v="${k}">${v}</button>`).join('')}</div></div>
        <div class="tbl-wrap"><table class="tbl tbl-tools"><thead><tr><th>Сервис</th><th>Для чего</th><th>Бесплатно</th><th>Платно</th><th>Доступ</th><th aria-label="Попробовал"></th></tr></thead><tbody></tbody></table></div></div>`;
      const tb = $('tbody', el);
      const draw = () => {
        const q = f.q.toLowerCase();
        const rows = D.tools.filter(t => (f.c === 'Все' || t.c === f.c) && (f.a === 'all' || t.rf === f.a) && (f.p === 'all' || t.p === f.p) && (!q || (t.n + t.d + t.t.join(' ') + t.c).toLowerCase().includes(q)));
        tb.innerHTML = rows.map((t, i) => `<tr style="--d:${Math.min(i, 12)}">
          <td class="td-key"><a href="${t.u}" target="_blank" rel="noopener" class="ext">${esc(t.n)}</a><small>${esc(t.c)} · ${t.t.map(esc).join(', ')}</small></td>
          <td>${esc(t.d)}</td><td>${esc(t.f || '')}</td><td>${esc(t.pd || '')}</td>
          <td><span class="acc acc-${t.rf}">${ACCESS[t.rf]}</span></td>
          <td><label class="tick" title="Попробовал"><input type="checkbox" data-n="${esc(t.n)}" ${tried[t.n] ? 'checked' : ''}><span></span></label></td></tr>`).join('') || `<tr><td colspan="6" class="empty">Ничего не найдено. Сбросьте фильтры.</td></tr>`;
        $('.d-count', el).textContent = rows.length + ' из ' + D.tools.length;
        $('.d-tried', el).textContent = Object.values(tried).filter(Boolean).length;
      };
      el.addEventListener('click', e => { const b = e.target.closest('.fchip'); if (!b) return; const k = b.parentElement.dataset.k; f[k] = b.dataset.v; $$('.fchip', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); draw(); });
      el.addEventListener('input', e => { if (e.target.id === 'tools-q') { f.q = e.target.value; draw(); } });
      el.addEventListener('change', e => { if (e.target.dataset.n) { tried[e.target.dataset.n] = e.target.checked; K.store.set('tried', tried); draw(); } });
      draw();
    },

    costs(el, D) {
      const sel = K.store.get('subs', null) || Object.fromEntries(D.subs.map(s => [s.n, !!s.def]));
      let rate = K.store.get('rate', 105);
      el.innerHTML = `<div class="dash reveal"><div class="dash-head"><span class="eyebrow">Калькулятор</span><b>Сколько стоит ваш набор ИИ в месяц</b></div>
        <div class="costs"><div class="cost-list">${D.subs.map(s => `<label class="cost-item"><input type="checkbox" data-n="${esc(s.n)}" ${sel[s.n] ? 'checked' : ''}><span class="ci-box"></span><span class="ci-n">${esc(s.n)}<small>${esc(s.g)}</small></span><span class="ci-p">${s.usd != null ? '$' + s.usd : rub(s.rub)}</span></label>`).join('')}</div>
        <div class="cost-sum"><label class="field"><span>Курс доллара с наценкой посредника, ₽</span><input class="inp" type="number" id="cost-rate" min="60" max="200" value="${rate}"></label>
          <div class="big"><span>В месяц</span><b class="c-month">0 ₽</b></div><div class="mid"><span>В год</span><b class="c-year">0 ₽</b></div>
          <div class="stack" aria-hidden="true"></div><ul class="stack-legend"></ul>
          <p class="hint">Цены оригиналов в долларах — ориентир на 2026 год. Через агрегатор часть сервисов дешевле: платите только за использование.</p></div></div></div>`;
      const COL = ['var(--blue)', 'var(--red)', 'var(--blue-2)', 'var(--ink)', '#8EA2E8', '#F08A90', '#3C4A6B'];
      const draw = () => {
        const groups = {}; let tot = 0;
        D.subs.forEach(s => { if (!sel[s.n]) return; const v = s.usd != null ? s.usd * rate : s.rub; tot += v; groups[s.g] = (groups[s.g] || 0) + v; });
        $('.c-month', el).textContent = rub(tot); $('.c-year', el).textContent = rub(tot * 12);
        const g = Object.entries(groups).sort((a, b) => b[1] - a[1]);
        $('.stack', el).innerHTML = g.map(([k, v], i) => `<i style="width:${tot ? (v / tot * 100) : 0}%;background:${COL[i % COL.length]}"></i>`).join('');
        $('.stack-legend', el).innerHTML = g.map(([k, v], i) => `<li><i style="background:${COL[i % COL.length]}"></i>${esc(k)}<b>${rub(v)}</b></li>`).join('') || '<li>Отметьте сервисы слева</li>';
      };
      el.addEventListener('change', e => { if (e.target.dataset.n) { sel[e.target.dataset.n] = e.target.checked; K.store.set('subs', sel); draw(); } });
      el.addEventListener('input', e => { if (e.target.id === 'cost-rate') { rate = +e.target.value || 0; K.store.set('rate', rate); draw(); } });
      draw();
    },

    money(el, D) {
      let sort = 'weeks', dir = 1, model = 'Все', pick = 0;
      const MCOL = { 'Услуга': 'var(--blue)', 'Внедрение': 'var(--red)', 'Продукт': 'var(--ink)' };
      el.innerHTML = `<div class="dash reveal"><div class="dash-head"><span class="eyebrow">Интерактивная панель</span><b>Карта заработка на ИИ</b><span class="dash-sub">Ориентиры рынка, 2026. Нажмите на точку или строку</span></div>
        <div class="chips" data-k="m">${['Все', 'Услуга', 'Внедрение', 'Продукт'].map(m => `<button type="button" class="fchip${m === 'Все' ? ' on' : ''}" data-v="${m}">${m === 'Все' ? 'Все модели' : m}</button>`).join('')}</div>
        <div class="money"><div class="scatter"></div><div class="m-detail"></div></div>
        <div class="tbl-wrap"><table class="tbl tbl-money"><thead><tr>
          <th data-s="n">Направление</th><th data-s="model">Модель</th><th data-s="start">Старт</th><th data-s="weeks">До первых денег</th><th data-s="max">Чек</th><th data-s="diff">Сложность</th></tr></thead><tbody></tbody></table></div></div>`;
      const W = 640, H = 330, P = { l: 64, r: 18, t: 18, b: 44 };
      const x = w => P.l + (w / 13) * (W - P.l - P.r);
      const lmin = Math.log10(300), lmax = Math.log10(400000);
      const y = v => H - P.b - (Math.log10(v) - lmin) / (lmax - lmin) * (H - P.t - P.b);
      const detail = i => {
        const m = D.money[i]; pick = i;
        $('.m-detail', el).innerHTML = `<span class="m-model" style="--c:${MCOL[m.model]}">${m.model}</span><h4>${esc(m.n)}</h4><p>${esc(m.how)}</p>
          <dl><div><dt>Чек</dt><dd>${rub(m.check[0])} – ${rub(m.check[1])}<small>${esc(m.unit)}</small></dd></div><div><dt>Старт</dt><dd>${m.start ? rub(m.start) : 'Бесплатно'}<small>инструменты, первый месяц</small></dd></div>
          <div><dt>До первых денег</dt><dd>~${m.weeks} нед.<small>при 2–3 часах в день</small></dd></div><div><dt>Сложность</dt><dd><span class="dots">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= m.diff ? 'on' : ''}"></i>`).join('')}</span></dd></div></dl>`;
        $$('.pt', el).forEach(p => p.classList.toggle('on', +p.dataset.i === i));
        $$('.tbl-money tbody tr', el).forEach(r => r.classList.toggle('on', +r.dataset.i === i));
      };
      const draw = () => {
        const rows = D.money.map((m, i) => ({ ...m, i, max: m.check[1] })).filter(m => model === 'Все' || m.model === model);
        const ticks = [1000, 10000, 100000];
        $('.scatter', el).innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Направления: срок до первых денег и максимальный чек">
          ${ticks.map(t => `<line x1="${P.l}" x2="${W - P.r}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${P.l - 8}" y="${y(t) + 4}" text-anchor="end" class="ax">${t >= 1000 ? (t / 1000) + ' тыс' : t}</text>`).join('')}
          ${[0, 2, 4, 6, 8, 10, 12].map(w => `<line x1="${x(w)}" x2="${x(w)}" y1="${P.t}" y2="${H - P.b}" class="grid v"/><text x="${x(w)}" y="${H - P.b + 18}" text-anchor="middle" class="ax">${w}</text>`).join('')}
          <text x="${(W + P.l) / 2}" y="${H - 6}" text-anchor="middle" class="ax-t">Недель до первых денег</text>
          <text x="14" y="${(H - P.b + P.t) / 2}" transform="rotate(-90 14 ${(H - P.b + P.t) / 2})" text-anchor="middle" class="ax-t">Максимальный чек, ₽</text>
          ${rows.map((m, k) => `<g class="pt${m.i === pick ? ' on' : ''}" data-i="${m.i}" style="--k:${k}" tabindex="0" role="button" aria-label="${esc(m.n)}">
            <line x1="${x(m.weeks)}" x2="${x(m.weeks)}" y1="${y(m.check[0])}" y2="${y(m.check[1])}" stroke="${MCOL[m.model]}" class="rng"/>
            <circle cx="${x(m.weeks)}" cy="${y(m.check[1])}" r="${5 + m.diff * 1.6}" fill="${MCOL[m.model]}"/>
            <text x="${x(m.weeks) + 10 + m.diff * 1.6}" y="${y(m.check[1]) + 4}" class="pt-l">${esc(m.n)}</text></g>`).join('')}
        </svg><div class="legend">${Object.entries(MCOL).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join('')}<span class="lg-note">Размер точки — сложность, линия — вилка чека</span></div>`;
        const tr = [...rows].sort((a, b) => (a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0) * dir);
        $('.tbl-money tbody', el).innerHTML = tr.map((m, k) => `<tr data-i="${m.i}" style="--d:${k}" class="${m.i === pick ? 'on' : ''}"><td class="td-key">${esc(m.n)}</td><td><span class="m-model" style="--c:${MCOL[m.model]}">${m.model}</span></td>
          <td class="num">${m.start ? rub(m.start) : '0 ₽'}</td><td class="num">${m.weeks} нед.</td><td class="num">${rub(m.check[0])} – ${rub(m.check[1])}</td><td><span class="dots">${[1, 2, 3, 4, 5].map(q => `<i class="${q <= m.diff ? 'on' : ''}"></i>`).join('')}</span></td></tr>`).join('');
        $$('.tbl-money th', el).forEach(th => th.classList.toggle('sorted', th.dataset.s === sort));
        if (!rows.find(r => r.i === pick) && rows[0]) pick = rows[0].i;
        detail(pick);
      };
      el.addEventListener('click', e => {
        const p = e.target.closest('.pt, .tbl-money tbody tr'); if (p) return detail(+p.dataset.i);
        const th = e.target.closest('th[data-s]'); if (th) { dir = sort === th.dataset.s ? -dir : 1; sort = th.dataset.s; return draw(); }
        const b = e.target.closest('.fchip'); if (b) { model = b.dataset.v; $$('.fchip', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); draw(); }
      });
      el.addEventListener('keydown', e => { const p = e.target.closest('.pt'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); detail(+p.dataset.i); } });
      draw();
    },

    price(el) {
      const s = K.store.get('price', { hours: 10, rate: 1500, tools: 3000, orders: 4, tax: 4, margin: 30 });
      const F = [['hours', 'Часов на один заказ', 1, 80, 1], ['rate', 'Желаемая ставка в час, ₽', 300, 6000, 100], ['tools', 'Инструменты в месяц, ₽', 0, 30000, 500], ['orders', 'Заказов в месяц', 1, 40, 1], ['margin', 'Запас на правки и переговоры, %', 0, 80, 5]];
      el.innerHTML = `<div class="dash reveal"><div class="dash-head"><span class="eyebrow">Калькулятор</span><b>Цена вашей услуги</b></div>
        <div class="price"><div class="sliders">${F.map(([k, l, a, b, st]) => `<label class="sl"><span>${l}</span><input type="range" id="pr-${k}" data-k="${k}" min="${a}" max="${b}" step="${st}" value="${s[k]}"><b data-v="${k}"></b></label>`).join('')}
          <div class="chips" data-k="tax"><span class="chips-l">Налог самозанятого</span>${[4, 6].map(t => `<button type="button" class="fchip${s.tax === t ? ' on' : ''}" data-v="${t}">${t}% — ${t === 4 ? 'клиенты-физлица' : 'компании и ИП'}</button>`).join('')}</div></div>
        <div class="p-out"><div class="big"><span>Рекомендованная цена заказа</span><b class="p-rec"></b></div>
          <div class="p-bars"></div><div class="mid"><span>Доход в месяц после налога и инструментов</span><b class="p-net"></b></div><p class="hint p-hint"></p></div></div></div>`;
      const draw = () => {
        F.forEach(([k]) => { const b = $(`[data-v="${k}"]`, el); b.textContent = (+s[k]).toLocaleString('ru-RU'); });
        const labor = s.hours * s.rate, toolsPer = s.tools / s.orders, base = labor + toolsPer, withM = base * (1 + s.margin / 100), price = Math.ceil(withM / (1 - s.tax / 100) / 100) * 100, tax = price * s.tax / 100;
        const net = (price - tax) * s.orders - s.tools;
        $('.p-rec', el).textContent = rub(price); $('.p-net', el).textContent = rub(net);
        const parts = [['Работа', labor, 'var(--blue)'], ['Инструменты', toolsPer, 'var(--blue-2)'], ['Запас', withM - base, 'var(--ink)'], ['Налог', tax, 'var(--red)']];
        $('.p-bars', el).innerHTML = parts.map(([n, v, c]) => `<div class="pb"><span>${n}</span><div class="bar"><i style="width:${(v / price * 100).toFixed(1)}%;background:${c}"></i></div><b>${rub(v)}</b></div>`).join('');
        $('.p-hint', el).textContent = `Реальная ставка: ${rub(net / Math.max(1, s.hours * s.orders))} в час. Сравните цену с медианой рынка из урока 10.3: если вы сильно ниже — добавьте ценность в пакет, а не снижайте ставку.`;
        K.store.set('price', s);
      };
      el.addEventListener('input', e => { const k = e.target.dataset.k; if (k) { s[k] = +e.target.value; draw(); } });
      el.addEventListener('click', e => { const b = e.target.closest('.fchip'); if (b) { s.tax = +b.dataset.v; $$('.fchip', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); draw(); } });
      draw();
    }
  };
  K.mountDash = (root, D) => $$('.dash-slot', root).forEach(el => { const f = K.dash[el.dataset.dash]; if (f && !el._m) { el._m = 1; f(el, D); } });

  // ---------- пошаговые инструкции с нарисованными экранами ----------
  K.mock = function (lines) {
    let n = 0, url = '';
    const hot = (txt) => { const h = /\*$/.test(txt.trim()); const t = txt.trim().replace(/\*$/, ''); return h ? [t, ++n] : [t, 0]; };
    const mark = (k) => k ? ` hot" data-n="${k}` : '';
    const body = lines.map(raw => {
      const sp = raw.indexOf(' '), k = raw.slice(0, sp), v = raw.slice(sp + 1);
      if (k === 'url') { url = v; return ''; }
      if (k === 'bar') { const [logo, ...b] = v.split('|'); return `<div class="mk-bar"><b>${esc(logo.trim())}</b><span>${b.map(x => { const [t, h] = hot(x); return `<em class="mk-btn sm${mark(h)}">${esc(t)}</em>`; }).join('')}</span></div>`; }
      if (k === 'side') return `<div class="mk-side">${v.split('|').map(x => { const [t, h] = hot(x); return `<span class="${h ? 'sel' : ''}${mark(h)}">${esc(t)}</span>`; }).join('')}</div>`;
      if (k === 'h') { const [t, h] = hot(v); return `<div class="mk-h${mark(h)}">${esc(t)}</div>`; }
      if (k === 'p') return `<div class="mk-p">${esc(v)}</div>`;
      if (k === 'btn') { const [t, h] = hot(v); return `<div class="mk-row"><em class="mk-btn${h ? ' pri' : ''}${mark(h)}">${esc(t)}</em></div>`; }
      if (k === 'in') { const [t, h] = hot(v); return `<div class="mk-in${mark(h)}"><span>${esc(t)}</span><i>➤</i></div>`; }
      if (k === 'msg') { const who = v[0], [t, h] = hot(v.slice(3)); return `<div class="mk-msg ${who === 'u' ? 'u' : 'a'}${mark(h)}">${esc(t)}</div>`; }
      if (k === 'field') { const c = v.indexOf(':'); const [t, h] = hot(v.slice(c + 1)); return `<div class="mk-field${mark(h)}"><small>${esc(v.slice(0, c))}</small><span>${esc(t)}</span></div>`; }
      if (k === 'code') { const [t, h] = hot(v); return `<div class="mk-code${mark(h)}">${esc(t)}</div>`; }
      if (k === 'toggle') { const [t, h] = hot(v); return `<div class="mk-tog${mark(h)}"><i></i>${esc(t)}</div>`; }
      if (k === 'list' || k === 'tabs') return `<div class="mk-${k}">${v.split('|').map(x => { const [t, h] = hot(x); return `<span class="${h ? 'sel' : ''}${mark(h)}">${esc(t)}</span>`; }).join('')}</div>`;
      if (k === 'nodes') return `<div class="mk-nodes">${v.split('>').map((x, i) => { const [t, h] = hot(x); return `${i ? '<i class="mk-wire"></i>' : ''}<span class="${h ? 'sel' : ''}${mark(h)}">${esc(t)}</span>`; }).join('')}</div>`;
      return '';
    }).join('');
    return `<div class="mock" data-mock><div class="mk-top"><i></i><i></i><i></i><span>${esc(url)}</span></div><div class="mk-body">${body}</div><span class="mk-cur" aria-hidden="true"></span></div>`;
  };
  K.howto = function (h) {
    const head = `<div class="ht-head"><span class="eyebrow">Пошаговая инструкция</span><h3>${esc(h.title)}</h3>
      <p class="ht-meta">${esc(h.svc)}${h.url ? ` · <a href="${h.url}" target="_blank" rel="noopener" class="ext">${esc(h.url.replace(/^https?:\/\/(www\.)?/, ''))}</a>` : ''} · ${h.min} мин · ${h.steps ? h.steps.length : h.n} ${(h.steps ? h.steps.length : h.n) < 5 ? 'шага' : 'шагов'}</p></div>`;
    if (h.locked) return `<section class="howto reveal">${head}<div class="prompt-locked">Инструкция с экранами открывается в полном доступе</div></section>`;
    return `<section class="howto reveal">${head}<ol class="ht-steps">${h.steps.map((st, i) => `<li class="ht-step"><div class="ht-txt"><span class="ht-n">${i + 1}</span><p>${inline(st.t).replace(/\((\d)\)/g, '<b class="ht-ref">$1</b>')}</p></div>${K.mock(st.s)}</li>`).join('')}</ol>
      <p class="ht-note">Экраны упрощены: в сервисе кнопки могут называться и стоять чуть иначе. Ищите похожие подписи.</p></section>`;
  };
  K.mountHowto = (root, D) => $$('.howto-slot', root).forEach(el => { const h = (D.howto || []).find(x => x.id === el.dataset.howto); if (h && !el._m) { el._m = 1; el.innerHTML = K.howto(h); K.observe(el); } });
  // курсор проходит по отмеченным местам
  K.playMock = el => {
    if (RM || el._play) return; el._play = 1;
    const hs = $$('.hot', el), cur = $('.mk-cur', el); if (!hs.length) return;
    let i = 0; const box = el.getBoundingClientRect();
    const go = () => {
      if (!el.isConnected) return;
      const b = el.getBoundingClientRect(), r = hs[i % hs.length].getBoundingClientRect();
      cur.style.transform = `translate(${r.left - b.left + Math.min(r.width * .7, r.width - 10)}px, ${r.top - b.top + r.height * .55}px)`;
      hs.forEach((x, k) => x.classList.toggle('now', k === i % hs.length));
      setTimeout(() => { cur.classList.add('click'); setTimeout(() => cur.classList.remove('click'), 260); }, 700);
      i++; el._t = setTimeout(go, hs.length > 1 ? 1700 : 2600);
    };
    go();
  };

  // ---------- тест ----------
  K.quiz = function (el, mod, onDone) {
    const qs = mod.quiz; if (!qs || !qs.length) { el.innerHTML = ''; return; }
    const saved = K.store.get('quiz', {})[mod.id];
    let i = 0, score = 0, answered = false;
    const show = () => {
      if (i >= qs.length) {
        const all = K.store.get('quiz', {}); all[mod.id] = { s: score, n: qs.length, at: Date.now() }; K.store.set('quiz', all);
        el.innerHTML = `<div class="quiz-end"><div class="ring" style="--p:${score / qs.length * 100}"><b>${score}/${qs.length}</b></div><div><h4>${score === qs.length ? 'Отлично, модуль усвоен' : score >= qs.length / 2 ? 'Хороший результат' : 'Стоит перечитать модуль'}</h4><p>${score === qs.length ? 'Можно двигаться дальше.' : 'Вернитесь к урокам, где были ошибки, и пройдите тест ещё раз.'}</p><button class="btn btn-ghost" type="button" data-q="again">Пройти заново</button></div></div>`;
        onDone && onDone(); return;
      }
      const q = qs[i]; answered = false;
      el.innerHTML = `<div class="quiz-top"><span>Вопрос ${i + 1} из ${qs.length}</span><div class="qbar"><i style="width:${i / qs.length * 100}%"></i></div></div>
        <h4 class="quiz-q">${esc(q.q)}</h4><div class="quiz-a">${q.a.map((a, k) => `<button type="button" class="qa" data-k="${k}"><span>${String.fromCharCode(1040 + k)}</span>${esc(a)}</button>`).join('')}</div><div class="quiz-e"></div>`;
    };
    el.onclick = e => {
      if (e.target.closest('[data-q="again"]')) { i = 0; score = 0; return show(); }
      if (e.target.closest('[data-q="next"]')) { i++; return show(); }
      const b = e.target.closest('.qa'); if (!b || answered) return; answered = true;
      const q = qs[i], k = +b.dataset.k, ok = k === q.c; if (ok) score++;
      $$('.qa', el).forEach(x => { const kk = +x.dataset.k; x.classList.add(kk === q.c ? 'right' : kk === k ? 'wrong' : 'dim'); x.disabled = true; });
      $('.quiz-e', el).innerHTML = `<div class="qe ${ok ? 'ok' : 'no'}"><b>${ok ? 'Верно.' : 'Не совсем.'}</b> ${esc(q.e)}</div><button type="button" class="btn" data-q="next">${i + 1 < qs.length ? 'Следующий вопрос' : 'Результат'}</button>`;
    };
    if (saved) { el.innerHTML = `<div class="quiz-end"><div class="ring" style="--p:${saved.s / saved.n * 100}"><b>${saved.s}/${saved.n}</b></div><div><h4>Тест пройден</h4><p>Ваш лучший результат сохранён в прогрессе.</p><button class="btn btn-ghost" type="button" data-q="again">Пройти заново</button></div></div>`; }
    else show();
  };

  // ---------- API ----------
  K.api = async (path, opt = {}) => {
    const tok = K.store.get('token', null);
    const h = { 'Content-Type': 'application/json' };
    if (tok) h.Authorization = 'Bearer ' + tok;
    const r = await fetch('/api/' + path, { method: opt.body ? 'POST' : 'GET', headers: h, body: opt.body ? JSON.stringify(opt.body) : undefined });
    const j = await r.json().catch(() => ({ error: 'Сервер не ответил' }));
    if (!r.ok) throw new Error(j.error || 'Ошибка ' + r.status);
    return j;
  };
})();
