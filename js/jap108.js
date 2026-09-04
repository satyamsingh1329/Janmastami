/**
 * 108 Names of Shri Krishna Jap Mala Controller
 * Synchronized Devotional Audio Chanting, Paced Web Speech Synthesis,
 * Ambient Sound Ducking, Circular Mandala Progress, and Completion Celebration.
 *
 * Guarantees that each name is completely spoken and followed by a peaceful pause
 * before the next sacred name begins.
 */

class Jap108Controller {
  constructor() {
    this.names = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isSpeaking = false;
    this.playbackSessionId = 0; // Incremented on every change to prevent race conditions
    this.activeUtterance = null; // Prevent browser GC during speech
    this.currentAudio = null;

    // Timing & Pacing Configuration (Default: Peaceful & Devotional)
    this.speedMode = 'slow';
    this.speechRate = 0.74;     // Serene, clear, devotional Sanskrit voice pace
    this.pacingDelay = 1500;    // ms peaceful pause AFTER speaking finishes completely
    this.prepDelay = 500;       // ms peaceful pause BEFORE voice begins
    this.japVolume = 0.9;

    this.pacingTimeout = null;
    this.prepTimeout = null;
    this.speechTimeout = null;

    // DOM Elements
    this.counterText = null;
    this.mantraText = null;
    this.transliterationText = null;
    this.nameHindiText = null;
    this.nameEnglishText = null;
    this.meaningHindiText = null;
    this.meaningEnglishText = null;
    this.progressCircle = null;
    this.beadRingContainer = null;
    this.cardDetails = null;
    this.audioWave = null;
    this.completionModal = null;

    this.playBtn = null;
    this.pauseBtn = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.resetBtn = null;
    this.volumeSlider = null;
    this.volValLabel = null;
    this.speedSelect = null;
  }

