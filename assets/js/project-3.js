// PROJECT 03 — HAMMER / Auction Car Platform interactions
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
  }

  /* ---------- LOADER ---------- */
  var loader = document.querySelector('[data-loader]');
  var loaderNum = document.querySelector('[data-loader-num]');
  var loaderFill = document.querySelector('[data-loader-fill]');
  var loaderWord = document.querySelector('[data-loader-word]');
  var words = ['RAISING THE GAVEL…', 'ROLLING CARS IN…', 'ARMING AUTOBIDS…', 'OPENING THE FLOOR…'];
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

  /* ---------- HERO REVEAL ---------- */
  function revealHero() {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('revealed');
      }, reduceMotion ? 0 : i * 110);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('main [data-reveal]');
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
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    if (reduceMotion) el.textContent = prefix + target.toFixed(decimals) + suffix;
    else requestAnimationFrame(frame);
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

  /* ---------- HERO LIVE LOT (ambient simulation) ---------- */
  var heroBid = document.querySelector('[data-hero-bid]');
  var heroTimer = document.querySelector('[data-hero-timer]');
  var heroBids = document.querySelector('[data-hero-bids]');
  var heroFeed = document.querySelector('[data-hero-feed]');
  var liveCount = document.querySelector('[data-live-count]');
  var heroPrice = 42500;
  var heroBidsN = 132;
  var heroSec = 47;
  var heroNames = ['AutoKing', 'Bidder_284', 'CarHunter99', 'NightRider', 'PaddleQueen'];

  function heroFeedPush(name, price, when) {
    if (!heroFeed) return;
    var row = document.createElement('div');
    row.className = 'feed-row';
    row.innerHTML = '<span></span><span></span><em></em>';
    row.children[0].textContent = name;
    row.children[1].textContent = fmt(price);
    row.children[2].textContent = when;
    heroFeed.insertBefore(row, heroFeed.firstChild);
    while (heroFeed.children.length > 3) heroFeed.removeChild(heroFeed.lastChild);
  }

  if (!reduceMotion) {
    setInterval(function () {
      heroSec -= 1;
      if (heroSec <= 0) {
        // lot closes, new lot opens
        heroPrice = 38000 + Math.round(Math.random() * 8000 / 500) * 500;
        heroSec = 45 + Math.round(Math.random() * 30);
        heroBidsN = 100 + Math.round(Math.random() * 40);
        heroFeedPush('HAMMER', heroPrice, 'new lot');
      } else if (Math.random() > 0.55) {
        heroPrice += 500;
        heroBidsN += 1;
        heroFeedPush(heroNames[Math.floor(Math.random() * heroNames.length)], heroPrice, 'now');
      }
      if (heroBid) heroBid.textContent = fmt(heroPrice);
      if (heroTimer) heroTimer.textContent = fmtTime(heroSec);
      if (heroBids) heroBids.textContent = heroBidsN;
      if (liveCount) {
        var w = 2280 + Math.round(Math.random() * 80);
        liveCount.textContent = w.toLocaleString('en-US');
      }
    }, 2000);
  }

  /* ---------- DEMO BIDDING FLOOR ---------- */
  var RIVALS = ['AutoKing', 'CarHunter99', 'PaddleQueen', 'NightRider', 'TurboSeth'];
  var TAUNTS = ['"This one\'s mine."', '"Try me."', '"I flew in for this."', '"My garage needs it."', '"Last warning. 👀"'];

  var demoBid = document.querySelector('[data-demo-bid]');
  var demoLeader = document.querySelector('[data-demo-leader]');
  var demoTimer = document.querySelector('[data-demo-timer]');
  var demoBox = document.querySelector('[data-messages]');
  var demoChips = document.querySelector('[data-chips]');
  var demoLat = document.querySelector('[data-lat]');
  var autobidBtn = document.querySelector('[data-autobid]');

  var price = 42500;
  var leader = 'AutoKing';
  var secs = 60;
  var over = false;
  var autobid = false;
  var AUTO_MAX = 48000;
  var tx = 99120;
  var busy = false;

  function setPrice(p, who) {
    price = p;
    leader = who;
    if (demoBid) demoBid.textContent = fmt(price);
    if (demoLeader) demoLeader.textContent = 'LEADER: ' + who + (who === 'YOU' ? ' 🏆' : ' 👑');
  }

  function addMsg(kind, html, meta) {
    if (!demoBox) return null;
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
    demoBox.appendChild(div);
    while (demoBox.children.length > 9) demoBox.removeChild(demoBox.firstChild);
    demoBox.scrollTop = demoBox.scrollHeight;
    return div;
  }

  function sysNote(html) {
    return addMsg('sys', html);
  }

  function endAuction(won) {
    over = true;
    if (won) {
      addMsg('win', '🔨 SOLD to <b>YOU</b> for <b>' + fmt(price) + '</b> — escrow locked, keys in 48h. 🏁');
      sysNote('Receipt emailed · escrow #' + (tx + 1) + ' · seller handshake pending');
    } else {
      addMsg('sys', '🔨 HAMMER FALLS — <b>' + leader + '</b> takes it at <b>' + fmt(price) + '</b>. <a href="#demo" style="color:inherit;font-weight:700">Reload to run it back →</a>');
    }
    if (demoChips) demoChips.style.opacity = '0.45';
  }

  function rivalStrike() {
    if (over || busy) return;
    var step = [500, 500, 1000][Math.floor(Math.random() * 3)];
    var r = RIVALS[Math.floor(Math.random() * RIVALS.length)];
    var taunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
    tx += 1;
    setPrice(price + step, r);
    addMsg('bot', '<b>' + r + '</b> bids <b>' + fmt(price) + '</b> — ' + taunt, (30 + Math.round(Math.random() * 25)) + 'ms · tx #' + tx + ' · outbid: ' + (leader === r ? 'floor' : leader));
    // autobid agent defends
    if (autobid && price + 500 <= AUTO_MAX) {
      setTimeout(function () {
        if (over) return;
        tx += 1;
        setPrice(price + 500, 'YOU (auto)');
        if (demoLeader) demoLeader.textContent = 'LEADER: YOU (auto) 🤖';
        addMsg('me', 'Autobid counters <b>' + fmt(price) + '</b> — max ' + fmt(AUTO_MAX) + '.', 'agent · 41ms · tx #' + tx);
      }, 900);
    } else if (autobid && leader !== 'YOU (auto)') {
      sysNote('Autobid ceiling ' + fmt(AUTO_MAX) + ' reached — raise max or bid manually.');
      autobid = false;
      if (autobidBtn) {
        autobidBtn.setAttribute('aria-pressed', 'false');
        autobidBtn.innerHTML = '<i></i> AUTOBID: OFF';
      }
    }
  }

  function youBid(step) {
    if (over) return;
    if (busy) return;
    busy = true;
    tx += 1;
    var wasLate = secs <= 60;
    setPrice(price + step, 'YOU');
    addMsg('me', 'You bid <b>' + fmt(price) + '</b> 🔨', (28 + Math.round(Math.random() * 20)) + 'ms · tx #' + tx);
    if (wasLate) {
      secs += 60;
      sysNote('Anti-snipe: hammer backs off <b>+60s</b> — floor gets a fair fight.');
    }
    if (demoLat) demoLat.textContent = (28 + Math.round(Math.random() * 20)) + 'ms';
    setTimeout(function () {
      busy = false;
      if (!over && Math.random() > 0.25) rivalStrike();
    }, 1100 + Math.random() * 800);
  }

  if (demoChips) {
    demoChips.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-bid]');
      if (!btn || over) return;
      youBid(parseInt(btn.dataset.bid, 10) || 500);
    });
  }

  if (autobidBtn) {
    autobidBtn.addEventListener('click', function () {
      if (over) return;
      autobid = !autobid;
      autobidBtn.setAttribute('aria-pressed', autobid ? 'true' : 'false');
      autobidBtn.innerHTML = '<i></i> AUTOBID: ' + (autobid ? 'ON · MAX $48K' : 'OFF');
      sysNote(autobid ? 'Autobid agent armed — max <b>' + fmt(AUTO_MAX) + '</b>, +$500 steps.' : 'Autobid agent stood down.');
      if (autobid && leader !== 'YOU' && leader !== 'YOU (auto)') rivalStrike();
    });
  }

  // demo clock
  setInterval(function () {
    if (over) return;
    secs -= 1;
    if (secs < 0) secs = 0;
    if (demoTimer) {
      demoTimer.textContent = fmtTime(secs);
      demoTimer.style.color = secs <= 15 ? '#FF3B30' : '';
    }
    // ambient rival pressure every ~9s if user idle
    if (!reduceMotion && secs > 0 && Math.random() > 0.72) rivalStrike();
    if (secs === 0) endAuction(leader === 'YOU' || leader === 'YOU (auto)');
  }, 1000);

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
    if (loader && !loader.classList.contains('loaded') && progress < 100) progress = 99;
  }, 6000);
})();
