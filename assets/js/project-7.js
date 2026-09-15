// PROJECT 07 — RETINA / Object Detection & Labeling interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['FOCUSING…', 'LOADING YOLO…', 'QUEUING BOXES…', 'CALIBRATING…'];
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
        var decimals = card.dataset.decimal ? (String(card.dataset.decimal).split('.')[1] || '').length : 0;
        var suffix = card.dataset.suffix || '';
        var prefix = card.dataset.prefix || '';
        if (reduceMotion) {
          // num already contains human text, animate just for non-reduced
          var txt = prefix + target.toFixed(decimals) + suffix;
          // for metrics that show like 1.2M etc, keep original human text on reduce
          if (card.dataset.decimal === '98.1') num.textContent = '98.1%';
          else if (card.dataset.decimal === '1.2') num.textContent = '1.2M+';
          else num.textContent = txt;
          mio.unobserve(card); return;
        }
        // for animated, use target precision
        if (card.dataset.decimal === '1.2') {
          // animate 0..1.2 with M+ suffix
          var start = null, dur = 1600;
          function frameM(ts) {
            if (!start) start = ts;
            var t = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            num.textContent = (target * eased).toFixed(1) + 'M+';
            if (t < 1) requestAnimationFrame(frameM);
            else num.textContent = '1.2M+';
          }
          requestAnimationFrame(frameM);
        } else if (card.dataset.decimal === '98.1') {
          var s2 = null, d2 = 1600;
          function frame2(ts) {
            if (!s2) s2 = ts;
            var t = Math.min((ts - s2) / d2, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            num.textContent = (target * eased).toFixed(1) + '%';
            if (t < 1) requestAnimationFrame(frame2);
            else num.textContent = '98.1%';
          }
          requestAnimationFrame(frame2);
        } else {
          var s3 = null, d3 = 1600;
          function frame3(ts) {
            if (!s3) s3 = ts;
            var t = Math.min((ts - s3) / d3, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            num.textContent = prefix + Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(frame3);
            else num.textContent = prefix + target + suffix;
          }
          requestAnimationFrame(frame3);
        }
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- HERO AMBIENT ---------- */
  var heroMs = document.querySelector('[data-hero-ms]');
  var heroMap = document.querySelector('[data-hero-map]');
  var heroQueue = document.querySelector('[data-hero-queue]');
  var liveBoxes = document.querySelector('[data-live-boxes]');
  var boxesCount = 1.2;
  if (!reduceMotion && heroMs) {
    setInterval(function () {
      if (heroMs) heroMs.textContent = (19 + Math.round(Math.random() * 6)) + 'ms';
      if (liveBoxes) {
        boxesCount += (Math.random() - 0.45) * 0.02;
        liveBoxes.textContent = boxesCount.toFixed(1) + 'M';
      }
      if (heroQueue && Math.random() > 0.7) {
        var q = parseInt(heroQueue.textContent.replace(/,/g, ''), 10) + (Math.random() > 0.5 ? -8 : 12);
        heroQueue.textContent = Math.max(900, q).toLocaleString('en-US');
      }
    }, 1800);
  }

  /* ---------- DEMO: VIEWFINDER SIM ---------- */
  var demoMap = document.querySelector('[data-demo-map]');
  var demoQueue = document.querySelector('[data-demo-queue]');
  var demoAuto = document.querySelector('[data-demo-auto]');
  var demoLat = document.querySelector('[data-lat]');
  var demoBoxes = document.querySelectorAll('[data-demo-box]');
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var vf = document.querySelector('[data-vf]');

  var state = { map: 98.1, queue: 1240, auto: 10000, picked: null };

  function renderDemo() {
    if (demoMap) demoMap.textContent = state.map.toFixed(1) + '%';
    if (demoQueue) demoQueue.textContent = state.queue.toLocaleString('en-US');
    if (demoAuto) demoAuto.textContent = (state.auto / 1000).toFixed(0) + 'k';
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

  function pickBox(idx) {
    state.picked = idx;
    demoBoxes.forEach(function (b, i) {
      b.classList.remove('demo-box--picked');
      if (i === idx) b.classList.add('demo-box--picked');
    });
    var labels = ['person 98% · tap fix to retag', 'car 95% · confirm or fix', 'dog 92% · confirm', 'bicycle 67% ? · uncertain — best to fix/reject'];
    addMsg('warn', 'Picked: <b>' + labels[idx] + '</b> — choose an action below.', 'box #' + idx + ' · IoU 0.91 · confidence ' + (idx === 3 ? '67%' : '92%+'));
  }

  demoBoxes.forEach(function (b, i) {
    b.addEventListener('click', function () { pickBox(i); });
  });

  function act(kind) {
    if (kind === 'confirm') {
      state.queue = Math.max(0, state.queue - 28);
      state.auto = Math.min(14000, state.auto + 220);
      addMsg('ok', 'Confirmed <b>4 boxes</b> → queue −28 · auto-label +220 tonight', 'consensus IoU 0.91 · no retrain needed');
      demoBoxes.forEach(function (b) { b.classList.remove('demo-box--picked', 'demo-box--rejected'); b.classList.add('demo-box--fixed'); setTimeout(function(){ b.classList.remove('demo-box--fixed'); }, 1200); });
    } else if (kind === 'fix') {
      var idx = state.picked !== null ? state.picked : 3;
      var box = demoBoxes[idx];
      if (box) {
        box.classList.remove('demo-box--low', 'demo-box--rejected');
        box.classList.add('demo-box--fixed');
        box.querySelector('span').textContent = 'motorbike 94% ✓';
        box.style.borderColor = '#00e676';
      }
      state.map = Math.min(98.6, state.map + 0.12);
      state.queue = Math.max(0, state.queue - 18);
      addMsg('ok', 'Fixed: <b>bicycle → motorbike 94%</b> · correction queued as gold, model will learn this confusion', 'mAP ' + state.map.toFixed(1) + '% · active learn −18 queue');
      setTimeout(function(){ if (box) box.classList.remove('demo-box--fixed'); }, 1400);
    } else if (kind === 'reject') {
      var rIdx = state.picked !== null ? state.picked : 3;
      var rBox = demoBoxes[rIdx];
      if (rBox) rBox.classList.add('demo-box--rejected');
      state.queue = Math.max(0, state.queue - 12);
      addMsg('warn', 'Rejected low box — <b>false positive removed</b> · not counted as gold, queue −12', 'precision +0.4% · review saved');
    } else if (kind === 'retrain') {
      state.map = Math.min(98.8, state.map + 0.3);
      state.queue = Math.max(320, state.queue - 180);
      state.auto = Math.min(18000, state.auto + 1800);
      addMsg('ok', 'Night loop done — <b>mAP ' + state.map.toFixed(1) + '%</b> · 1,800 new auto-labels landed, queue −180', 'retrained on 40 human + 1.8k pseudo · IoU 0.91 · 22ms still');
      // reset boxes visually
      setTimeout(function () {
        demoBoxes.forEach(function (b, i) {
          b.classList.remove('demo-box--picked','demo-box--fixed','demo-box--rejected');
          if (i === 3) { b.querySelector('span').textContent = 'bicycle 71% ?'; b.classList.add('demo-box--low'); }
        });
        state.picked = null;
      }, 900);
    }
    renderDemo();
    if (demoLat) demoLat.textContent = (19 + Math.round(Math.random() * 8)) + 'ms';
  }

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    act(btn.dataset.act);
  });

  // also allow tapping boxes themselves to auto-fix hint
  if (vf && !reduceMotion) {
    // ambient tiny jitter on 22ms readout
    setInterval(function () {
      if (demoLat) demoLat.textContent = (19 + Math.round(Math.random() * 6)) + 'ms';
    }, 1600);
  }

  renderDemo();

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
