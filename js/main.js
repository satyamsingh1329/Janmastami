/**
 * Main Application Orchestrator & UI Controller
 * Integrates all modules, Peacock Feather Custom Cursor, Floating Audio Dock,
 * Quick Navigation, Touch Interactions, Reduced Motion, and Experience Lifecycle.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("🌙 Initializing Shri Krishna Janmashtami Digital Experience");

  // Initialize particle canvas systems

  // 1. Initialize Particles
  if (window.DivineParticles) {
    window.DivineParticles.init('bgCanvas', 'fgCanvas');
  }

  // 2. Initialize Countdown & 12:00 Transition Link
  if (window.MidnightCountdown && window.MidnightTransition) {
    window.MidnightTransition.init();
    window.MidnightCountdown.init(() => {
      window.MidnightTransition.triggerSequence();
    });
  }

  // 3. Initialize Krishna Reveal & Animated Speaking Experience
  if (window.KrishnaReveal) {
    window.KrishnaReveal.init();
  }

  // 4. Initialize 108 Jap Mala
  if (window.Jap108) {
    window.Jap108.init();
  }

  // 5. Initialize Digital Temple Bell
  if (window.TempleBell) {
    window.TempleBell.init();
  }

  // 5b. Initialize Devotional Gate Lock (1 Bell + 1 Jhula Compulsory)
  if (window.DevotionalGate) {
    window.DevotionalGate.init();
  }

  // 6. Initialize Dahi-Handi Game
  if (window.DahiHandi) {
    window.DahiHandi.init();
  }

  // 7. Initialize Wish Card Generator
  if (window.WishCard) {
    window.WishCard.init();
  }

  // 8. Custom Peacock Feather Cursor
  initPeacockCursor();

  // 9. Audio Floating Controls & Global Events
  initAudioControls();

  // 10. Quick Navigation Dock
  initQuickNav();

  // 11. Interactive Cradle / Bal Gopal Jhula
  initJhulaPhysics();

  // 12. Reduced Motion & Accessibility
  initAccessibility();

  // 13. Replay Button
  initReplayExperience();
});

/**
 * Custom Peacock Feather Cursor with Topmost Z-Index, Zero-Lag Tracking, and Fluid Interactivity
 */
function initPeacockCursor() {
  const cursorEl = document.getElementById('peacockCursor');
  if (!cursorEl) return;

  const featherBody = cursorEl.querySelector('.cursor-feather-body');

  let mouseX = -100;
  let mouseY = -100;
  let prevX = -100;
  let prevY = -100;
  let currentTilt = 25; // Base angle (degrees)
  let isVisible = false;

  const updatePosition = (x, y) => {
    mouseX = x;
    mouseY = y;

    document.body.classList.remove('touch-active');

    if (!isVisible) {
      isVisible = true;
      cursorEl.classList.add('cursor-visible');
      cursorEl.style.opacity = '1';
    }

    // Direct immediate transform for 0ms perceptible latency
    cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    // Emit subtle golden spark particles occasionally
    if (window.DivineParticles && Math.random() < 0.35) {
      window.DivineParticles.addCursorSpark(mouseX, mouseY);
    }
  };

  // Pointer & Mouse listeners
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') {
      cursorEl.style.opacity = '0';
      document.body.classList.add('touch-active');
      return;
    }
    updatePosition(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    updatePosition(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchstart', () => {
    cursorEl.style.opacity = '0';
    document.body.classList.add('touch-active');
  }, { passive: true });

  // Natural velocity tilt loop for feather body
  const animateFeatherTilt = () => {
    const vx = mouseX - prevX;
    const vy = mouseY - prevY;
    prevX = mouseX;
    prevY = mouseY;

    const speed = Math.sqrt(vx * vx + vy * vy);
    let targetTilt = 25; // Base resting angle

    if (speed > 1.5) {
      // Tilt feather based on movement direction
      const moveAngle = Math.atan2(vy, vx) * (180 / Math.PI);
      targetTilt = 25 + Math.sin((moveAngle * Math.PI) / 180) * 15;
    }

    currentTilt += (targetTilt - currentTilt) * 0.15;

    if (featherBody) {
      featherBody.style.transform = `rotate(${currentTilt}deg)`;
    }

    requestAnimationFrame(animateFeatherTilt);
  };
  animateFeatherTilt();

  // Click Feedback: Spawn golden ripple from pointer tip (always on top)
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 450);
  });

  // Window enter / leave (ensure cursor stays visible anywhere inside the window)
  window.addEventListener('blur', () => {
    cursorEl.style.opacity = '0';
    cursorEl.classList.remove('cursor-visible');
    isVisible = false;
  });

  window.addEventListener('focus', () => {
    cursorEl.style.opacity = '1';
    cursorEl.classList.add('cursor-visible');
    isVisible = true;
  });

  document.addEventListener('mouseleave', (e) => {
    if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
      cursorEl.classList.remove('cursor-visible');
      cursorEl.style.opacity = '0';
      isVisible = false;
    }
  });

  document.addEventListener('mouseenter', () => {
    cursorEl.classList.add('cursor-visible');
    cursorEl.style.opacity = '1';
    isVisible = true;
  });

  // Hover brightening over interactive elements
  const interactiveTargets = 'button, a, input, select, textarea, .mandala-bead, .temple-bell-interactive, .nav-dock-item, .jhula-hanging-frame, .btn-wish-preset, canvas, [role="button"], .dock-action-btn, .divine-range';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      cursorEl.classList.add('cursor-hover-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      cursorEl.classList.remove('cursor-hover-active');
    }
  });
}

