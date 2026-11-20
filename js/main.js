/* ============================================================
   陆地航母调研网页 — 交互脚本
   ============================================================ */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  /* ---------- 滚动进度 & 返回顶部 ---------- */
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = percent + '%';

    header.classList.toggle('scrolled', scrollTop > 20);
    backTop.classList.toggle('show', scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 移动端菜单 ---------- */
  menuToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 滚动显现动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // 数字滚动
          if (entry.target.classList.contains('stat')) {
            animateCount(entry.target.querySelector('.stat-num'));
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    document.querySelectorAll('.stat-num').forEach(animateCount);
  }

  /* 图表容器：给 panel 加 in-view 以触发条形动画 */
  const panels = document.querySelectorAll('.panel');
  if ('IntersectionObserver' in window) {
    const chartObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    panels.forEach(function (p) { chartObserver.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add('in-view'); });
  }

  /* ---------- 数字滚动 ---------- */
  function animateCount(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.count, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1300;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.innerHTML = prefix + value.toLocaleString('en-US') + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 导航高亮（当前区块） ---------- */
  const sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.prototype.slice.call(navLinks.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }
})();
