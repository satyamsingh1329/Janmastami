/**
 * Krishna Divine Experience & Sacred Hindi Message Controller
 * Displays the sacred sitting portrait cleanly and delivers the divine 1.0x paced Hindi message.
 */

class KrishnaRevealController {
  constructor() {
    this.isRevealed = false;
    this.isMessagePlaying = false;
    this.currentLineIndex = 0;
    this.typewriterTimeout = null;
    this.speechRate = 1.0; // Strictly locked at authentic 1.0x speed
    this.voiceEnabled = true;

    // Heartfelt Poetic Hindi Message
    this.messageLines = [
      "हे मेरे प्रिय, इस पावन रात्रि में तुम्हारा यहाँ आना कोई संयोग नहीं है। तुम्हारे हृदय के हर भाव और हर प्रार्थना को मैं भली-भांति जानता हूँ।",
      "जीवन में परिस्थितियाँ चाहे कितनी भी कठिन क्यों न हों, यदि तुम्हारा विश्वास अटूट है तो संसार की कोई भी शक्ति तुम्हें डिगा नहीं सकती।",
      "समय जब परीक्षा ले, तब धैर्य मत खोना। अंधकार कितना भी गहरा क्यों न हो, एक छोटा सा दीपक भी उसे मिटाने के लिए पर्याप्त होता है।",
      "कर्म तुम्हारा अधिकार है, फल का विधान मुझ पर छोड़ दो। जो निष्काम भाव से अपना सच्चा प्रयास करता है, उसका मार्ग मैं स्वयं प्रशस्त करता हूँ।",
      "जो बीत गया, उसे लेकर मन को व्यथित मत करो। जो आने वाला है, उस पर पूर्ण श्रद्धा रखो क्योंकि मेरी बनाई हर योजना तुम्हें तुम्हारी सच्ची मंजिल के और करीब ले जा रही है।",
      "जब सफलता मिले तो अहंकार नहीं, कृतज्ञता व्यक्त करना; और जब मार्ग समझ न आए, तो आंखें मूंदकर मुझ पर विश्वास करना।",
      "अपने परिवार में प्रेम बनाए रखो, अपने मन में शांति स्थापित करो, और हर जीव के प्रति करुणा का भाव रखो।",
      "सदा स्मरण रखना—तुम इस संसार में कभी अकेले नहीं हो। तुम्हारी हर श्वास में, हर क्षण, हर परिस्थिति में मैं तुम्हारे साथ हूँ।",
      "तुम्हारे घर में सुख-समृद्धि, उत्तम स्वास्थ्य और असीम आनंद का प्रकाश सदा आलोकित रहे।",
      "राधे राधे। जय श्री कृष्ण।"
    ];

    // DOM Elements
    this.sittingContainer = null;
    this.messageContainer = null;
    this.startMessageBtn = null;
    this.playBtn = null;
    this.pauseBtn = null;
    this.replayBtn = null;
    this.voiceToggleBtn = null;
  }

  init() {
    this.sittingContainer = document.getElementById('krishnaSittingVisual');
    this.messageContainer = document.getElementById('krishnaMessageDisplay');
    this.startMessageBtn = document.getElementById('btnStartKrishnaMessage');
    this.playBtn = document.getElementById('btnPlayMessage');
    this.pauseBtn = document.getElementById('btnPauseMessage');
    this.replayBtn = document.getElementById('btnReplayMessage');
    this.voiceToggleBtn = document.getElementById('btnToggleVoice');

    this.bindEvents();
  }

