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

    const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .tm2-member, .tm2-culture-card');
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

    tl.fromTo('.tm2-hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo('.tm2-hero-headline', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.4')
      .fromTo('.tm2-hero-subtext', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo('.tm2-hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');
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

    // Culture scroll progress (manual fallback)
    const cultureViewport = document.querySelector('.tm2-culture-viewport');
    const cultureProgress = document.querySelector('.tm2-culture-progress-fill');
    if (cultureViewport && cultureProgress) {
        const maxScroll = cultureViewport.scrollWidth - cultureViewport.clientWidth;
        cultureProgress.style.width = (maxScroll > 0 ? (cultureViewport.scrollLeft / maxScroll) * 100 : 0) + '%';
    }
}, { passive: true });

// ============================================
// CULTURE HORIZONTAL SCROLL
// ============================================
const cultureSection = document.querySelector('.tm2-culture');
const cultureTrack = document.querySelector('.tm2-culture-track');
if (cultureSection && cultureTrack) {
    function initCultureScroll() {
        ScrollTrigger.getAll().forEach(t => {
            if (t.trigger === '.tm2-culture') t.kill();
        });

        const trackWidth = cultureTrack.scrollWidth;
        const viewportWidth = cultureSection.clientWidth;
        const scrollDistance = trackWidth - viewportWidth + 60;

        if (scrollDistance <= 0) return;

        gsap.to(cultureTrack, {
            x: () => -scrollDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: '.tm2-culture',
                start: 'top top',
                end: () => '+=' + scrollDistance,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const cultureProgress = document.querySelector('.tm2-culture-progress-fill');
                    if (cultureProgress) {
                        cultureProgress.style.width = (self.progress * 100) + '%';
                    }
                }
            }
        });
    }

    if (document.readyState === 'complete') {
        setTimeout(initCultureScroll, 200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initCultureScroll, 200);
        });
    }
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.tm2-members-tag, .tm2-members-title, .tm2-member, .tm2-culture-tag, .tm2-culture-title, .tm2-culture-card, .tm2-stat, .tm2-join-tag, .tm2-join-title, .tm2-join-text, .cta-headline, .cta-subtext');

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
// MEMBER CARD HOVER
// ============================================
const memberCards = document.querySelectorAll('.tm2-member');
memberCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -8, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
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
