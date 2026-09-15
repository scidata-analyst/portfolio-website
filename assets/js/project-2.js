// PROJECT 02 — STAYOS / AI Hotel OS interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['CHECKING IN…', 'SYNCING ROOMS…', 'WAKING AI CONCIERGE…', 'POLISHING LOBBY…'];
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
    if (progress >= 100) {
      finishLoad();
    } else {
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
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }
    if (label && label.style.opacity === '1') {
      label.style.left = mx + 'px';
      label.style.top = (my - 34) + 'px';
    }
  });

  (function animateRing() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, [data-magnetic]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (ring) {
        ring.style.width = '58px';
        ring.style.height = '58px';
      }
      if (label) {
        label.style.opacity = '1';
        label.style.left = mx + 'px';
        label.style.top = (my - 34) + 'px';
      }
    });
    el.addEventListener('mouseleave', function () {
      if (ring) {
        ring.style.width = '44px';
        ring.style.height = '44px';
      }
      if (label) label.style.opacity = '0';
    });
  });

  /* ---------- HERO REVEAL + TYPING ---------- */
  function typeInto(el, done) {
    if (!el || reduceMotion) {
      if (done) done();
      return;
    }
    var full = el.textContent;
    el.textContent = '';
    var i = 0;
    (function step() {
      i += 2;
      el.textContent = full.slice(0, i);
      if (i < full.length) {
        setTimeout(step, 18);
      } else if (done) {
        done();
      }
    })();
  }

  function revealHero() {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('revealed');
      }, reduceMotion ? 0 : i * 110);
    });
    setTimeout(function () {
      var t = document.querySelector('#heroChat [data-type]');
      if (t && !t.dataset.typed) {
        t.dataset.typed = '1';
        typeInto(t);
      }
    }, reduceMotion ? 100 : 900);
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll(
    'main [data-reveal], .foot [data-reveal]'
  );
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

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
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  function animateNum(el, target, decimals, prefix, suffix) {
    var start = null;
    var dur = 1600;
    function frame(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    } else {
      requestAnimationFrame(frame);
    }
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
        var target = parseFloat(card.dataset.decimal || card.dataset.count || '0');
        var decimals = card.dataset.decimal
          ? (String(card.dataset.decimal).split('.')[1] || '').length
          : 0;
        if (num) animateNum(num, target, decimals, card.dataset.prefix || '', card.dataset.suffix || '');
        mio.unobserve(card);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { mio.observe(m); });
  }

  /* ---------- LIVE DEMO CHAT ---------- */
  var ANSWERS = {
    late: {
      q: 'Landing at 2AM — can I still check in?',
      a: 'Always. Door code 4419 is live, Room 205 held + free late checkout till 2PM. Taxi tracked to your folio. Sleep easy. 🗝️',
      intent: 'intent: late_checkin · 0.98 · door_code issued'
    },
    upgrade: {
      q: 'Can you upgrade me to sea-view?',
      a: 'Done — Sea-view 709 for +$12/night (was $40). I moved your bags note + breakfast to the balcony slot. Added to folio. 🌊',
      intent: 'intent: upsell_upgrade · 0.96 · +$12 revenue'
    },
    clean: {
      q: 'Need room cleaning ASAP please.',
      a: 'Housekeeping dispatched — Mina is 2 floors away, ETA 6 min. I paused DND-sync so no one disturbs you after. 🧹',
      intent: 'intent: housekeeping · 0.97 · task routed · ETA 6m'
    },
    bill: {
      q: 'Can you split my bill?',
      a: 'Split ready: room to card •• 4412 ($186), minibar + taxi to second card ($34). Invoices emailed + night-audit sealed. 🧾',
      intent: 'intent: billing_split · 0.95 · folio settled'
    }
  };

  var box = document.querySelector('[data-messages]');
  var chips = document.querySelector('[data-chips]');
  var lat = document.querySelector('[data-lat]');

  function addMsg(kind, text, intent) {
    if (!box) return null;
    var div = document.createElement('div');
    div.className = 'msg msg--' + kind;
    var p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    if (intent) {
      var s = document.createElement('span');
      s.className = 'intent';
      s.textContent = intent;
      div.appendChild(s);
    }
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  function botReply(key) {
    var ans = ANSWERS[key];
    if (!ans || !box) return;
    var typing = addMsg('bot', '…');
    if (lat) lat.textContent = 'thinking…';
    setTimeout(function () {
      if (typing) typing.remove();
      var node = addMsg('bot', ans.a, ans.intent);
      if (lat) lat.textContent = (0.6 + Math.random() * 0.6).toFixed(1) + 's';
      if (node && !reduceMotion) {
        node.style.transform = 'translateY(8px)';
        node.style.opacity = '0';
        requestAnimationFrame(function () {
          node.style.transition = 'transform .4s ease, opacity .4s ease';
          node.style.transform = 'translateY(0)';
          node.style.opacity = '1';
        });
      }
    }, 750 + Math.random() * 500);
  }

  if (chips) {
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-q]');
      if (!btn) return;
      addMsg('user', ANSWERS[btn.dataset.q] ? ANSWERS[btn.dataset.q].q : btn.textContent.trim());
      botReply(btn.dataset.q);
    });
  }

  /* ---------- MAGNETIC ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.12 + 'px,' + y * 0.12 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- OCCUPANCY FLICKER ---------- */
  var occ = document.querySelector('[data-occupancy]');
  if (occ && !reduceMotion) {
    setInterval(function () {
      var base = 87 + Math.round(Math.random() * 3 - 1);
      occ.textContent = base + '%';
    }, 4000);
  }

  /* ---------- GSAP EXTRAS ---------- */
  if (!reduceMotion && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    try {
      gsap.to('.hero-giant', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.next-giant', {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    } catch (err) { /* decorative only */ }
  }

  /* ---------- KICK OFF ---------- */
  if (document.readyState === 'complete') tickLoad();
  else window.addEventListener('load', tickLoad);
  setTimeout(function () {
    if (loader && !loader.classList.contains('loaded') && progress < 100) {
      progress = 99;
    }
  }, 6000);
})();
