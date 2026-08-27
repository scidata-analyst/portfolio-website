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

            const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .price-card, .price-faq-item');
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
                    .fromTo('.price-hero-label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                    .fromTo('.price-word', { y: 100, opacity: 0, skewY: 5 }, { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.12 }, '-=0.4')
                    .fromTo('.price-hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
                    .fromTo('.price-hero-toggle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
                    .fromTo('.price-float', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.6');
            } catch (e) {
                forceRevealAll();
            }
        }

        try {
            const revealEls = document.querySelectorAll('.reveal-text:not(.price-hero .reveal-text)');
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
            const priceCards = document.querySelectorAll('.price-card');
            priceCards.forEach((card, i) => {
                gsap.from(card, {
                    y: 100, opacity: 0, duration: 1, delay: i * 0.15, ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
                });
            });
        } catch (e) {
            console.warn('Price cards failed:', e);
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
                    const rotateX = (y - centerY) / centerY * -3;
                    const rotateY = (x - centerX) / centerX * 3;
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
            const toggleSwitch = document.querySelector('[data-toggle]');
            if (toggleSwitch) {
                let isYearly = true;
                toggleSwitch.classList.add('toggle-switch--active');

                toggleSwitch.addEventListener('click', () => {
                    isYearly = !isYearly;
                    toggleSwitch.classList.toggle('toggle-switch--active');

                    const amounts = document.querySelectorAll('.plan-amount');
                    amounts.forEach(amount => {
                        const card = amount.closest('.plan-price');
                        const newVal = isYearly ? card.getAttribute('data-yearly') : card.getAttribute('data-monthly');
                        
                        gsap.fromTo(amount, 
                            { y: -20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', onStart: () => {
                                amount.textContent = parseInt(newVal).toLocaleString();
                            }}
                        );
                    });
                });
            }
        } catch (e) {
            console.warn('Toggle failed:', e);
        }

        try {
            const floats = document.querySelectorAll('.price-float');
            floats.forEach((float, i) => {
                gsap.to(float, {
                    y: () => (i % 2 === 0 ? 15 : -15),
                    duration: 2 + i * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
        } catch (e) {
            console.warn('Float animation failed:', e);
        }

        try {
            const offerBadge = document.querySelector('.offer-badge-circle');
            if (offerBadge) {
                gsap.to(offerBadge, {
                    rotate: 360,
                    duration: 20,
                    repeat: -1,
                    ease: 'none'
                });

                gsap.from(offerBadge, {
                    scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.7)',
                    immediateRender: false,
                    scrollTrigger: { trigger: '.price-offer', start: 'top 75%', toggleActions: 'play none none none' }
                });
            }
        } catch (e) {
            console.warn('Offer badge failed:', e);
        }

        try {
            const compareRows = document.querySelectorAll('.compare-table tbody tr');
            compareRows.forEach((row, i) => {
                gsap.from(row, {
                    x: -30, opacity: 0, duration: 0.6, delay: i * 0.05, ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: { trigger: '.compare-table', start: 'top 80%', toggleActions: 'play none none none' }
                });
            });
        } catch (e) {
            console.warn('Compare table failed:', e);
        }

        try {
            const faqItems = document.querySelectorAll('.price-faq-item');
            faqItems.forEach((item, i) => {
                gsap.from(item, {
                    y: 40, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
                });
            });
        } catch (e) {
            console.warn('FAQ items failed:', e);
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