/**
 * Floating Audio Dock & Modal Settings
 */
function initAudioControls() {
  const startExpBtn = document.getElementById('btnEnterExperience');
  const masterSoundBtn = document.getElementById('btnMasterSoundToggle');
  const soundSettingsBtn = document.getElementById('btnOpenSoundSettings');
  const soundModal = document.getElementById('audioSettingsModal');
  const closeSoundModal = document.getElementById('btnCloseSoundModal');

  const enterApp = () => {
    if (window.DivineAudio) {
      window.DivineAudio.init().then(() => {
        window.DivineAudio.startRiverAmbience();
        window.DivineAudio.startFluteMelody();
      });
    }

    const openingScreen = document.getElementById('openingScreen');
    if (openingScreen) {
      openingScreen.classList.add('fade-out-opening');
      setTimeout(() => {
        openingScreen.style.display = 'none';
      }, 1000);
    }
  };

  if (startExpBtn) {
    startExpBtn.addEventListener('click', enterApp);
  }

  // Master Sound Toggle
  if (masterSoundBtn) {
    masterSoundBtn.addEventListener('click', () => {
      if (window.DivineAudio) {
        window.DivineAudio.ensureContext();
        const isMuted = window.DivineAudio.toggleMute();
        updateSoundButtonUI(isMuted);
      }
    });
  }

  function updateSoundButtonUI(isMuted) {
    if (!masterSoundBtn) return;
    masterSoundBtn.innerHTML = isMuted
      ? '<span class="icon">🔇</span>'
      : '<span class="icon">🔊</span>';
    masterSoundBtn.title = isMuted ? 'ध्वनि चालू करें (Unmute)' : 'ध्वनि म्यूट करें (Mute)';
  }

  // Audio Settings Modal
  if (soundSettingsBtn && soundModal) {
    soundSettingsBtn.addEventListener('click', () => {
      soundModal.classList.add('modal-visible');
    });
  }

  if (closeSoundModal && soundModal) {
    closeSoundModal.addEventListener('click', () => {
      soundModal.classList.remove('modal-visible');
    });
  }

  // Channel Sliders
  const bindSlider = (id, channel) => {
    const el = document.getElementById(id);
    if (el && window.DivineAudio) {
      el.value = window.DivineAudio.settings[`${channel}Volume`] || 0.5;
      el.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (channel === 'master') {
          window.DivineAudio.setMasterVolume(val);
        } else {
          window.DivineAudio.setChannelVolume(channel, val);
        }
      });
    }
  };

  bindSlider('sliderMasterVol', 'master');
  bindSlider('sliderFluteVol', 'flute');
  bindSlider('sliderBellVol', 'bell');
  bindSlider('sliderRainVol', 'rain');
  bindSlider('sliderPeacockVol', 'peacock');
  bindSlider('sliderRiverVol', 'river');
}

