import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost`);
  const path = url.searchParams.get('path');
  
  if (!path) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Укажите параметр path' }));
    return;
  }

  const targetUrl = `https://api.hh.ru${path}`;
  
  https.get(targetUrl, { headers: { 'User-Agent': 'Nerva-MVP/1.0' } }, (hhRes) => {
    let data = '';
    hhRes.on('data', chunk => data += chunk);
    hhRes.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (e) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  });
}).listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
