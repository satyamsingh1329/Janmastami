/**
 * Interactive Janmashtami Wish Card Generator (अपनी शुभकामना भेजें)
 * 100% Frontend HTML5 Canvas Card Renderer, High-Res PNG Download,
 * Web Share API integration & formatted clipboard copy.
 */

class WishCardGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 800;
    this.height = 1050;

    // Form inputs
    this.inputName = null;
    this.inputFamily = null;
    this.inputWish = null;
    this.inputCity = null;
    this.themeSelect = null;

    // Buttons
    this.btnGenerate = null;
    this.btnDownload = null;
    this.btnShare = null;
    this.btnCopyWish = null;

    // Assets
    this.krishnaImg = new Image();
    this.krishnaImg.src = 'images/krishna-sitting.jpg';
    this.featherImg = new Image();
    this.featherImg.src = 'images/peacock-feather.svg';

    this.currentTheme = 'vrindavan';
  }

  init() {
    this.canvas = document.getElementById('wishCardCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.inputName = document.getElementById('wishName');
    this.inputFamily = document.getElementById('wishFamily');
    this.inputWish = document.getElementById('wishMessage');
    this.inputCity = document.getElementById('wishCity');
    this.themeSelect = document.getElementById('wishTheme');

    this.btnGenerate = document.getElementById('btnGenerateWish');
    this.btnDownload = document.getElementById('btnDownloadCard');
    this.btnShare = document.getElementById('btnShareCard');
    this.btnCopyWish = document.getElementById('btnCopyWishText');

    this.loadPersistedData();
    this.bindEvents();
    
    // Ensure image loads before first render
    if (this.krishnaImg.complete) {
      this.renderCard();
    } else {
      this.krishnaImg.onload = () => this.renderCard();
    }
  }

  loadPersistedData() {
    try {
      const saved = localStorage.getItem('krishna_wish_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (this.inputName && data.name) this.inputName.value = data.name;
        if (this.inputFamily && data.family) this.inputFamily.value = data.family;
        if (this.inputWish && data.wish) this.inputWish.value = data.wish;
        if (this.inputCity && data.city) this.inputCity.value = data.city;
        if (this.themeSelect && data.theme) this.themeSelect.value = data.theme;
      }
    } catch (e) {}
  }

  saveData() {
    try {
      const data = {
        name: this.inputName ? this.inputName.value : '',
        family: this.inputFamily ? this.inputFamily.value : '',
        wish: this.inputWish ? this.inputWish.value : '',
        city: this.inputCity ? this.inputCity.value : '',
        theme: this.themeSelect ? this.themeSelect.value : 'vrindavan'
      };
      localStorage.setItem('krishna_wish_data', JSON.stringify(data));
    } catch (e) {}
  }

  bindEvents() {
    [this.inputName, this.inputFamily, this.inputWish, this.inputCity].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.saveData();
          this.renderCard();
        });
      }
    });

    if (this.themeSelect) {
      this.themeSelect.addEventListener('change', (e) => {
        this.currentTheme = e.target.value;
        this.saveData();
        this.renderCard();
      });
    }

    document.querySelectorAll('.btn-wish-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-preset');
        if (text && this.inputWish) {
          this.inputWish.value = text;
          this.saveData();
          this.renderCard();
        }
      });
    });

    if (this.btnGenerate) {
      this.btnGenerate.addEventListener('click', () => {
        this.renderCard();
        const previewContainer = document.getElementById('wishCardPreviewSection');
        if (previewContainer) {
          previewContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (this.btnDownload) {
      this.btnDownload.addEventListener('click', () => this.downloadCard());
    }

    if (this.btnShare) {
      this.btnShare.addEventListener('click', () => this.shareCard());
    }

    if (this.btnCopyWish) {
      this.btnCopyWish.addEventListener('click', () => this.copyWishText());
    }
  }

  renderCard() {
    const ctx = this.ctx;
    if (!ctx) return;

    const name = (this.inputName && this.inputName.value.trim()) || 'सत्यम';
    const family = this.inputFamily ? this.inputFamily.value.trim() : '';
    const wish = (this.inputWish && this.inputWish.value.trim()) || 'भगवान श्री कृष्ण आपके जीवन में सुख, शांति, समृद्धि और अपार आनंद का संचार करें!';
    const city = this.inputCity ? this.inputCity.value.trim() : '';

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Theme Gradient Background
    let bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.currentTheme === 'gold') {
      bgGrad.addColorStop(0, '#1a1100');
      bgGrad.addColorStop(0.5, '#382200');
      bgGrad.addColorStop(1, '#0d0800');
    } else if (this.currentTheme === 'peacock') {
      bgGrad.addColorStop(0, '#011926');
      bgGrad.addColorStop(0.5, '#00353f');
      bgGrad.addColorStop(1, '#001420');
    } else if (this.currentTheme === 'yamuna') {
      bgGrad.addColorStop(0, '#020b2e');
      bgGrad.addColorStop(0.5, '#004e89');
      bgGrad.addColorStop(1, '#01122a');
    } else {
      // Midnight Vrindavan
      bgGrad.addColorStop(0, '#040b19');
      bgGrad.addColorStop(0.5, '#0a1936');
      bgGrad.addColorStop(1, '#020610');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Stars & Divine Light Particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 50; i++) {
      const sx = (i * 79) % this.width;
      const sy = (i * 97) % this.height;
      const sr = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sr * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ornate Double Golden Border
    ctx.strokeStyle = '#e0a93b';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, this.width - 60, this.height - 60);

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, this.width - 84, this.height - 84);

    // Corner Flourishes
    const drawCorner = (x, y, flipX, flipY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.quadraticCurveTo(0, 0, 28, 0);
      ctx.moveTo(0, 40);
      ctx.quadraticCurveTo(0, 0, 40, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(9, 9, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd166';
      ctx.fill();
      ctx.restore();
    };

    drawCorner(50, 50, false, false);
    drawCorner(this.width - 50, 50, true, false);
    drawCorner(50, this.height - 50, false, true);
    drawCorner(this.width - 50, this.height - 50, true, true);

    // 4. Header Sacred Mantra
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd166';
    ctx.font = '700 28px "Cinzel Decorative", serif';
    ctx.shadowColor = '#ffb703';
    ctx.shadowBlur = 16;
    ctx.fillText('॥ श्री कृष्णाय नमः ॥', this.width / 2, 95);
    ctx.shadowBlur = 0;

    // 5. Circle Avatar / Krishna Thumbnail
    const avatarY = 225;
    const avatarR = 90;

    const haloGrad = ctx.createRadialGradient(this.width / 2, avatarY, avatarR * 0.7, this.width / 2, avatarY, avatarR * 1.35);
    haloGrad.addColorStop(0, 'rgba(255, 209, 102, 0.85)');
    haloGrad.addColorStop(0.5, 'rgba(114, 239, 221, 0.45)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(this.width / 2, avatarY, avatarR * 1.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.width / 2, avatarY, avatarR, 0, Math.PI * 2);
    ctx.clip();
    if (this.krishnaImg.complete && this.krishnaImg.naturalWidth > 0) {
      ctx.drawImage(this.krishnaImg, (this.width / 2) - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
    } else {
      ctx.fillStyle = '#0077b6';
      ctx.fillRect((this.width / 2) - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = '40px sans-serif';
      ctx.fillText('🦚', this.width / 2, avatarY + 15);
    }
    ctx.restore();

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(this.width / 2, avatarY, avatarR, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Title Heading
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "Rozha One", serif';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 18;
    ctx.fillText('श्री कृष्ण जन्माष्टमी', this.width / 2, 375);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffd166';
    ctx.font = '500 20px "Poppins", sans-serif';
    ctx.fillText('की पावन एवं हार्दिक शुभकामनाएँ', this.width / 2, 412);

    // Decorative Line with Peacock symbol
    ctx.strokeStyle = '#e0a93b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 438);
    ctx.lineTo(this.width / 2 - 30, 438);
    ctx.moveTo(this.width / 2 + 30, 438);
    ctx.lineTo(this.width - 180, 438);
    ctx.stroke();
    ctx.fillStyle = '#72efdd';
    ctx.font = '22px sans-serif';
    ctx.fillText('🦚', this.width / 2, 445);

    // 7. Message Box
    const boxX = 75;
    const boxY = 475;
    const boxW = this.width - 150;
    const boxH = 310;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.35)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 209, 102, 0.4)';
    ctx.font = '700 50px "Cinzel Decorative", serif';
    ctx.fillText('“', boxX + 35, boxY + 52);

    ctx.fillStyle = '#f8f9fa';
    ctx.font = '400 22px "Poppins", sans-serif';
    this.wrapText(ctx, wish, this.width / 2, boxY + 75, boxW - 70, 34);

    // 8. Sender Attribution
    let senderFull = name;
    if (family) senderFull += ` एवं समस्त ${family} परिवार`;
    if (city) senderFull += ` (${city})`;

    ctx.fillStyle = '#ffd166';
    ctx.font = '600 24px "Rozha One", serif';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 8;
    ctx.fillText(`— प्रेषक: ${senderFull}`, this.width / 2, boxY + boxH - 35);
    ctx.shadowBlur = 0;

    // 9. Sacred Footer
    ctx.fillStyle = '#ff758f';
    ctx.font = '600 24px "Rozha One", serif';
    ctx.fillText('राधे राधे ❤️ जय श्री कृष्ण', this.width / 2, 840);

    ctx.fillStyle = 'rgba(226, 234, 252, 0.6)';
    ctx.font = '300 15px "Poppins", sans-serif';
    ctx.fillText('श्री कृष्ण जन्माष्टमी डिजिटल अनुभव | vrindavan-divine', this.width / 2, 875);
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  downloadCard() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `Krishna-Janmashtami-Wish-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();

    if (window.DivineAudio) {
      window.DivineAudio.playTempleBell(0.4);
    }
  }

  async shareCard() {
    if (!this.canvas) return;

    try {
      const name = (this.inputName && this.inputName.value.trim()) || 'भक्त';
      const wish = (this.inputWish && this.inputWish.value.trim()) || '';
      const shareText = `🦚 श्री कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएँ! ✨\n\n"${wish}"\n\n— ${name}\n\nराधे राधे! जय श्री कृष्ण! 🌸`;

      if (navigator.share && navigator.canShare) {
        this.canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'janmashtami-wish.png', { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'श्री कृष्ण जन्माष्टमी शुभकामना',
              text: shareText,
              files: [file]
            });
          } else {
            await navigator.share({
              title: 'श्री कृष्ण जन्माष्टमी शुभकामना',
              text: shareText,
              url: window.location.href
            });
          }
        });
      } else {
        this.copyWishText();
      }
    } catch (err) {
      console.warn("Share canceled or error:", err);
    }
  }

  copyWishText() {
    const name = (this.inputName && this.inputName.value.trim()) || 'भक्त';
    const family = this.inputFamily ? this.inputFamily.value.trim() : '';
    const wish = (this.inputWish && this.inputWish.value.trim()) || '';
    const city = this.inputCity ? this.inputCity.value.trim() : '';

    let sender = name;
    if (family) sender += ` एवं समस्त ${family} परिवार`;
    if (city) sender += ` (${city})`;

    const textToCopy = `🦚✨ श्री कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएँ ✨🦚\n\n"${wish}"\n\n— प्रेषक: ${sender}\n\n🌸 राधे राधे! जय श्री कृष्ण! 🌸\nहाथी घोड़ा पालकी, जय कन्हैया लाल की!`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const copyBtn = this.btnCopyWish;
      if (copyBtn) {
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ शुभकामना कॉपी हो गई!';
        setTimeout(() => {
          copyBtn.innerHTML = origText;
        }, 2500);
      }
      if (window.DivineAudio) {
        window.DivineAudio.playTempleBell(0.3);
      }
    }).catch(e => {
      console.warn("Copy error", e);
    });
  }
}

// Global Wish Card Generator Singleton
window.WishCard = new WishCardGenerator();