/**
 * Floating Quick Navigation Dock with Devotional Gate Lock Protection
 */
function initQuickNav() {
  const toggleBtn = document.getElementById('btnNavDockToggle');
  const navItems = document.querySelectorAll('.nav-dock-item');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const dock = document.getElementById('quickNavDock');
      if (dock) dock.classList.toggle('nav-dock-open');
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').replace('#', '');

      // If user clicks a subsequent section before completing 1 Bell + 1 Jhula
      if (window.DevotionalGate && !window.DevotionalGate.isUnlocked &&
          ['krishnaDarshanSection', 'dahiHandiSection', 'jap108Section', 'wishCardSection'].includes(targetId)) {
        const gateCard = document.getElementById('darshanGateLockCard');
        if (gateCard) {
          gateCard.scrollIntoView({ behavior: 'smooth' });
          gateCard.classList.add('pulse');
          setTimeout(() => gateCard.classList.remove('pulse'), 1500);
        }
        return;
      }

      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
        if (window.DivineAudio) window.DivineAudio.playTempleBell(0.3);
      }
    });
  });
}

/**
 * Interactive Bal Gopal Cradle / Jhula (कान्हा को झुलाएँ 🦚)
 */
function initJhulaPhysics() {
  const jhulaEl = document.getElementById('balGopalJhula');
  const swingBtn = document.getElementById('btnSwingJhula');
  if (!jhulaEl) return;

  const swing = () => {
    jhulaEl.classList.remove('jhula-swing');
    void jhulaEl.offsetWidth; // Force reflow
    jhulaEl.classList.add('jhula-swing');

    if (window.DivineAudio) {
      window.DivineAudio.ensureContext();
      window.DivineAudio.playTempleBell(0.35);
    }

    // Notify Devotional Gate of Cradle Swing
    if (window.DevotionalGate) {
      window.DevotionalGate.recordJhulaSwing();
    }

    if (window.DivineParticles) {
      window.DivineParticles.spawnCelebrationPetals(30);
      const rect = jhulaEl.getBoundingClientRect();
      window.DivineParticles.spawnAuraBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }
  };

  jhulaEl.addEventListener('click', swing);
  if (swingBtn) swingBtn.addEventListener('click', swing);
}

/**
 * High Cinematic Motion Initialization
 */
function initAccessibility() {
  document.body.classList.remove('reduced-motion-mode');
  if (window.DivineParticles) {
    window.DivineParticles.setReducedMotion(false);
  }
}

/**
 * Replay Experience Lifecycle
 */
function initReplayExperience() {
  const replayBtn = document.getElementById('btnResetWholeExperience');
  if (!replayBtn) return;

  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const openingScreen = document.getElementById('openingScreen');
      if (openingScreen) {
        openingScreen.style.display = 'flex';
        openingScreen.classList.remove('fade-out-opening');
      }

      if (window.MidnightCountdown) {
        window.MidnightCountdown.reset();
      }

      if (window.DevotionalGate) {
        window.DevotionalGate.reset();
      }

      if (window.KrishnaReveal) {
        window.KrishnaReveal.isRevealed = false;
        window.KrishnaReveal.currentLineIndex = 0;
        const msgCard = document.getElementById('krishnaMessageContentCard');
        if (msgCard) msgCard.style.display = 'none';
        const startMsgBtn = document.getElementById('btnStartKrishnaMessage');
        if (startMsgBtn) startMsgBtn.style.display = 'inline-flex';
      }

      if (window.DivineAudio) {
        window.DivineAudio.playTempleBell(0.4);
      }
    }, 600);
  });
}

/**
 * ==========================================================================
 * DEVOTIONAL GATE CONTROLLER
 * Compulsory Lock: Requires at least 1 Bell Ring + 1 Jhula Swing to Unlock
 * ==========================================================================
 */
class DevotionalGateController {
  constructor() {
    this.bellRung = false;
    this.jhulaSwung = false;
    this.isUnlocked = false;

    this.gateCard = null;
    this.taskBell = null;
    this.taskJhula = null;
    this.badgeBell = null;
    this.badgeJhula = null;
    this.unlockedNotice = null;
    this.subsequentContainer = null;
    this.proceedBtn = null;
  }

