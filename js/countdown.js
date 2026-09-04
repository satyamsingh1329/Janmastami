/**
 * Midnight Countdown & Testing Mode Controller
 * Strictly locks viewport and disables all scrolling until 12:00:00 midnight is reached.
 */

class MidnightCountdown {
  constructor() {
    this.timerId = null;
    this.isDemoMode = false;
    this.demoSecondsLeft = 10;
    this.hasTriggeredMidnight = false;
    this.onMidnightCallback = null;
    this.isLocked = true;

    // DOM Elements
    this.hoursEl = null;
    this.minutesEl = null;
    this.secondsEl = null;
    this.statusEl = null;
    this.countdownContainer = null;

    // Bound Event Handlers for Scroll Locking
    this.handleWheel = (e) => {
      if (this.isLocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    this.handleTouchMove = (e) => {
      if (this.isLocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    this.handleKeyDown = (e) => {
      if (!this.isLocked) return;
      const keys = ['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (keys.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
  }

  init(onMidnightCallback) {
    this.onMidnightCallback = onMidnightCallback;
    this.hoursEl = document.getElementById('countHours');
    this.minutesEl = document.getElementById('countMinutes');
    this.secondsEl = document.getElementById('countSeconds');
    this.statusEl = document.getElementById('countdownStatus');
    this.countdownContainer = document.getElementById('midnightCountdownSection');

    this.lockScrolling();
    this.bindButtons();
    this.startRealtime();
  }

  lockScrolling() {
    this.isLocked = true;
    document.body.classList.add('countdown-locked');
    document.documentElement.classList.add('countdown-locked');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
  }

  unlockScrolling() {
    this.isLocked = false;
    document.body.classList.remove('countdown-locked');
    document.documentElement.classList.remove('countdown-locked');

    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('keydown', this.handleKeyDown);

    if (window.DahiHandi) {
      setTimeout(() => {
        window.DahiHandi.resizeCanvas();
        window.DahiHandi.drawScene();
      }, 50);
    }

    console.log("🔓 Midnight reached — Page unlocked!");
  }

  bindButtons() {
    const demoBtn = document.getElementById('btnDemo10s');
    const instantBtn = document.getElementById('btnInstantMidnight');
    const resetBtn = document.getElementById('btnResetCountdown');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        if (window.DivineAudio) window.DivineAudio.ensureContext();
        this.startDemoMode(10);
      });
    }

    if (instantBtn) {
      instantBtn.addEventListener('click', () => {
        if (window.DivineAudio) window.DivineAudio.ensureContext();
        this.triggerMidnight();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.reset();
      });
    }
  }

  startRealtime() {
    this.isDemoMode = false;
    this.hasTriggeredMidnight = false;
    if (this.timerId) clearInterval(this.timerId);

    this.updateRealtimeDisplay();
    this.timerId = setInterval(() => {
      this.updateRealtimeDisplay();
    }, 1000);
  }

  updateRealtimeDisplay() {
    if (this.isDemoMode) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (hours === 0 && minutes === 0 && seconds === 0 && !this.hasTriggeredMidnight) {
      this.triggerMidnight();
      return;
    }

    const pad = (n) => n.toString().padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = pad(hours);
    if (this.minutesEl) this.minutesEl.textContent = pad(minutes);
    if (this.secondsEl) this.secondsEl.textContent = pad(seconds);

    if (hours === 23 && minutes === 59 && seconds >= 50) {
      this.triggerPreMidnightTension(60 - seconds);
    }
  }

  startDemoMode(seconds = 10) {
    this.isDemoMode = true;
    this.demoSecondsLeft = seconds;
    this.hasTriggeredMidnight = false;
    if (this.timerId) clearInterval(this.timerId);

    if (this.statusEl) {
      this.statusEl.innerHTML = `<span class="demo-badge pulse">⚡ टेस्ट मोड सक्रिय: ${this.demoSecondsLeft}s</span>`;
    }

    this.renderDemoTime();

    this.timerId = setInterval(() => {
      this.demoSecondsLeft--;
      this.renderDemoTime();

      if (this.demoSecondsLeft <= 5 && this.demoSecondsLeft > 0) {
        this.triggerPreMidnightTension(this.demoSecondsLeft);
      }

      if (this.demoSecondsLeft <= 0) {
        clearInterval(this.timerId);
        this.triggerMidnight();
      }
    }, 1000);
  }

  renderDemoTime() {
    const pad = (n) => n.toString().padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = "11";
    if (this.minutesEl) this.minutesEl.textContent = "59";
    if (this.secondsEl) {
      const secVal = 60 - this.demoSecondsLeft;
      this.secondsEl.textContent = pad(Math.max(50, Math.min(59, secVal)));
    }

    if (this.statusEl && this.isDemoMode) {
      this.statusEl.innerHTML = `<span class="demo-badge pulse">⚡ दिव्य क्षण आने में: ${this.demoSecondsLeft} सेकंड</span>`;
    }
  }

  triggerPreMidnightTension(secondsLeft) {
    if (this.countdownContainer) {
      this.countdownContainer.classList.add('tension-pulse');
    }

    if (window.DivineAudio && window.DivineAudio.ctx && !window.DivineAudio.isMuted) {
      try {
        const ctx = window.DivineAudio.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(window.DivineAudio.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }
  }

  triggerMidnight() {
    if (this.hasTriggeredMidnight) return;
    this.hasTriggeredMidnight = true;
    if (this.timerId) clearInterval(this.timerId);

    const pad = (n) => n.toString().padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = "12";
    if (this.minutesEl) this.minutesEl.textContent = "00";
    if (this.secondsEl) this.secondsEl.textContent = "00";

    if (this.statusEl) {
      this.statusEl.innerHTML = `<span class="divine-highlight">✨ पावन मध्यरात्रि — भगवान श्री कृष्ण का प्राकट्य! ✨</span>`;
    }

    // Unlock page
    this.unlockScrolling();

    if (this.onMidnightCallback) {
      this.onMidnightCallback();
    }
  }

  reset() {
    this.hasTriggeredMidnight = false;
    this.lockScrolling();
    this.startRealtime();
    if (this.statusEl) {
      this.statusEl.innerHTML = `<span>वर्तमान समय (मध्यरात्रि 12:00 बजे दिव्य प्राकट्य)</span>`;
    }
    if (this.countdownContainer) {
      this.countdownContainer.classList.remove('tension-pulse');
    }
  }
}

// Global Countdown Singleton
window.MidnightCountdown = new MidnightCountdown();
