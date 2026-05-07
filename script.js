// Scroll Reset & Loader
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 600);
});

gsap.registerPlugin(ScrollTrigger);

// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


let splitTypes;

let resizeTimeout;

function runSplit() {
    // Check for mobile - Disable split animation if < 768px
    if (window.innerWidth <= 768) {
        if (splitTypes) splitTypes.revert();
        return;
    }

    // 1. Target key text elements
    splitTypes = new SplitType('.hero-title, .section-title, .product-desc, .big-statement, .hero-subtitle, .alchemy-title, .alchemy-subtitle, .alchemy-card-title, .alchemy-card-desc', {
        types: 'lines, words'
    });

    // 2. Animate each element's lines
    document.querySelectorAll('.hero-title, .section-title, .product-desc, .big-statement, .hero-subtitle, .alchemy-title, .alchemy-subtitle, .alchemy-card-title, .alchemy-card-desc').forEach((char, i) => {
        const lines = char.querySelectorAll('.line');

        // Ensure lines are ready for reveal animation (hidden initially)
        gsap.set(lines, {
            yPercent: 100,
            opacity: 0
        });

        // Add delay for secondary text to create sequential effect
        let delay = 0;
        if (char.classList.contains('product-desc') || char.classList.contains('hero-subtitle') || char.classList.contains('alchemy-card-desc') || char.classList.contains('alchemy-subtitle')) {
            delay = 0.3;
        }

        gsap.to(lines, {
            scrollTrigger: {
                trigger: char,
                start: 'top 80%',
                end: 'bottom 80%',
                toggleActions: 'play none none none'
            },
            yPercent: 0,
            opacity: 1,
            duration: 1,
            delay: delay,
            ease: 'power4.out',
            stagger: 0.1
        });
    });
}

runSplit();

// Handle Resize with Loader
window.addEventListener('resize', () => {
    // Show loader while resizing/resetting to hide layout shifts
    const loader = document.getElementById('loader');
    loader.classList.remove('loader-hidden');

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Revert split first
        if (splitTypes) splitTypes.revert();
        ScrollTrigger.refresh();

        // Re-run split (will check width inside)
        runSplit();

        // Hide loader after setting up
        setTimeout(() => {
            loader.classList.add('loader-hidden');
        }, 500);
    }, 500); // Wait for resize to settle
});
