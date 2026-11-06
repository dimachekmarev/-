// Парсер курса: markdown-файлы из /private -> структура модулей
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'private');
const FILES = ['part1.md', 'part2.md', 'part3.md', 'part4.md'];
let cache = null;

// Контент: из папки private/ (разработка) или из зашифрованного content.enc (публикация)
function files() {
  if (fs.existsSync(path.join(DIR, 'part1.md'))) {
    const o = {}; for (const f of FILES.concat('data.js', 'howto.js')) o[f] = fs.readFileSync(path.join(DIR, f), 'utf8'); return o;
  }
  const crypto = require('crypto');
  const raw = Buffer.from(fs.readFileSync(path.join(__dirname, '..', 'content.enc'), 'utf8'), 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', Buffer.from(process.env.CONTENT_KEY || '', 'hex'), raw.subarray(0, 12));
  d.setAuthTag(raw.subarray(12, 28));
  return JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString('utf8'));
}

function parseQuiz(src) {
  const qs = [];
  let cur = null;
  for (const raw of src.split('\n')) {
    const l = raw.trim();
    if (l.startsWith('?? ')) { cur = { q: l.slice(3), a: [], c: 0, e: '' }; qs.push(cur); }
    else if (cur && (l.startsWith('- ') || l.startsWith('+ '))) { if (l[0] === '+') cur.c = cur.a.length; cur.a.push(l.slice(2)); }
    else if (cur && l.startsWith('= ')) cur.e = l.slice(2);
  }
  return qs;
}

function parse() {
  if (cache) return cache;
  const src = files();
  const md = FILES.map(f => src[f]).join('\n');
  const mod = { exports: {} }; new Function('module', 'exports', src['data.js'])(mod, mod.exports);
  const data = mod.exports;
  const hm = { exports: {} }; new Function('module', 'exports', src['howto.js'])(hm, hm.exports);
  data.howto = hm.exports;
  const modules = [];
  const prompts = [];
  let m = null, l = null;
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# M ')) {
      const [h, title, sub, flag] = line.slice(2).split('|').map(s => s.trim());
      m = { id: 'm' + h.split(' ')[1], num: h.split(' ')[1], title, sub, free: flag === 'free', lessons: [], quiz: [] };
      modules.push(m); l = null; continue;
    }
    if (line.startsWith('## L ')) {
      const [h, title, min] = line.slice(3).split('|').map(s => s.trim());
      l = { id: h.split(' ')[1], title, min: +min || 8, md: '' };
      m.lessons.push(l); continue;
    }
    if (line.trim() === '::quiz') {
      const buf = [];
      while (++i < lines.length && lines[i].trim() !== '::end') buf.push(lines[i]);
      m.quiz = m.quiz.concat(parseQuiz(buf.join('\n')));
      continue;
    }
    if (line.startsWith('::prompt ')) {
      const title = line.slice(9).trim();
      const buf = [];
      let j = i;
      while (++j < lines.length && lines[j].trim() !== '::end') buf.push(lines[j]);
      prompts.push({ cat: m.title, title, text: buf.join('\n').trim(), free: m.free, mod: m.num, lesson: l && l.id });
    }
    if (l) l.md += line + '\n';
  }
  for (const p of data.extraPrompts) prompts.push({ cat: p.cat, title: p.title, text: p.text, free: false });
  modules.forEach(mm => mm.lessons.forEach(ll => { ll.md = ll.md.trim(); }));
  cache = { modules, prompts, data };
  return cache;
}

// Отдаём контент: бесплатным — открытые модули полностью, остальное — оглавление
function payload(paid) {
  const { modules, prompts, data } = parse();
  return {
    paid,
    modules: modules.map(mm => {
      const open = paid || mm.free;
      return {
        id: mm.id, num: mm.num, title: mm.title, sub: mm.sub, free: mm.free, locked: !open,
        lessons: mm.lessons.map(ll => open ? ll : { id: ll.id, title: ll.title, min: ll.min }),
        quiz: open ? mm.quiz : [], quizCount: mm.quiz.length
      };
    }),
    prompts: prompts.map(p => (paid || p.free) ? p : { cat: p.cat, title: p.title, locked: true, mod: p.mod }),
    howto: data.howto.map(h => (paid || h.free) ? h : { id: h.id, title: h.title, svc: h.svc, url: h.url, min: h.min, n: h.steps.length, locked: true }),
    tools: data.tools, links: data.links, money: data.money, subs: data.subs, glossary: data.glossary,
    stats: {
      modules: modules.length,
      lessons: modules.reduce((s, x) => s + x.lessons.length, 0),
      minutes: modules.reduce((s, x) => s + x.lessons.reduce((a, b) => a + b.min, 0), 0),
      prompts: prompts.length, quiz: modules.reduce((s, x) => s + x.quiz.length, 0),
      howto: data.howto.length, tools: data.tools.length, money: data.money.length, glossary: data.glossary.length
    }
  };
}

module.exports = { parse, payload };
