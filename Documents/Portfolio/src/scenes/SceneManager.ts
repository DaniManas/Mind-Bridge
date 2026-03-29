// ═══════════════════════════════════════════════════════════════
// SCENE MANAGER — Enhanced Three.js Magic
// Golden particles, atmospheric depth, Hufflepuff colours
// ═══════════════════════════════════════════════════════════════

import * as THREE from 'three';

export class SceneManager {
    private canvas: HTMLCanvasElement;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;

    // Particle systems
    private stardust!: THREE.Points;
    private goldenMotes!: THREE.Points;
    private purpleMotes!: THREE.Points;

    // Animated lights
    private lights: { light: THREE.PointLight; phase: number; speed: number; radius: number }[] = [];

    // State
    private scrollProgress: number = 0;
    private time: number = 0;

    constructor() {
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        this.init();
    }

    private init() {
        // ── Scene ──
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x070408, 0.018);

        // ── Camera ──
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.set(0, 0, 8);

        // ── Renderer ──
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // ── Build world ──
        this.createStardust();
        this.createGoldenMotes();
        this.createPurpleMotes();
        this.createAtmosphericLights();

        // ── Resize ──
        window.addEventListener('resize', this.handleResize);
    }

    // ────────────────────────────────────────────────────────────
    // STARDUST — large background star field
    // ────────────────────────────────────────────────────────────
    private createStardust() {
        const count = 3500;
        const positions = new Float32Array(count * 3);
        const sizes     = new Float32Array(count);
        const alphas    = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const r = 60 + Math.random() * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi   = Math.acos(2 * Math.random() - 1);

            positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            sizes[i]  = Math.random() < 0.05 ? 2.5 : 0.8 + Math.random() * 1.2;
            alphas[i] = 0.3 + Math.random() * 0.7;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('alpha',    new THREE.BufferAttribute(alphas, 1));

        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.12,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        });

        this.stardust = new THREE.Points(geo, mat);
        this.scene.add(this.stardust);
    }

    // ────────────────────────────────────────────────────────────
    // GOLDEN MOTES — Hufflepuff magical dust
    // ────────────────────────────────────────────────────────────
    private createGoldenMotes() {
        const count = 600;
        const positions = new Float32Array(count * 3);
        const speeds    = new Float32Array(count);
        const phases    = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2;
            speeds[i] = 0.2 + Math.random() * 0.8;
            phases[i] = Math.random() * Math.PI * 2;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0xf0c75e,
            size: 0.06,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.goldenMotes = new THREE.Points(geo, mat);
        (this.goldenMotes as any)._speeds = speeds;
        (this.goldenMotes as any)._phases = phases;
        (this.goldenMotes as any)._origPositions = positions.slice();
        this.scene.add(this.goldenMotes);
    }

    // ────────────────────────────────────────────────────────────
    // PURPLE MOTES — magical depth accent
    // ────────────────────────────────────────────────────────────
    private createPurpleMotes() {
        const count = 300;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 35;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0x7b5ea7,
            size: 0.04,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.purpleMotes = new THREE.Points(geo, mat);
        this.scene.add(this.purpleMotes);
    }

    // ────────────────────────────────────────────────────────────
    // ATMOSPHERIC LIGHTS — floating magical orbs in 3D
    // ────────────────────────────────────────────────────────────
    private createAtmosphericLights() {
        const configs = [
            { color: 0xf0c75e, intensity: 1.5, distance: 18, x:  3, y:  2, z: 2 },
            { color: 0xffd700, intensity: 1.0, distance: 15, x: -4, y: -1, z: 1 },
            { color: 0x6b46c1, intensity: 0.8, distance: 20, x:  5, y: -3, z: 3 },
            { color: 0xf0c75e, intensity: 0.6, distance: 12, x: -2, y:  4, z: 1 },
            { color: 0x3b82f6, intensity: 0.4, distance: 25, x:  0, y: -5, z: 4 },
        ];

        configs.forEach((cfg, i) => {
            const light = new THREE.PointLight(cfg.color, cfg.intensity, cfg.distance);
            light.position.set(cfg.x, cfg.y, cfg.z);
            this.scene.add(light);
            this.lights.push({
                light,
                phase: (i / configs.length) * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.4,
                radius: 1.5 + Math.random() * 2,
            });
        });

        // Ambient
        const ambient = new THREE.AmbientLight(0x1a0e1f, 0.8);
        this.scene.add(ambient);
    }

    // ────────────────────────────────────────────────────────────
    // UPDATE — called every frame
    // ────────────────────────────────────────────────────────────
    public update(scrollProg: number) {
        this.scrollProgress = scrollProg;
        this.time += 0.008;

        this.animateStardust();
        this.animateGoldenMotes();
        this.animateLights();
        this.animateCamera();

        this.renderer.render(this.scene, this.camera);
    }

    private animateStardust() {
        if (!this.stardust) return;
        this.stardust.rotation.y += 0.00015;
        this.stardust.rotation.x += 0.00008;
        // Pulse opacity
        const mat = this.stardust.material as THREE.PointsMaterial;
        mat.opacity = 0.55 + Math.sin(this.time * 0.5) * 0.1;
    }

    private animateGoldenMotes() {
        if (!this.goldenMotes) return;
        const geo     = this.goldenMotes.geometry;
        const pos     = geo.attributes.position.array as Float32Array;
        const orig    = (this.goldenMotes as any)._origPositions as Float32Array;
        const speeds  = (this.goldenMotes as any)._speeds as Float32Array;
        const phases  = (this.goldenMotes as any)._phases as Float32Array;
        const count   = pos.length / 3;

        for (let i = 0; i < count; i++) {
            const t = this.time * speeds[i];
            pos[i * 3]     = orig[i * 3]     + Math.sin(t + phases[i]) * 0.4;
            pos[i * 3 + 1] = orig[i * 3 + 1] + Math.cos(t * 0.7 + phases[i]) * 0.35;
            pos[i * 3 + 2] = orig[i * 3 + 2] + Math.sin(t * 1.3 + phases[i]) * 0.2;
        }

        geo.attributes.position.needsUpdate = true;

        // Rotate slowly
        this.goldenMotes.rotation.y = this.time * 0.04;

        // Opacity breathes
        const mat = this.goldenMotes.material as THREE.PointsMaterial;
        mat.opacity = 0.6 + Math.sin(this.time * 0.8) * 0.2;
    }

    private animateLights() {
        this.lights.forEach(({ light, phase, speed, radius }) => {
            const t = this.time * speed + phase;
            light.position.x += Math.sin(t) * 0.008 * radius;
            light.position.y += Math.cos(t * 0.7) * 0.006 * radius;
            light.intensity = (light.intensity * 0.97) + ((0.8 + Math.sin(t * 2) * 0.3) * 0.03);
        });
    }

    private animateCamera() {
        const sp = this.scrollProgress;

        // Gentle parallax — camera drifts subtly with scroll
        const targetY = sp * 3;
        const targetZ = 8 - sp * 2;

        this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;

        // Breathe
        this.camera.position.x = Math.sin(this.time * 0.2) * 0.3;

        // Subtle roll
        this.camera.rotation.z = Math.sin(this.time * 0.15) * 0.008;

        this.camera.lookAt(0, this.camera.position.y * 0.3, 0);
    }

    // ────────────────────────────────────────────────────────────
    // RESIZE
    // ────────────────────────────────────────────────────────────
    private handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
}
