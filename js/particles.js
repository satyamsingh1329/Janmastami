/**
 * High-Performance Dual Canvas Particle & Atmospheric Engine
 * Controls: Starry Sky, Shooting Stars, Yamuna River Physics & Reflections, Rain Storm & Ripples,
 * Fireflies, Divine Aura Particles, Celebration Petals, Floating Radhe Radhe Mantras & Cursor Trails.
 */

class DivineParticleEngine {
  constructor() {
    this.bgCanvas = null;
    this.bgCtx = null;
    this.fgCanvas = null;
    this.fgCtx = null;
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.isRunning = false;
    this.reducedMotion = false;
    this.rainIntensity = 0.2; // 0 = none, 0.2 = light drizzle, 1.0 = thunderstorm
    this.divineAuraIntensity = 0.0;
    this.isCelebration = false;

    // Collections
    this.stars = [];
    this.shootingStars = [];
    this.fireflies = [];
    this.raindrops = [];
    this.splashes = [];
    this.lotusDiyas = [];
    this.divineParticles = [];
    this.flowerPetals = [];
    this.radheMantras = [];
    this.cursorSparks = [];

    this.mouse = { x: this.width / 2, y: this.height / 2, vx: 0, vy: 0, lastX: 0, lastY: 0 };
    this.time = 0;

    this.checkReducedMotion();
  }

  checkReducedMotion() {
    // Always default to High Cinematic Motion for rich immersive visuals
    this.reducedMotion = false;
    try {
      localStorage.removeItem('krishna_reduced_motion');
    } catch (e) {}
  }

  setReducedMotion(val) {
    this.reducedMotion = !!val;
    this.initElements();
  }

  init(bgCanvasId = 'bgCanvas', fgCanvasId = 'fgCanvas') {
    this.bgCanvas = document.getElementById(bgCanvasId);
    this.fgCanvas = document.getElementById(fgCanvasId);

    if (!this.bgCanvas || !this.fgCanvas) {
      console.warn("Particle canvases not found");
      return;
    }

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.fgCtx = this.fgCanvas.getContext('2d');

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    window.addEventListener('pointermove', (e) => {
      this.mouse.vx = e.clientX - this.mouse.x;
      this.mouse.vy = e.clientY - this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.reducedMotion && Math.random() < 0.6) {
        this.addCursorSpark(e.clientX, e.clientY);
      }
    });

    this.initElements();
    this.start();
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    [this.bgCanvas, this.fgCanvas].forEach(canvas => {
      if (!canvas) return;
      canvas.width = this.width * this.dpr;
      canvas.height = this.height * this.dpr;
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
    });