  init() {
    this.gateCard = document.getElementById('darshanGateLockCard');
    this.taskBell = document.getElementById('gateTaskBell');
    this.taskJhula = document.getElementById('gateTaskJhula');
    this.badgeBell = document.getElementById('gateBadgeBell');
    this.badgeJhula = document.getElementById('gateBadgeJhula');
    this.unlockedNotice = document.getElementById('darshanUnlockedNotice');
    this.subsequentContainer = document.getElementById('subsequentDarshanSections');
    this.proceedBtn = document.getElementById('btnProceedToDarshan');

    if (this.proceedBtn) {
      this.proceedBtn.onclick = () => {
        const target = document.getElementById('krishnaDarshanSection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    this.updateUI();
  }

  recordBellRing() {
    if (this.bellRung && this.isUnlocked) return;
    this.bellRung = true;
    this.updateUI();
    this.checkUnlock();
  }

  recordJhulaSwing() {
    if (this.jhulaSwung && this.isUnlocked) return;
    this.jhulaSwung = true;
    this.updateUI();
    this.checkUnlock();
  }

  updateUI() {
    if (this.badgeBell && this.taskBell) {
      if (this.bellRung) {
        this.badgeBell.textContent = '✅ 1 / 1 (पूर्ण)';
        this.badgeBell.className = 'task-status-badge badge-completed';
        this.taskBell.className = 'gate-task-card task-completed';
      } else {
        this.badgeBell.textContent = '0 / 1 (बाकी)';
        this.badgeBell.className = 'task-status-badge badge-pending';
        this.taskBell.className = 'gate-task-card task-pending';
      }
    }

    if (this.badgeJhula && this.taskJhula) {
      if (this.jhulaSwung) {
        this.badgeJhula.textContent = '✅ 1 / 1 (पूर्ण)';
        this.badgeJhula.className = 'task-status-badge badge-completed';
        this.taskJhula.className = 'gate-task-card task-completed';
      } else {
        this.badgeJhula.textContent = '0 / 1 (बाकी)';
        this.badgeJhula.className = 'task-status-badge badge-pending';
        this.taskJhula.className = 'gate-task-card task-pending';
      }
    }
  }

  checkUnlock() {
    if (this.bellRung && this.jhulaSwung && !this.isUnlocked) {
      this.unlockDarshan();
    }
  }

  unlockDarshan() {
    this.isUnlocked = true;
    console.log("🌸 Devotional Gate Unlocked: 1 Bell Ring + 1 Jhula Swing Completed!");

    if (this.gateCard) {
      this.gateCard.classList.add('gate-unlocked');
    }

    if (this.unlockedNotice) {
      this.unlockedNotice.style.display = 'block';
    }

    if (this.subsequentContainer) {
      this.subsequentContainer.classList.remove('darshan-locked');
      this.subsequentContainer.classList.add('darshan-unlocked-reveal');
    }

    // Unlock quick navigation items
    const lockedNavItems = document.querySelectorAll('.nav-dock-item.nav-item-locked');
    lockedNavItems.forEach(item => {
      item.classList.remove('nav-item-locked');
      item.removeAttribute('data-locked');
      item.innerHTML = item.innerHTML.replace('🔒 ', '');
    });

    if (window.DivineAudio) {
      window.DivineAudio.playCelebrationSound();
    }

    if (window.DivineParticles) {
      window.DivineParticles.spawnCelebrationPetals(60);
    }

    if (window.DahiHandi) {
      setTimeout(() => {
        window.DahiHandi.resizeCanvas();
        window.DahiHandi.drawScene();
      }, 100);
    }
  }

  reset() {
    this.bellRung = false;
    this.jhulaSwung = false;
    this.isUnlocked = false;

    if (this.gateCard) this.gateCard.classList.remove('gate-unlocked');
    if (this.unlockedNotice) this.unlockedNotice.style.display = 'none';
    if (this.subsequentContainer) {
      this.subsequentContainer.classList.add('darshan-locked');
      this.subsequentContainer.classList.remove('darshan-unlocked-reveal');
    }

    this.updateUI();
  }
}

// Global Devotional Gate Singleton
window.DevotionalGate = new DevotionalGateController();

