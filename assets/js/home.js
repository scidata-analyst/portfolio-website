gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('[data-cursor]');
const cursorFollower = document.querySelector('[data-cursor-follower]');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(cursorFollower, { x: followerX, y: followerY });
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .service-card, .tech-card, .approach-item');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 0.5, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 2.5, borderColor: '#0bbd29', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1, borderColor: '#ffffff', duration: 0.3 });
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
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
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
        const tl = gsap.timeline();

        if (isMenuOpen) {
            tl.set(navOverlay, { display: 'flex' })
              .fromTo(navOverlay, { opacity: 0 }, { opacity: 1, duration: 0.4 })
              .fromTo('.nav-link-magnetic', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.2')
              .fromTo('.nav-overlay-info .nav-info-block', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
              .fromTo('.nav-overlay-social a', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, '-=0.3');
        } else {
            tl.to(navOverlay, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(navOverlay, { display: 'none' }) });
        }
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealEls = document.querySelectorAll('.reveal-text');
revealEls.forEach(el => {
    gsap.fromTo(el, 
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// ============================================
// HERO ANIMATION
// ============================================
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
    .from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero-title-line', { y: 100, opacity: 0, duration: 1.2, stagger: 0.15 }, '-=0.5')
    .from('.hero-description', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.deco-circle', { scale: 0, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1');

// Parallax background text
gsap.to('.hero-bg-text', {
    y: 200,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

// ============================================
// HORIZONTAL SCROLL - SERVICES
// ============================================
const servicesTrack = document.querySelector('[data-horizontal-scroll]');
if (servicesTrack) {
    const panels = gsap.utils.toArray('.services-panel');
    gsap.to(panels, {
        x: () => -(servicesTrack.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '.services-horizontal',
            pin: true,
            scrub: 1,
            end: () => '+=' + (servicesTrack.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true
        }
    });

    // Image scale on hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const img = card.querySelector('.service-image img');
        if (img) {
            card.addEventListener('mouseenter', () => {
                gsap.to(img, { scale: 1.1, duration: 0.6, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
            });
        }
    });
}

// ============================================
// STICKY STORYTELLING - PROCESS
// ============================================
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, i) => {
    gsap.from(step, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ============================================
// IMAGE SCALE TRANSITIONS
// ============================================
const scaleTargets = document.querySelectorAll('.service-image img, .tech-card');
scaleTargets.forEach(el => {
    if (el.tagName === 'IMG') {
        gsap.fromTo(el, { scale: 1 }, {
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
});

// ============================================
// COUNTER ANIMATION
// ============================================
const counters = document.querySelectorAll('[data-count]');
counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    gsap.fromTo(counter, { innerText: 0 }, {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ============================================
// TEXT DISTORTION ON HOVER
// ============================================
const distortTargets = document.querySelectorAll('.approach-name, .service-name, .tech-name');
distortTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(el, { skewX: -3, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { skewX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
});

// ============================================
// CURSOR FOLLOWER SPOTLIGHT
// ============================================
const spotlightEl = document.querySelector('.hero');
if (spotlightEl && window.innerWidth > 1024) {
    spotlightEl.addEventListener('mousemove', (e) => {
        const rect = spotlightEl.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(spotlightEl, {
            '--mouse-x': x + '%',
            '--mouse-y': y + '%',
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

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
// TILT EFFECT FOR TECH CARDS
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
// LOADER ANIMATION
// ============================================
window.addEventListener('load', () => {
    const loaderTl = gsap.timeline();
    loaderTl
        .from('.loader-text', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.loader-bar', { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, '-=0.4')
        .to('.loader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=1')
        .to('.loader', { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.3 });
});

// ============================================
// SCROLL-BASED TYPOGRAPHY
// ============================================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    gsap.fromTo(heroTitle.children, 
        { y: 0 },
        {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        }
    );
}

// ============================================
// SECTION HEADER ANIMATIONS
// ============================================
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach(header => {
    const eyebrow = header.querySelector('.section-eyebrow');
    const title = header.querySelector('.section-title');
    
    if (eyebrow) {
        gsap.from(eyebrow, {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    if (title) {
        gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }
});

// ============================================
// MICRO-INTERACTIONS
// ============================================
const microEls = document.querySelectorAll('.service-card, .approach-item, .tech-card');
microEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(el, { y: -8, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { y: 0, duration: 0.4, ease: 'power2.out' });
    });
});

// ============================================
// RESPONSIVE CURSOR
// ============================================
if ('ontouchstart' in window) {
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
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
