document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER LOGIC (Unchanged) ---
    const preloader = document.getElementById('preloader');
    const preloaderBox = document.querySelector('.preloader-box');
    const scanline = document.querySelector('.scanline');
    const heroContent = document.querySelector('.hero-content');
    
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // GSAP Timeline for a controlled animation sequence
    const preloaderTl = gsap.timeline({
        // This function runs once the timeline is complete
        onComplete: () => {
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
            // Start observing sections ONLY after the preloader is done
            initScrollAnimations();
        }
    });

    // --- Animation Sequence ---

    preloaderTl
        // 1. Animate the preloader box into view
        .to(preloaderBox, { 
            opacity: 1, 
            duration: 0.5 
        })
        
        // 2. Animate the text elements inside the box
        .from(preloaderBox.children, { 
            y: 20, 
            opacity: 0, 
            stagger: 0.2, 
            duration: 0.5 
        })
        
        // 3. Animate the scanline effect
        .to(scanline, { 
            y: '100vh', 
            duration: 1.5, 
            ease: 'power2.inOut' 
        }, "-=1") // Overlap this animation with the previous one
        
        // 4. Fade out the entire preloader
        .to(preloader, { 
            opacity: 0, 
            duration: 0.8, 
            delay: 0.5 
        })
        
        // 5. Hide the preloader from the layout completely
        .set(preloader, { 
            display: 'none' 
        })
        
        // 6. Animate the hero content into view for a seamless transition
        .to(heroContent, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        }, "-=0.5"); // Start this animation slightly before the preloader is fully gone


    // --- NEW: SCROLL-TRIGGERED ANIMATIONS ---
    function initScrollAnimations() {
        const sectionsToAnimate = document.querySelectorAll('.animate-section');
        
        // Configuration for the observer
        const observerOptions = {
            root: null, // observes intersections relative to the viewport
            rootMargin: '0px',
            threshold: 0.2 // Animate when 20% of the element is visible
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    
                    // Specific animations based on the section's ID
                    if (section.id === 'word-of-the-day') {
                        gsap.to(section.querySelector('.wod-title'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        gsap.to(section.querySelector('.wod-definition'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
                    }
                    
                    if (section.id === 'cool-stuff') {
                        gsap.to(section.querySelector('h2'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        // Stagger the cards for a beautiful cascading effect
                        gsap.to(section.querySelectorAll('.card'), {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.2, // Each card animates 0.2s after the previous one
                            ease: 'power2.out',
                            delay: 0.3 // Start after the heading has animated
                        });
                    }

                    if (section.id === 'footer') {
                        gsap.to(section.querySelector('.cli-line'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                        gsap.to(section.querySelector('.footer-links'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
                        gsap.to(section.querySelector('.footer-disclaimer'), { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
                    }

                    // Stop observing the element after it has been animated
                    observer.unobserve(section);
                }
            });
        }, observerOptions);

        // Tell the observer to watch each of our sections
        sectionsToAnimate.forEach(section => {
            sectionObserver.observe(section);
        });
    }
});