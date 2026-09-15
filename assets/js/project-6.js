// PROJECT 06 — VOLT / AI Power Saving interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function calcArc(kw) {
    // 0-1200kW maps to 251 dash length, cap 860 safe, 1150 danger
    var pct = Math.max(0, Math.min(1, kw / 1150));
    return 251 * (1 - pct);
  }

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['CHARGING…', 'SYNCING METERS…', 'LEARNING LOAD…', 'ARMING BREAKERS…'];
  var wi = 0, progress = 0;
  var wordTimer = setInterval(function () {
    wi = (wi + 1) % words.length;
    if (loaderWord) loaderWord.textContent = words[wi];
  }, 700);
  function finishLoad() {
    clearInterval(wordTimer);
    if (loaderNum) loaderNum.textContent = '100';
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(function () {
      if (loader) loader.classList.add('loaded');
      revealHero();
    }, 450);
  }
  function tickLoad() {
    progress += 6 + Math.random() * 14;
    if (progress >= 100) finishLoad();
    else {
      if (loaderNum) loaderNum.textContent = Math.floor(progress);
      if (loaderFill) loaderFill.style.width = progress + '%';
      setTimeout(tickLoad, 110 + Math.random() * 220);
    }
  }

  /* ---------- CURSOR ---------- */
  var cursor = document.querySelector('[data-cursor]');
  var dot = cursor ? cursor.querySelector('.cursor-dot') : null;
  var ring = cursor ? cursor.querySelector('.cursor-ring') : null;
  var label = cursor ? cursor.querySelector('.cursor-label') : null;
  var mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    if (label && label.style.opacity === '1') { label.style.left = mx + 'px'; label.style.top = (my - 34) + 'px'; }
  });
  (function animateRing() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateRing);
  })();
  document.querySelectorAll('a, button, [data-magnetic]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (ring) { ring.style.width = '58px'; ring.style.height = '58px'; }
      if (label) { label.style.opacity = '1'; label.style.left = mx + 'px'; label.style.top = (my - 34) + 'px'; }
    });
    el.addEventListener('mouseleave', function () {
      if (ring) { ring.style.width = '44px'; ring.style.height = '44px'; }
      if (label) label.style.opacity = '0';
    });
  });

  /* ---------- REVEAL ---------- */
  function revealHero() {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('revealed'); }, reduceMotion ? 0 : i * 110);
    });
  }
  var revealEls = document.querySelectorAll('main [data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('revealed'); });

  /* ---------- PROGRESS + TOTOP ---------- */
  var bar = document.querySelector('[data-progress]');
  var totop = document.querySelector('.footer-totop');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = p + '%';
    if (totop) totop.classList.toggle('visible', h.scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- METRIC COUNTERS ---------- */
  var counted = new WeakSet();
  var metrics = document.querySelectorAll('.metric');
  if ('IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || counted.has(en.target)) return;
        counted.add(en.target);
        var card = en.target;
        var num = card.querySelector('[data-num]');
        if (!num) return;
        var raw = card.dataset.decimal || card.dataset.count || '0';
        var target = parseFloat(raw);
        var isTime = raw.indexOf('w') !== -1;
        var decimals = card.dataset.decimal ? (String(card.dataset.decimal).split('.')[1] || '').length : 0;
        if (reduceMotion) {
          num.textContent = (card.dataset.prefix || '') + (isTime ? target + 'w' : target.toFixed(decimals)) + (card.dataset.suffix || '');
          mio.unobserve(card); return;
        }
        var start = null, dur = 1600;
        function frame(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          var v = target * eased;
          if (isTime) num.textContent = (card.dataset.prefix || '') + Math.round(v) + 'w';
          else num.textContent = (card.dataset.prefix || '') + v.toFixed(decimals) + (card.dataset.suffix || '');
          if (t < 1) requestAnimationFrame(frame);
          else {
            if (isTime) num.textContent = (card.dataset.prefix || '') + target + 'w' + (card.dataset.suffix || '');
            else num.textContent = (card.dataset.prefix || '') + target.toFixed(decimals) + (card.dataset.suffix || '');
          }
        }
        requestAnimationFrame(frame);
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- HERO AMBIENT (substation ticks) ---------- */
  var heroKw = document.querySelector('[data-hero-kw]');
  var heroEff = document.querySelector('[data-hero-eff]');
  var heroSaved = document.querySelector('[data-hero-saved]');
  var liveKw = document.querySelector('[data-live-kw]');
  var demoKw = document.querySelector('[data-demo-kw]');
  var demoEff = document.querySelector('[data-demo-eff]');
  var demoSaved = document.querySelector('[data-demo-saved]');
  var demoPeak = document.querySelector('[data-demo-peak]');
  var demoArc = document.querySelector('[data-demo-arc]');
  var demoLat = document.querySelector('[data-lat]');

  var kw = 742, eff = 65, saved = 35;

  function renderKw() {
    var txt = String(Math.round(kw));
    if (heroKw) heroKw.textContent = txt;
    if (liveKw) liveKw.textContent = txt;
    if (demoKw) demoKw.textContent = txt;
    if (heroEff) heroEff.textContent = Math.round(eff) + '%';
    if (demoEff) demoEff.textContent = Math.round(eff) + '%';
    if (heroSaved) heroSaved.textContent = '−' + Math.round(saved) + '%';
    if (demoSaved) demoSaved.textContent = Math.round(saved) + '%';
    if (demoPeak) demoPeak.textContent = 'peak ' + (kw > 900 ? '⚠ ' + Math.round(kw + 40) + 'kW cap' : '860kW cap');
    if (demoArc) demoArc.setAttribute('stroke-dashoffset', String(Math.round(calcArc(kw))));
  }

  if (!reduceMotion) setInterval(function () {
    var jitter = Math.round(Math.random() * 30 - 15);
    kw = Math.max(680, Math.min(860, kw + jitter * 0.35));
    eff = Math.max(58, Math.min(74, eff + (Math.random() - 0.5) * 1.2));
    renderKw();
    if (demoLat) demoLat.textContent = (0.7 + Math.random() * 0.6).toFixed(1) + 's';
  }, 1800);

  renderKw();

  /* ---------- DEMO GRID SIM ---------- */
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var zones = document.querySelectorAll('[data-dz]');

  function setZone(id, html, cls) {
    var el = document.querySelector('[data-dz="' + id + '"]');
    if (!el) return;
    if (cls) { el.className = 'dz dz--' + cls; } else el.className = 'dz';
    // rebuild inner only if html contains b/em? we just update em
    if (typeof html === 'string') {
      var em = el.querySelector('em');
      if (em) em.textContent = html;
    }
  }

  function addMsg(kind, html, meta) {
    if (!feed) return;
    var div = document.createElement('div');
    div.className = 'msg msg--' + kind;
    var p = document.createElement('p');
    p.innerHTML = html;
    div.appendChild(p);
    if (meta) {
      var s = document.createElement('span');
      s.className = 'intent';
      s.textContent = meta;
      div.appendChild(s);
    }
    feed.appendChild(div);
    while (feed.children.length > 4) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
    if (!reduceMotion) {
      div.style.opacity = '0'; div.style.transform = 'translateY(8px)';
      requestAnimationFrame(function () {
        div.style.transition = 'opacity .35s, transform .35s';
        div.style.opacity = '1'; div.style.transform = 'translateY(0)';
      });
    }
  }

  function inject(kind) {
    if (kind === 'phantom') {
      kw = Math.min(980, kw + 28);
      eff = Math.max(52, eff - 3);
      saved = Math.max(18, saved - 2);
      setZone('B', 'PHANTOM 18kW · shedding', 'hot');
      setZone('A', '72% · hold', null);
      addMsg('warn', '04:12 — Phantom <b>HVAC-3 18kW</b> ghost load → breaker <b>B-3 OPEN</b>, Zone C lights cut', '0.9s · occupancy 0 · saved 12kW instantly');
      setTimeout(function () { kw = Math.max(700, kw - 20); eff = Math.min(68, eff + 2); saved = Math.min(35, saved + 1); renderKw(); setZone('B', '68% · isolated ✓', 'ok'); }, 1800);
    } else if (kind === 'peak') {
      kw = Math.min(1120, kw + 220);
      eff = Math.max(48, eff - 8);
      addMsg('bad', '⚠ Forecast <b>T+18m 1,140kW</b> — trip risk 0.82 · staggering <b>compressor-2 +4m</b>', 'peak shave · cap 860kW · risk avoided');
      setZone('A', '88% · staggered', 'hot');
      setZone('B', '76% · shed HVAC', 'hot');
      setTimeout(function () { kw = 860; eff = 64; saved = 35; renderKw(); addMsg('ok', 'Staggered ✓ — peak held at <b>860kW</b>, production uninterrupted', '0.9s · no blackout · penalty avoided $420'); setZone('A', '72% · optimal', 'ok'); setZone('B', '65% · shed held', 'ok'); }, 2000);
    } else if (kind === 'fault') {
      addMsg('bad', 'Sensor <b>CLAMP-B2 offline</b> — fallback to neighbor + last good value', 'fault · redundancy active · MTTR 0.9s → 47m before');
      setZone('B', 'sensor fault · fallback', 'hot');
      setTimeout(function () { addMsg('ok', 'Sensor recovered — calibration done, line <b>re-closed</b>', 'self-heal · no crew dispatched'); setZone('B', '71% · healthy', 'ok'); }, 1700);
    } else if (kind === 'restore') {
      kw = 742; eff = 65; saved = 35; renderKw();
      setZone('A', 'OPTIMAL · hold', null);
      setZone('B', 'PHANTOM 12kW', 'hot');
      setZone('C', 'IDLE · cut', 'off');
      addMsg('ok', 'Breakers restored — grid back to <b>optimal</b>, learning updated', '0.9s · policy logged · next phantom caught faster');
    }
    renderKw();
  }

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-inject]');
    if (!btn) return;
    inject(btn.dataset.inject);
  });

  /* ---------- MAGNETIC ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.12 + 'px,' + y * 0.12 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- GSAP ---------- */
  if (!reduceMotion && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    try {
      gsap.to('.hero-giant', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.next-giant', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'bottom top', scrub: true } });
    } catch (err) {}
  }

  if (document.readyState === 'complete') tickLoad();
  else window.addEventListener('load', tickLoad);
  setTimeout(function () { if (loader && !loader.classList.contains('loaded') && progress < 100) progress = 99; }, 6000);
})();
