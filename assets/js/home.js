gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR (ENHANCED)
// ============================================
const cursor = document.querySelector('[data-cursor]');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let trailX = 0, trailY = 0;

if (cursor && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });

        // Show trail on mouse move
        if (cursorTrail) {
            gsap.to(cursorTrail, { opacity: 1, duration: 0.2 });
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursorTrail) {
            gsap.to(cursorTrail, { opacity: 0, duration: 0.3 });
        }
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;

        // Trail follows with more lag
        if (cursorTrail) {
            trailX += (mouseX - trailX) * 0.08;
            trailY += (mouseY - trailY) * 0.08;
            gsap.set(cursorTrail, { x: trailX, y: trailY });
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor states for different elements
    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .service-panel, .tech-block, .approach-row');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });

    const viewTargets = document.querySelectorAll('.service-panel, .tech-block');
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
const navOverlayBg = document.querySelector('.nav-overlay-bg');
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

    // Close on link click
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
// LOADER ANIMATION
// ============================================
function runLoader() {
    const loaderNum = document.querySelector('.loader-num');
    const loaderFill = document.querySelector('.loader-fill');

    const tl = gsap.timeline();

    tl.from('.loader-brand', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.loader-percentage', { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
      .from('.loader-track', { scaleX: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .from('.loader-tagletter', { opacity: 0, duration: 0.4 }, '-=0.2');

    // Animate percentage
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

// ============================================
// INITIALIZATION
// ============================================
document.documentElement.classList.add('js-ready');

// Fallback: reveal all hidden elements after 4s
setTimeout(() => {
    document.querySelectorAll('.reveal-init').forEach(el => {
        el.classList.add('reveal-active');
    });
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
}, 4000);

// ============================================
// HERO REVEAL (after loader) — SUPPORTS BOTH LEGACY AND V2
// ============================================
function revealHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Legacy hero
    if (document.querySelector('.hero-eyebrow')) {
        tl.fromTo('.hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
          .fromTo('.headline-line--1 .headline-word', { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.4')
          .fromTo('.headline-line--2 .headline-word', { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.7')
          .fromTo('.headline-line--3 .headline-word', { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.7')
          .fromTo('.hero-subtext', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
          .fromTo('.hero-cta-group', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
          .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
          .fromTo('.hero-side-text', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
          .fromTo('.float-text', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power2.out' }, '-=1');
    }

    // HERO V2 — bolder first impression
    if (document.querySelector('.hero-v2')) {
        const hv = gsap.timeline({ defaults: { ease: 'power3.out' } });
        hv.fromTo('.hv-top', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2)
          .fromTo('.hv-line', { y: 110, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.12, ease: 'power4.out' }, 0.35)
          .fromTo('.hv-lead', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.95)
          .fromTo('.hv-ctas', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1)
          .fromTo('.hv-stats .hv-stat', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 1.25)
          .fromTo('.hv-showcase', { y: 40, opacity: 0, rotate: -1 }, { y: 0, opacity: 1, rotate: -0.6, duration: 1, ease: 'power3.out' }, 0.8)
          .fromTo('.hv-bottom', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5)
          .fromTo('.hv-bigtype', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.3);
    }
}

// ============================================
// SCROLL PROGRESS
// ============================================
window.addEventListener('scroll', () => {
    const scrollBar = document.querySelector('.scroll-progress-bar');
    if (scrollBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollBar.style.width = progress + '%';
    }
}, { passive: true });

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.section-tag, .about-title, .about-body, .metric, .tech-heading, .tech-block, .process-heading, .process-node, .approach-heading, .approach-row, .cta-headline, .cta-subtext, .btn-cta-large');

revealElements.forEach(el => {
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
// PARALLAX FLOATING TEXT
// ============================================
gsap.to('.float-text--1', {
    x: -100,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
    }
});

gsap.to('.float-text--2', {
    x: 80,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
    }
});

gsap.to('.float-text--3', {
    y: -60,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
    }
});

// ============================================
// HERO HEADLINE SCROLL PARALLAX
// ============================================
const heroHeadline = document.querySelector('.hero-headline');
if (heroHeadline) {
    gsap.fromTo(heroHeadline, { y: 0 }, {
        y: -80,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// ============================================
// HORIZONTAL SCROLL - SERVICES
// ============================================
const servicesViewport = document.querySelector('[data-horizontal-scroll]');
const servicesTrack = servicesViewport ? servicesViewport.querySelector('.services-track') : null;

if (servicesViewport && servicesTrack) {
    function initHorizontalScroll() {
        ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === '.services-section') t.kill();
        });

        const trackWidth = servicesTrack.scrollWidth;
        const viewportWidth = servicesViewport.clientWidth;
        const scrollDistance = trackWidth - viewportWidth + 60;

        if (scrollDistance <= 0) return;

        gsap.to(servicesTrack, {
            x: () => -scrollDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: '.services-section',
                pin: '.services-sticky-wrap',
                scrub: 1,
                end: () => '+=' + scrollDistance,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progressFill = document.querySelector('.progress-fill');
                    if (progressFill) {
                        progressFill.style.width = (self.progress * 100) + '%';
                    }
                }
            }
        });
    }

    if (document.readyState === 'complete') {
        setTimeout(initHorizontalScroll, 200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initHorizontalScroll, 200);
        });
    }
}

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
// WHO WE ARE - ANIMATIONS
// ============================================
const wwaSection = document.querySelector('.who-we-are');
if (wwaSection) {
    // Title reveal animation
    const wwaTitle = wwaSection.querySelector('.wwa-title');
    if (wwaTitle) {
        const titleText = wwaTitle.textContent;
        wwaTitle.innerHTML = '';
        titleText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? ' ' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(40px)';
            wwaTitle.appendChild(span);
        });

        ScrollTrigger.create({
            trigger: wwaSection,
            start: 'top 70%',
            onEnter: () => {
                gsap.to(wwaTitle.children, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.02,
                    ease: 'power3.out'
                });
            }
        });
    }

    // Cards stagger entrance
    const wwaCards = wwaSection.querySelectorAll('.wwa-card');
    gsap.set(wwaCards, { opacity: 0, y: 60 });
    ScrollTrigger.create({
        trigger: wwaSection,
        start: 'top 60%',
        onEnter: () => {
            gsap.to(wwaCards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    });

    // Stats counter entrance
    const wwaStats = wwaSection.querySelectorAll('.wwa-stat');
    gsap.set(wwaStats, { opacity: 0, scale: 0.8 });
    ScrollTrigger.create({
        trigger: wwaSection,
        start: 'top 50%',
        onEnter: () => {
            gsap.to(wwaStats, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    });

    // Visual rings entrance
    const wwaVisual = wwaSection.querySelector('.wwa-visual');
    if (wwaVisual) {
        gsap.set(wwaVisual, { opacity: 0, scale: 0.5, rotation: -30 });
        ScrollTrigger.create({
            trigger: wwaSection,
            start: 'top 55%',
            onEnter: () => {
                gsap.to(wwaVisual, {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                });
            }
        });
    }

    // Tag entrance
    const wwaTag = wwaSection.querySelector('.wwa-tag');
    if (wwaTag) {
        gsap.set(wwaTag, { opacity: 0, x: -30 });
        ScrollTrigger.create({
            trigger: wwaSection,
            start: 'top 75%',
            onEnter: () => {
                gsap.to(wwaTag, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Bottom CTA entrance
    const wwaBottom = wwaSection.querySelector('.wwa-bottom');
    if (wwaBottom) {
        gsap.set(wwaBottom, { opacity: 0, y: 30 });
        ScrollTrigger.create({
            trigger: wwaSection,
            start: 'top 40%',
            onEnter: () => {
                gsap.to(wwaBottom, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Parallax on background glow
    const wwaGlows = wwaSection.querySelectorAll('.wwa-glow');
    wwaGlows.forEach((glow, i) => {
        gsap.to(glow, {
            y: i === 0 ? 100 : -100,
            scrollTrigger: {
                trigger: wwaSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// ============================================
// TEXT DISTORTION ON HOVER
// ============================================
const distortTargets = document.querySelectorAll('.panel-title, .tech-block-title, .approach-name, .node-title');
distortTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(el, { skewX: -2, scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { skewX: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
});

// ============================================
// TILT EFFECT FOR TECH BLOCKS
// ============================================
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
});

// ============================================
// MICRO-INTERACTIONS
// ============================================
const microEls = document.querySelectorAll('.service-panel, .approach-row');
microEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(el, { y: -4, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out' });
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
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

// ============================================
// HERO V2 PARALLAX & BENTO REVEALS
// ============================================
if (document.querySelector('.hero-v2')) {
    // Parallax on hero visual
    gsap.to('.hv-showcase', {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hv-bigtype', {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });

    // Reveal bento, work, edge, etc
    const bentoCards = document.querySelectorAll('.b-card, .snap-card, .wp-card, .edge-card, .pv-step, .testi-card, .pt-card');
    bentoCards.forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: (i % 3) * 0.04,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Snap header
    gsap.from('.snap-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.snap-section', start: 'top 80%' }
    });

    // Mega CTA parallax
    gsap.to('.mega-big', {
        y: -60,
        scrollTrigger: { trigger: '.mega-cta', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
}

// ============================================
// RESPONSIVE CURSOR DISABLE
// ============================================
if ('ontouchstart' in window) {
    if (cursor) cursor.style.display = 'none';
}

// ============================================
// REFRESH SCROLLTRIGGER ON RESIZE
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
