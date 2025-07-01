document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');
    
    // Check if preloader exists to prevent errors
    if (preloader) {
        const preloaderBox = preloader.querySelector('.preloader-box');
        const scanline = preloader.querySelector('.scanline');
        const heroSection = document.getElementById('hero');
        
        document.body.style.overflow = 'hidden';

        const preloaderTl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = 'auto';
                // Start observing sections only after the preloader is done
                initScrollAnimations();
                initGeminiCanvas(); // <<<--- Initialize our new canvas animation
            }
        });

        preloaderTl
            .to(preloaderBox, { opacity: 1, duration: 0.5 })
            .from(preloader.querySelectorAll('.preloader-box > *'), { y: 20, opacity: 0, stagger: 0.2, duration: 0.5 })
            .to(scanline, { y: '100vh', duration: 1.5, ease: 'power2.inOut' }, "-=1")
            .to(preloader, { opacity: 0, duration: 0.8, delay: 0.5 })
            .set(preloader, { display: 'none' })
            .to(heroSection, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "-=0.5");
    } else {
        // If no preloader, just run the scroll animations
        initScrollAnimations();
        initGeminiCanvas(); // <<<--- Also initialize if there's no preloader
    }


    // --- SCROLL-TRIGGERED ANIMATIONS ---
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // A bit earlier trigger
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- NEW: GEMINI 2.5 CANVAS ANIMATION ---
    function initGeminiCanvas() {
        const canvas = document.getElementById('gemini-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // Mouse position
        const mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 120) * (canvas.width / 120) // Responsive mouse radius
        };

        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(0, 127, 255, 0.8)'; // Azure
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Mouse collision detection
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 5;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 5;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 5;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 5;
                    }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Create particle array
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(0, 127, 255, 0.8)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Connect particles with lines
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                 ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(168, 178, 209, ${opacityValue})`; // Light Slate with opacity
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Resize event
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            mouse.radius = (canvas.height / 120) * (canvas.width / 120);
            init();
        });

        init();
        animate();
    }
});