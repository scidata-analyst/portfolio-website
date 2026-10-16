/* Scidata services page script: loader, menu overlay, ticker duplicates.
   Vanilla + GSAP only. Loaded with defer. */
gsap.registerPlugin(ScrollTrigger);

// ============================================
// MENU OVERLAY
// ============================================
const menuTrigger = document.querySelector('[data-menu-trigger]');
const navOverlay = document.querySelector('[data-nav-overlay]');
let isMenuOpen = false;

if (menuTrigger && navOverlay) {
    const setMenu = (open) => {
        isMenuOpen = open;
        menuTrigger.classList.toggle('nav-menu-trigger--active', open);
        menuTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        navOverlay.classList.toggle('nav-overlay--open', open);
        navOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
            gsap.fromTo('.nav-overlay-link',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.1 });
        }
    };
    menuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenu(!isMenuOpen);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) setMenu(false);
    });
    navOverlay.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => setMenu(false));
    });
}

// ============================================
// LOADER
// ============================================
let loaderDone = false;
function runLoader() {
    if (loaderDone) return;
    loaderDone = true;
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
            v: 100, duration: 1.8, ease: 'power2.inOut',
            onUpdate: () => { loaderNum.textContent = Math.round(counter.v); }
        });
    }
    if (loaderFill) {
        gsap.to(loaderFill, { width: '100%', duration: 2.2, ease: 'power2.inOut' });
    }
    tl.to('.loader', {
        yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.5,
        onComplete: () => { gsap.set('.loader', { display: 'none' }); }
    });
}
if (document.readyState === 'complete') {
    runLoader();
} else {
    window.addEventListener('load', runLoader);
}

// Safety: never trap user behind loader
setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader && getComputedStyle(loader).display !== 'none' && !loaderDone) {
        runLoader();
    }
}, 4500);

// ============================================
// SCROLL REVEALS (play once - never hide content again)
// ============================================
const revealEls = document.querySelectorAll('.sv-menu-head, .sv-row, .sv-stack-cloud, .sv-step, .sv-plan, .sv-faq-item, .sv-cta-title');
revealEls.forEach((el) => {
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
gsap.to('.sv-hero-giant', {
    yPercent: 24,
    ease: 'none',
    scrollTrigger: { trigger: '.sv-hero', start: 'top top', end: 'bottom top', scrub: true }
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
