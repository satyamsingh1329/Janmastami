/**
 * Web Audio API Sound Engine & Synthesizer
 * Zero-dependency procedural synthesis for Bansuri (Flute), Temple Bell, Rain, Thunder, Peacock, Shankh & River ambience.
 * Supports audio ducking during speech, soft bell harmonics, and natural speaking pace.
 */

class DivineSoundEngine {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.isMuted = false;
    this.masterGain = null;
    
    // Channel Gain Nodes
    this.gains = {
      flute: null,
      bell: null,
      rain: null,
      thunder: null,
      peacock: null,
      river: null,
      ambient: null
    };

    // Active Node References
    this.activeNodes = {
      fluteInterval: null,
      rainSource: null,
      riverSource: null,
      ambientDrone: null,
      peacockInterval: null
    };

    // State
    this.settings = {
      masterVolume: 0.8,
      fluteVolume: 0.65,
      bellVolume: 0.28,      // Significantly softened, pleasant & peaceful
      rainVolume: 0.35,
      thunderVolume: 0.7,
      peacockVolume: 0.45,
      riverVolume: 0.35,
      autoBellEnabled: true,
      speechRate: 1.0        // Sacred, authentic 1.0x natural speech pace
    };

    this.isFlutePlaying = false;
    this.isRainPlaying = false;
    this.isRiverPlaying = false;
    this.lastBellTime = 0;
    this.isDucked = false;