  bindEvents() {
    if (this.startMessageBtn) {
      this.startMessageBtn.addEventListener('click', () => {
        this.startSpeakingExperience();
      });
    }

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.playMessage());
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.pauseMessage());
    }

    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        this.currentLineIndex = 0;
        this.playMessage();
      });
    }

    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.addEventListener('click', () => {
        this.voiceEnabled = !this.voiceEnabled;
        this.voiceToggleBtn.innerHTML = this.voiceEnabled
          ? '🗣️ वाणी: चालू'
          : '🔇 वाणी: बंद';
        if (!this.voiceEnabled && window.DivineAudio) {
          window.DivineAudio.stopSpeech();
        }
      });
    }
  }

  startSpeakingExperience() {
    if (this.startMessageBtn) this.startMessageBtn.style.display = 'none';
    const messageCard = document.getElementById('krishnaMessageContentCard');
    if (messageCard) messageCard.style.display = 'block';

    if (this.sittingContainer) {
      this.sittingContainer.classList.add('visual-speaking-mode');
    }

    this.currentLineIndex = 0;
    this.playMessage();
  }

  playMessage() {
    if (!this.messageContainer) return;
    this.isMessagePlaying = true;
    if (this.playBtn) this.playBtn.style.display = 'none';
    if (this.pauseBtn) this.pauseBtn.style.display = 'inline-flex';
    if (this.replayBtn) this.replayBtn.style.display = 'none';

    // Duck background ambience while Krishna speaks
    if (window.DivineAudio) {
      window.DivineAudio.ensureContext();
      window.DivineAudio.duckAmbience(true);
    }

    this.typeNextLine();
  }

  typeNextLine() {
    if (!this.isMessagePlaying) return;

    if (this.currentLineIndex >= this.messageLines.length) {
      this.isMessagePlaying = false;

      if (this.playBtn) this.playBtn.style.display = 'none';
      if (this.pauseBtn) this.pauseBtn.style.display = 'none';
      if (this.replayBtn) this.replayBtn.style.display = 'inline-flex';

      // Restore background ambience
      if (window.DivineAudio) {
        window.DivineAudio.duckAmbience(false);
        if (window.DivineAudio.settings.autoBellEnabled) {
          window.DivineAudio.playTempleBell(0.4);
        }
      }
      if (window.DivineParticles) {
        window.DivineParticles.spawnCelebrationPetals(50);
      }
      return;
    }

    const currentLineText = this.messageLines[this.currentLineIndex];

    // Soft bell at start and final line
    if (window.DivineAudio && window.DivineAudio.settings.autoBellEnabled) {
      if (this.currentLineIndex === 0 || this.currentLineIndex === this.messageLines.length - 1) {
        window.DivineAudio.playTempleBell(0.35);
      }
    }

    // Speak Hindi at authentic 1.0x rate
    if (this.voiceEnabled && window.DivineAudio) {
      window.DivineAudio.speakHindi(
        currentLineText,
        1.0,
        null,
        null,
        null
      );
    }

    // Render HTML line with animated highlight
    this.renderLinesUpTo(this.currentLineIndex);

    this.currentLineIndex++;

    // Calculate delay at 1.0x speed
    const baseDuration = currentLineText.length * 75;
    const delay = Math.max(3000, baseDuration);

    this.typewriterTimeout = setTimeout(() => {
      this.typeNextLine();
    }, delay);
  }

  renderLinesUpTo(index) {
    if (!this.messageContainer) return;

    let html = '';
    for (let i = 0; i <= index; i++) {
      const isLatest = i === index;
      const isSpecial = i >= this.messageLines.length - 2;
      html += `
        <p class="hindi-msg-line ${isLatest ? 'latest-line' : 'past-line'} ${isSpecial ? 'sacred-highlight' : ''}">
          <span class="line-bullet">🦚</span>
          ${this.messageLines[i]}
        </p>
      `;
    }

    this.messageContainer.innerHTML = html;
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  pauseMessage() {
    this.isMessagePlaying = false;

    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
      this.typewriterTimeout = null;
    }
    if (this.playBtn) this.playBtn.style.display = 'inline-flex';
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';

    if (window.DivineAudio) {
      window.DivineAudio.stopSpeech();
      window.DivineAudio.duckAmbience(false);
    }
  }
}

// Global Krishna Reveal Singleton
window.KrishnaReveal = new KrishnaRevealController();
