/**
 * Interactive Digital Temple Bell (दिव्य मंदिर घंटी)
 * Prominently located in the Krishna Birth section.
 * Realistic physical swing, clapper movement, soft bell tone, golden ripples,
 * and seamless guidance to the cradle interaction.
 */

class TempleBellController {
  constructor() {
    this.bellElement = null;
    this.clapperElement = null;
    this.ringButton = null;
    this.autoBellToggle = null;
    this.rippleContainer = null;
    this.isRinging = false;
    this.ringCount = 0;
  }

  init() {
    this.bellElement = document.getElementById('templeBellWrapper');
    this.clapperElement = document.getElementById('templeBellClapper');
    this.ringButton = document.getElementById('btnRingTempleBell');
    this.autoBellToggle = document.getElementById('btnToggleAutoBell');
    this.rippleContainer = document.getElementById('bellRipplesContainer');

    this.bindEvents();
    this.updateAutoBellUI();
  }

  bindEvents() {
    if (this.bellElement) {
      this.bellElement.addEventListener('click', () => this.ringBell());
    }
    if (this.ringButton) {
      this.ringButton.addEventListener('click', () => this.ringBell());
    }
    if (this.autoBellToggle) {
      this.autoBellToggle.addEventListener('click', () => this.toggleAutoBell());
    }
  }

  ringBell(intensity = 0.8) {
    if (!this.bellElement) return;
    this.ringCount++;

    // Soft temple bell sound
    if (window.DivineAudio) {
      window.DivineAudio.ensureContext();
      window.DivineAudio.playTempleBell(intensity);
    }

    // Notify Devotional Gate of Bell Ring
    if (window.DevotionalGate) {
      window.DevotionalGate.recordBellRing();
    }

    // Physical Swing Animation
    this.bellElement.classList.remove('bell-swing');
    void this.bellElement.offsetWidth; // Force Reflow
    this.bellElement.classList.add('bell-swing');

    if (this.clapperElement) {
      this.clapperElement.classList.remove('clapper-swing');
      void this.clapperElement.offsetWidth;
      this.clapperElement.classList.add('clapper-swing');
    }

    // Spawn Golden Shockwave Ripples
    this.spawnShockwave();

    // Spawn subtle divine sparks
    if (window.DivineParticles) {
      const rect = this.bellElement.getBoundingClientRect();
      window.DivineParticles.spawnAuraBurst(rect.left + rect.width / 2, rect.bottom, 15);
    }

    // Update Counter badge
    const counterBadge = document.getElementById('bellRingCounter');
    if (counterBadge) {
      counterBadge.textContent = `${this.ringCount} बार`;
    }

    // Highlight the Cradle (Jhula) interaction below
    const jhulaWrapper = document.getElementById('balGopalJhula');
    const swingJhulaBtn = document.getElementById('btnSwingJhula');
    if (jhulaWrapper) {
      jhulaWrapper.classList.add('cradle-glow-highlight');
      setTimeout(() => jhulaWrapper.classList.remove('cradle-glow-highlight'), 3000);
    }
    if (swingJhulaBtn) {
      swingJhulaBtn.classList.add('btn-pulse-gold');
      setTimeout(() => swingJhulaBtn.classList.remove('btn-pulse-gold'), 3000);
    }
  }

  spawnShockwave() {
    if (!this.rippleContainer) return;

    const ripple = document.createElement('div');
    ripple.className = 'bell-shockwave';
    this.rippleContainer.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1200);
  }

  toggleAutoBell() {
    if (!window.DivineAudio) return;
    window.DivineAudio.settings.autoBellEnabled = !window.DivineAudio.settings.autoBellEnabled;
    window.DivineAudio.saveSettings();
    this.updateAutoBellUI();
  }

  updateAutoBellUI() {
    if (!this.autoBellToggle || !window.DivineAudio) return;
    const isEnabled = window.DivineAudio.settings.autoBellEnabled;
    this.autoBellToggle.innerHTML = isEnabled
      ? '🔔 स्वतः घंटी: सक्रिय (ON)'
      : '🔕 स्वतः घंटी: निष्क्रिय (OFF)';
    this.autoBellToggle.classList.toggle('btn-active-gold', isEnabled);
  }
}

// Global Temple Bell Singleton
window.TempleBell = new TempleBellController();