    this.loadPersistedSettings();
  }

  loadPersistedSettings() {
    try {
      const saved = localStorage.getItem('krishna_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
      const savedMute = localStorage.getItem('krishna_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {
      console.warn("LocalStorage audio settings error", e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('krishna_audio_settings', JSON.stringify(this.settings));
      localStorage.setItem('krishna_audio_muted', this.isMuted.toString());
    } catch (e) {}
  }

  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return Promise.resolve();
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("Web Audio API not supported on this browser.");
        return Promise.resolve();
      }

      this.ctx = new AudioContextClass();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.settings.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create individual channel gains
      Object.keys(this.gains).forEach(channel => {
        const gainNode = this.ctx.createGain();
        const settingKey = `${channel}Volume`;
        const vol = this.settings[settingKey] !== undefined ? this.settings[settingKey] : 0.5;
        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
        gainNode.connect(this.masterGain);
        this.gains[channel] = gainNode;
      });

      this.isInitialized = true;
      console.log("🌸 Divine Web Audio Engine initialized.");
      return Promise.resolve();
    } catch (err) {
      console.error("Failed to initialize AudioContext:", err);
      return Promise.resolve();
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.settings.masterVolume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    this.saveSettings();
    return this.isMuted;
  }

  toggleMute() {
    return this.setMute(!this.isMuted);
  }

  setChannelVolume(channel, value) {
    if (this.settings[`${channel}Volume`] !== undefined) {
      this.settings[`${channel}Volume`] = Math.max(0, Math.min(1, value));
      if (this.gains[channel] && this.ctx && !this.isDucked) {
        this.gains[channel].gain.setTargetAtTime(this.settings[`${channel}Volume`], this.ctx.currentTime, 0.05);
      }
      this.saveSettings();
    }
  }

  setMasterVolume(value) {
    this.settings.masterVolume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.settings.masterVolume, this.ctx.currentTime, 0.05);
    }
    this.saveSettings();
  }

  /**
   * Audio Ducking: Reduces background flute/rain/river while Krishna is speaking
   */
  duckAmbience(enable) {
    this.isDucked = enable;
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fadeTime = 0.6;

    if (enable) {
      // Duck down
      if (this.gains.flute) this.gains.flute.gain.setTargetAtTime(0.12, now, fadeTime);
      if (this.gains.rain) this.gains.rain.gain.setTargetAtTime(0.08, now, fadeTime);
      if (this.gains.river) this.gains.river.gain.setTargetAtTime(0.08, now, fadeTime);
      if (this.gains.peacock) this.gains.peacock.gain.setTargetAtTime(0.05, now, fadeTime);
    } else {
      // Restore normal
      if (this.gains.flute) this.gains.flute.gain.setTargetAtTime(this.settings.fluteVolume, now, fadeTime);
      if (this.gains.rain) this.gains.rain.gain.setTargetAtTime(this.settings.rainVolume, now, fadeTime);
      if (this.gains.river) this.gains.river.gain.setTargetAtTime(this.settings.riverVolume, now, fadeTime);
      if (this.gains.peacock) this.gains.peacock.gain.setTargetAtTime(this.settings.peacockVolume, now, fadeTime);
    }
  }

  // ==========================================
  // PROCEDURAL SOUND SYNTHESIS
  // ==========================================

  /**
   * Soft, warm temple bell chime with debouncing to prevent overlapping loudness
   */
  playTempleBell(intensity = 0.8) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Debounce rapid clicks: minimum 250ms interval between bell strikes
    if (now - this.lastBellTime < 0.25) {
      return;
    }
    this.lastBellTime = now;

    try {
      const baseFreq = 528; // Sacred Solfeggio 528Hz Temple Bell fundamental
      const harmonics = [
        { mult: 1.0, gain: 0.35, decay: 2.8 },
        { mult: 2.01, gain: 0.22, decay: 2.2 },
        { mult: 3.02, gain: 0.12, decay: 1.8 },
        { mult: 4.18, gain: 0.08, decay: 1.2 }
      ];

      const bellMaster = this.ctx.createGain();
      // Keep master gain soft
      bellMaster.gain.setValueAtTime(0.35 * intensity * this.settings.bellVolume, now);
      bellMaster.connect(this.gains.bell);

      harmonics.forEach(h => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h.mult, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * h.mult * 0.998, now + h.decay);

        // Amplitude Envelope: Soft strike, exponential decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(h.gain * intensity, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gain);
        gain.connect(bellMaster);

        osc.start(now);
        osc.stop(now + h.decay + 0.05);
      });

    } catch (e) {
      console.warn("Temple bell synth error", e);
    }
  }

  /**
   * Divine Shankh (Conch Shell) Blow
   */
  playShankh(duration = 3.5) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const shankhGain = this.ctx.createGain();
      shankhGain.connect(this.gains.flute);

      const baseFreq = 220; // A3
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.linearRampToValueAtTime(baseFreq * 1.04, now + duration * 0.6);
      osc1.frequency.linearRampToValueAtTime(baseFreq, now + duration);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(950, now + duration * 0.4);
      filter.frequency.linearRampToValueAtTime(450, now + duration);
      filter.Q.setValueAtTime(3.0, now);

      shankhGain.gain.setValueAtTime(0, now);
      shankhGain.gain.linearRampToValueAtTime(0.4, now + 1.0);
      shankhGain.gain.setValueAtTime(0.4, now + duration - 1.0);
      shankhGain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(shankhGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.1);
      osc2.stop(now + duration + 0.1);
    } catch (e) {
      console.warn("Shankh synth error", e);
    }
  }

  /**
   * Divine Bansuri (Flute) Melody Synthesis
   */
  startFluteMelody() {
    this.ensureContext();
    if (this.isFlutePlaying || !this.ctx) return;
    this.isFlutePlaying = true;

    const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];
    const melodyPhrases = [
      [0, 1, 2, 3, 2, 1, 0],
      [2, 3, 4, 5, 4, 3, 2],
      [5, 4, 3, 2, 3, 4, 3],
      [0, 2, 3, 4, 5, 4, 2, 0],
      [3, 4, 5, 6, 5, 4, 3],
      [5, 4, 3, 2, 1, 0]
    ];

    let phraseIdx = 0;
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isFlutePlaying || !this.ctx || this.isMuted) return;

      const currentPhrase = melodyPhrases[phraseIdx];
      const notePitch = scale[currentPhrase[noteIdx]];
      const noteDuration = 0.8 + Math.random() * 0.5;

      this.playFluteNote(notePitch, noteDuration);

      noteIdx++;
      if (noteIdx >= currentPhrase.length) {
        noteIdx = 0;
        phraseIdx = (phraseIdx + 1) % melodyPhrases.length;
        const restDuration = 1400 + Math.random() * 1600;
        this.activeNodes.fluteInterval = setTimeout(playNextNote, restDuration);
      } else {
        const nextTime = (noteDuration * 0.85) * 1000;
        this.activeNodes.fluteInterval = setTimeout(playNextNote, nextTime);
      }
    };

    playNextNote();
  }

  stopFluteMelody() {
    this.isFlutePlaying = false;
    if (this.activeNodes.fluteInterval) {
      clearTimeout(this.activeNodes.fluteInterval);
      this.activeNodes.fluteInterval = null;
    }
  }

  playFluteNote(freq, duration) {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const noteGain = this.ctx.createGain();
      noteGain.connect(this.gains.flute);

      const oscPrimary = this.ctx.createOscillator();
      oscPrimary.type = 'sine';
      oscPrimary.frequency.setValueAtTime(freq, now);

      const oscOvertone = this.ctx.createOscillator();
      oscOvertone.type = 'sine';
      oscOvertone.frequency.setValueAtTime(freq * 2, now);
      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.14, now);
      oscOvertone.connect(overtoneGain);
      overtoneGain.connect(noteGain);

      // Vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.2, now);
      lfoGain.gain.setValueAtTime(freq * 0.012, now);
      lfo.connect(oscPrimary.frequency);
      lfo.connect(oscOvertone.frequency);
      lfo.start(now + 0.15);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.4, now + 0.16);
      noteGain.gain.setValueAtTime(0.35, now + duration * 0.6);
      noteGain.gain.linearRampToValueAtTime(0.0001, now + duration);

      oscPrimary.connect(noteGain);
      oscPrimary.start(now);
      oscOvertone.start(now);

      oscPrimary.stop(now + duration + 0.05);
      oscOvertone.stop(now + duration + 0.05);
      lfo.stop(now + duration + 0.05);

    } catch (e) {
      console.warn("Flute note synth error", e);
    }
  }

  /**
   * Continuous Rain Generator
   */
  startRain() {
    this.ensureContext();
    if (this.isRainPlaying || !this.ctx) return;
    this.isRainPlaying = true;

    try {
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.25;
          data[i] = (b0 + b1 + b2) * 0.18;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2800, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(350, this.ctx.currentTime);

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(this.gains.rain);

      source.start(0);
      this.activeNodes.rainSource = source;
    } catch (e) {
      console.warn("Rain synth error", e);
    }
  }

  stopRain() {
    this.isRainPlaying = false;
    if (this.activeNodes.rainSource) {
      try {
        this.activeNodes.rainSource.stop();
        this.activeNodes.rainSource.disconnect();
      } catch (e) {}
      this.activeNodes.rainSource = null;
    }
  }

  /**
   * Cinematic Thunder Rumble
   */
  playThunder() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 3.8;
      const thunderGain = this.ctx.createGain();
      thunderGain.connect(this.gains.thunder);

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 2.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(55, now + duration);

      noise.connect(filter);
      filter.connect(thunderGain);

      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(68, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + duration);

      subGain.gain.setValueAtTime(0.6, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      subOsc.connect(subGain);
      subGain.connect(thunderGain);

      thunderGain.gain.setValueAtTime(0, now);
      thunderGain.gain.linearRampToValueAtTime(0.85, now + 0.08);
      thunderGain.gain.setValueAtTime(0.65, now + 0.7);
      thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.start(now);
      subOsc.start(now);
      noise.stop(now + duration);
      subOsc.stop(now + duration);
    } catch (e) {
      console.warn("Thunder synth error", e);
    }
  }

  /**
   * Peacock Call (Mayur Vani)
   */
  playPeacockCall() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const callGain = this.ctx.createGain();
      callGain.connect(this.gains.peacock);

      const makeChirp = (startTime, duration, startFreq, endFreq) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, startTime);
        filter.Q.setValueAtTime(3.0, startTime);

        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(0.25, startTime + duration * 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(g);
        g.connect(callGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      };

      makeChirp(now, 0.4, 1400, 2300);
      makeChirp(now + 0.45, 0.8, 2100, 1100);

    } catch (e) {
      console.warn("Peacock call synth error", e);
    }
  }

  startPeacockAmbience() {
    if (this.activeNodes.peacockInterval) return;
    const scheduleNext = () => {
      const interval = 15000 + Math.random() * 20000;
      this.activeNodes.peacockInterval = setTimeout(() => {
        this.playPeacockCall();
        scheduleNext();
      }, interval);
    };
    scheduleNext();
  }

  startRiverAmbience() {
    this.ensureContext();
    if (this.isRiverPlaying || !this.ctx) return;
    this.isRiverPlaying = true;

    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + (0.012 * white)) / 1.012;
          data[i] = last * 1.5;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(this.gains.river);

      source.start(0);
      this.activeNodes.riverSource = source;
    } catch (e) {
      console.warn("River ambience error", e);
    }
  }

  playCelebrationSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    this.playTempleBell(0.6);
    setTimeout(() => this.playTempleBell(0.5), 260);
    this.playShankh(2.8);
  }

  /**
   * Speech Synthesis for Krishna's Hindi Sacred Message (Strict 1.0x Rate)
   */
  speakHindi(text, rate = 1.0, onStart, onBoundary, onEnd) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis not supported in this browser.");
      if (onEnd) onEnd();
      return null;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = rate || this.settings.speechRate || 1.0;
    utterance.pitch = 0.98; // Warm, peaceful, natural male tone

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onBoundary) utterance.onboundary = onBoundary;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Global Sound Engine Singleton
window.DivineAudio = new DivineSoundEngine();
