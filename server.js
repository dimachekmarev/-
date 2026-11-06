// Сервер для Render / любого Node-хостинга: статика + /api
const http = require('http'), fs = require('fs'), path = require('path'), url = require('url');
const ROOT = __dirname;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
const API = new Set(['config', 'content', 'checkout', 'order', 'webhook', 'login', 'demo-pay', 'admin']);
require('./api/_course').parse();
http.createServer((req, res) => {
  const u = url.parse(req.url, true); let p = decodeURIComponent(u.pathname);
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (p.startsWith('/api/')) {
    const name = p.slice(5).replace(/\/$/, '');
    if (!API.has(name)) { res.statusCode = 404; return res.end('{}'); }
    let b = ''; req.on('data', c => { b += c; if (b.length > 1e5) req.destroy(); });
    req.on('end', async () => {
      req.query = u.query; try { req.body = b ? JSON.parse(b) : {}; } catch { req.body = {}; }
      try { await require('./api/' + name + '.js')(req, res); } catch (e) { console.error(e); res.statusCode = 500; res.end('{}'); }
    }); return;
  }
  if (p === '/') p = '/index.html';
  if (!/^\/(assets\/[\w.-]+|[\w-]+(\.html)?)$/.test(p) || /^\/(server|package)/.test(p)) { res.statusCode = 404; return res.end('Not found'); }
  let f = path.join(ROOT, p); if (!path.extname(f)) f += '.html';
  fs.readFile(f, (e, d) => {
    if (e) { res.statusCode = 404; res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.end('<p>Страница не найдена. <a href="/">На главную</a></p>'); }
    res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream');
    res.setHeader('Cache-Control', p.startsWith('/assets/') ? 'public, max-age=300' : 'no-cache');
    res.end(d);
  });
}).listen(process.env.PORT || 3000, () => console.log('listening ' + (process.env.PORT || 3000)));
