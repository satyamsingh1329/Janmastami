# 🌙🦚 SHRI KRISHNA JANMASHTAMI — CINEMATIC INTERACTIVE DIGITAL EXPERIENCE
### *"MIDNIGHT VRINDAVAN — THE DIVINE MOMENT"*

A completely original, highly immersive, cinematic and interactive **Shri Krishna Janmashtami Digital Experience Website** built with **100% Frontend Technologies** (HTML5, CSS3, Vanilla JavaScript, Web Audio API, Canvas API, SVG, Web Share API, LocalStorage).

> **Important Note:** This project contains **NO Python, Flask, Node.js, PHP, database, or backend server**. It runs completely client-side in any modern web browser.

---

## 🌟 Key Features

1. **Midnight Vrindavan Atmosphere**:
   - Deep midnight blue sky with dynamic twinkling stars and shooting meteors.
   - Live flowing holy **Yamuna River** with physics-based wave reflections, moon shimmer, and floating glowing diyas.
   - Swirling golden **fireflies (Jugnu)** drifting gently across Kadamba grove silhouettes.
   - Dual-canvas architecture optimized for silky 60 FPS performance.

2. **Custom Peacock Feather Cursor (Desktop) & Touch Sparks (Mobile)**:
   - Physics-driven peacock feather SVG following cursor with velocity-based tilt angle.
   - Emits golden sparks and brightens with glowing aura upon hovering interactive elements.

3. **Suspenseful Opening & Seamless Web Audio Activation**:
   - Eerie, atmospheric midnight darkness.
   - Smooth initial unlock complying with modern browser autoplay policies.

4. **Real-time Midnight Countdown & Fast-Forward Testing Mode**:
   - Real-time countdown clock tracking the exact 12:00:00 midnight moment.
   - **⚡ 10s Test Mode & Instant Trigger buttons** for developers, judges, and reviewers to test the 12:00 sequence instantly.

5. **Exact 12:00 Divine Birth Cinematic Sequence**:
   - Total momentary silence & pitch dark.
   - Blinding celestial flash across the screen.
   - Procedural multi-branch lightning drawn live on Canvas.
   - Rolling sub-bass thunder rumble and screen vibration.
   - Monsoon rain storm with splash ripples on Yamuna.
   - Sacred Shankh (Conch) blow and echoing temple bells.
   - Divine Bansuri (Flute) melody.
   - Grand Reveal of Bhagwan Shri Krishna with luminous golden-blue aura and flower shower!

6. **Divine Krishna Darshan & Sacred Hindi Message**:
   - High-definition sacred portrait of Shri Krishna with animated celestial halo.
   - Complete sacred Hindi message delivered via word-by-word typewriter effect.
   - Synchronized Web Speech API voice narration and Web Audio flute background.

7. **108 Sacred Names of Shri Krishna (अष्टोत्तर शतनामावली)**:
   - **108 distinct, non-repeating, verified authentic names**.
   - Circular mandala progress tracker with 108 glowing clickable beads.
   - Sanskrit Mantras, Hindi names, English transliterations, and meanings.
   - **Auto-Jap mode** with customizable chanting speed and bead chimes.
   - Grand darshan celebration upon 108th name completion.

8. **Interactive 3D Digital Temple Bell (दिव्य मंदिर घंटी)**:
   - Realistic physical swinging bell with damping physics and clapper movement.
   - Radiates expanding golden shockwave ripples.
   - Web Audio multi-oscillator physical bronze bell chime synthesis.
   - Automatic Bell Mode during sacred prayers.

9. **Playable "माखन मिश्री दही-हांडी" (Dahi-Handi) Mini-Game**:
   - Physics-based jump timing game on Canvas.
   - Little Kanha leaps towards the swinging decorated pot.
   - Butter splatter particle burst, festive confetti, live score, and high score tracking.
   - Unlocks special Janmashtami blessing darshan upon breaking pots.

