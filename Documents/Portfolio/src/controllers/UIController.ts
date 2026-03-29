// ═══════════════════════════════════════════════════════════════
// UI CONTROLLER
// - Custom wand cursor + gold trail
// - Floating Great Hall candles
// - Ambient magical orbs
// - Nav hide/show + mobile menu
// - Hover cursor enlargement
// - Contact form with spell notification
// - Lightning flashes
// ═══════════════════════════════════════════════════════════════

import gsap from 'gsap';

export class UIController {
    private cursor: HTMLElement | null;
    private trailContainer: HTMLElement | null;
    private nav: HTMLElement | null;
    private lastScrollY: number = 0;
    private trailTimer: number = 0;

    constructor() {
        this.cursor       = document.getElementById('custom-cursor');
        this.trailContainer = document.getElementById('cursor-trail');
        this.nav          = document.getElementById('main-nav');
    }

    public init() {
        this.setupCursor();
        this.setupCandles();
        this.setupOrbs();
        this.setupNav();
        this.setupForm();
        this.setupLightning();
        this.setupHoverEffects();
        this.scheduleLightning();
    }

    // ────────────────────────────────────────────────────────────
    // CUSTOM CURSOR + TRAIL
    // ────────────────────────────────────────────────────────────
    private setupCursor() {
        if (!this.cursor) return;

        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.12,
                ease: 'power2.out',
            });

            this.spawnTrailDot(e.clientX, e.clientY);
        });

        document.addEventListener('mouseleave', () => {
            gsap.to(this.cursor, { opacity: 0, duration: 0.3 });
        });

        document.addEventListener('mouseenter', () => {
            gsap.to(this.cursor, { opacity: 1, duration: 0.3 });
        });
    }

    private spawnTrailDot(x: number, y: number) {
        if (!this.trailContainer) return;

        // Rate-limit trail dots
        this.trailTimer++;
        if (this.trailTimer % 3 !== 0) return;

        const size = 4 + Math.random() * 5;
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${x}px; top: ${y}px;
            background: hsl(${42 + Math.random() * 20}, 90%, ${60 + Math.random() * 20}%);
            box-shadow: 0 0 ${size * 2}px rgba(240,199,94,0.6);
        `;
        this.trailContainer.appendChild(dot);

        gsap.to(dot, {
            opacity: 0,
            scale: 0,
            x: (Math.random() - 0.5) * 20,
            y: -15 - Math.random() * 20,
            duration: 0.55 + Math.random() * 0.2,
            ease: 'power2.out',
            onComplete: () => dot.remove(),
        });
    }

    // ────────────────────────────────────────────────────────────
    // FLOATING CANDLES (Great Hall style)
    // ────────────────────────────────────────────────────────────
    private setupCandles() {
        const layer = document.getElementById('candles-layer');
        if (!layer) return;

        const CANDLE_COUNT = 28;

        for (let i = 0; i < CANDLE_COUNT; i++) {
            setTimeout(() => this.spawnCandle(layer), Math.random() * 6000);
        }
    }

    private spawnCandle(layer: HTMLElement) {
        const candle = document.createElement('div');
        candle.className = 'candle';

        const x    = Math.random() * 100;
        const dur  = 14 + Math.random() * 18; // seconds to float up
        const size = 0.6 + Math.random() * 0.6;

        candle.innerHTML = `
            <div class="candle-flame"></div>
            <div class="candle-body"></div>
            <div class="candle-drip"></div>
        `;

        candle.style.cssText = `
            left: ${x}%;
            animation-duration: ${dur}s;
            animation-delay: ${Math.random() * -dur}s;
            transform: scale(${size});
            opacity: 0;
        `;

        layer.appendChild(candle);

        // Restart after it exits viewport
        setTimeout(() => {
            candle.remove();
            this.spawnCandle(layer);
        }, dur * 1000 + 1000);
    }

    // ────────────────────────────────────────────────────────────
    // AMBIENT MAGICAL ORBS
    // ────────────────────────────────────────────────────────────
    private setupOrbs() {
        const layer = document.getElementById('orbs-layer');
        if (!layer) return;

        const ORB_COUNT = 12;
        const COLOURS   = ['rgba(240,199,94,0.5)', 'rgba(107,70,193,0.4)', 'rgba(255,215,0,0.4)', 'rgba(180,130,255,0.3)'];

        for (let i = 0; i < ORB_COUNT; i++) {
            const orb  = document.createElement('div');
            orb.className = 'magic-orb';

            const size = 60 + Math.random() * 120;
            const x    = Math.random() * 100;
            const y    = Math.random() * 100;
            const dur  = 8 + Math.random() * 12;
            const col  = COLOURS[Math.floor(Math.random() * COLOURS.length)];

            orb.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${x}%; top: ${y}%;
                background: radial-gradient(circle, ${col} 0%, transparent 70%);
                animation-duration: ${dur}s;
                animation-delay: ${-Math.random() * dur}s;
            `;

            layer.appendChild(orb);
        }
    }

    // ────────────────────────────────────────────────────────────
    // NAVIGATION
    // ────────────────────────────────────────────────────────────
    private setupNav() {
        // Hide/show on scroll
        window.addEventListener('scroll', () => {
            const current = window.scrollY;

            if (!this.nav) return;

            if (current > 80) {
                this.nav.classList.add('nav-scrolled');
            } else {
                this.nav.classList.remove('nav-scrolled');
            }

            if (current > this.lastScrollY + 5 && current > 200) {
                this.nav.classList.add('hidden');
            } else if (current < this.lastScrollY - 5) {
                this.nav.classList.remove('hidden');
            }

            this.lastScrollY = current;
        }, { passive: true });

        // Smooth scroll on nav links
        document.querySelectorAll('.nav-menu a, .hero-btn, .scroll-indicator').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = (link as HTMLAnchorElement).getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu
                    document.querySelector('.nav-menu')?.classList.remove('open');
                }
            });
        });

        // Active link tracking
        const sections  = document.querySelectorAll('.scene-section');
        const navLinks  = document.querySelectorAll('.nav-menu a');
        const observer  = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');
                navLinks.forEach((a) => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            });
        }, { threshold: 0.4 });

        sections.forEach((s) => observer.observe(s));

        // Mobile toggle
        const toggle  = document.getElementById('nav-toggle');
        const menu    = document.querySelector('.nav-menu');
        toggle?.addEventListener('click', () => {
            menu?.classList.toggle('open');
        });
    }

    // ────────────────────────────────────────────────────────────
    // CONTACT FORM
    // ────────────────────────────────────────────────────────────
    private setupForm() {
        const form = document.getElementById('contact-form') as HTMLFormElement | null;
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showSpellNotification('🦉 Your owl has been dispatched!', 'success');
            form.reset();
        });
    }

    private showSpellNotification(message: string, _type: 'success' | 'error' = 'success') {
        const notif = document.createElement('div');
        notif.className = 'spell-notification';
        notif.innerHTML = `<span class="notif-icon">✨</span><span>${message}</span>`;
        document.body.appendChild(notif);

        gsap.fromTo(notif,
            { x: 380, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );

        setTimeout(() => {
            gsap.to(notif, {
                x: 380, opacity: 0, duration: 0.45, ease: 'back.in(1.7)',
                onComplete: () => notif.remove(),
            });
        }, 3500);
    }

    // ────────────────────────────────────────────────────────────
    // HOVER EFFECTS — cursor state changes
    // ────────────────────────────────────────────────────────────
    private setupHoverEffects() {
        const interactives = document.querySelectorAll(
            'a, button, .project-card, .contact-method, .spell-tag, .timeline-card'
        );

        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.cursor?.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor?.classList.remove('cursor-hover');
            });
        });
    }

    // ────────────────────────────────────────────────────────────
    // LIGHTNING EFFECT (hero section)
    // ────────────────────────────────────────────────────────────
    private setupLightning() {
        const lightning = document.getElementById('hero-lightning');
        if (!lightning) return;

        for (let i = 0; i < 3; i++) {
            const bolt = document.createElement('div');
            bolt.className = 'lightning-bolt';
            bolt.style.cssText = `
                position: absolute;
                top: 0;
                left: ${30 + Math.random() * 40}%;
                width: ${1 + Math.random()}px;
                height: ${80 + Math.random() * 100}px;
                background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,199,94,0.4) 60%, transparent 100%);
                opacity: 0;
                border-radius: 1px;
                animation-delay: ${i * 2.5}s;
            `;
            lightning.appendChild(bolt);
        }
    }

    private scheduleLightning() {
        const bolts = document.querySelectorAll<HTMLElement>('.lightning-bolt');
        if (!bolts.length) return;

        const flash = () => {
            const bolt = bolts[Math.floor(Math.random() * bolts.length)];
            const tl = gsap.timeline();
            tl.to(bolt, { opacity: 1, duration: 0.05 })
              .to(bolt, { opacity: 0.2, duration: 0.05 })
              .to(bolt, { opacity: 0.9, duration: 0.04 })
              .to(bolt, { opacity: 0, duration: 0.15 });

            setTimeout(flash, 5000 + Math.random() * 12000);
        };

        setTimeout(flash, 3000 + Math.random() * 5000);
    }
}
