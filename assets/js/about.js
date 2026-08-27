(function() {
    'use strict';

    // ============================================
    // GLOBAL ERROR HANDLER
    // ============================================
    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('about.js')) {
            console.warn('About.js error caught:', e.message);
            forceRevealAll();
        }
    });

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

    // ============================================
    // CHECK GSAP AVAILABILITY
    // ============================================
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Using static content.');
        document.body.style.visibility = 'visible';
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
        return;
    }

    try {
        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add('js-ready');
        document.body.style.visibility = 'visible';

        // ============================================
        // CUSTOM CURSOR
        // ============================================
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

            const hoverTargets = document.querySelectorAll('a, button, .btn-magnetic, [data-magnetic], .story-card, .value-card, .capability-item, .testimonial-card');
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
        // LOADER ANIMATION
        // ============================================
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
                console.warn('Loader animation failed:', e);
                gsap.set('.loader', { display: 'none' });
                revealHero();
            }
        }

        if (document.readyState === 'complete') {
            runLoader();
        } else {
            window.addEventListener('load', runLoader);
        }

        // ============================================
        // HERO REVEAL
        // ============================================
        function revealHero() {
            try {
                const heroEls = document.querySelectorAll('.about-hero .reveal-text');
                gsap.set(heroEls, { opacity: 0, y: 60 });

                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                heroTl
                    .fromTo('.about-hero .hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                    .fromTo('.about-hero .hero-title-line', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, '-=0.5')
                    .fromTo('.about-hero .hero-description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
                    .fromTo('.about-hero .hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
                    .fromTo('.about-hero .hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
                    .fromTo('.about-hero .hero-particle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1');
            } catch (e) {
                console.warn('Hero reveal failed:', e);
                forceRevealAll();
            }
        }

        // ============================================
        // SCROLL REVEAL ANIMATIONS
        // ============================================
        try {
            const revealEls = document.querySelectorAll('.reveal-text:not(.about-hero .reveal-text)');
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
            console.warn('Scroll reveal animations failed:', e);
        }

        // ============================================
        // PARALLAX BACKGROUND TEXT
        // ============================================
        try {
            gsap.to('.about-hero .hero-bg-text', {
                y: 200,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.about-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        } catch (e) {
            console.warn('Parallax animation failed:', e);
        }

        // ============================================
        // SCROLL-BASED TYPOGRAPHY
        // ============================================
        try {
            const heroTitle = document.querySelector('.about-hero .hero-title');
            if (heroTitle) {
                gsap.fromTo(heroTitle.children, 
                    { y: 0 },
                    {
                        y: -100,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: '.about-hero',
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

        // ============================================
        // HORIZONTAL SCROLL - STORY TIMELINE
        // ============================================
        try {
            const storyTrack = document.querySelector('[data-horizontal-scroll]');
            if (storyTrack) {
                const panels = gsap.utils.toArray('.story-panel');
                gsap.to(panels, {
                    x: () => -(storyTrack.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.story-horizontal',
                        pin: true,
                        scrub: 1,
                        end: () => '+=' + (storyTrack.scrollWidth - window.innerWidth),
                        invalidateOnRefresh: true
                    }
                });

                const storyCards = document.querySelectorAll('.story-card');
                storyCards.forEach(card => {
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

        // ============================================
        // HORIZONTAL SCROLL - TESTIMONIALS
        // ============================================
        try {
            const testimonialsTrack = document.querySelector('.testimonials-track');
            if (testimonialsTrack) {
                const testimonialPanels = gsap.utils.toArray('.testimonial-panel');
                gsap.to(testimonialPanels, {
                    x: () => -(testimonialsTrack.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.testimonials',
                        pin: true,
                        scrub: 1,
                        end: () => '+=' + (testimonialsTrack.scrollWidth - window.innerWidth),
                        invalidateOnRefresh: true
                    }
                });
            }
        } catch (e) {
            console.warn('Testimonials scroll failed:', e);
        }

        // ============================================
        // STICKY STORYTELLING - VALUES
        // ============================================
        try {
            const valueCards = document.querySelectorAll('.value-card');
            valueCards.forEach((card, i) => {
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
                    }
                });
            });
        } catch (e) {
            console.warn('Value cards animation failed:', e);
        }

        // ============================================
        // CAPABILITY ITEMS ANIMATION
        // ============================================
        try {
            const capabilityItems = document.querySelectorAll('.capability-item');
            capabilityItems.forEach((item, i) => {
                gsap.from(item, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        } catch (e) {
            console.warn('Capability items animation failed:', e);
        }

        // ============================================
        // COUNTER ANIMATION
        // ============================================
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

        // ============================================
        // TEXT DISTORTION ON HOVER
        // ============================================
        try {
            const distortTargets = document.querySelectorAll('.capability-name, .value-name, .story-name');
            distortTargets.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    gsap.to(el, { skewX: -3, duration: 0.3, ease: 'power2.out' });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, { skewX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                });
            });
        } catch (e) {
            console.warn('Text distortion failed:', e);
        }

        // ============================================
        // TILT EFFECT FOR VALUE CARDS
        // ============================================
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

        // ============================================
        // MANIFESTO KINETIC TYPOGRAPHY
        // ============================================
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

        // ============================================
        // PHILOSOPHY TEXT REVEAL
        // ============================================
        try {
            const philosophyLines = document.querySelectorAll('.philosophy-line');
            philosophyLines.forEach((line, i) => {
                gsap.from(line, {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: '.philosophy',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.15
                });
            });
        } catch (e) {
            console.warn('Philosophy animation failed:', e);
        }

        // ============================================
        // SECTION HEADER ANIMATIONS
        // ============================================
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
            console.warn('Section headers animation failed:', e);
        }

        // ============================================
        // MICRO-INTERACTIONS
        // ============================================
        try {
            const microEls = document.querySelectorAll('.story-card, .value-card, .capability-item, .testimonial-card');
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
