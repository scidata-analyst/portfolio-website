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

    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .in2-solution-card, .in2-product-card, .in2-stat');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });

    const viewTargets = document.querySelectorAll('.in2-product-card, .in2-solution-card');
    viewTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--view');
            if (cursor.querySelector('.cursor-label')) {
                cursor.querySelector('.cursor-label').textContent = 'VIEW';
            }
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

    tl.fromTo('.in2-hero-tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo('.in2-headline-word', { y: '100%' }, { y: '0%', duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
      .fromTo('.in2-hero-subtext', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
      .fromTo('.in2-hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo('.in2-hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

    // Mark words as revealed for CSS fallback
    document.querySelectorAll('.in2-headline-word').forEach(el => el.classList.add('revealed'));
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
// SOLUTIONS STICKY CARDS
// ============================================
const solutionCards = document.querySelectorAll('.in2-solution-card');
const solutionsSection = document.querySelector('.in2-solutions');

// Initialize all cards as hidden
gsap.set(solutionCards, { opacity: 0, y: 80, scale: 0.92 });

// Create a single ScrollTrigger for the solutions section
if (solutionsSection && solutionCards.length > 0) {
    ScrollTrigger.create({
        trigger: solutionsSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const cardCount = solutionCards.length;
            const activeIndex = Math.min(Math.floor(progress * cardCount), cardCount - 1);

            solutionCards.forEach((card, i) => {
                if (i === activeIndex) {
                    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
                } else {
                    gsap.to(card, { opacity: 0, y: 80, scale: 0.92, duration: 0.4, ease: 'power2.in' });
                }
            });
        }
    });
}

// Activate first card on load
if (solutionCards.length > 0) {
    setTimeout(() => {
        gsap.to(solutionCards[0], { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' });
    }, 1500);
}

// ============================================
// PRODUCT CARDS REVEAL
// ============================================
const productCards = document.querySelectorAll('.in2-product-card');
productCards.forEach(card => {
    gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ============================================
// PRODUCT CARD HOVER
// ============================================
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
    });
});

// ============================================
// STATS COUNTER
// ============================================
const statCounters = document.querySelectorAll('.in2-stat-num');
statCounters.forEach(counter => {
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
// DEEP DIVE REVEAL
// ============================================
const deepdiveBlocks = document.querySelectorAll('.in2-deepdive-block');
deepdiveBlocks.forEach(block => {
    gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
            trigger: block,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
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
