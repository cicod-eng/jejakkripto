#!/usr/bin/env node
// breadcrumbs.cjs — 全站扫描 index.html，按每个页面已有的视觉面包屑生成 BreadcrumbList JSON-LD
// 用法: node breadcrumbs.cjs  （幂等：已含 BreadcrumbList 的页面自动跳过）
const fs = require('fs');
const path = require('path');

const HOST = 'https://jejakkripto.com';
const ROOT = __dirname;

function findPages(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'assets' || e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...findPages(full));
    else if (e.name === 'index.html') out.push(full);
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function dirToUrl(rel) {
  const dir = rel.replace(/\/index\.html$/, '');
  return dir ? `${HOST}/${dir}/` : `${HOST}/`;
}

// 从视觉面包屑解析出 [{name, url}]，最后一项 url 为 null（用当前页 URL 填）
function parseBreadcrumb(html) {
  const nav = html.match(/<nav class="breadcrumb"[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) return null;
  const inner = nav[1];
  const anchors = [];
  const re = /<a href="([^"]*)">([^<]*)<\/a>/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    anchors.push({ href: m[1], name: decode(m[2]), end: re.lastIndex });
  }
  const links = anchors.map((a) => ({ name: a.name, url: HOST + a.href }));
  const tail = anchors.length
    ? inner.slice(anchors[anchors.length - 1].end).replace(/^\s*›\s*/, '').trim()
    : '';
  if (tail) links.push({ name: decode(tail), url: null });
  return links;
}

function blockFor(jsonLd) {
  const json = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n');
  return `  <script type="application/ld+json">\n${json}\n  </script>\n`;
}

const pages = findPages(ROOT).sort();
let ok = 0;
let skip = 0;
let none = 0;

for (const file of pages) {
  const rel = path.relative(ROOT, file);
  if (rel === 'index.html') continue; // 首页无面包屑
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('BreadcrumbList')) { skip++; continue; }
  const links = parseBreadcrumb(html);
  if (!links || links.length === 0) { none++; console.log('NO-BREADCRUMB', rel); continue; }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: links.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.name,
      item: l.url || dirToUrl(rel)
    }))
  };
  if (!html.includes('</head>')) { none++; console.log('NO-HEAD', rel); continue; }
  html = html.replace('</head>', blockFor(jsonLd) + '</head>');
  fs.writeFileSync(file, html);
  ok++;
  console.log(`OK  ${rel}  (${links.length} 级)`);
}

console.log(`\n完成：新增 ${ok} 页，跳过(已有) ${skip} 页，异常 ${none} 页`);
