// ═══════════════════════════════════════════════════════════════
// BACKGROUND JOURNEY
// Crossfade between Hogwarts location images as you scroll.
// Uses two layered divs for smooth GPU-composited transitions.
// ═══════════════════════════════════════════════════════════════

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
    { id: 'entrance',   bg: '/images/backgrounds/castle.png',      overlay: 'rgba(7,4,8,0.55)',  tint: 'rgba(240,199,94,0.04)' },
    { id: 'about',      bg: '/images/backgrounds/great-hall.png',   overlay: 'rgba(7,4,8,0.60)',  tint: 'rgba(240,150,30,0.06)' },
    { id: 'experience', bg: '/images/backgrounds/corridor.png',     overlay: 'rgba(5,3,7,0.65)',  tint: 'rgba(107,70,193,0.05)' },
    { id: 'projects',   bg: '/images/backgrounds/corridor.png',     overlay: 'rgba(5,3,7,0.65)',  tint: 'rgba(107,70,193,0.06)' },
    { id: 'skills',     bg: '/images/backgrounds/common-room.png',  overlay: 'rgba(8,5,4,0.58)',  tint: 'rgba(240,180,60,0.06)' },
    { id: 'contact',    bg: '/images/backgrounds/castle.png',       overlay: 'rgba(4,3,6,0.68)',  tint: 'rgba(80,50,140,0.06)' },
];

export class BackgroundJourney {
    private layerA!: HTMLElement;
    private layerB!: HTMLElement;
    private overlayEl!: HTMLElement;
    private activeLayer: 'A' | 'B' = 'A';
    private currentBg: string = '';

    constructor() {
        this.buildLayers();
        this.setupTransitions();
        this.setupParallax();
    }

    private buildLayers() {
        const base = `
            position: fixed; top: 0; left: 0; width: 100%; height: 110%;
            background-size: cover; background-position: center top;
            will-change: transform, opacity;
            pointer-events: none;
        `;

        this.layerA = document.createElement('div');
        this.layerA.id = 'bg-layer-a';
        this.layerA.style.cssText = base + 'z-index: -3; opacity: 1;';

        this.layerB = document.createElement('div');
        this.layerB.id = 'bg-layer-b';
        this.layerB.style.cssText = base + 'z-index: -2; opacity: 0;';

        // Colour overlay — changes tint per section
        this.overlayEl = document.createElement('div');
        this.overlayEl.id = 'bg-overlay';
        this.overlayEl.style.cssText = `
            position: fixed; inset: 0; pointer-events: none;
            z-index: -1;
            background: rgba(7,4,8,0.55);
            transition: background 1.2s ease;
        `;

        document.body.prepend(this.overlayEl);
        document.body.prepend(this.layerB);
        document.body.prepend(this.layerA);
    }

    private setupTransitions() {
        // Preload first background immediately
        const first = SCENES[0];
        this.layerA.style.backgroundImage = `url('${first.bg}')`;
        this.currentBg = first.bg;
        this.overlayEl.style.background = first.overlay;

        SCENES.forEach((scene) => {
            const el = document.getElementById(scene.id);
            if (!el) return;

            ScrollTrigger.create({
                trigger: el,
                start: 'top 60%',
                onEnter:     () => this.transition(scene),
                onEnterBack: () => this.transition(scene),
            });
        });
    }

    private transition(scene: typeof SCENES[0]) {
        if (this.currentBg === scene.bg) {
            // Same image — just update the overlay colour
            this.overlayEl.style.background = scene.overlay;
            return;
        }

        const incoming = this.activeLayer === 'A' ? this.layerB : this.layerA;
        const outgoing = this.activeLayer === 'A' ? this.layerA : this.layerB;

        // Set the new image on the hidden layer
        incoming.style.backgroundImage = `url('${scene.bg}')`;

        // Crossfade
        gsap.to(incoming, { opacity: 1, duration: 1.0, ease: 'power2.inOut' });
        gsap.to(outgoing, { opacity: 0, duration: 1.0, ease: 'power2.inOut' });

        this.overlayEl.style.background = scene.overlay;
        this.currentBg = scene.bg;
        this.activeLayer = this.activeLayer === 'A' ? 'B' : 'A';
    }

    private setupParallax() {
        // Both layers get a slow vertical drift for parallax depth
        [this.layerA, this.layerB].forEach((layer) => {
            gsap.fromTo(layer,
                { backgroundPositionY: '0%' },
                {
                    backgroundPositionY: '25%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: 'body',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.5,
                    },
                }
            );
        });
    }
}