    this.bgCtx.scale(this.dpr, this.dpr);
    this.fgCtx.scale(this.dpr, this.dpr);
  }

  initElements() {
    // 1. Stars (constellations & twinkles)
    const starCount = this.reducedMotion ? 60 : (this.width < 768 ? 120 : 250);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.7),
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.3 ? '#ffffff' : (Math.random() > 0.5 ? '#ffd166' : '#90e0ef')
      });
    }

    // 2. Fireflies (Jugnu)
    const fireflyCount = this.reducedMotion ? 8 : (this.width < 768 ? 16 : 35);
    this.fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: this.height * 0.3 + Math.random() * (this.height * 0.6),
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        baseAlpha: Math.random() * 0.5 + 0.4
      });
    }

    // 3. Floating Lotus Diyas on Yamuna
    const diyaCount = this.width < 768 ? 5 : 12;
    this.lotusDiyas = [];
    for (let i = 0; i < diyaCount; i++) {
      this.lotusDiyas.push({
        x: Math.random() * this.width,
        y: this.height * 0.72 + Math.random() * (this.height * 0.25),
        size: Math.random() * 6 + 10,
        speed: Math.random() * 0.3 + 0.15,
        flamePhase: Math.random() * Math.PI * 2,
        bobPhase: Math.random() * Math.PI * 2
      });
    }

    // 4. Raindrops
    this.initRaindrops();

    // 5. Radhe Radhe Floating Mantras
    this.initRadheMantras();
  }

  initRaindrops() {
    const count = this.reducedMotion ? 40 : (this.width < 768 ? 90 : 180);
    this.raindrops = [];
    for (let i = 0; i < count; i++) {
      this.raindrops.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: Math.random() * 18 + 12,
        speed: Math.random() * 12 + 16,
        thickness: Math.random() * 1.2 + 0.6,
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  initRadheMantras() {
    const count = this.reducedMotion ? 3 : (this.width < 768 ? 4 : 8);
    this.radheMantras = [];
    for (let i = 0; i < count; i++) {
      this.radheMantras.push({
        x: Math.random() * (this.width - 150) + 75,
        y: Math.random() * (this.height * 0.7) + 80,
        size: Math.random() * 8 + 18,
        alpha: Math.random() * 0.35 + 0.15,
        vy: - (Math.random() * 0.2 + 0.1),
        vx: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
        glow: Math.random() > 0.5 ? '#ffd166' : '#72efdd'
      });
    }
  }

  addCursorSpark(x, y) {
    this.cursorSparks.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      radius: Math.random() * 2.5 + 1.0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.2 + 0.5,
      alpha: 1.0,
      color: Math.random() > 0.4 ? '#ffd166' : (Math.random() > 0.5 ? '#06d6a0' : '#48cae4')
    });
  }

  triggerShootingStar() {
    if (this.reducedMotion) return;
    this.shootingStars.push({
      x: Math.random() * (this.width * 0.8),
      y: Math.random() * (this.height * 0.3),
      length: Math.random() * 80 + 60,
      speed: Math.random() * 10 + 14,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      alpha: 1.0,
      width: Math.random() * 2 + 1.5
    });
  }

  spawnCelebrationPetals(count = 50) {
    for (let i = 0; i < count; i++) {
      this.flowerPetals.push({
        x: Math.random() * this.width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 2.5 + 1.8,
        size: Math.random() * 10 + 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        color: Math.random() > 0.5 ? '#ffb703' : (Math.random() > 0.5 ? '#e63946' : '#ff758f'),
        alpha: 1.0
      });
    }
  }

  spawnAuraBurst(cx, cy, count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.divineParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.01,
        color: Math.random() > 0.3 ? '#ffe66d' : '#48cae4'
      });
    }
  }

  setRainIntensity(val) {
    this.rainIntensity = Math.max(0, Math.min(1.0, val));
  }

  setDivineAuraIntensity(val) {
    this.divineAuraIntensity = Math.max(0, Math.min(1.0, val));
  }

  // ==========================================
  // RENDER LOOP
  // ==========================================

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate() {
    if (!this.isRunning) return;

    this.time += 0.016;

    // Trigger random shooting stars
    if (Math.random() < 0.003 && !this.reducedMotion) {
      this.triggerShootingStar();
    }

    this.renderBackground();
    this.renderForeground();

    requestAnimationFrame(() => this.animate());
  }

  renderBackground() {
    const ctx = this.bgCtx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Stars
    this.stars.forEach(star => {
      star.alpha += Math.sin(this.time * 2 + star.x) * star.twinkleSpeed * 0.1;
      const currentAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowBlur = star.radius * 3;
      ctx.shadowColor = star.color;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

    // 2. Render Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.015;

      if (s.alpha <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(0.3, `rgba(255, 214, 102, ${s.alpha * 0.8})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.stroke();
    }

    // 3. Render Floating "राधे राधे" Ambient Mantras
    ctx.font = 'italic 600 20px "Rozha One", serif';
    this.radheMantras.forEach(m => {
      m.y += m.vy;
      m.x += Math.sin(this.time + m.phase) * 0.3;
      if (m.y < 50) {
        m.y = this.height * 0.7;
        m.x = Math.random() * (this.width - 150) + 75;
      }

      ctx.save();
      ctx.globalAlpha = m.alpha * (0.8 + 0.2 * Math.sin(this.time * 1.5 + m.phase));
      ctx.fillStyle = m.glow;
      ctx.shadowColor = m.glow;
      ctx.shadowBlur = 12;
      ctx.fillText("राधे राधे", m.x, m.y);
      ctx.restore();
    });

    // 4. Render Yamuna River Wave Highlights & Reflections
    const riverTop = this.height * 0.70;
    const waveCount = 3;
    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      const waveY = riverTop + w * 35;
      ctx.lineTo(0, waveY);

      for (let x = 0; x <= this.width; x += 25) {
        const yOffset = Math.sin(x * 0.008 + this.time * 1.2 + w * 1.5) * (4 + w * 2);
        ctx.lineTo(x, waveY + yOffset);
      }
      ctx.lineTo(this.width, this.height);
      ctx.closePath();

      const riverGrad = ctx.createLinearGradient(0, waveY, 0, this.height);
      riverGrad.addColorStop(0, `rgba(0, 78, 137, ${0.08 + w * 0.04})`);
      riverGrad.addColorStop(1, `rgba(1, 18, 48, ${0.25 + w * 0.06})`);
      ctx.fillStyle = riverGrad;
      ctx.fill();
    }

    // 5. Render Floating Diyas & Lotus on Yamuna
    this.lotusDiyas.forEach(diya => {
      diya.x += diya.speed;
      if (diya.x > this.width + 30) diya.x = -30;

      const bobY = diya.y + Math.sin(this.time * 2 + diya.bobPhase) * 3;

      // Water Ripple below Diya
      ctx.beginPath();
      ctx.ellipse(diya.x, bobY + 5, diya.size * 1.2, diya.size * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(114, 239, 221, ${0.2 + 0.1 * Math.sin(this.time * 3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Diya Base (Golden Clay)
      ctx.beginPath();
      ctx.arc(diya.x, bobY, diya.size * 0.6, 0, Math.PI);
      ctx.fillStyle = '#b05e27';
      ctx.fill();

      // Glowing Flame
      const flameFlicker = Math.sin(this.time * 8 + diya.flamePhase) * 2;
      ctx.beginPath();
      ctx.ellipse(diya.x, bobY - 4, diya.size * 0.35, (diya.size * 0.6) + flameFlicker, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffbe0b';
      ctx.shadowColor = '#fb5607';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 6. Render Fireflies (Jugnu)
    this.fireflies.forEach(f => {
      f.x += f.vx + Math.sin(this.time + f.phase) * 0.4;
      f.y += f.vy + Math.cos(this.time + f.phase) * 0.3;

      // Wrap edges
      if (f.x < -10) f.x = this.width + 10;
      if (f.x > this.width + 10) f.x = -10;
      if (f.y < this.height * 0.2) f.y = this.height * 0.85;
      if (f.y > this.height * 0.95) f.y = this.height * 0.3;

      const pulse = Math.sin(this.time * 3 + f.phase);
      const alpha = Math.max(0.1, f.baseAlpha + pulse * 0.35);

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(216, 243, 89, ${alpha})`;
      ctx.shadowColor = '#d8f359';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  renderForeground() {
    const ctx = this.fgCtx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Rain System (if intensity > 0)
    if (this.rainIntensity > 0.05) {
      const activeCount = Math.floor(this.raindrops.length * this.rainIntensity);
      ctx.strokeStyle = `rgba(174, 214, 241, ${0.45 * this.rainIntensity})`;
      ctx.lineWidth = 1.2;

      for (let i = 0; i < activeCount; i++) {
        const r = this.raindrops[i];
        r.y += r.speed * (0.8 + this.rainIntensity * 0.5);
        r.x += 1.5; // Wind angle

        if (r.y > this.height * 0.72 && Math.random() < 0.25) {
          // Spawn splash
          this.splashes.push({
            x: r.x,
            y: r.y,
            rx: 1,
            ry: 0.3,
            maxRx: Math.random() * 8 + 6,
            alpha: 0.6
          });
        }

        if (r.y > this.height) {
          r.y = -r.length;
          r.x = Math.random() * this.width;
        }

        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + 2, r.y + r.length);
        ctx.stroke();
      }

      // Render Rain Splashes
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const sp = this.splashes[i];
        sp.rx += 0.6;
        sp.ry += 0.2;
        sp.alpha -= 0.035;

        if (sp.alpha <= 0) {
          this.splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, sp.rx, sp.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 230, 255, ${sp.alpha})`;
        ctx.stroke();
      }
    }

    // 2. Divine Aura Particles (Radiating around Krishna)
    if (this.divineAuraIntensity > 0.05) {
      if (Math.random() < 0.4) {
        const cx = this.width / 2;
        const cy = this.height * 0.42;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 120 + 30;
        this.divineParticles.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: Math.cos(angle) * 0.8,
          vy: Math.sin(angle) * 0.8 - 0.4,
          radius: Math.random() * 3 + 1.2,
          alpha: 0.9 * this.divineAuraIntensity,
          decay: 0.012,
          color: Math.random() > 0.5 ? '#ffd166' : '#72efdd'
        });
      }
    }

    // Update & draw divine particles
    for (let i = this.divineParticles.length - 1; i >= 0; i--) {
      const p = this.divineParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.divineParticles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

    // 3. Flower Petals (Celebration Shower)
    for (let i = this.flowerPetals.length - 1; i >= 0; i--) {
      const pt = this.flowerPetals[i];
      pt.x += pt.vx + Math.sin(this.time * 2 + pt.x) * 0.8;
      pt.y += pt.vy;
      pt.rotation += pt.rotSpeed;

      if (pt.y > this.height + 20) {
        this.flowerPetals.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, pt.size, pt.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = 0.88;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    // 4. Peacock Cursor Sparks
    for (let i = this.cursorSparks.length - 1; i >= 0; i--) {
      const cs = this.cursorSparks[i];
      cs.x += cs.vx;
      cs.y += cs.vy;
      cs.alpha -= 0.04;

      if (cs.alpha <= 0) {
        this.cursorSparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(cs.x, cs.y, cs.radius, 0, Math.PI * 2);
      ctx.fillStyle = cs.color;
      ctx.globalAlpha = cs.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

// Global Particle Engine Singleton
window.DivineParticles = new DivineParticleEngine();
