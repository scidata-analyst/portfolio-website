// PROJECT 04 — CONDUIT / Data Pipeline & ETL interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['PRESSURIZING…', 'PRIMING CONDUITS…', 'CHECKING SEALS…', 'OPENING VALVES…'];
  var wi = 0;
  var progress = 0;

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

  /* ---------- CUSTOM CURSOR ---------- */
  var cursor = document.querySelector('[data-cursor]');
  var dot = cursor ? cursor.querySelector('.cursor-dot') : null;
  var ring = cursor ? cursor.querySelector('.cursor-ring') : null;
  var label = cursor ? cursor.querySelector('.cursor-label') : null;
  var mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    if (label && label.style.opacity === '1') {
      label.style.left = mx + 'px';
      label.style.top = (my - 34) + 'px';
    }
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

  /* ---------- HERO REVEAL ---------- */
  function revealHero() {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('revealed'); }, reduceMotion ? 0 : i * 110);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('main [data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('revealed'); });

  /* ---------- SCROLL PROGRESS + TOTOP ---------- */
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
  if (totop) totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- ANIMATED COUNTERS (metric cards) ---------- */
  function setCounterText(el, target, decimals, prefix, suffix) {
    el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
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
        var target = parseFloat(card.dataset.decimal || card.dataset.count || '0');
        var decimals = card.dataset.decimal ? (String(card.dataset.decimal).split('.')[1] || '').length : 0;
        if (reduceMotion) { setCounterText(num, target, decimals, card.dataset.prefix || '', card.dataset.suffix || ''); return; }
        var start = null, dur = 1600;
        function frame(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          num.textContent = (card.dataset.prefix || '') + (target * eased).toFixed(decimals) + (card.dataset.suffix || '');
          if (t < 1) requestAnimationFrame(frame);
          else setCounterText(num, target, decimals, card.dataset.prefix || '', card.dataset.suffix || '');
        }
        requestAnimationFrame(frame);
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- HERO CONDUIT AMBIENT ---------- */
  var heroIngest = document.querySelector('[data-hero-ingest]');
  var liveRate = document.querySelector('[data-live-rate]');
  var dlqHero = document.querySelector('[data-dlq]');
  var baseK = 640;
  var dlq = 143;
  if (!reduceMotion && heroIngest) {
    setInterval(function () {
      var jitter = Math.round(Math.random() * 40 - 20);
      var v = Math.max(560, Math.min(720, baseK + jitter));
      heroIngest.textContent = v;
      if (liveRate) liveRate.textContent = (v / 1000 * 8).toFixed(1) + 'M';
      if (Math.random() > 0.7) {
        dlq = Math.max(12, dlq + (Math.random() > 0.5 ? 3 : -2));
        if (dlqHero) dlqHero.textContent = dlq;
      }
    }, 1800);
  }

  /* ---------- DEMO: LIVE CONDUIT SIMULATOR ---------- */
  var rateEl = document.querySelector('[data-demo-rate]');
  var freshEl = document.querySelector('[data-demo-fresh]');
  var dlqEl = document.querySelector('[data-demo-dlq]');
  var okEl = document.querySelector('[data-demo-ok]');
  var latEl = document.querySelector('[data-lat]');
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var pipeNodes = document.querySelectorAll('.demo-pipe .dp-node');

  var state = { rate: 640, fresh: 0.7, dlq: 143, ok: 99.97, driftHits: 0 };

  function render() {
    if (rateEl) rateEl.textContent = state.rate + 'K';
    if (freshEl) freshEl.textContent = state.fresh.toFixed(1) + 's';
    if (dlqEl) dlqEl.textContent = state.dlq;
    if (okEl) okEl.textContent = state.ok.toFixed(2) + '%';
    if (latEl) latEl.textContent = state.fresh.toFixed(1) + 's';
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

  function hitNode(idx, cls) {
    if (!pipeNodes[idx]) return;
    pipeNodes[idx].classList.remove('dp-node--hit', 'dp-node--ok');
    void pipeNodes[idx].offsetWidth;
    pipeNodes[idx].classList.add(cls);
    setTimeout(function () { pipeNodes[idx].classList.remove('dp-node--hit'); }, 900);
  }

  function inject(kind) {
    if (kind === 'drift') {
      state.driftHits += 1;
      state.rate = Math.max(500, state.rate - 20);
      state.fresh = Math.min(2.4, state.fresh + 0.2);
      state.dlq += Math.round(20 + Math.random() * 30);
      state.ok = Math.max(98.5, state.ok - 0.15);
      hitNode(1, 'dp-node--hit');
      addMsg('warn', 'Schema drift <b>+promo_code:string?</b> detected → auto-migrated <b>silver_orders</b>, backfilled default, no DAG failure.', 'drift #' + state.driftHits + ' · handled · alert: minor');
      setTimeout(function () {
        state.fresh = Math.max(0.7, state.fresh - 0.15);
        hitNode(1, 'dp-node--ok');
        render();
      }, 1400);
    } else if (kind === 'junk') {
      var junk = Math.round(120 + Math.random() * 180);
      state.dlq += junk;
      state.ok = Math.max(97.8, state.ok - 0.6);
      state.fresh = Math.min(2.8, state.fresh + 0.5);
      hitNode(2, 'dp-node--hit');
      addMsg('warn', junk + ' malformed rows quarantined → <b>DLQ</b> (null_violation, bad_date). Pipeline stayed <b>green</b>.', (junk) + ' rows · replayable · 0.0s downtime');
      setTimeout(function () { hitNode(2, 'dp-node--ok'); state.fresh = Math.max(0.8, state.fresh - 0.3); render(); }, 1600);
    } else if (kind === 'spike') {
      var before = state.rate;
      state.rate = Math.min(1200, state.rate + 300 + Math.round(Math.random() * 200));
      state.fresh = Math.min(1.9, state.fresh + 0.4);
      hitNode(0, 'dp-node--hit');
      addMsg('ok', 'Traffic spike <b>' + before + 'K → ' + state.rate + 'K/hr</b> absorbed — autoscaled Spark executors 4 → 8, no backpressure.', 'spike +47% · p95 still ' + state.fresh.toFixed(1) + 's');
      setTimeout(function () { hitNode(0, 'dp-node--ok'); state.fresh = Math.max(0.7, state.fresh - 0.2); render(); }, 1800);
    } else if (kind === 'heal') {
      if (state.dlq === 0) { addMsg('ok', 'DLQ already empty — nothing to replay. Pipe is clean. ✨', 'no-op'); return; }
      var healed = Math.min(state.dlq, 80 + Math.round(Math.random() * 60));
      state.dlq -= healed;
      state.ok = Math.min(99.97, state.ok + healed * 0.004);
      state.fresh = Math.max(0.6, state.fresh - 0.1);
      hitNode(2, 'dp-node--ok');
      addMsg('ok', 'Replayed <b>' + healed + ' rows</b> from DLQ → silver after fix. Lineage updated, audit logged.', 'replayed · delivered 99.97% · ClickHouse fresh');
    }
    render();
  }

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-inject]');
    if (!btn) return;
    inject(btn.dataset.inject);
  });

  // ambient tick keeps the board alive even if user does nothing
  if (!reduceMotion) setInterval(function () {
    if (Math.random() > 0.65) {
      state.rate = Math.max(520, Math.min(820, state.rate + Math.round(Math.random() * 30 - 15)));
      state.fresh = Math.max(0.6, Math.min(1.2, state.fresh + (Math.random() - 0.5) * 0.15));
      render();
    }
  }, 2600);

  render();

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

  /* ---------- GSAP EXTRAS ---------- */
  if (!reduceMotion && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    try {
      gsap.to('.hero-giant', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.next-giant', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'bottom top', scrub: true } });
    } catch (err) {}
  }

  /* ---------- KICK OFF ---------- */
  if (document.readyState === 'complete') tickLoad();
  else window.addEventListener('load', tickLoad);
  setTimeout(function () { if (loader && !loader.classList.contains('loaded') && progress < 100) progress = 99; }, 6000);
})();
