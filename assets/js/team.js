gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('[data-cursor]');
let mouseX = 0, mouseY = 0;

if (cursor && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
    });

    function animateCursor() {
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .tm-mosaic-tile, .tm-deck-card, .tm-polaroid');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });
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
        gsap.to(loaderNum, {
            innerText: 100,
            duration: 2.5,
            ease: 'power2.inOut',
            snap: { innerText: 1 },
            onUpdate: function() {
                loaderNum.textContent = Math.round(this.targets()[0].innerText);
            }
        });
    }

    if (loaderFill) {
        gsap.to(loaderFill, { width: '100%', duration: 2.5, ease: 'power2.inOut' });
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

document.documentElement.classList.add('js-ready');

setTimeout(() => {
    document.querySelectorAll('.reveal-init').forEach(el => el.classList.add('reveal-active'));
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
}, 4000);

// ============================================
// HERO REVEAL
// ============================================
function revealHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.tm-mosaic-tile', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' })
      .fromTo('.tm-hero-tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
      .fromTo('.tm-hero-headline', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.5')
      .fromTo('.tm-hero-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo('.tm-hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');
}

// ============================================
// SCROLL PROGRESS
// ============================================
window.addEventListener('scroll', () => {
    const scrollBar = document.querySelector('.scroll-progress-bar');
    if (scrollBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    }

    // Scroll orb fill
    const orbFill = document.querySelector('.tm-scroll-orb-fill');
    if (orbFill) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        orbFill.style.height = Math.min((scrollTop / docHeight) * 100, 100) + '%';
    }
}, { passive: true });

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.tm-members-tag, .tm-members-title, .tm-deck-card, .tm-culture-tag, .tm-culture-title, .tm-polaroid, .tm-stat-item, .tm-join-tag, .tm-join-title, .tm-join-text, .cta-headline, .cta-subtext');

revealEls.forEach(el => {
    gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ============================================
// MOSAC TILE PARALLAX
// ============================================
const mosaicTiles = document.querySelectorAll('.tm-mosaic-tile');
mosaicTiles.forEach((tile, i) => {
    gsap.fromTo(tile, { y: 0 }, {
        y: -20,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
            trigger: '.tm-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1 + i * 0.2
        }
    });
});

// ============================================
// COUNTER ANIMATION
// ============================================
const counters = document.querySelectorAll('[data-count]');
counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    gsap.fromTo(counter, { innerText: 0 }, {
        innerText: target,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerText: 1 },
        immediateRender: false,
        scrollTrigger: {
            trigger: counter,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ============================================
// POLAROID TILT ON HOVER
// ============================================
const polaroids = document.querySelectorAll('.tm-polaroid');
polaroids.forEach(polaroid => {
    polaroid.addEventListener('mouseenter', () => {
        gsap.to(polaroid, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
    });
    polaroid.addEventListener('mouseleave', () => {
        gsap.to(polaroid, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
        }
    });
});

// ============================================
// RESPONSIVE CURSOR
// ============================================
if ('ontouchstart' in window) {
    if (cursor) cursor.style.display = 'none';
}

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
