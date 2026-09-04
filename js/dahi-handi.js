/**
 * Interactive Dahi-Handi Mini Game ("माखन मिश्री दही-हांडी")
 * Fully responsive, centered canvas with realistic swinging Matki pot physics,
 * Bal Gopal jump mechanics, butter splatters, celebratory confetti, and audio.
 */

class DahiHandiGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 500;
    this.height = 480;
    this.isRunning = false;
    this.animId = null;

    // Game State
    this.score = 0;
    this.highScore = 0;
    this.timeLeft = 25; // 25s round
    this.timerInterval = null;
    this.gameStage = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER'

    // Assets
    this.kanhaImg = new Image();
    this.kanhaImg.src = 'images/little-bal-gopal.jpg';

    // Entities
    this.handi = {
      x: 250,
      y: 110,
      radius: 42,
      swingAngle: 0,
      swingSpeed: 0.038,
      amplitude: 140,
      isBroken: false
    };

    this.kanha = {
      x: 250,
      y: 400,
      baseY: 400,
      radius: 36,
      vy: 0,
      isJumping: false,
      jumpPower: -18,
      gravity: 0.8
    };

    this.butterSplats = [];
    this.confetti = [];

    // Stars background
    this.bgStars = [];
    for (let i = 0; i < 35; i++) {
      this.bgStars.push({
        x: Math.random() * 500,
        y: Math.random() * 300,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    // DOM Elements
    this.startBtn = null;
    this.jumpBtn = null;
    this.scoreDisplay = null;
    this.highScoreDisplay = null;
    this.timerDisplay = null;
    this.statusMessage = null;
    this.celebrationModal = null;
  }

  init() {
    this.canvas = document.getElementById('dahiHandiCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.startBtn = document.getElementById('btnStartDahiHandi');
    this.jumpBtn = document.getElementById('btnJumpKanha');
    this.scoreDisplay = document.getElementById('dahiScore');
    this.highScoreDisplay = document.getElementById('dahiHighScore');
    this.timerDisplay = document.getElementById('dahiTimer');
    this.statusMessage = document.getElementById('dahiStatusMsg');
    this.celebrationModal = document.getElementById('dahiCelebrationModal');

    this.loadHighScore();
    this.resizeCanvas();
    this.bindEvents();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (!this.isRunning) this.drawScene();
    });

    // Initial draw once image loads or immediately
    this.kanhaImg.onload = () => {
      if (!this.isRunning) this.drawScene();
    };
    this.drawScene();
  }

  loadHighScore() {
    try {
      const saved = localStorage.getItem('krishna_handi_highscore');
      if (saved) {
        this.highScore = parseInt(saved, 10) || 0;
        if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
      }
    } catch (e) {}
  }

  saveHighScore() {
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('krishna_handi_highscore', this.highScore.toString());
        if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
      }
    } catch (e) {}
  }

  resizeCanvas() {
    if (!this.canvas) return;

    // Use container width or standard crisp dimension
    const parent = this.canvas.parentElement;
    let targetW = 500;
    if (parent && parent.clientWidth > 100) {
      targetW = Math.min(parent.clientWidth - 16, 500);
    }
    if (targetW < 300) targetW = 320;

    this.width = Math.round(targetW);
    this.height = 480;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Center entities accurately
    this.kanha.x = this.width / 2;
    this.kanha.baseY = this.height - 75;
    if (!this.kanha.isJumping) {
      this.kanha.y = this.kanha.baseY;
    }

    this.handi.amplitude = Math.min(150, (this.width / 2) - 50);
    if (!this.isRunning) {
      this.handi.x = this.width / 2;
    }
  }

  bindEvents() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startGame());
    }

    if (this.jumpBtn) {
      this.jumpBtn.addEventListener('click', () => this.jump());
    }

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (this.gameStage === 'PLAYING') {
          this.jump();
        } else if (this.gameStage === 'IDLE' || this.gameStage === 'GAMEOVER') {
          this.startGame();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.gameStage === 'PLAYING') {
        e.preventDefault();
        this.jump();
      }
    });

    const closeCelebrationBtn = document.getElementById('btnCloseDahiCelebration');
    if (closeCelebrationBtn && this.celebrationModal) {
      closeCelebrationBtn.addEventListener('click', () => {
        this.celebrationModal.classList.remove('modal-visible');
      });
    }
  }

  startGame() {
    if (window.DivineAudio) window.DivineAudio.ensureContext();

    this.resizeCanvas();
    this.gameStage = 'PLAYING';
    this.score = 0;
    this.timeLeft = 25;
    this.handi.isBroken = false;
    this.handi.swingSpeed = 0.038;
    this.butterSplats = [];
    this.confetti = [];

    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;
    if (this.statusMessage) this.statusMessage.innerHTML = '🎯 सही समय पर <b>TAP</b> करें और माखन हांडी फोड़ें!';
    if (this.startBtn) this.startBtn.style.display = 'none';
    if (this.jumpBtn) this.jumpBtn.style.display = 'inline-flex';

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    this.isRunning = true;
    this.loop();
  }

  jump() {
    if (!this.kanha.isJumping && this.gameStage === 'PLAYING') {
      this.kanha.isJumping = true;
      this.kanha.vy = this.kanha.jumpPower;

      if (window.DivineAudio) {
        window.DivineAudio.playTempleBell(0.3);
      }
    }
  }

  update() {
    // 1. Swing Handi smoothly
    this.handi.swingAngle += this.handi.swingSpeed;
    this.handi.x = (this.width / 2) + Math.sin(this.handi.swingAngle) * this.handi.amplitude;

    // 2. Kanha Jump Physics
    if (this.kanha.isJumping) {
      this.kanha.y += this.kanha.vy;
      this.kanha.vy += this.kanha.gravity;

      // Check Collision with Handi
      if (!this.handi.isBroken) {
        const dx = this.kanha.x - this.handi.x;
        const dy = this.kanha.y - this.handi.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 60) {
          this.hitHandi();
        }
      }

      // Land back on base
      if (this.kanha.y >= this.kanha.baseY) {
        this.kanha.y = this.kanha.baseY;
        this.kanha.vy = 0;
        this.kanha.isJumping = false;
      }
    }

    // 3. Update Butter Splats
    for (let i = this.butterSplats.length - 1; i >= 0; i--) {
      const b = this.butterSplats[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.25;
      b.alpha -= 0.02;
      if (b.alpha <= 0) this.butterSplats.splice(i, 1);
    }

    // 4. Update Confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.rot += 0.08;
      c.alpha -= 0.015;
      if (c.alpha <= 0) this.confetti.splice(i, 1);
    }
  }

  hitHandi() {
    this.handi.isBroken = true;
    this.score += 100;
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    this.saveHighScore();

    if (this.statusMessage) {
      this.statusMessage.innerHTML = '✨ <b>अद्भुत!</b> माखन हांडी फूट गई! गोविंदा आला रे! ✨';
    }

    // Sound effect
    if (window.DivineAudio) {
      window.DivineAudio.playCelebrationSound();
    }

    // Spawn Butter Splatter
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.butterSplats.push({
        x: this.handi.x,
        y: this.handi.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: Math.random() * 5 + 3,
        alpha: 1.0,
        color: Math.random() > 0.35 ? '#ffffff' : '#fff3b0'
      });
    }

    // Spawn Confetti
    for (let i = 0; i < 40; i++) {
      this.confetti.push({
        x: this.handi.x,
        y: this.handi.y,
        vx: (Math.random() - 0.5) * 8,
        vy: - (Math.random() * 6 + 2),
        size: Math.random() * 8 + 4,
        rot: Math.random() * Math.PI * 2,
        color: ['#ffd166', '#06d6a0', '#ef476f', '#118ab2', '#ffbe0b'][Math.floor(Math.random() * 5)],
        alpha: 1.0
      });
    }

    // Global Petal shower
    if (window.DivineParticles) {
      window.DivineParticles.spawnCelebrationPetals(40);
    }

    // Respawn Handi after 1.2s with faster speed
    setTimeout(() => {
      if (this.gameStage === 'PLAYING') {
        this.handi.isBroken = false;
        this.handi.swingSpeed = Math.min(0.08, this.handi.swingSpeed + 0.005);
      }
    }, 1200);
  }

  endGame() {
    this.gameStage = 'GAMEOVER';
    this.isRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (this.startBtn) {
      this.startBtn.textContent = '🔄 पुनः खेलें (Play Again)';
      this.startBtn.style.display = 'inline-flex';
    }
    if (this.jumpBtn) this.jumpBtn.style.display = 'none';

    if (this.statusMessage) {
      this.statusMessage.innerHTML = `🏆 खेल समाप्त! आपका स्कोर: <b>${this.score}</b> अंक`;
    }

    if (this.score >= 200 && this.celebrationModal) {
      this.celebrationModal.classList.add('modal-visible');
    }
  }

  drawScene() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Festive Night Sky Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#030c1d');
    bgGrad.addColorStop(0.5, '#071833');
    bgGrad.addColorStop(1, '#0e2a4a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Twinkling stars
    this.bgStars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x % this.width, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    });

    // Top Hanging Floral Toran (Marigold & Mango Leaves)
    this.drawTopToran(ctx);

    // 2. Handi Hanging Rope
    const ropeTopX = this.width / 2;
    const ropeTopY = 15;
    ctx.strokeStyle = '#d4a373';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ropeTopX, ropeTopY);
    ctx.lineTo(this.handi.x, this.handi.y - 32);
    ctx.stroke();

    // 3. Draw Dahi Handi (Matki)
    if (!this.handi.isBroken) {
      this.drawMatki(ctx, this.handi.x, this.handi.y);
    }

    // 4. Draw Butter Splatter Particles
    this.butterSplats.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.globalAlpha = b.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 5. Draw Confetti
    this.confetti.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();
    });
    ctx.globalAlpha = 1.0;

    // 6. Base Temple Floor
    this.drawFloor(ctx);

    // 7. Draw Little Kanha Character
    this.drawKanha(ctx, this.kanha.x, this.kanha.y);
  }

  drawTopToran(ctx) {
    ctx.save();
    ctx.strokeStyle = '#e76f51';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.quadraticCurveTo(this.width / 2, 38, this.width, 16);
    ctx.stroke();

    // Small marigold flowers hanging
    const count = 9;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = t * this.width;
      const y = (1 - t) * (1 - t) * 16 + 2 * (1 - t) * t * 38 + t * t * 16;

      ctx.beginPath();
      ctx.arc(x, y + 6, 5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#ffb703' : '#fb8500';
      ctx.fill();
    }
    ctx.restore();
  }

  drawMatki(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Golden Aura Glow
    const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 55);
    auraGrad.addColorStop(0, 'rgba(255, 209, 102, 0.45)');
    auraGrad.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.fill();

    // Terracotta Pot Body
    ctx.beginPath();
    ctx.arc(0, 6, 32, 0, Math.PI * 2);
    const potGrad = ctx.createRadialGradient(-8, -4, 4, 0, 6, 34);
    potGrad.addColorStop(0, '#e76f51');
    potGrad.addColorStop(0.5, '#b04a2f');
    potGrad.addColorStop(1, '#6c2b18');
    ctx.fillStyle = potGrad;
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pot Neck / Rim
    ctx.beginPath();
    ctx.ellipse(0, -20, 20, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#9c3d23';
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fresh White Butter (Makhan) overflowing
    ctx.beginPath();
    ctx.ellipse(0, -23, 18, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Butter Drips
    ctx.beginPath();
    ctx.arc(-8, -14, 5, 0, Math.PI * 2);
    ctx.arc(6, -12, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Sacred Tilak Motif on Pot
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(0, 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Small Peacock Feather on Handi
    ctx.strokeStyle = '#06d6a0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, -22);
    ctx.quadraticCurveTo(26, -34, 22, -44);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(22, -44, 6, 9, Math.PI / 6, 0, Math.PI * 2);
    ctx.fillStyle = '#118ab2';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, -44, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    ctx.restore();
  }

  drawKanha(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    const r = this.kanha.radius;

    // Shadow on ground
    const shadowScale = Math.max(0.4, 1 - (this.kanha.baseY - y) / 250);
    ctx.beginPath();
    ctx.ellipse(0, (this.kanha.baseY - y) + 38, 32 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * shadowScale})`;
    ctx.fill();

    // Golden Aura Halo behind Bal Gopal
    const aura = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r + 12);
    aura.addColorStop(0, 'rgba(255, 209, 102, 0.4)');
    aura.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, r + 12, 0, Math.PI * 2);
    ctx.fill();

    // Circular Avatar Medal
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    if (this.kanhaImg.complete && this.kanhaImg.naturalWidth > 0) {
      ctx.drawImage(this.kanhaImg, -r, -r, r * 2, r * 2);
    } else {
      // Vector Little Kanha
      ctx.fillStyle = '#8ecae6';
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, -4, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Divine Golden Border Ring
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Little Peacock Feather on Head
    ctx.strokeStyle = '#06d6a0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(8, -r - 12, 14, -r - 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(14, -r - 18, 5, 8, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#06d6a0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -r - 18, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    ctx.restore();
  }

  drawFloor(ctx) {
    ctx.save();
    const floorY = this.height - 30;

    // Green Grass Mat / Altar
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, this.height);
    floorGrad.addColorStop(0, '#0f4c5c');
    floorGrad.addColorStop(1, '#082530');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, this.width, 30);

    // Glowing Gold Top Border
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.width, floorY);
    ctx.stroke();

    // Decorative Floral Petals on Floor
    const petals = [20, 65, 110, 160, 210, 260, 310, 360, 410, 460];
    petals.forEach((px, idx) => {
      if (px < this.width) {
        ctx.beginPath();
        ctx.arc(px, floorY + 12, 4, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#ff758f' : '#ffb703';
        ctx.fill();
      }
    });

    ctx.restore();
  }

  loop() {
    if (!this.isRunning) {
      this.drawScene();
      return;
    }

    this.update();
    this.drawScene();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// Global Dahi Handi Game Singleton
window.DahiHandi = new DahiHandiGame();
