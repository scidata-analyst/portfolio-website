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

            const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .solution-card, .stat-item');
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
                const heroEls = document.querySelectorAll('.innovation-hero .reveal-text');
                gsap.set(heroEls, { opacity: 0, y: 60 });

                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                heroTl
                    .fromTo('.innovation-hero .hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                    .fromTo('.innovation-hero .hero-title-line', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, '-=0.5')
                    .fromTo('.innovation-hero .hero-description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
                    .fromTo('.innovation-hero .hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
                    .fromTo('.innovation-hero .hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
                    .fromTo('.innovation-hero .hero-particle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1');
            } catch (e) {
                forceRevealAll();
            }
        }

        try {
            const revealEls = document.querySelectorAll('.reveal-text:not(.innovation-hero .reveal-text)');
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
            gsap.to('.innovation-hero .hero-bg-text', {
                y: 200,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.innovation-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        } catch (e) {
            console.warn('Parallax failed:', e);
        }

        try {
            const heroTitle = document.querySelector('.innovation-hero .hero-title');
            if (heroTitle) {
                gsap.fromTo(heroTitle.children, 
                    { y: 0 },
                    {
                        y: -100,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: '.innovation-hero',
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
            const solutionsTrack = document.querySelector('[data-horizontal-scroll]');
            if (solutionsTrack) {
                const panels = gsap.utils.toArray('.solution-panel');
                gsap.to(panels, {
                    x: () => -(solutionsTrack.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.solutions-horizontal',
                        pin: true,
                        scrub: 1,
                        end: () => '+=' + (solutionsTrack.scrollWidth - window.innerWidth),
                        invalidateOnRefresh: true
                    }
                });

                const solutionCards = document.querySelectorAll('.solution-card');
                solutionCards.forEach(card => {
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -10, duration: 0.4, ease: 'power2.out' });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
                    });
                });
            }
        } catch (e) {
            console.warn('Horizontal scroll failed:', e);
        }

        try {
            const counters = document.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                gsap.fromTo(counter, { innerText: 0 }, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: counter,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        } catch (e) {
            console.warn('Counter animation failed:', e);
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
            const microEls = document.querySelectorAll('.solution-card, .stat-item');
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
