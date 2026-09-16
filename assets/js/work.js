gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR + FLOATING PREVIEW TAG
// ============================================
const cursor = document.querySelector('[data-cursor]');
const wxFloat = document.querySelector('.wx-float');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

if (!('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
        if (wxFloat) gsap.to(wxFloat, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power3.out' });
    });

    if (cursor) {
        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .wx-filter, .wx-stack-cloud span');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
        });
    }
} else {
    if (cursor) cursor.style.display = 'none';
}

// Row hover -> floating "VIEW CASE" tag with per-row label
const rows = document.querySelectorAll('.wx-row');
rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        if (!wxFloat || ('ontouchstart' in window)) return;
        const label = row.getAttribute('data-cursor-text') || 'VIEW CASE ✦';
        wxFloat.querySelector('.wx-float-word').textContent = label.replace('OPEN', 'VIEW');
        wxFloat.classList.add('is-on');
        if (cursor) cursor.classList.add('cursor--view');
    });
    row.addEventListener('mouseleave', () => {
        if (!wxFloat) return;
        wxFloat.classList.remove('is-on');
        if (cursor) cursor.classList.remove('cursor--view');
    });
});

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

    tl.fromTo('.wx-hero-top', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.wx-title .wx-line--1', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.35')
      .fromTo('.wx-title .wx-line--2', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.75')
      .fromTo('.wx-hero-giant', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.2 }, '-=0.9')
      .fromTo('.wx-lead', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.7')
      .fromTo('.wx-hero-actions .wx-btn', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.6')
      .fromTo('.wx-spin', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.5')
      .fromTo('.wx-stat', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.5');
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
// FILTER — All / AI / Platforms / Data
// ============================================
const filterBtns = document.querySelectorAll('.wx-filter');
const wallEmpty = document.querySelector('.wx-wall-empty');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const f = btn.getAttribute('data-filter');
        let visible = 0;

        rows.forEach(row => {
            const cat = row.getAttribute('data-cat');
            const show = (f === 'all' || cat === f);
            row.classList.remove('is-pop');
            if (show) {
                row.classList.remove('is-hidden');
                // re-trigger pop
                void row.offsetWidth;
                row.classList.add('is-pop');
                visible++;
            } else {
                row.classList.add('is-hidden');
            }
        });

        if (wallEmpty) wallEmpty.hidden = visible !== 0;
        ScrollTrigger.refresh();
    });
});

// ============================================
// SCROLL REVEALS (play once — never hide content again)
// ============================================
const revealEls = document.querySelectorAll('.wx-index-head, .wx-row, .wx-proof-card, .wx-step, .wx-stack-cloud span, .wx-cta-title, .wx-cta-sub, .wx-cta-row');

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

// Row visual parallax tilt on mouse
rows.forEach(row => {
    const visual = row.querySelector('.wx-row-visual');
    if (!visual) return;
    row.addEventListener('mousemove', (e) => {
        const r = row.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        gsap.to(visual, { x: px * 14, duration: 0.4, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
        gsap.to(visual, { x: 0, duration: 0.5, ease: 'power2.out' });
    });
});

// Hero giant number drifts on scroll
gsap.to('.wx-hero-giant', {
    yPercent: 24,
    ease: 'none',
    scrollTrigger: { trigger: '.wx-hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Process bg text drifts
gsap.to('.wx-process-bg', {
    xPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.wx-process', start: 'top bottom', end: 'bottom top', scrub: true }
});

// ============================================
// SMOOTH ANCHOR SCROLL
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
