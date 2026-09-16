gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('[data-cursor]');

if (cursor && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });

    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .ax-year, .ax-law, .ax-panel-head, .ax-quote');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });
} else if (cursor) {
    cursor.style.display = 'none';
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
const magneticEls = document.querySelectorAll('[data-magnetic]');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    });
});

// ============================================
// MENU ANIMATION
// ============================================
const menuTrigger = document.querySelector('[data-menu-trigger]');
const navOverlay = document.querySelector('[data-nav-overlay]');
let isMenuOpen = false;

if (menuTrigger && navOverlay) {
    menuTrigger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuTrigger.classList.toggle('nav-menu-trigger--active', isMenuOpen);

        if (isMenuOpen) {
            navOverlay.classList.add('nav-overlay--open');
            gsap.fromTo('.nav-overlay-link', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 });
            gsap.fromTo('.nav-info-item', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.25 });
            gsap.fromTo('.nav-overlay-socials a', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.3 });
            document.body.style.overflow = 'hidden';
        } else {
            navOverlay.classList.remove('nav-overlay--open');
            document.body.style.overflow = '';
        }
    });

    navOverlay.querySelectorAll('.nav-overlay-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                menuTrigger.classList.remove('nav-menu-trigger--active');
                navOverlay.classList.remove('nav-overlay--open');
                document.body.style.overflow = '';
            }
        });
    });
}

// ============================================
// LOADER
// ============================================
function runLoader() {
    const loaderNum = document.querySelector('.loader-num');
    const loaderFill = document.querySelector('.loader-fill');

    const tl = gsap.timeline();
    tl.from('.loader-brand', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.loader-percentage', { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
      .from('.loader-track', { scaleX: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .from('.loader-tagline', { opacity: 0, duration: 0.4 }, '-=0.2');

    if (loaderNum) {
        const counter = { v: 0 };
        gsap.to(counter, {
            v: 100,
            duration: 2.2,
            ease: 'power2.inOut',
            onUpdate: () => { loaderNum.textContent = Math.round(counter.v); }
        });
    }

    if (loaderFill) {
        gsap.to(loaderFill, { width: '100%', duration: 2.2, ease: 'power2.inOut' });
    }

    tl.to('.loader', { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.5, onComplete: () => {
        gsap.set('.loader', { display: 'none' });
        revealHero();
    }});
}

if (document.readyState === 'complete') {
    runLoader();
} else {
    window.addEventListener('load', runLoader);
}

// Safety: never trap user behind loader
setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader && getComputedStyle(loader).display !== 'none') {
        loader.style.display = 'none';
        revealHero();
    }
}, 4500);

// ============================================
// HERO REVEAL — chunky staggered entrance
// ============================================
let heroRevealed = false;
function revealHero() {
    if (heroRevealed) return;
    heroRevealed = true;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.ax-hero-top', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.ax-title .ax-line--1', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.35')
      .fromTo('.ax-title .ax-line--2', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.75')
      .fromTo('.ax-title .ax-line--3', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.75')
      .fromTo('.ax-hero-giant', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.2 }, '-=0.9')
      .fromTo('.ax-hero-stamp', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.8')
      .fromTo('.ax-lead', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.7')
      .fromTo('.ax-hero-actions .ax-btn', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.6')
      .fromTo('.ax-spin', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.5')
      .fromTo('.ax-stat', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.5');
}

// ============================================
// SCROLL PROGRESS
// ============================================
window.addEventListener('scroll', () => {
    const scrollBar = document.querySelector('.scroll-progress-bar');
    if (scrollBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollBar.style.width = ((scrollTop / Math.max(docHeight, 1)) * 100) + '%';
    }
}, { passive: true });

// ============================================
// CAPABILITIES ACCORDION (accessible, animated)
// ============================================
const panels = document.querySelectorAll('[data-panel]');

panels.forEach(panel => {
    const head = panel.querySelector('.ax-panel-head');
    if (!head) return;

    head.addEventListener('click', () => {
        const isOpen = panel.classList.contains('is-open');

        // single-open behaviour
        panels.forEach(p => {
            p.classList.remove('is-open');
            const h = p.querySelector('.ax-panel-head');
            if (h) h.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            panel.classList.add('is-open');
            head.setAttribute('aria-expanded', 'true');
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }
    });
});

// ============================================
// SCROLL REVEALS (play once — never hide content again)
// ============================================
const revealEls = document.querySelectorAll('.ax-mono-title, .ax-mono-sub, .ax-story-head, .ax-year, .ax-values-head, .ax-law, .ax-caps-head, .ax-panel, .ax-philo-quote, .ax-philo-title, .ax-num-card, .ax-voices-head, .ax-quote, .ax-cta-title, .ax-cta-sub, .ax-cta-row');

revealEls.forEach(el => {
    gsap.from(el, {
        y: 56,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true
        }
    });
});

// Hero giant drifts on scroll
gsap.to('.ax-hero-giant', {
    yPercent: 24,
    ease: 'none',
    scrollTrigger: { trigger: '.ax-hero', start: 'top top', end: 'bottom top', scrub: true }
});

// ============================================
// NUMBER COUNTERS
// ============================================
document.querySelectorAll('[data-count]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
            trigger: counter,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
        },
        onUpdate: () => { counter.textContent = Math.round(obj.v); }
    });
});

// ============================================
// SMOOTH ANCHOR SCROLL (native — no extra plugin)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// RESIZE
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ============================================
// BACK TO TOP BUTTON VISIBILITY
// ============================================
const totopBtn = document.querySelector('.footer-totop');
if (totopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            totopBtn.classList.add('visible');
        } else {
            totopBtn.classList.remove('visible');
        }
    });
}