10. **Janmashtami Wish Card Generator (अपनी शुभकामना भेजें)**:
    - Custom sender name, family name, city, and personalized greetings or preset Vedic blessings.
    - 4 Divine Themes (Midnight Vrindavan, Golden Gokul, Peacock Emerald, Mystic Yamuna).
    - Rendered live on high-definition HTML5 Canvas with royal golden borders and peacock emblems.
    - **📥 Instant PNG Download**, **📲 Web Share API integration**, and **📋 One-click copy wish text**.

11. **Procedural Web Audio API Sound Synthesizer (Zero External Dependencies)**:
    - Bansuri / Flute Synth (Raag Yaman / Bhupali phrases with warm vibrato & breath noise).
    - Temple Bell Harmonics (528 Hz bronze resonance with exponential decay).
    - Monsoon Rain & Yamuna River flow generators.
    - Sub-bass Thunder generator & Mayur Vani (Peacock call) glissando.
    - Also supports loading local MP3 audio files if placed in `/audio/`.

---

## 📁 Project Structure

```
/
├── index.html                  # Master Single Page Application
├── css/
│   └── style.css               # Luxury celestial dark theme, glassmorphism & responsive CSS
├── js/
│   ├── main.js                 # App orchestrator, custom cursor, quick nav & accessibility
│   ├── audio.js                # Web Audio API procedural sound engine & mixer
│   ├── particles.js            # Dual Canvas engine: Stars, Yamuna, Rain, Fireflies & Aura
│   ├── countdown.js            # Midnight countdown timer & 10s Demo mode
│   ├── midnight-transition.js  # 12:00 Birth Sequence: Flash, Lightning, Thunder & Reveal
│   ├── krishna-reveal.js       # Krishna avatar aura & Hindi typewriter message narration
│   ├── jap108.js               # 108 distinct Krishna names Jap Mala & circular mandala
│   ├── temple-bell.js          # Interactive 3D temple bell with swing physics & auto-mode
│   ├── dahi-handi.js           # Playable Canvas Dahi-Handi mini-game
│   └── wish-card.js            # Instant HTML5 Canvas Janmashtami Wish Card generator
├── data/
│   └── krishna-108-names.js    # 108 distinct sacred names dataset with Sanskrit mantras
├── images/
│   ├── vrindavan-night.jpg     # Midnight Vrindavan background artwork
│   ├── krishna.jpg             # Divine Bhagwan Shri Krishna portrait
│   ├── dahi-handi.jpg          # Decorated earthen Dahi Handi pot
│   ├── little-bal-gopal.jpg    # Cute Little Kanha character for game & swing
│   └── peacock-feather.svg     # SVG peacock feather for cursor & ornamentation
├── audio/                      # Optional folder for custom MP3 files (flute.mp3, rain.mp3, etc.)
└── README.md                   # Full documentation & guide
```

---

## 🚀 How to Run Locally

Because this is a **100% frontend-only static website**, you can run it in multiple easy ways:

### Option 1: Direct File Opening
- Simply double-click `index.html` in your file explorer to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari!

### Option 2: Lightweight Local Preview Server
You can also preview via any standard local server tool:
```bash
# Using npx serve
npx -y serve .

# Or using VS Code Live Server extension
```

---

## 🎨 Replacing Images & Audio (Customization)

- **Krishna Portrait**: Replace `images/krishna.jpg` with any image of your choice.
- **Background**: Replace `images/vrindavan-night.jpg`.
- **Dahi Handi**: Replace `images/dahi-handi.jpg`.
- **Little Kanha**: Replace `images/little-bal-gopal.jpg`.
- **Custom MP3 Audio**: Place `flute.mp3`, `rain.mp3`, `thunder.mp3`, `temple-bell.mp3`, or `peacock.mp3` in the `/audio/` folder if you wish to use recorded audio files instead of the built-in procedural Web Audio synthesizer.

---

## ♿ Accessibility & Motion

- Supports keyboard navigation (`Tab`, `Space`, `Enter`).
- Screen reader friendly semantic tags and ARIA live regions.
- **Reduce Motion (♿ कम मोशन)** button toggles reduced particle density, subdued flashes, and smooth transitions.

---

**🌸 राधे राधे • जय श्री कृष्ण 🌸**
*"हाथी घोड़ा पालकी, जय कन्हैया लाल की!"*
