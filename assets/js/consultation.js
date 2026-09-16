gsap.registerPlugin(ScrollTrigger);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('[data-cursor]');

if (cursor && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });

    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .ct-topic, .ct-pay, .ct-move, input, select, textarea');
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

    tl.fromTo('.ct-hero-top', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.ct-title .ct-line--1', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.35')
      .fromTo('.ct-title .ct-line--2', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.75')
      .fromTo('.ct-hero-giant', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.2 }, '-=0.9')
      .fromTo('.ct-lead', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.7')
      .fromTo('.ct-hero-actions .ct-btn', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.6')
      .fromTo('.ct-ticket', { scale: 0, opacity: 0, rotate: 20 }, { scale: 1, opacity: 1, rotate: 4, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.5')
      .fromTo('.ct-stat', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.5');
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
// TOPIC PICKER → pre-fills booking form + scrolls
// ============================================
const serviceSelect = document.getElementById('ctService');
const topicBtns = document.querySelectorAll('[data-topic]');

function pickTopic(value, btn) {
    if (serviceSelect) {
        const match = Array.from(serviceSelect.options).find(o => o.text.trim() === value.trim());
        if (match) {
            serviceSelect.value = match.value || match.text;
            // options without explicit value use text
            serviceSelect.selectedIndex = match.index;
        }
        const field = serviceSelect.closest('.ct-field');
        if (field) {
            field.classList.remove('is-bad');
            field.classList.remove('is-flash');
            void field.offsetWidth;
            field.classList.add('is-flash');
        }
    }
    topicBtns.forEach(b => b.classList.remove('ct-topic-picked'));
    if (btn) btn.classList.add('ct-topic-picked');

    const target = document.getElementById('book');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

topicBtns.forEach(btn => {
    btn.addEventListener('click', () => pickTopic(btn.getAttribute('data-topic') || '', btn));
});

// ============================================
// FAQ ACCORDION (accessible, single-open)
// ============================================
const qas = document.querySelectorAll('[data-qa]');

qas.forEach(qa => {
    const head = qa.querySelector('.ct-qa-head');
    if (!head) return;

    head.addEventListener('click', () => {
        const isOpen = qa.classList.contains('is-open');

        qas.forEach(q => {
            q.classList.remove('is-open');
            const h = q.querySelector('.ct-qa-head');
            if (h) h.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            qa.classList.add('is-open');
            head.setAttribute('aria-expanded', 'true');
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }
    });
});

// ============================================
// BOOKING FORM — validation, counter, success
// ============================================
const bookForm = document.getElementById('bookForm');
const msgInput = document.getElementById('ctMsg');
const msgCount = document.getElementById('ctCount');
const successBox = document.getElementById('bookSuccess');

if (msgInput && msgCount) {
    msgInput.addEventListener('input', () => {
        msgCount.textContent = msgInput.value.length;
    });
}

function setBad(input, bad) {
    const field = input.closest('.ct-field');
    if (!field) return;
    field.classList.toggle('is-bad', bad);
    if (bad) {
        input.addEventListener('input', () => field.classList.remove('is-bad'), { once: true });
        input.addEventListener('change', () => field.classList.remove('is-bad'), { once: true });
    }
}

if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('ctName');
        const email = document.getElementById('ctEmail');
        const service = document.getElementById('ctService');
        const msg = document.getElementById('ctMsg');

        let ok = true;
        let firstBad = null;

        const check = (input, valid) => {
            setBad(input, !valid);
            if (!valid) {
                ok = false;
                if (!firstBad) firstBad = input;
            }
        };

        check(name, name.value.trim().length >= 2);
        check(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()));
        check(service, service.value !== '');
        check(msg, msg.value.trim().length >= 10);

        if (!ok) {
            if (firstBad) firstBad.focus({ preventScroll: false });
            gsap.fromTo(bookForm, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.35)' });
            return;
        }

        const btn = bookForm.querySelector('[type="submit"]');
        const label = btn ? btn.querySelector('.ct-submit-label') : null;
        if (btn) btn.disabled = true;
        if (label) label.textContent = 'Sending…';

        // Front-end acknowledgement (wire to backend/WhatsApp as needed)
        setTimeout(() => {
            if (successBox) {
                successBox.hidden = false;
                gsap.from(successBox, { y: 24, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' });
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (label) label.textContent = 'Request received ✓';
            bookForm.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = true; });
        }, 900);
    });
}

// ============================================
// SCROLL REVEALS (play once — never hide content again)
// ============================================
const revealEls = document.querySelectorAll('.ct-topics-head, .ct-topic, .ct-payoff-head, .ct-pay, .ct-session-head, .ct-move, .ct-faq-head, .ct-qa, .ct-book-head, .ct-form, .ct-cta-title, .ct-cta-sub, .ct-cta-row');

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
gsap.to('.ct-hero-giant', {
    yPercent: 24,
    ease: 'none',
    scrollTrigger: { trigger: '.ct-hero', start: 'top top', end: 'bottom top', scrub: true }
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
