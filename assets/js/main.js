// JejakKripto — 全局脚本（GA4 埋点 / 移动导航 / 搜索 / affiliate 埋点）

// ===== 站点配置（部署前请填写） =====
var JEJAK_CONFIG = {
  // 替换为你的 GA4 Measurement ID，例如 'G-ABC123DEF'。
  // 未填写或保留 XXXX 时，GA4 自动跳过，不影响其它功能。
  ga4Id: 'G-XXXXXXXXXX',
  // 可选：Bing 站长工具站点验证码（留空跳过）。
  bingSiteVerification: ''
};

// ===== GA4 动态加载 =====
(function () {
  var id = JEJAK_CONFIG.ga4Id || '';
  if (!id || id.indexOf('XXXX') !== -1) return; // 未配置，跳过

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
})();

// ===== Bing 站点验证（可选） =====
(function () {
  var code = JEJAK_CONFIG.bingSiteVerification;
  if (!code) return;
  var meta = document.createElement('meta');
  meta.name = 'msvalidate.01';
  meta.content = code;
  document.head.appendChild(meta);
})();

// ===== 全局交互 =====
(function () {
  'use strict';

  // 移动端导航开关
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // 搜索按钮：首页滚动到搜索框并聚焦，内页跳回 /#cari
  var searchToggles = document.querySelectorAll('.search-toggle');
  searchToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var path = window.location.pathname.replace(/\/+$/, '');
      if (path === '' || path === '/index.html') {
        var box = document.getElementById('cari');
        if (box) {
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var input = box.querySelector('input[type="search"]');
          if (input) input.focus();
        }
      } else {
        window.location.href = '/#cari';
      }
    });
  });

  // 从内页带 #cari 跳回时，聚焦搜索框（浏览器已自动滚动到锚点）
  if (window.location.hash === '#cari') {
    var searchInput = document.querySelector('#cari input[type="search"]');
    if (searchInput) searchInput.focus();
  }

  // Affiliate 出站点击事件埋点（GA4 事件名统一，见总规范第 44 条）
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-affiliate]');
    if (!el) return;
    var platform = el.getAttribute('data-affiliate'); // binance | okx
    var kind = el.getAttribute('data-cta') || 'click';
    if (window.gtag) {
      window.gtag('event', 'affiliate_click_' + platform, {
        event_category: 'affiliate',
        event_label: kind
      });
    }
  });
})();
