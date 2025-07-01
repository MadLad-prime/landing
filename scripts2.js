document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER LOGIC (Refactored) ---
    const preloader = document.getElementById('preloader');
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = 'auto';
            initScrollAnimations();
        }
    });
    preloaderTl
        .to(preloader.querySelector('.preloader-box'), { opacity: 1, duration: 0.5 })
        .from(preloader.querySelectorAll('.preloader-box > *'), { y: 20, opacity: 0, stagger: 0.2, duration: 0.5 })
        .to(preloader.querySelector('.scanline'), { y: '100vh', duration: 1.5, ease: 'power2.inOut' }, "-=1")
        .to(preloader, { opacity: 0, duration: 0.8, delay: 0.5 })
        .set(preloader, { display: 'none' })
        .to(document.querySelector('.hero-content'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.5");


    // --- SCROLL-TRIGGERED ANIMATIONS (Unchanged) ---
    function initScrollAnimations() {
        const sectionsToAnimate = document.querySelectorAll('.animate-section');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    if (section.id === 'word-of-the-day') {
                        gsap.to(section.querySelector('.wod-title'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        gsap.to(section.querySelector('.wod-definition'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
                    }
                    if (section.id === 'cool-stuff') {
                        gsap.to(section.querySelector('h2'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        gsap.to(section.querySelectorAll('.card'), {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.2,
                            ease: 'power2.out',
                            delay: 0.3
                        });
                    }
                    if (section.id === 'footer') {
                        gsap.to(section.querySelector('.cli-line'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        gsap.to(section.querySelector('.footer-links'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
                        gsap.to(section.querySelector('.footer-disclaimer'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
                    }
                    observer.unobserve(section);
                }
            });
        }, observerOptions);
        sectionsToAnimate.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // --- NEW: INTERACTIVE CARD & FOOTER LOGIC ---

    // 1. Interactive Card Glow Effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Footer Command Typing Effect
    const cliCommand = document.querySelector('.cli-command');
    const cliCursor = document.querySelector('.cli-cursor');
    const footerLinks = document.querySelector('.footer-links');
    const commandText = 'get_socials';
    let i = 0;

    function typeCommand() {
        if (i < commandText.length) {
            cliCommand.textContent += commandText.charAt(i);
            i++;
            setTimeout(typeCommand, 150);
        } else {
            cliCursor.style.animation = 'none';
            cliCursor.style.opacity = 0;
            gsap.to(footerLinks, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 });
            gsap.to('.footer-disclaimer', { opacity: 1, y: 0, duration: 0.5, delay: 0.7 });
        }
    }
    
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeCommand, 1000);
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    footerObserver.observe(document.getElementById('footer'));

});