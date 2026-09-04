/**
 * Midnight Janmashtami Birth Cinematic Transition
 * Executes the seamless realistic divine light burst:
 * Complete Darkness -> Sudden Golden-White Divine Bloom & Exposure Flare ->
 * Thunder & Gentle Monsoon Rain -> Yamuna Reflections -> "श्री कृष्ण का जन्म हो चुका है" ->
 * Baby Krishna in Cradle (Jhula) Reveal & Temple Bell Focus.
 */

class MidnightTransition {
  constructor() {
    this.isTransitioning = false;
    this.overlayEl = null;
    this.lightningCanvas = null;
    this.lightningCtx = null;
  }

  init() {
    this.overlayEl = document.getElementById('cinematicFlashOverlay');
    this.lightningCanvas = document.getElementById('lightningCanvas');
    if (this.lightningCanvas) {
      this.lightningCtx = this.lightningCanvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  resizeCanvas() {
    if (!this.lightningCanvas) return;
    this.lightningCanvas.width = window.innerWidth;
    this.lightningCanvas.height = window.innerHeight;
  }

  triggerSequence(onComplete) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    console.log("⚡ Triggering Realistic Divine Light Janmashtami Birth Transition");

    const birthSection = document.getElementById('birthCelebrationSection');

    // 1. COMPLETE DARKNESS & SILENCE (0ms)
    if (this.overlayEl) {
      this.overlayEl.classList.add('cinematic-darkness-active');
    }

    // 2. REALISTIC GOLDEN-WHITE DIVINE BLOOM & EXPOSURE (350ms)
    setTimeout(() => {
      if (this.overlayEl) {
        this.overlayEl.classList.remove('cinematic-darkness-active');
        this.overlayEl.classList.add('divine-bloom-active');
        setTimeout(() => {
          this.overlayEl.classList.remove('divine-bloom-active');
        }, 1200);
      }
    }, 350);

    // 3. CELESTIAL LIGHTNING FORK ON CANVAS (500ms)
    setTimeout(() => {
      this.drawLightningBolt();
      const wrapper = document.querySelector('.experience-wrapper');
      if (wrapper) {
        wrapper.classList.add('screen-shake');
        setTimeout(() => wrapper.classList.remove('screen-shake'), 600);
      }
    }, 500);

    // 4. THUNDER AUDIO (600ms)
    setTimeout(() => {
      if (window.DivineAudio) {
        window.DivineAudio.playThunder();
      }
    }, 600);

    // 5. MONSOON RAIN (1000ms)
    setTimeout(() => {
      if (window.DivineParticles) {
        window.DivineParticles.setRainIntensity(0.7);
      }
      if (window.DivineAudio) {
        window.DivineAudio.startRain();
      }
    }, 1000);

    // 6. YAMUNA & MOONLIGHT INTENSIFY (1800ms)
    setTimeout(() => {
      if (window.DivineAudio) {
        window.DivineAudio.startRiverAmbience();
      }
    }, 1800);

    // 7. SACRED SHANKH & SOFT TEMPLE BELL (2800ms)
    setTimeout(() => {
      if (window.DivineAudio) {
        window.DivineAudio.playShankh(3.2);
        window.DivineAudio.playTempleBell(0.6);
      }
      if (window.DivineParticles) {
        window.DivineParticles.spawnAuraBurst(window.innerWidth / 2, window.innerHeight * 0.45, 50);
        window.DivineParticles.spawnCelebrationPetals(40);
      }
    }, 2800);

    // 8. BANSURI MELODY & REVEAL BIRTH & CRADLE SECTION (3800ms)
    setTimeout(() => {
      if (window.DivineAudio) {
        window.DivineAudio.startFluteMelody();
        window.DivineAudio.startPeacockAmbience();
      }
      if (window.DivineParticles) {
        window.DivineParticles.setRainIntensity(0.25);
      }

      if (birthSection) {
        birthSection.scrollIntoView({ behavior: 'smooth' });
        birthSection.classList.add('birth-section-highlight');
      }

      if (window.DahiHandi) {
        window.DahiHandi.resizeCanvas();
        window.DahiHandi.drawScene();
      }

      this.isTransitioning = false;
      if (onComplete) onComplete();
    }, 3800);
  }

  /**
   * Procedural Multi-Branch Lightning Generator on Canvas
   */
  drawLightningBolt() {
    if (!this.lightningCanvas || !this.lightningCtx) return;
    const ctx = this.lightningCtx;
    const w = this.lightningCanvas.width;
    const h = this.lightningCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const startX = w * 0.3 + Math.random() * (w * 0.4);
    const startY = 0;
    const endX = startX + (Math.random() - 0.5) * (w * 0.25);
    const endY = h * 0.6;

    const createBranch = (x1, y1, x2, y2, depth = 0) => {
      if (depth > 3) return;

      const segments = 10;
      let currX = x1;
      let currY = y1;
      const dx = (x2 - x1) / segments;
      const dy = (y2 - y1) / segments;

      ctx.beginPath();
      ctx.moveTo(currX, currY);

      for (let i = 0; i < segments; i++) {
        const nextX = currX + dx + (Math.random() - 0.5) * 30;
        const nextY = currY + dy + (Math.random() - 0.5) * 12;
        ctx.lineTo(nextX, nextY);

        if (Math.random() < 0.2 && depth < 2) {
          const forkAngle = (Math.random() - 0.5) * 1.0;
          const forkDist = 50 + Math.random() * 60;
          createBranch(
            nextX,
            nextY,
            nextX + Math.sin(forkAngle) * forkDist,
            nextY + Math.cos(forkAngle) * forkDist,
            depth + 1
          );
        }

        currX = nextX;
        currY = nextY;
      }

      ctx.strokeStyle = `rgba(255, 209, 102, ${0.8 / (depth + 1)})`;
      ctx.lineWidth = 5 / (depth + 1);
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 18;
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 / (depth + 1)})`;
      ctx.lineWidth = 2 / (depth + 1);
      ctx.shadowBlur = 0;
      ctx.stroke();
    };

    createBranch(startX, startY, endX, endY);

    setTimeout(() => {
      ctx.clearRect(0, 0, w, h);
    }, 160);
  }
}

// Global Midnight Transition Singleton
window.MidnightTransition = new MidnightTransition();
