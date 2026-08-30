// PROJECT 9 - Custom NLP Model Training Platform
(function() {
    'use strict';

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

    // CURSOR
    const cursor = document.querySelector('[data-cursor]');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');
    const cursorLabel = cursor?.querySelector('.cursor-label');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('[data-magnetic], a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) { cursorRing.style.width = '55px'; cursorRing.style.height = '55px'; }
            if (cursorLabel) cursorLabel.style.opacity = '1';
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) { cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; }
            if (cursorLabel) cursorLabel.style.opacity = '0';
        });
    });

    function revealHero() {
        document.querySelectorAll('.p-title-word').forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), i * 120);
        });
        setTimeout(() => {
            document.querySelectorAll('.p-hero-desc, .p-hero-metrics').forEach(el => el.classList.add('revealed'));
        }, 600);
    }

    const revealElements = document.querySelectorAll('[data-reveal], [data-tech], [data-visual], [data-step]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed', 'active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0, 0)'; });
    });

    // Pipeline steps stagger
    const steps = document.querySelectorAll('[data-step]');
    if ('IntersectionObserver' in window) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, i * 200);
                    stepObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        steps.forEach(step => stepObserver.observe(step));
    }

    setTimeout(updateLoader, 300);

})();
