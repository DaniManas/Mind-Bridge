// ═══════════════════════════════════════════════════════════════
// SCROLL CONTROLLER
// GSAP ScrollTrigger — section reveals, skill bars,
// timeline items, project cards, stagger animations
// ═══════════════════════════════════════════════════════════════

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneManager } from '../scenes/SceneManager';

gsap.registerPlugin(ScrollTrigger);

export class ScrollController {
    constructor(_sceneManager: SceneManager) {
        // sceneManager reserved for future 3D scene-switch integration
    }

    public init() {
        this.scrollProgress();
        this.heroReveal();
        this.sectionReveal();
        this.timelineReveal();
        this.projectCards();
        this.skillChapters();
        this.languageBars();
        this.contactReveal();
        this.sectionBackgrounds();
    }

    // ────────────────────────────────────────────────────────────
    // SCROLL PROGRESS BAR
    // ────────────────────────────────────────────────────────────
    private scrollProgress() {
        const bar = document.querySelector('#scroll-progress .progress-bar') as HTMLElement;
        if (!bar) return;

        gsap.to(bar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
            },
        });
    }

    // ────────────────────────────────────────────────────────────
    // HERO ENTRY (no scroll trigger — just entrance animations)
    // ────────────────────────────────────────────────────────────
    private heroReveal() {
        // The CSS handles entrance animations via keyframes.
        // We use JS only for dynamic elements spawned later.
        const entrance = document.getElementById('entrance');
        if (!entrance) return;

        // Parallax: hero castle silhouette shifts on scroll
        gsap.to('.hero-castle-silhouette', {
            y: 80,
            ease: 'none',
            scrollTrigger: {
                trigger: '#entrance',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Hero content fades out as user scrolls past
        gsap.to('.entrance-content', {
            opacity: 0,
            y: -40,
            ease: 'none',
            scrollTrigger: {
                trigger: '#entrance',
                start: 'center top',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // ────────────────────────────────────────────────────────────
    // SECTION CONTENT REVEAL (About, Skills, Contact cards)
    // ────────────────────────────────────────────────────────────
    private sectionReveal() {
        const sections = ['#about', '#experience', '#projects', '#skills', '#contact'];

        sections.forEach((sel) => {
            const el = document.querySelector(sel);
            if (!el) return;

            const card = el.querySelector('.parchment-card');
            if (!card) return;

            gsap.fromTo(card,
                { opacity: 0, y: 60, scale: 0.97 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // Section title floats in
            const title = el.querySelector('.section-title');
            if (title) {
                gsap.fromTo(title,
                    { opacity: 0, y: 30, letterSpacing: '10px' },
                    {
                        opacity: 1, y: 0, letterSpacing: '2px',
                        duration: 0.9,
                        delay: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 72%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        });

        // About grid items stagger
        const aboutCols = document.querySelectorAll('.wizard-portrait-wrap, .wizard-bio');
        aboutCols.forEach((col, i) => {
            gsap.fromTo(col,
                { opacity: 0, x: i === 0 ? -40 : 40 },
                {
                    opacity: 1, x: 0,
                    duration: 0.9,
                    delay: 0.3 + i * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
    }

    // ────────────────────────────────────────────────────────────
    // TIMELINE REVEAL
    // ────────────────────────────────────────────────────────────
    private timelineReveal() {
        const items = document.querySelectorAll<HTMLElement>('.timeline-item');

        items.forEach((item, i) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 82%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: 'power3.out',
                        onStart: () => item.classList.add('visible'),
                    });
                },
                onLeaveBack: () => {
                    item.classList.remove('visible');
                    gsap.set(item, { opacity: 0, x: -20 });
                },
            });
        });
    }

    // ────────────────────────────────────────────────────────────
    // PROJECT CARDS
    // ────────────────────────────────────────────────────────────
    private projectCards() {
        const cards = document.querySelectorAll<HTMLElement>('.project-card');

        cards.forEach((card, i) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        delay: i * 0.12,
                        ease: 'back.out(1.4)',
                        onStart: () => card.classList.add('visible'),
                    });
                },
                onLeaveBack: () => {
                    card.classList.remove('visible');
                    gsap.set(card, { opacity: 0, y: 30 });
                },
            });
        });
    }

    // ────────────────────────────────────────────────────────────
    // SKILL CHAPTERS
    // ────────────────────────────────────────────────────────────
    private skillChapters() {
        const chapters = document.querySelectorAll<HTMLElement>('.skill-chapter');

        chapters.forEach((ch, i) => {
            ScrollTrigger.create({
                trigger: ch,
                start: 'top 87%',
                onEnter: () => {
                    gsap.to(ch, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: 'power2.out',
                        onStart: () => ch.classList.add('visible'),
                    });

                    // Stagger the individual spell tags
                    const tags = ch.querySelectorAll('.spell-tag');
                    gsap.fromTo(tags,
                        { opacity: 0, scale: 0.8 },
                        {
                            opacity: 1, scale: 1,
                            duration: 0.4,
                            stagger: 0.05,
                            delay: 0.2 + i * 0.1,
                            ease: 'back.out(2)',
                        }
                    );
                },
                onLeaveBack: () => {
                    ch.classList.remove('visible');
                    gsap.set(ch, { opacity: 0, y: 20 });
                },
            });
        });
    }

    // ────────────────────────────────────────────────────────────
    // LANGUAGE BARS
    // ────────────────────────────────────────────────────────────
    private languageBars() {
        const bar = document.querySelector<HTMLElement>('.languages-bar');
        if (!bar) return;

        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            onEnter: () => {
                bar.classList.add('visible');

                const fills = bar.querySelectorAll<HTMLElement>('.lang-fill');
                fills.forEach((fill, i) => {
                    const level = fill.getAttribute('data-level') || '0';
                    gsap.to(fill, {
                        width: `${level}%`,
                        duration: 1.4,
                        delay: 0.2 + i * 0.15,
                        ease: 'power2.out',
                    });
                });
            },
            onLeaveBack: () => {
                bar.classList.remove('visible');
                bar.querySelectorAll<HTMLElement>('.lang-fill').forEach((f) => {
                    gsap.set(f, { width: '0%' });
                });
            },
        });
    }

    // ────────────────────────────────────────────────────────────
    // CONTACT SECTION
    // ────────────────────────────────────────────────────────────
    private contactReveal() {
        const methods = document.querySelectorAll('.contact-method');
        if (methods.length) {
            gsap.fromTo(methods,
                { opacity: 0, x: -20 },
                {
                    opacity: 1, x: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#contact',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }

        const formGroups = document.querySelectorAll('.form-group, .form-row');
        if (formGroups.length) {
            gsap.fromTo(formGroups,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#contact',
                        start: 'top 72%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }
    }

    // ────────────────────────────────────────────────────────────
    // SECTION BACKGROUND COLOUR HINTS
    // Subtle body background tint changes per section
    // ────────────────────────────────────────────────────────────
    private sectionBackgrounds() {
        // Parallax depth for parchment cards
        document.querySelectorAll('.parchment-card').forEach((card) => {
            gsap.to(card, {
                y: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: card.closest('.scene-section') || card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });
        });
    }
}
