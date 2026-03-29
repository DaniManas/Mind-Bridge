// ═══════════════════════════════════════════════════════════════
// MAIN ENTRY POINT — Manas Dani Magical Portfolio
// ═══════════════════════════════════════════════════════════════

import './style.css';
import { SceneManager }      from './scenes/SceneManager';
import { ScrollController }  from './controllers/ScrollController';
import { UIController }      from './controllers/UIController';
import { BackgroundJourney } from './controllers/BackgroundJourney';
import Lenis                 from 'lenis';

class MagicalPortfolio {
    private sceneManager!: SceneManager;
    private scrollController!: ScrollController;
    private uiController!: UIController;
    private lenis!: Lenis;
    private ready: boolean = false;

    constructor() {
        this.init();
    }

    private async init() {
        // ── Lenis smooth scroll ──────────────────────────────
        this.lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        // ── Backgrounds (go first — needs to prepend to body) ──
        new BackgroundJourney();

        // ── Three.js scene ───────────────────────────────────
        this.sceneManager = new SceneManager();

        // ── Controllers ──────────────────────────────────────
        this.scrollController = new ScrollController(this.sceneManager);
        this.uiController     = new UIController();

        // ── Simulate loading + reveal ────────────────────────
        await this.runLoadingScreen();

        // ── Start everything ─────────────────────────────────
        this.scrollController.init();
        this.uiController.init();

        this.ready = true;
        this.animate();
    }

    private runLoadingScreen(): Promise<void> {
        return new Promise((resolve) => {
            const bar  = document.getElementById('loading-progress');
            const screen = document.getElementById('loading-screen');
            let pct = 0;

            const tick = setInterval(() => {
                // Accelerate slowly then snap at the end
                pct += pct < 70 ? Math.random() * 12 : Math.random() * 25;
                if (pct >= 100) {
                    pct = 100;
                    clearInterval(tick);

                    setTimeout(() => {
                        screen?.classList.add('hidden');
                        // Small delay before starting interactive elements
                        setTimeout(resolve, 400);
                    }, 600);
                }
                if (bar) bar.style.width = `${pct}%`;
            }, 180);
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        // Update Lenis
        this.lenis.raf(performance.now());

        // Update Three.js scene
        if (this.ready) {
            const scrollProg =
                window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
            this.sceneManager.update(scrollProg);
        }
    };
}

// ── Boot ─────────────────────────────────────────────────────
new MagicalPortfolio();