  init() {
    this.names = window.KRISHNA_108_NAMES || (typeof KRISHNA_108_NAMES !== 'undefined' ? KRISHNA_108_NAMES : []);
    
    if (this.names.length === 0) {
      console.warn("108 Names dataset not ready, retrying in 50ms...");
      setTimeout(() => this.init(), 50);
      return;
    }

    // DOM references
    this.counterText = document.getElementById('japCounterNumber');
    this.mantraText = document.getElementById('japMantraDisplay');
    this.transliterationText = document.getElementById('japTransliteration');
    this.nameHindiText = document.getElementById('japNameHindi');
    this.nameEnglishText = document.getElementById('japNameEnglish');
    this.meaningHindiText = document.getElementById('japMeaningHindi');
    this.meaningEnglishText = document.getElementById('japMeaningEnglish');
    this.progressCircle = document.getElementById('japProgressCircle');
    this.beadRingContainer = document.getElementById('japBeadRing');
    this.cardDetails = document.querySelector('.jap-card-details');
    this.audioWave = document.getElementById('japAudioWave');
    this.completionModal = document.getElementById('japCompletionModal');

    this.playBtn = document.getElementById('btnJapPlay');
    this.pauseBtn = document.getElementById('btnJapPause');
    this.prevBtn = document.getElementById('btnJapPrev');
    this.nextBtn = document.getElementById('btnJapNext');
    this.resetBtn = document.getElementById('btnJapReset');
    this.volumeSlider = document.getElementById('sliderJapVolume');
    this.volValLabel = document.getElementById('japVolVal');
    this.speedSelect = document.getElementById('japSpeedSelect');

    this.applySpeedSettings('slow');
    this.loadPersistedIndex();
    this.renderBeadRing();
    this.bindEvents();
    this.updateDisplay(false);

    // Warm up speech synthesis voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded in browser cache
      };
      window.speechSynthesis.getVoices();
    }
  }

  applySpeedSettings(mode) {
    this.speedMode = mode;
    if (mode === 'slow') {
      this.speechRate = 0.74;  // Peaceful, meditative tempo
      this.pacingDelay = 1500; // 1.5s peaceful pause after full completion
      this.prepDelay = 500;    // 0.5s calm preparation
    } else if (mode === 'medium') {
      this.speechRate = 0.82;  // Devotional medium
      this.pacingDelay = 1000; // 1.0s pause
      this.prepDelay = 350;
    } else if (mode === 'steady') {
      this.speechRate = 0.88;  // Continuous chanting flow
      this.pacingDelay = 650;  // 0.65s pause
      this.prepDelay = 250;
    }
  }

  loadPersistedIndex() {
    try {
      const saved = localStorage.getItem('krishna_jap_index');
      if (saved !== null) {
        this.currentIndex = Math.max(0, Math.min(this.names.length - 1, parseInt(saved, 10)));
      }
    } catch (e) {}
  }

  savePersistedIndex() {
    try {
      localStorage.setItem('krishna_jap_index', this.currentIndex.toString());
    } catch (e) {}
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.onclick = (e) => {
        e.preventDefault();
        this.startJap();
      };
    }

    if (this.pauseBtn) {
      this.pauseBtn.onclick = (e) => {
        e.preventDefault();
        this.pauseJap();
      };
    }

    if (this.prevBtn) {
      this.prevBtn.onclick = (e) => {
        e.preventDefault();
        this.prevName();
      };
    }

    if (this.nextBtn) {
      this.nextBtn.onclick = (e) => {
        e.preventDefault();
        this.nextName();
      };
    }

    if (this.resetBtn) {
      this.resetBtn.onclick = (e) => {
        e.preventDefault();
        this.resetJap();
      };
    }

    if (this.volumeSlider) {
      this.volumeSlider.oninput = (e) => {
        this.japVolume = parseFloat(e.target.value) || 0.9;
        if (this.volValLabel) {
          this.volValLabel.textContent = `${Math.round(this.japVolume * 100)}%`;
        }
        if (this.currentAudio) {
          this.currentAudio.volume = this.japVolume;
        }
      };
    }

    if (this.speedSelect) {
      this.speedSelect.onchange = (e) => {
        this.applySpeedSettings(e.target.value);
        if (this.isPlaying) {
          // Restart current name with updated pacing
          this.playCurrentName();
        }
      };
    }

    const closeCompletionBtn = document.getElementById('btnCloseJapCompletion');
    if (closeCompletionBtn && this.completionModal) {
      closeCompletionBtn.onclick = () => {
        this.completionModal.classList.remove('modal-visible');
        if (window.DivineAudio) {
          window.DivineAudio.duckAmbience(false);
        }
      };
    }
  }

  renderBeadRing() {
    if (!this.beadRingContainer) return;
    this.beadRingContainer.innerHTML = '';

    const totalBeads = 108;
    const radius = 142; // Radius matching SVG track
    const center = 170; // Center in 340x340 container

    for (let i = 0; i < totalBeads; i++) {
      const angle = (i / totalBeads) * (Math.PI * 2) - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      const bead = document.createElement('div');
      const isSumeru = (i === 0);
      bead.className = `mandala-bead ${i === this.currentIndex ? 'bead-current' : (i < this.currentIndex ? 'bead-passed' : '')} ${isSumeru ? 'bead-sumeru' : ''}`;
      bead.id = `bead-${i}`;
      bead.style.left = `${x}px`;
      bead.style.top = `${y}px`;
      bead.title = `नाम ${i + 1}`;

      bead.onclick = (e) => {
        e.stopPropagation();
        this.stopCurrentAudio();
        this.currentIndex = i;
        if (this.isPlaying) {
          this.playCurrentName();
        } else {
          this.updateDisplay(true);
        }
      };

      this.beadRingContainer.appendChild(bead);
    }
  }

  startJap() {
    this.isPlaying = true;
    if (this.playBtn) this.playBtn.style.display = 'none';
    if (this.pauseBtn) this.pauseBtn.style.display = 'inline-flex';

    if (window.DivineAudio) {
      window.DivineAudio.ensureContext();
      window.DivineAudio.duckAmbience(true);
    }

    this.playCurrentName();
  }

  pauseJap() {
    this.isPlaying = false;
    this.stopCurrentAudio();

    if (this.playBtn) this.playBtn.style.display = 'inline-flex';
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';

    if (window.DivineAudio) {
      window.DivineAudio.duckAmbience(false);
    }
  }

  nextName() {
    this.stopCurrentAudio();
    if (this.currentIndex < this.names.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }

    if (this.isPlaying) {
      this.playCurrentName();
    } else {
      this.updateDisplay(true);
    }
  }

  prevName() {
    this.stopCurrentAudio();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.names.length - 1;
    }

    if (this.isPlaying) {
      this.playCurrentName();
    } else {
      this.updateDisplay(true);
    }
  }

  resetJap() {
    this.stopCurrentAudio();
    this.currentIndex = 0;

    if (this.isPlaying) {
      this.playCurrentName();
    } else {
      this.updateDisplay(true);
    }
  }

  stopCurrentAudio() {
    // Invalidate any in-flight playback sessions
    this.playbackSessionId++;

    // Clear all timeouts
    if (this.pacingTimeout) {
      clearTimeout(this.pacingTimeout);
      this.pacingTimeout = null;
    }
    if (this.prepTimeout) {
      clearTimeout(this.prepTimeout);
      this.prepTimeout = null;
    }
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }

    // Stop HTML5 Audio instance
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
      } catch (e) {}
      this.currentAudio = null;
    }

    // Stop SpeechSynthesis if speaking
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    this.activeUtterance = null;
    this.isSpeaking = false;
    if (this.cardDetails) this.cardDetails.classList.remove('is-chanting');
    if (this.audioWave) this.audioWave.classList.remove('active');
  }

  playCurrentName() {
    if (!this.names || this.names.length === 0) return;
    const item = this.names[this.currentIndex];
    if (!item) return;

    // Stop previous audio and invalidate prior async tokens
    this.stopCurrentAudio();
    const sessionId = this.playbackSessionId;

    // Update UI visuals synchronously
    this.updateDisplay(false);

    // If Jap is not actively running, do not play sound
    if (!this.isPlaying) return;

    // Duck ambience
    if (window.DivineAudio) {
      window.DivineAudio.ensureContext();
      window.DivineAudio.duckAmbience(true);
    }

    // Preparation pause before starting speech (e.g. 0.5s)
    this.prepTimeout = setTimeout(() => {
      if (!this.isPlaying || this.playbackSessionId !== sessionId) return;

      this.isSpeaking = true;
      if (this.cardDetails) this.cardDetails.classList.add('is-chanting');
      if (this.audioWave) this.audioWave.classList.add('active');

      this.speakMantra(item.mantra, sessionId);
    }, this.prepDelay);
  }

  speakMantra(mantraText, sessionId) {
    if (!('speechSynthesis' in window)) {
      // Fallback if browser lacks Web Speech
      this.speechTimeout = setTimeout(() => {
        this.handleNameSpeechFinished(sessionId);
      }, 2500);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(mantraText);
      this.activeUtterance = utterance; // Prevent garbage collection

      utterance.volume = this.japVolume;
      utterance.rate = this.speechRate;   // Calm, peaceful Sanskrit pronunciation
      utterance.pitch = 0.96;              // Warm resonant tone

      // Select authentic Hindi/Sanskrit voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('sa') || v.lang.includes('mr')) ||
                         voices.find(v => v.name.includes('India') || v.name.includes('Hindi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      let isFinished = false;
      const onDone = () => {
        if (isFinished) return;
        isFinished = true;
        this.handleNameSpeechFinished(sessionId);
      };

      utterance.onend = (e) => {
        // Only trigger completion if this was a valid full spoken utterance
        if (this.playbackSessionId === sessionId && this.isPlaying) {
          onDone();
        }
      };

      utterance.onerror = (e) => {
        // If canceled or interrupted by pause/skip, DO NOT advance
        if (e && (e.error === 'canceled' || e.error === 'interrupted')) {
          return;
        }
        if (this.playbackSessionId === sessionId && this.isPlaying) {
          onDone();
        }
      };

      // Safety timeout: only triggers if browser speech synthesis hangs indefinitely
      this.speechTimeout = setTimeout(() => {
        if (!isFinished && this.playbackSessionId === sessionId && this.isPlaying) {
          onDone();
        }
      }, 5500);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error", err);
      this.handleNameSpeechFinished(sessionId);
    }
  }

  handleNameSpeechFinished(sessionId) {
    if (this.playbackSessionId !== sessionId || !this.isPlaying) return;

    this.isSpeaking = false;
    this.activeUtterance = null;
    if (this.cardDetails) this.cardDetails.classList.remove('is-chanting');
    if (this.audioWave) this.audioWave.classList.remove('active');

    // ONLY after full speech completion, start the peaceful pause
    this.pacingTimeout = setTimeout(() => {
      if (this.playbackSessionId !== sessionId || !this.isPlaying) return;

      if (this.currentIndex < this.names.length - 1) {
        this.currentIndex++;
        this.playCurrentName();
      } else {
        // Completed 108 / 108
        this.triggerCompletion();
      }
    }, this.pacingDelay);
  }

  updateDisplay(playSound = false) {
    if (!this.names || this.names.length === 0) return;
    const item = this.names[this.currentIndex];
    if (!item) return;

    if (this.counterText) {
      this.counterText.textContent = `${item.id} / 108`;
    }
    if (this.mantraText) {
      this.mantraText.textContent = item.mantra;
    }
    if (this.transliterationText) {
      this.transliterationText.textContent = item.transliteration || '';
    }
    if (this.nameHindiText) {
      this.nameHindiText.textContent = item.nameHindi;
    }
    if (this.nameEnglishText) {
      this.nameEnglishText.textContent = item.nameEnglish;
    }
    if (this.meaningHindiText) {
      this.meaningHindiText.textContent = item.meaningHindi;
    }
    if (this.meaningEnglishText) {
      this.meaningEnglishText.textContent = item.meaningEnglish;
    }

    // Circular Progress SVG stroke
    if (this.progressCircle) {
      const radius = 142;
      const circumference = 2 * Math.PI * radius;
      const progress = (this.currentIndex + 1) / 108;
      const offset = circumference - (progress * circumference);
      this.progressCircle.style.strokeDasharray = `${circumference}`;
      this.progressCircle.style.strokeDashoffset = `${offset}`;
    }

    // Update Beads
    for (let i = 0; i < 108; i++) {
      const b = document.getElementById(`bead-${i}`);
      if (b) {
        b.className = `mandala-bead ${i === this.currentIndex ? 'bead-current' : (i < this.currentIndex ? 'bead-passed' : '')} ${i === 0 ? 'bead-sumeru' : ''}`;
      }
    }

    // Play subtle soft bell on manual bead navigation
    if (playSound && window.DivineAudio && !this.isPlaying) {
      window.DivineAudio.playTempleBell(0.32);
    }

    this.savePersistedIndex();
  }

  triggerCompletion() {
    this.isPlaying = false;
    this.stopCurrentAudio();

    if (this.playBtn) this.playBtn.style.display = 'inline-flex';
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';

    console.log("🌸 108 Krishna Names Jap Completed!");

    if (this.completionModal) {
      this.completionModal.classList.add('modal-visible');
    }

    if (window.DivineAudio) {
      window.DivineAudio.playShankh(3.2);
      window.DivineAudio.playCelebrationSound();
      window.DivineAudio.duckAmbience(false);
    }

    if (window.DivineParticles) {
      window.DivineParticles.spawnCelebrationPetals(100);
    }
  }
}

// Global Jap Controller Singleton
window.Jap108 = new Jap108Controller();
