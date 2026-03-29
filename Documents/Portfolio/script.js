// ============================================
// MAGICAL PORTFOLIO - JAVASCRIPT
// Interactive Elements & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Magical Particles Generation
    // ============================================
    createMagicalParticles();

    // ============================================
    // Smooth Scrolling for Navigation
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // Scroll Animations for Elements
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.magical-card, .project-card, .skill-category'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Create magical success message
            showMagicalNotification('Your owl has been sent! ✨');

            // Reset form
            contactForm.reset();
        });
    }

    // ============================================
    // Skill Bar Animations
    // ============================================
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';

                setTimeout(() => {
                    bar.style.width = width;
                }, 100);

                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ============================================
    // Parallax Effect for Hogwarts Castle
    // ============================================
    const castle = document.querySelector('.hogwarts-castle');

    if (castle) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            castle.style.transform = `translateX(-50%) translateY(${rate}px)`;
        });
    }

    // ============================================
    // Interactive Project Cards
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            createSparkles(e.currentTarget);
        });
    });

    // ============================================
    // Cursor Trail Effect (Optional)
    // ============================================
    let cursorTrail = [];
    const maxTrailLength = 10;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) { // Only on desktop
            createCursorSparkle(e.clientX, e.clientY);
        }
    });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create magical floating particles
 */
function createMagicalParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(240, 199, 94, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

/**
 * Create sparkle effect on element
 */
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--hufflepuff-gold);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * rect.width}px;
            top: ${Math.random() * rect.height}px;
            animation: sparkleFloat 1s ease-out forwards;
            box-shadow: 0 0 10px var(--hufflepuff-gold);
        `;

        element.style.position = 'relative';
        element.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
}

/**
 * Create cursor sparkle effect
 */
function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--hufflepuff-gold);
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        z-index: 9999;
        animation: cursorSparkle 0.8s ease-out forwards;
        box-shadow: 0 0 10px var(--hufflepuff-gold);
    `;

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

/**
 * Show magical notification
 */
function showMagicalNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'magical-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--hufflepuff-gold), var(--hufflepuff-yellow));
        color: var(--hufflepuff-black);
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: var(--font-heading);
        font-size: 1.1rem;
        box-shadow: 0 4px 20px rgba(240, 199, 94, 0.6);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out, slideOutRight 0.5s ease-out 2.5s forwards;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// CSS ANIMATIONS (Added dynamically)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
        }
    }
    
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes cursorSparkle {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .nav-link.active {
        color: var(--hufflepuff-gold);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
