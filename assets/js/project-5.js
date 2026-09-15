// PROJECT 05 — PULSE / AI Ad Buy & Audience interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['CALIBRATING ROAS…', 'SCANNING AUDIENCES…', 'ARMING BIDS…', 'KILLING WASTE…'];
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
      label.style.left = mx + 'px'; label.style.top = (my - 34) + 'px';
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
        if (reduceMotion) {
          num.textContent = (card.dataset.prefix || '') + target.toFixed(decimals) + (card.dataset.suffix || '');
          mio.unobserve(card); return;
        }
        var start = null, dur = 1600;
        function frame(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          num.textContent = (card.dataset.prefix || '') + (target * eased).toFixed(decimals) + (card.dataset.suffix || '');
          if (t < 1) requestAnimationFrame(frame);
          else num.textContent = (card.dataset.prefix || '') + target.toFixed(decimals) + (card.dataset.suffix || '');
        }
        requestAnimationFrame(frame);
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- HERO EXCHANGE AMBIENT ---------- */
  var heroBid = document.querySelector('[data-hero-bid]');
  var heroRoas = document.querySelector('[data-hero-roas]');
  var heroFeed = document.querySelector('[data-hero-feed]');
  var liveBids = document.querySelector('[data-live-bids]');
  var heroBidV = 1.84, heroRoasV = 3.1;
  var ids = 881204;
  if (!reduceMotion && heroFeed) {
    setInterval(function () {
      var win = Math.random() > 0.32;
      var bid = (0.88 + Math.random() * 1.6).toFixed(2);
      ids += 1;
      var row = document.createElement('div');
      row.className = 'af-row' + (win ? ' af-row--win' : '');
      row.innerHTML = '<span>Impr. #' + ids + '</span><span>BID $' + bid + (win ? ' ✓' : ' ✕') + '</span><span>' + (win ? 'WON · ROAS ' + (2.1 + Math.random()).toFixed(1) + '×' : 'LOST · waste avoided') + '</span>';
      heroFeed.insertBefore(row, heroFeed.firstChild);
      while (heroFeed.children.length > 3) heroFeed.removeChild(heroFeed.lastChild);
      heroBidV = parseFloat(bid);
      if (heroBid) heroBid.textContent = '$' + heroBidV.toFixed(2);
      heroRoasV = Math.max(2.4, Math.min(4.2, heroRoasV + (Math.random() - 0.5) * 0.22));
      if (heroRoas) heroRoas.textContent = heroRoasV.toFixed(1) + '×';
      if (liveBids) liveBids.textContent = (1.1 + Math.random() * 0.3).toFixed(1) + 'B';
    }, 1800);
  }

  /* ---------- DEMO: LIVE EXCHANGE SIM ---------- */
  var demoBid = document.querySelector('[data-demo-bid]');
  var demoRoas = document.querySelector('[data-demo-roas]');
  var demoWin = document.querySelector('[data-demo-win]');
  var demoWaste = document.querySelector('[data-demo-waste]');
  var demoLat = document.querySelector('[data-lat]');
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var bars = {
    lookalike: document.querySelector('[data-bar="lookalike"]'),
    retarget: document.querySelector('[data-bar="retarget"]'),
    prospect: document.querySelector('[data-bar="prospect"]')
  };

  var state = { bid: 1.84, roas: 3.1, win: 67, waste: 42, imp: 881205 };

  function render() {
    if (demoBid) demoBid.textContent = '$' + state.bid.toFixed(2);
    if (demoRoas) demoRoas.textContent = state.roas.toFixed(1) + '×';
    if (demoWin) demoWin.textContent = Math.round(state.win) + '%';
    if (demoWaste) demoWaste.textContent = Math.round(state.waste) + '%';
    if (bars.lookalike) bars.lookalike.style.setProperty('--w', Math.max(18, Math.min(88, 74 + (state.roas - 3.1) * 10)) + '%');
    if (bars.retarget) bars.retarget.style.setProperty('--w', Math.max(20, Math.min(85, 62 + (state.win - 67) * 0.8)) + '%');
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

  function tickLatency() {
    var lat = 14 + Math.round(Math.random() * 14);
    if (demoLat) demoLat.textContent = lat + 'ms';
    return lat;
  }

  function inject(kind) {
    var lat = tickLatency();
    state.imp += 1;
    if (kind === 'good') {
      state.bid = 1.7 + Math.random() * 0.6;
      state.roas = Math.min(4.6, state.roas + 0.25 + Math.random() * 0.2);
      state.win = Math.min(78, state.win + 3);
      state.waste = Math.max(28, state.waste - 2);
      addMsg('win', 'Impr. #' + state.imp + ' — <b>BID $' + state.bid.toFixed(2) + ' ✓ WON</b> · high-intent lookalike · pCVR 0.11', 'segment: skate_lookalike_7 · ROAS ' + state.roas.toFixed(1) + '× · ' + lat + 'ms');
    } else if (kind === 'fraud') {
      state.waste = Math.min(58, state.waste + 4);
      state.roas = Math.max(2.2, state.roas - 0.12);
      addMsg('fraud', 'Impr. #' + state.imp + ' — <b>BID $0.00 ✕ BLOCKED</b> · bot_score 0.94 · IVT filtered, $0 spent', 'fraud kill · waste avoided · ' + lat + 'ms');
      // quickly recover as filter learns
      setTimeout(function () { state.waste = Math.max(36, state.waste - 2); render(); }, 1200);
    } else if (kind === 'drift') {
      state.roas = Math.max(1.9, state.roas - 0.35);
      state.win = Math.max(48, state.win - 6);
      addMsg('lose', 'Impr. #' + state.imp + ' — <b>BID $1.20 ✕ LOST</b> · audience taste shifted, creative fatigue detected', 'drift · CTR −18% · model re-training · ' + lat + 'ms');
      setTimeout(function () {
        state.roas = Math.min(3.4, state.roas + 0.22);
        state.win = Math.min(68, state.win + 4);
        addMsg('win', 'Model re-tuned — <b>new creative wins</b> · lookalike refreshed, ROAS recovering', 'retrained · 1,247 segments · ' + tickLatency() + 'ms');
        render();
      }, 1600);
    } else if (kind === 'shift') {
      var from = state.roas.toFixed(1);
      state.roas = Math.min(4.2, state.roas + 0.18);
      state.win = Math.min(76, state.win + 2);
      state.waste = Math.max(30, state.waste - 3);
      addMsg('win', 'Budget auto-shifted → <b>skate_lookalike_7 +18%</b> · prospect −12% · expected +$420/day', 're-allocated · ' + from + '× → ' + state.roas.toFixed(1) + '× · ' + lat + 'ms');
    }
    render();
  }

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-inject]');
    if (!btn) return;
    inject(btn.dataset.inject);
  });

  // ambient heartbeat
  if (!reduceMotion) setInterval(function () {
    if (Math.random() > 0.68) {
      state.bid = Math.max(1.1, Math.min(2.6, state.bid + (Math.random() - 0.5) * 0.22));
      state.roas = Math.max(2.6, Math.min(3.8, state.roas + (Math.random() - 0.5) * 0.12));
      render(); tickLatency();
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
