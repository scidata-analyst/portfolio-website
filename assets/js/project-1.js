// PROJECT 01 — NEXABOT case study interactions
(function () {
  'use strict';

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['LISTENING…', 'PARSING…', 'UNDERSTANDING…', 'READY.'];
  var progress = 0, wi = 0;
  var wordTimer = setInterval(function () {
    if (!loaderWord) return;
    wi = (wi + 1) % words.length;
    loaderWord.textContent = words[wi];
  }, 550);

  function finishLoad() {
    clearInterval(wordTimer);
    if (loaderNum) loaderNum.textContent = '100';
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(function () {
      if (loader) loader.classList.add('loaded');
      revealAll();
    }, 450);
  }
  function tick() {
    progress += 6 + Math.random() * 14;
    if (progress >= 100) { finishLoad(); return; }
    if (loaderNum) loaderNum.textContent = Math.floor(progress);
    if (loaderFill) loaderFill.style.width = progress + '%';
    setTimeout(tick, 110 + Math.random() * 180);
  }
  setTimeout(tick, 250);
  // safety: never trap user
  setTimeout(function () { if (loader && !loader.classList.contains('loaded')) finishLoad(); }, 5000);

  /* ---------- CUSTOM CURSOR ---------- */
  var cursor = document.querySelector('[data-cursor]');
  var dot = cursor ? cursor.querySelector('.cursor-dot') : null;
  var ring = cursor ? cursor.querySelector('.cursor-ring') : null;
  var label = cursor ? cursor.querySelector('.cursor-label') : null;
  var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    if (label) { label.style.left = mx + 'px'; label.style.top = (my - 34) + 'px'; }
  });
  (function ringLoop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(ringLoop);
  })();
  document.querySelectorAll('a, button, [data-magnetic]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (ring) { ring.style.width = '68px'; ring.style.height = '68px'; ring.style.background = 'rgba(214,255,42,.15)'; }
      if (label) label.style.opacity = '1';
    });
    el.addEventListener('mouseleave', function () {
      if (ring) { ring.style.width = '44px'; ring.style.height = '44px'; ring.style.background = 'transparent'; }
      if (label) label.style.opacity = '0';
    });
  });

  /* ---------- REVEALS ---------- */
  function revealAll() {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('revealed'); }, i * 90);
    });
  }
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('[data-reveal]').forEach(function (el) { if (io) io.observe(el); else el.classList.add('revealed'); });

  /* ---------- SCROLL PROGRESS + TOTOP ---------- */
  var prog = document.querySelector('[data-progress]');
  var totop = document.querySelector('.footer-totop');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (prog) prog.style.width = p + '%';
    if (totop) totop.classList.toggle('visible', h.scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- MAGNETIC ---------- */
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.18 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- COUNT-UP METRICS ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var num = el.querySelector('[data-num]');
    if (!num) return;
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var k = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      num.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var mio = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { countUp(en.target); mio.unobserve(en.target); }
    });
  }, { threshold: 0.4 }) : null;
  document.querySelectorAll('.metric[data-count]').forEach(function (el) { if (mio) mio.observe(el); else countUp(el); });

  /* ---------- HERO FAKE LATENCY TICK ---------- */
  var heroLive = document.querySelector('.t-live');
  setInterval(function () {
    if (!heroLive) return;
    var ms = 160 + Math.floor(Math.random() * 60);
    heroLive.innerHTML = '<span class="blink"></span> ' + ms + 'ms';
  }, 2200);

  /* ---------- INTERACTIVE DEMO ---------- */
  var ANSWERS = {
    track: { u: '📦 Where is my order #4521?', b: 'Found it — #4521 left the depot this morning and arrives Thursday before 5pm. Live tracking link sent. Anything else?', intent: 'intent: track_order · 0.97' },
    refund: { u: '💸 I want a refund, this is ridiculous', b: 'Totally fair to be upset — sorry about this. I’ve started your refund for order #4521 (3–5 days). I’ll personally follow up until it lands.', intent: 'intent: request_refund · 0.94 · sentiment: angry → tone: calm' },
    address: { u: '📍 Change address to Banani 11', b: 'Done — delivery moved to House 12, Road 11, Banani. Courier notified. You’ll get an SMS confirmation in a minute.', intent: 'intent: change_address · 0.96 · entities: [Banani 11]' },
    human: { u: '🧍 I want a human', b: 'Of course — looping in a human with full context attached, so you won’t repeat anything. Avg. human pickup: 40s.', intent: 'intent: escalate · 0.99 · handoff with summary' }
  };
  var box = document.querySelector('[data-messages]');
  var lat = document.querySelector('[data-lat]');
  function scrollBox() { if (box) box.scrollTop = box.scrollHeight; }
  function addMsg(text, who, intent) {
    if (!box) return null;
    var d = document.createElement('div');
    d.className = 'msg msg--' + who;
    var p = document.createElement('p');
    p.textContent = text;
    d.appendChild(p);
    if (intent) {
      var s = document.createElement('span');
      s.className = 'intent';
      s.textContent = intent;
      d.appendChild(s);
    }
    box.appendChild(d);
    scrollBox();
    return d;
  }
  function botTyping() {
    if (!box) return null;
    var d = document.createElement('div');
    d.className = 'msg msg--bot';
    d.innerHTML = '<p><span class="typing-dots"><i></i><i></i><i></i></span></p>';
    box.appendChild(d);
    scrollBox();
    return d;
  }
  document.querySelectorAll('[data-chips] button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-q');
      var a = ANSWERS[key];
      if (!a || btn.disabled) return;
      btn.disabled = true;
      setTimeout(function () { btn.disabled = false; }, 1800);
      addMsg(a.u, 'user');
      var t = botTyping();
      var ms = 140 + Math.floor(Math.random() * 120);
      if (lat) lat.textContent = ms + 'ms';
      setTimeout(function () {
        if (t) t.remove();
        addMsg(a.b, 'bot', a.intent + ' · ' + ms + 'ms');
      }, 900 + Math.random() * 700);
    });
  });

  /* ---------- GSAP PARALLAX (optional) ---------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-giant', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.next-giant', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }
})();
