// PROJECT 09 — FORGE / Custom NLP Training interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['HEATING FORGE…', 'SPINNING GPUs…', 'LOADING CHECKPOINTS…', 'QUEUING EPOCHS…'];
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
          if (raw === '1-click') { num.textContent = '1-click'; }
          else num.textContent = prefix + target.toFixed(decimals) + suffix;
          mio.unobserve(card); return;
        }
        if (raw === '1-click') { num.textContent = '1-click'; mio.unobserve(card); return; }
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

  /* ---------- HERO AMBIENT ---------- */
  var heroLoss = document.querySelector('[data-hero-loss]');
  var heroF1 = document.querySelector('[data-hero-f1]');
  var heroGpu = document.querySelector('[data-hero-gpu]');
  var heroCost = document.querySelector('[data-hero-cost]');
  var liveRuns = document.querySelector('[data-live-runs]');
  if (!reduceMotion) {
    setInterval(function () {
      if (heroGpu) heroGpu.textContent = '4xA100 ' + String(88 + Math.round(Math.random() * 6)) + '%';
      if (liveRuns) liveRuns.textContent = String(310 + Math.round(Math.random() * 8));
    }, 2000);
    void heroLoss; void heroF1; void heroCost;
  }

  /* ---------- DEMO: FORGE RUN SIM ---------- */
  var lossEl = document.querySelector('[data-demo-loss]');
  var f1El = document.querySelector('[data-demo-f1]');
  var costEl = document.querySelector('[data-demo-cost]');
  var gpuEl = document.querySelector('[data-demo-gpu]');
  var latEl = document.querySelector('[data-lat]');
  var barsBox = document.querySelector('[data-lossbars]');
  var feed = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var deployBtn = chips ? chips.querySelector('[data-act="deploy"]') : null;

  var MAX_EP = 12;
  var state = { ep: 0, loss: 2.31, f1: 61.4, cost: 0, gpus: 1, running: false, timer: null, deployed: false, noisy: false, bestF1: 61.4 };

  function barHeight(loss) {
    // map loss 2.4..0.3 -> 100%..12%
    var h = 12 + ((Math.min(2.4, Math.max(0.3, loss)) - 0.3) / 2.1) * 88;
    return h.toFixed(1) + '%';
  }

  function renderBars(bestEp) {
    if (!barsBox) return;
    var html = '';
    for (var i = 0; i < MAX_EP; i++) {
      var b = state.bars && state.bars[i] != null ? state.bars[i] : null;
      if (b == null) {
        html += '<i style="height:6px;opacity:.25"></i>';
      } else {
        html += '<i style="height:' + barHeight(b) + '"' + (i === bestEp ? ' class="is-best"' : '') + '></i>';
      }
    }
    barsBox.innerHTML = html;
  }

  function render() {
    if (lossEl) lossEl.textContent = state.loss.toFixed(2);
    if (f1El) f1El.textContent = state.f1.toFixed(1);
    if (costEl) costEl.textContent = '$' + state.cost.toFixed(2);
    if (gpuEl) gpuEl.textContent = state.gpus + 'xA100';
    if (latEl) latEl.textContent = 'ep ' + state.ep + '/' + MAX_EP;
    renderBars(state.bestEp);
    if (deployBtn) deployBtn.disabled = !(state.f1 >= 90 && !state.deployed);
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

  function stopRun(msg) {
    state.running = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (msg) addMsg('warn', msg, 'run halted @ep' + state.ep);
    render();
  }

  function stepEpoch() {
    if (state.ep >= MAX_EP) {
      stopRun('Run complete — <b>12/12 epochs</b>. Best F1 ' + state.bestF1.toFixed(1) + '. Deploy the champion.');
      return;
    }
    state.ep += 1;
    var speed = state.gpus >= 4 ? 1.6 : 1;
    var noisePenalty = state.noisy ? 0.16 : 0;
    var drop = (0.22 + Math.random() * 0.12) * speed / 1.4 - noisePenalty * 0.4;
    state.loss = Math.max(0.31, state.loss - Math.max(0.02, drop));
    var gain = (2.4 + Math.random() * 1.4) * (speed > 1 ? 1.15 : 1) - (state.noisy ? 1.8 : 0);
    state.f1 = Math.min(96.4, Math.max(58, state.f1 + gain));
    state.cost += (state.gpus >= 4 ? 2.4 : 1.5);
    state.bars = state.bars || [];
    state.bars[state.ep - 1] = state.loss;
    if (state.f1 > state.bestF1) {
      state.bestF1 = state.f1;
      state.bestEp = state.ep - 1;
      addMsg('ok', 'ep' + state.ep + ' — loss <b>' + state.loss.toFixed(2) + '</b> · F1 <b>' + state.f1.toFixed(1) + '</b> · ckpt saved ✓', 'best so far · cost $' + state.cost.toFixed(2));
    } else {
      addMsg('warn', 'ep' + state.ep + ' — loss <b>' + state.loss.toFixed(2) + '</b> · F1 <b>' + state.f1.toFixed(1) + '</b> · no gain, lr x0.5', state.noisy ? 'noisy labels suspected · F1 wobble' : 'plateau · patience 2/3');
    }
    if (state.noisy && state.ep >= 4) {
      state.noisy = false;
      addMsg('ok', 'Noise quarantined — <b>8% bad labels</b> isolated by confidence filter, curve recovering', 'auto-clean · run continues');
    }
    render();
    if (state.ep >= MAX_EP) stopRun();
  }

  function act(kind) {
    if (kind === 'start') {
      if (state.running) { addMsg('warn', 'Run already training — <b>ep' + state.ep + '/12</b>. Add GPUs or inject noise.', 'busy'); return; }
      if (state.ep >= MAX_EP) {
        state.ep = 0; state.loss = 2.31; state.f1 = 61.4; state.cost = 0;
        state.bars = []; state.deployed = false; state.noisy = false; state.bestF1 = 61.4; state.bestEp = null;
        addMsg('ok', 'New run queued — weights reset, starting <b>ep1/12</b>', 'seed 42 · split 80/10/10');
      }
      state.running = true;
      addMsg('ok', 'Training started — <b>' + state.gpus + 'xA100 spot</b> · LoRA r16 · early-stop armed', reduceMotion ? 'running' : 'live · watch the bars fall');
      render();
      if (reduceMotion) { while (state.ep < MAX_EP) stepEpoch(); return; }
      state.timer = setInterval(stepEpoch, state.gpus >= 4 ? 900 : 1400);
    } else if (kind === 'noise') {
      if (!state.running) { addMsg('warn', 'Start the run first — then throw garbage at it.', 'idle'); return; }
      state.noisy = true;
      addMsg('warn', 'Injected <b>8% noisy labels</b> — watch F1 wobble. Confidence filter is on it.', 'corruption · ep' + state.ep);
    } else if (kind === 'scale') {
      if (state.gpus >= 4) { addMsg('warn', 'Already at <b>4xA100</b> — diminishing returns beyond this.', 'maxed'); return; }
      state.gpus = 4;
      addMsg('ok', 'Scaled to <b>4xA100 spot</b> — epochs ~40% faster, cost/ep up, total down via early stop', 'autoscale · $2.40/ep');
      if (state.running && !reduceMotion) {
        if (state.timer) clearInterval(state.timer);
        state.timer = setInterval(stepEpoch, 900);
      }
      render();
    } else if (kind === 'deploy') {
      if (state.deployed) { addMsg('warn', 'Already shipped — champion is live on canary.', 'done'); return; }
      if (state.f1 < 90) { addMsg('warn', 'Gate blocked — F1 <b>' + state.f1.toFixed(1) + '</b> under 90. Train more first.', 'policy gate · prove it, then ship it'); return; }
      state.deployed = true;
      stopRun();
      addMsg('ship', 'SHIPPED — <b>v3 @F1 ' + state.f1.toFixed(1) + '</b> to canary 10% · autoscale endpoint live · drift watch armed', 'deploy $0 · rollback ready · ' + state.ep + ' epochs · $' + state.cost.toFixed(2));
      render();
    }
  }

  if (chips) chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn || btn.disabled) return;
    act(btn.dataset.act);
  });

  renderBars(null);
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
