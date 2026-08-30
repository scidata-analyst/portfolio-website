// PROJECT 1 - ChatBot NLP Engine
// Custom cursor, scroll reveals, loader, magnetic buttons

(function() {
    'use strict';

    // LOADER
    let loaderProgress = 0;
    const loaderNum = document.querySelector('[data-loader-num]');
    const loaderFill = document.querySelector('.loader-fill');
    const loader = document.querySelector('.loader');

    function updateLoader() {
        loaderProgress += Math.random() * 15;
        if (loaderProgress >= 100) {
            loaderProgress = 100;
            if (loaderNum) loaderNum.textContent = '100';
            if (loaderFill) loaderFill.style.width = '100%';
            setTimeout(() => {
                if (loader) loader.classList.add('loaded');
                revealHero();
            }, 500);
        } else {
            if (loaderNum) loaderNum.textContent = Math.floor(loaderProgress);
            if (loaderFill) loaderFill.style.width = loaderProgress + '%';
            setTimeout(updateLoader, 100 + Math.random() * 200);
        }
    }

    // CUSTOM CURSOR
    const cursor = document.querySelector('[data-cursor]');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');
    const cursorLabel = cursor?.querySelector('.cursor-label');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor label on hover
    document.querySelectorAll('[data-magnetic], a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) { cursorRing.style.width = '60px'; cursorRing.style.height = '60px'; }
            if (cursorLabel) cursorLabel.style.opacity = '1';
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) { cursorRing.style.width = '40px'; cursorRing.style.height = '40px'; }
            if (cursorLabel) cursorLabel.style.opacity = '0';
        });
    });

    // HERO REVEAL
    function revealHero() {
        document.querySelectorAll('[data-reveal]').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
                if (el.classList.contains('p-title-word')) {
                    el.classList.add('revealed');
                }
            }, i * 100);
        });
    }

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll('[data-reveal], [data-feature], [data-tech], [data-visual]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed', 'active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // MAGNETIC BUTTONS
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // GSAP ScrollTrigger animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Visual container animation
        const visual = document.querySelector('.p-visual');
        if (visual) {
            ScrollTrigger.create({
                trigger: '.p-showcase-trigger',
                start: 'top bottom',
                end: 'bottom top',
                onEnter: () => visual.classList.add('active'),
                onLeaveBack: () => visual.classList.remove('active')
            });
        }
    }

    // Start loader
    setTimeout(updateLoader, 300);

})();
