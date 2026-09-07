#!/usr/bin/env node
// indexnow.cjs — 提交新 URL 给 Bing IndexNow（即时索引，不用等爬虫）
// 用法: node indexnow.cjs "https://jejakkripto.com/新页面/" "https://jejakkripto.com/另一页/"
const https = require('https');

const HOST = 'jejakkripto.com';
const KEY = '91a25e9ebee347589012f92b1b2b8721';

const urls = process.argv.slice(2).filter((u) => /^https:\/\/jejakkripto\.com\//.test(u));

if (urls.length === 0) {
  console.error('用法: node indexnow.cjs "https://jejakkripto.com/xxx/" ...');
  console.error('（只接受 jejakkripto.com 的完整 https 链接）');
  process.exit(1);
}

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls
});

const req = https.request(
  {
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log(`HTTP ${res.statusCode} — ${body || '(空响应，通常表示已接收)'}`);
    });
  }
);

req.on('error', (e) => {
  console.error('提交失败:', e.message);
  process.exit(1);
});
req.write(payload);
req.end();
