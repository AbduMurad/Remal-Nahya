/* =========================================================================
   REMAL NAHYA — site behaviour. No dependencies.
   ========================================================================= */
(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ scroll reveal */
  function reveal() {
    var els = document.querySelectorAll('[data-rv]');
    if (RM || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.setAttribute('data-in', 'true'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = parseInt(el.getAttribute('data-rv'), 10) || 0;
        setTimeout(function () { el.setAttribute('data-in', 'true'); }, d * 70);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
    // fail-safe: nothing stays invisible if the observer never fires
    setTimeout(function () {
      els.forEach(function (e) { e.setAttribute('data-in', 'true'); });
    }, 3200);
  }

  /* ------------------------------------------------ count-up stats */
  function counters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (RM || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.textContent = e.getAttribute('data-fmt') || e.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')),
            pre = el.getAttribute('data-pre') || '', post = el.getAttribute('data-post') || '',
            grp = el.getAttribute('data-group') === '1', t0 = null, DUR = 950;
        function fmt(n) {
          var s = grp ? Math.round(n).toLocaleString('en-US') : String(Math.round(n));
          return pre + s + post;
        }
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / DUR, 1);
          el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
    // fail-safe: a stat never sits at 0 if the observer never fires
    setTimeout(function () {
      els.forEach(function (e) {
        if (e.textContent === '0') e.textContent = e.getAttribute('data-fmt') || e.getAttribute('data-count');
      });
    }, 3200);
  }

  /* ------------------------------------------------ mobile drawer */
  function drawer() {
    var d = document.getElementById('drawer');
    if (!d) return;
    var open = document.getElementById('burger'), close = document.getElementById('drawerClose');
    function set(v) {
      d.setAttribute('data-open', v ? 'true' : 'false');
      document.body.style.overflow = v ? 'hidden' : '';
      if (open) open.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) { var f = d.querySelector('a,button'); if (f) f.focus(); }
    }
    if (open) open.addEventListener('click', function () { set(true); });
    if (close) close.addEventListener('click', function () { set(false); });
    d.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && d.getAttribute('data-open') === 'true') { set(false); if (open) open.focus(); }
    });
  }

  /* ------------------------------------------------ scroll progress */
  function progress() {
    var bar = document.getElementById('prog');
    if (!bar) return;
    var tick = false;
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.inlineSize = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }

  /* ------------------------------------------------ wellbore scroller */
  function wellScroller() {
    var wrap = document.getElementById('wellwrap');
    if (!wrap) return;
    var svg = wrap.querySelector('.well');
    var steps = wrap.querySelectorAll('.wstep');
    if (!steps.length) return;

    if (svg && 'IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { svg.setAttribute('data-drawn', 'true'); dio.disconnect(); }
      }, { threshold: 0.25 });
      dio.observe(svg);
    } else if (svg) { svg.setAttribute('data-drawn', 'true'); }

    function activate(stage) {
      steps.forEach(function (s) {
        s.setAttribute('data-on', s.getAttribute('data-stage') === stage ? 'true' : 'false');
      });
      if (!svg) return;
      svg.querySelectorAll('.w-stage').forEach(function (g) {
        g.setAttribute('data-on', g.getAttribute('data-stage') === stage ? 'true' : 'false');
      });
    }
    activate(steps[0].getAttribute('data-stage'));

    if (RM || !('IntersectionObserver' in window)) {
      steps.forEach(function (s) { s.setAttribute('data-on', 'true'); });
      if (svg) svg.querySelectorAll('.w-stage').forEach(function (g) { g.setAttribute('data-on', 'true'); });
      return;
    }
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(en.target.getAttribute('data-stage'));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { sio.observe(s); });

    steps.forEach(function (s) {
      s.addEventListener('mouseenter', function () { activate(s.getAttribute('data-stage')); });
    });
  }

  /* ------------------------------------------------ services filter + search */
  function filters() {
    var root = document.getElementById('srvfilter');
    if (!root) return;
    var chips = root.querySelectorAll('.chip');
    var input = root.querySelector('input[type="search"]');
    var items = document.querySelectorAll('[data-cat]');
    var empty = document.getElementById('noresult');
    var cat = 'all';

    function apply() {
      var q = (input && input.value || '').trim().toLowerCase();
      var shown = 0;
      items.forEach(function (it) {
        var okCat = cat === 'all' || it.getAttribute('data-cat') === cat;
        var okQ = !q || (it.getAttribute('data-search') || it.textContent).toLowerCase().indexOf(q) > -1;
        var ok = okCat && okQ;
        it.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true');
        cat = c.getAttribute('data-filter');
        apply();
      });
    });
    if (input) input.addEventListener('input', apply);
    apply();
  }

  /* ------------------------------------------------ contact form (demo) */
  function form() {
    var f = document.getElementById('rfq');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('rfqok');
      if (ok) { ok.setAttribute('data-on', 'true'); ok.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' }); }
      f.reset();
    });
  }

  /* ------------------------------------------------ header shade on scroll */
  function header() {
    var h = document.querySelector('.hdr');
    if (!h) return;
    var tick = false;
    function upd() {
      h.style.background = window.scrollY > 40 ? 'rgba(11,21,51,.985)' : 'rgba(11,21,51,.92)';
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }

  function boot() {
    reveal(); counters(); drawer(); progress();
    wellScroller(); filters(); form(); header();
    if (window.__remalRoute) window.__remalRoute();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.__remalBoot = boot;
})();
