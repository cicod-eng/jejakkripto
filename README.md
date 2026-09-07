# JejakKripto

Panduan kripto berbahasa Indonesia untuk pemula. Situs statis, di-deploy ke GitHub Pages.

## Struktur

```
jejakkripto/
├── index.html                 # 首页
├── 404.html                   # 自定义 404
├── CNAME                      # 域名 jejakkripto.com
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/style.css          # 全局样式 + 设计 tokens
│   └── js/main.js             # GA4 埋点 / 导航 / affiliate 事件
├── belajar-kripto/            # 栏目：Belajar Kripto
├── bursa-kripto/              # 栏目：Bursa Kripto
├── dompet-kripto/             # 栏目：Dompet Kripto
├── aset-rwa/                  # 栏目：Aset & RWA
├── panduan-binance/           # 专题：Panduan Binance
├── panduan-okx/               # 专题：Panduan OKX
├── tentang-kami/              # 合规页（+ 其余 7 个）
└── JEJAKKRIPTO-建站总规范.md   # 权威规范（56 条）
```

## 部署前必做

1. **填 GA4 ID** — 打开 `assets/js/main.js`，把 `JEJAK_CONFIG.ga4Id` 的 `G-XXXXXXXXXX` 换成真实 Measurement ID。
2. **Bing 验证（可选）** — 把验证码填到 `JEJAK_CONFIG.bingSiteVerification`（或用 HTML 文件验证）。
3. **GSC 验证** — 在 Search Console 用「域名」或「网址前缀」验证 `jejakkripto.com`。
4. **DNS** — 把 `jejakkripto.com` 的 CNAME/A 记录指向 GitHub Pages；仓库 Settings → Pages 里设 Custom domain 并勾选 Enforce HTTPS。

## URL 规范

- 新页面一律建目录 `slug/index.html`，无 `.html` 后缀。
- slug 用全印尼语连字符，例如 `/cara-daftar-binance/`。
- 新增页面后手动把条目加进 `sitemap.xml`。

## 发布新文章

按《JEJAKKRIPTO-建站总规范.md》附录 A 的顺序写，Tier A 6 篇优先。每篇：
- 结论前置（前 150 字给答案）
- 合规口径：不称 Binance.com/OKX "berizin"，以 OJK 官方清单为准
- affiliate 链接加 `rel="sponsored nofollow"` + 就近披露
- 配图用 `.webp`
