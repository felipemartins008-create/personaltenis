const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  let pathname = decodeURI(reqUrl.pathname);

  // Rota do link de divulgação /c, /c/:banner, /link, /link/:banner ou /api/c
  if (pathname === '/c' || pathname.startsWith('/c/') || pathname === '/link' || pathname.startsWith('/link/') || pathname === '/api/c' || pathname === '/api/c.js' || pathname.startsWith('/api/c')) {
    const handler = require('./api/c');
    req.query = Object.fromEntries(reqUrl.searchParams);
    if (pathname.startsWith('/c/')) {
      req.query.banner = pathname.replace('/c/', '');
    } else if (pathname.startsWith('/link/')) {
      req.query.banner = pathname.replace('/link/', '');
    }
    return handler(req, res);
  }

  // Rotas amigáveis
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/divulgacao') {
    pathname = '/divulgacao.html';
  } else if (pathname === '/whatsapp') {
    pathname = '/whatsapp.html';
  }

  // Mapear para pasta public
  let filePath = path.join(__dirname, 'public', pathname);

  // Se não encontrar direto, verificar se existe com .html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Página não encontrada (404)');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎾 Servidor Personal Tênis rodando com sucesso!`);
  console.log(`🚀 Landing Page & Funil:    http://localhost:${PORT}/`);
  console.log(`📱 Painel de Divulgação:    http://localhost:${PORT}/divulgacao`);
  console.log(`🔗 Link do WhatsApp (/c):   http://localhost:${PORT}/c`);
  console.log(`💬 Redirecionador WhatsApp: http://localhost:${PORT}/whatsapp`);
  console.log(`======================================================\n`);
});
