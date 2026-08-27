(function() {
    'use strict';

    function forceRevealAll() {
        document.querySelectorAll('.reveal-text').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
        document.body.style.visibility = 'visible';
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.body.style.visibility = 'visible';
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
        return;
    }

    try {
        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add('js-ready');
        document.body.style.visibility = 'visible';

        const cursor = document.querySelector('[data-cursor]');
        const cursorFollower = document.querySelector('[data-cursor-follower]');
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        if (cursor && cursorFollower && !('ontouchstart' in window)) {
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

            const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .expect-card, .faq-item, .form-feature');
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

        function runLoader() {
            try {
                const loaderTl = gsap.timeline();
                loaderTl
                    .from('.loader-text', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })
                    .from('.loader-bar', { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, '-=0.4')
                    .to('.loader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=1')
                    .to('.loader', { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.3, onComplete: () => {
                        gsap.set('.loader', { display: 'none' });
                        revealHero();
                    } });
            } catch (e) {
                gsap.set('.loader', { display: 'none' });
                revealHero();
            }
        }

        if (document.readyState === 'complete') {
            runLoader();
        } else {
            window.addEventListener('load', runLoader);
        }

        function revealHero() {
            try {
                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                heroTl
                    .fromTo('.consult-hero-label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                    .fromTo('.consult-title-word', { y: 80, opacity: 0, rotateX: -40 }, { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.12 }, '-=0.4')
                    .fromTo('.consult-hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
                    .fromTo('.hero-cta-row', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
                    .fromTo('.consult-blob', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 1.5, stagger: 0.2, ease: 'power3.out' }, '-=1');
            } catch (e) {
                forceRevealAll();
            }
        }

        try {
            const revealEls = document.querySelectorAll('.reveal-text:not(.consult-hero .reveal-text)');
            revealEls.forEach(el => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                        immediateRender: false,
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
                    }
                );
            });
        } catch (e) {
            console.warn('Scroll reveal failed:', e);
        }

        try {
            const blobs = document.querySelectorAll('.consult-blob');
            blobs.forEach((blob, i) => {
                gsap.to(blob, {
                    x: () => (i % 2 === 0 ? 30 : -30),
                    y: () => (i === 0 ? 20 : -20),
                    duration: 4 + i,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
        } catch (e) {
            console.warn('Blob animation failed:', e);
        }

        try {
            const expectCards = document.querySelectorAll('.expect-card');
            expectCards.forEach((card, i) => {
                gsap.from(card, {
                    y: 80, opacity: 0, duration: 1, delay: i * 0.15, ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
                });
            });
        } catch (e) {
            console.warn('Expect cards failed:', e);
        }

        try {
            const tiltEls = document.querySelectorAll('[data-tilt]');
            tiltEls.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / centerY * -5;
                    const rotateY = (x - centerX) / centerX * 5;
                    gsap.to(el, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
                });
            });
        } catch (e) {
            console.warn('Tilt failed:', e);
        }

        try {
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                
                gsap.set(answer, { height: 0, opacity: 0 });

                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('faq-item--open');
                    
                    faqItems.forEach(other => {
                        other.classList.remove('faq-item--open');
                        gsap.to(other.querySelector('.faq-answer'), { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut' });
                    });

                    if (!isOpen) {
                        item.classList.add('faq-item--open');
                        gsap.set(answer, { height: 'auto' });
                        gsap.from(answer, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut' });
                    }
                });
            });
        } catch (e) {
            console.warn('FAQ failed:', e);
        }

        try {
            const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    gsap.to(input, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
                });
                input.addEventListener('blur', () => {
                    gsap.to(input, { scale: 1, duration: 0.3, ease: 'power2.out' });
                });
            });
        } catch (e) {
            console.warn('Form interactions failed:', e);
        }

        try {
            const scrollBarFill = document.querySelector('.scroll-bar-fill');
            if (scrollBarFill) {
                gsap.to(scrollBarFill, {
                    width: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1
                    }
                });
            }
        } catch (e) {
            console.warn('Scroll bar failed:', e);
        }

        if ('ontouchstart' in window) {
            if (cursor) cursor.style.display = 'none';
            if (cursorFollower) cursorFollower.style.display = 'none';
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                try { ScrollTrigger.refresh(); } catch (e) {}
            }, 250);
        });

    } catch (e) {
        console.error('GSAP initialization error:', e);
        forceRevealAll();
    }
})();
