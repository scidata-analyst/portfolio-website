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

    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .ab-value-card, .ab-cap-panel, .ab-testimonial');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });

    const viewTargets = document.querySelectorAll('.ab-value-card, .ab-testimonial');
    viewTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--view');
            cursor.querySelector('.cursor-label').textContent = 'VIEW';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--view');
        });
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

    tl.fromTo('.ab-intro-tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo('.ab-intro-headline', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.4')
      .fromTo('.ab-intro-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo('.ab-visual-frame', { scale: 0.8, opacity: 0, rotate: -10 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.8')
      .fromTo('.ab-intro-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');
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
}, { passive: true });

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.ab-intro-tag, .ab-intro-headline, .ab-intro-text, .ab-manifesto-word, .ab-timeline-item, .ab-value-card, .ab-cap-panel, .ab-philosophy-title, .ab-philosophy-text, .ab-stat-item, .ab-testimonial, .cta-headline, .cta-subtext');

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
// MANIFESTO WORD HOVER
// ============================================
const manifestoWords = document.querySelectorAll('.ab-manifesto-word');
manifestoWords.forEach(word => {
    word.addEventListener('mouseenter', () => {
        gsap.to(word, { y: -12, rotation: -3, scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    word.addEventListener('mouseleave', () => {
        gsap.to(word, { y: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
});

// ============================================
// CAPABILITIES ACCORDION
// ============================================
const capPanels = document.querySelectorAll('[data-panel]');
capPanels.forEach(panel => {
    const head = panel.querySelector('.ab-cap-panel-head');
    head.addEventListener('click', () => {
        const isOpen = panel.classList.contains('ab-cap-panel--open');
        capPanels.forEach(p => p.classList.remove('ab-cap-panel--open'));
        if (!isOpen) {
            panel.classList.add('ab-cap-panel--open');
        }
    });
});

// ============================================
// TILT EFFECT
// ============================================
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
});

// ============================================
// COUNTER + RING ANIMATION
// ============================================
const statRings = document.querySelectorAll('.ab-stat-ring-fill');
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

statRings.forEach(ring => {
    const target = parseInt(ring.getAttribute('data-ring'));
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (target / 100) * circumference;

    ScrollTrigger.create({
        trigger: ring,
        start: 'top 88%',
        onEnter: () => {
            gsap.to(ring, { strokeDashoffset: offset, duration: 2, ease: 'power2.out' });
        }
    });
});

// ============================================
// TIMELINE PROGRESS
// ============================================
const timelineSection = document.querySelector('.ab-timeline');
const timelineProgress = document.querySelector('.ab-timeline-progress');

if (timelineSection && timelineProgress) {
    gsap.to(timelineProgress, {
        height: '100%',
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
            trigger: timelineSection,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
        }
    });
}

// ============================================
// MICRO-INTERACTIONS
// ============================================
const microEls = document.querySelectorAll('.ab-cap-panel, .ab-testimonial');
microEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(el, { x: 6, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, duration: 0.3, ease: 'power2.out' });
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
