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

            const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .info-card, .contact-form');
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
                const heroEls = document.querySelectorAll('.contact-hero .reveal-text');
                gsap.set(heroEls, { opacity: 0, y: 60 });

                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                heroTl
                    .fromTo('.contact-hero .hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                    .fromTo('.contact-hero .hero-title-line', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, '-=0.5')
                    .fromTo('.contact-hero .hero-description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
                    .fromTo('.contact-hero .hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
                    .fromTo('.contact-hero .deco-circle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1');
            } catch (e) {
                forceRevealAll();
            }
        }

        try {
            const revealEls = document.querySelectorAll('.reveal-text:not(.contact-hero .reveal-text)');
            revealEls.forEach(el => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        } catch (e) {
            console.warn('Scroll reveal failed:', e);
        }

        try {
            gsap.to('.contact-hero .hero-bg-text', {
                y: 200,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.contact-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        } catch (e) {
            console.warn('Parallax failed:', e);
        }

        try {
            const heroTitle = document.querySelector('.contact-hero .hero-title');
            if (heroTitle) {
                gsap.fromTo(heroTitle.children, 
                    { y: 0 },
                    {
                        y: -100,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: '.contact-hero',
                            start: 'top top',
                            end: 'bottom top',
                            scrub: 1
                        }
                    }
                );
            }
        } catch (e) {
            console.warn('Scroll typography failed:', e);
        }

        try {
            const manifestoWords = document.querySelectorAll('.manifesto-word');
            manifestoWords.forEach((word, i) => {
                gsap.from(word, {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: '.manifesto',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.1
                });
            });
        } catch (e) {
            console.warn('Manifesto animation failed:', e);
        }

        try {
            const infoCards = document.querySelectorAll('.info-card');
            infoCards.forEach((card, i) => {
                gsap.from(card, {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.15
                });
            });
        } catch (e) {
            console.warn('Info cards animation failed:', e);
        }

        try {
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
        } catch (e) {
            console.warn('Tilt effect failed:', e);
        }

        try {
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
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    });
                }
                
                if (title) {
                    gsap.from(title, {
                        y: 60,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    });
                }
            });
        } catch (e) {
            console.warn('Section headers failed:', e);
        }

        try {
            const microEls = document.querySelectorAll('.info-card, .contact-form');
            microEls.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    gsap.to(el, { y: -8, duration: 0.4, ease: 'power2.out' });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, { y: 0, duration: 0.4, ease: 'power2.out' });
                });
            });
        } catch (e) {
            console.warn('Micro-interactions failed:', e);
        }

        if ('ontouchstart' in window) {
            if (cursor) cursor.style.display = 'none';
            if (cursorFollower) cursorFollower.style.display = 'none';
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                try {
                    ScrollTrigger.refresh();
                } catch (e) {
                    console.warn('ScrollTrigger refresh failed:', e);
                }
            }, 250);
        });

    } catch (e) {
        console.error('GSAP initialization error:', e);
        forceRevealAll();
    }

})();
