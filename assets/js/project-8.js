// PROJECT 08 — SHIELD / Hate Speech & Sentiment interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['SCANNING…', 'ARMING FILTERS…', 'LOADING 50 LANGS…', 'CALIBRATING TONE…'];
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
        var target = parseFloat(card.dataset.decimal || card.dataset.count || '0');
        var decimals = card.dataset.decimal ? (String(card.dataset.decimal).split('.')[1] || '').length : 0;
        var suffix = card.dataset.suffix || '';
        var prefix = card.dataset.prefix || '';
        if (reduceMotion) { num.textContent = prefix + target.toFixed(decimals) + suffix; mio.unobserve(card); return; }
        var start = null, dur = 1600;
        function frame(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          num.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(frame);
          else num.textContent = prefix + target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(frame);
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- HERO AMBIENT (live scans) ---------- */
  var liveScans = document.querySelector('[data-live-scans]');
  if (!reduceMotion && liveScans) {
    var base = 12;
    setInterval(function () {
      var jitter = (Math.random() - 0.5) * 0.6;
      liveScans.textContent = (base + jitter).toFixed(1) + 'M';
    }, 2000);
  }

  /* ---------- DEMO: LIVE SHIELD ---------- */
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var input = document.querySelector('[data-input]');
  var sendBtn = document.querySelector('[data-send]');
  var latEl = document.querySelector('[data-lat]');

  function classify(text) {
    var t = text.toLowerCase();
    // coded BN-EN
    if (/tui ekta|tui.*\*\*\*|bainchod|\*\*\*.*bn/i.test(text) || (t.indexOf('tui') !== -1 && text.indexOf('***') !== -1)) {
      return { kind: 'blocked', label: 'BLOCKED · hate 0.97 · BN-EN', meta: 'hate 0.97 · target:protected 0.94 · BN-EN · 38ms' };
    }
    if (/k\*\*\* them all|kill them all.*hate|\[hate\]/i.test(text)) {
      return { kind: 'blocked', label: 'BLOCKED · hate 0.97 · intent:threat', meta: 'hate 0.97 · harass 0.88 · target:protected · 42ms' };
    }
    if (/kill the lights|kill.*lights/i.test(text) && t.indexOf('hate') === -1) {
      return { kind: 'safe', label: 'SAFE · hate 0.02 · context:safe', meta: 'context:safe phrase · hate 0.02 · EN · 31ms' };
    }
    if (/terrible.*worst|worst.*decision|terrible policy/i.test(text)) {
      return { kind: 'flagged', label: 'FLAGGED · sentiment:neg 0.84 → review', meta: 'sentiment:neg 0.84 · hate 0.08 · heated not hate · 44ms' };
    }
    // heuristic fallback: very short positive
    if (t.length < 80 && /(great|happy|love|good|awesome|thanks|quality)/i.test(text)) {
      return { kind: 'safe', label: 'SAFE · sentiment:pos 0.92', meta: 'sentiment:pos 0.92 · hate 0.02 · EN · 29ms' };
    }
    // default: neutral safe with low hate
    return { kind: 'safe', label: 'SAFE · hate 0.06 · neutral', meta: 'hate 0.06 · sentiment:neu 0.71 · 36ms' };
  }

  function tickLat() {
    var v = 34 + Math.round(Math.random() * 24);
    if (latEl) latEl.textContent = v + 'ms';
    return v;
  }

  function addMsg(kind, text, meta) {
    if (!feed) return;
    var div = document.createElement('div');
    div.className = 'msg msg--' + kind;
    var p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    if (meta) {
      var s = document.createElement('span');
      s.className = 'intent';
      s.textContent = meta;
      div.appendChild(s);
    }
    feed.appendChild(div);
    while (feed.children.length > 5) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
    if (!reduceMotion) {
      div.style.opacity = '0'; div.style.transform = 'translateY(8px)';
      requestAnimationFrame(function () {
        div.style.transition = 'opacity .35s, transform .35s';
        div.style.opacity = '1'; div.style.transform = 'translateY(0)';
      });
    }
  }

  function scan(text) {
    if (!text || !text.trim()) return;
    var c = classify(text);
    addMsg(c.kind === 'blocked' ? 'blocked' : c.kind === 'flagged' ? 'flagged' : 'safe', text, c.label + ' · ' + c.meta.replace(/.*·\s*/, ''));
    // also add a detailed intent line separately for flagged
    tickLat();
  }

  var PRESETS = {
    safe: 'Great product! Really happy with quality 😊',
    heated: 'This policy is terrible, worst decision ever',
    coded: 'tui ekta *** — tui morbi (BN-EN)',
    hate: 'k*** them all — they should disappear [hate]'
  };

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-inject]');
    if (!btn) return;
    var kind = btn.dataset.inject;
    var txt = PRESETS[kind] || kind;
    scan(txt);
  });

  function doSend() {
    if (!input) return;
    var v = input.value;
    if (!v.trim()) return;
    scan(v);
    input.value = '';
    input.focus();
  }

  if (sendBtn) sendBtn.addEventListener('click', doSend);
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doSend();
  });

  // ambient demo ticks: simulate incoming posts
  var samples = [
    'Love the new update, so smooth! ✨',
    'This is the worst service ever, refund now!',
    'tui ekta *** bokachoda',
    'Kill the lights and save power 💡',
    'You people are all the same, hate you'
  ];
  var si = 0;
  if (!reduceMotion) setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    if (Math.random() > 0.72) {
      si = (si + 1) % samples.length;
      // only auto-add occasionally so demo doesn't spam while user types
      if (feed && feed.children.length < 5) scan(samples[si]);
    }
  }, 4000);

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
