/* ============================================================
   ARABIC LUXURY WEDDING INVITATION — script.js
   مهند & أسماء — ٢٠ أغسطس ٢٠٢٦
============================================================ */

'use strict';

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  groomName:    'مهند',
  brideName:    'أسماء',
  weddingDate:  new Date('2026-08-20T18:00:00'),  // 6 PM on August 20, 2026
  mapsUrl:      '#',  // Replace with actual Google Maps URL
  musicUrl:     '',   // Replace with path to romantic music file
};


// ============================================================
// LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');

  // Simulate loading bar then fade out
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 900);
  }, 2000);
});


// ============================================================
// PARTICLES CANVAS — Floating Golden Particles
// ============================================================
(function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 20;
      this.size  = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.glyph = ['✦', '✧', '·', '•'][Math.floor(Math.random() * 4)];
      this.fontSize = Math.random() * 10 + 6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y        += this.speedY;
      this.x        += this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.fontSize}px serif`;
      ctx.fillStyle = '#C9A86A';
      ctx.textAlign = 'center';
      ctx.fillText(this.glyph, 0, 0);
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 55; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();


// ============================================================
// ENVELOPE OPENING ANIMATION
// ============================================================
(function initEnvelope() {
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const mainEnvelope    = document.getElementById('mainEnvelope');
  const envFlap         = document.getElementById('envFlap');
  const waxSeal         = document.getElementById('waxSeal');
  const envSparkles     = document.getElementById('envSparkles');
  const envCta          = document.getElementById('envCta');
  const envelopeScreen  = document.getElementById('envelope-screen');
  const mainInvitation  = document.getElementById('main-invitation');
  let hasOpened = false;

  envelopeWrapper.addEventListener('click', openEnvelope);

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    // Remove hover pointer
    envelopeWrapper.style.cursor = 'default';
    envCta.style.opacity = '0';
    envCta.style.transition = 'opacity 0.4s ease';

    // Step 1: Crack the wax seal
    waxSeal.classList.add('cracked');

    // Step 2: Sparkles appear
    setTimeout(() => {
      envSparkles.classList.add('active');
    }, 300);

    // Step 3: Envelope flap opens
    setTimeout(() => {
      envFlap.classList.add('open');
    }, 500);

    // Step 4: Music starts
    setTimeout(() => {
      tryPlayMusic();
    }, 600);

    // Step 5: Envelope rises and fades
    setTimeout(() => {
      mainEnvelope.style.transition = 'transform 1s ease-in, opacity 0.8s ease';
      mainEnvelope.style.transform  = 'translateY(-60px) scale(0.92)';
      mainEnvelope.style.opacity    = '0';
    }, 1200);

    // Step 6: Reveal main invitation
    setTimeout(() => {
      envelopeScreen.classList.add('opening-done');
      mainInvitation.classList.remove('hidden');
      document.body.style.overflowY = 'auto';

      // Trigger first reveal animations
      requestAnimationFrame(() => {
        triggerRevealAnimations();
        initScrollReveal();
        startCountdown();
      });
    }, 2000);
  }
})();


// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
function triggerRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-up');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    }
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal-up').forEach(el => {
    observer.observe(el);
  });
}


// ============================================================
// COUNTDOWN TIMER
// ============================================================
function startCountdown() {
  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const cdCards   = document.getElementById('countdownCards');
  const cdDone    = document.getElementById('countdown-done');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now  = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      cdCards.classList.add('hidden');
      cdDone.classList.remove('hidden');
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days    = Math.floor(totalSec / 86400);
    const hours   = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    // Animate number change
    animateNumberChange(cdDays,    pad(days));
    animateNumberChange(cdHours,   pad(hours));
    animateNumberChange(cdMinutes, pad(minutes));
    animateNumberChange(cdSeconds, pad(seconds));
  }

  function animateNumberChange(el, newVal) {
    if (el.textContent !== newVal) {
      el.style.transform = 'scale(1.2)';
      el.style.color     = '#B8924A';
      el.textContent     = newVal;
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.color     = '';
      }, 200);
    }
  }

  update();
  setInterval(update, 1000);
}


// ============================================================
// RSVP FORM
// ============================================================
function submitRSVP() {
  const nameInput   = document.getElementById('rsvp-name');
  const guestsInput = document.getElementById('rsvp-guests');
  const nameError   = document.getElementById('name-error');
  const guestsError = document.getElementById('guests-error');

  // Clear errors
  nameError.textContent   = '';
  guestsError.textContent = '';

  const name   = nameInput.value.trim();
  const guests = parseInt(guestsInput.value, 10);
  let valid = true;

  // Validate name
  if (!name) {
    nameError.textContent = 'يرجى إدخال اسمك الكريم';
    nameInput.focus();
    valid = false;
  }

  // Validate guests
  if (!guestsInput.value || isNaN(guests) || guests < 1) {
    guestsError.textContent = 'يرجى إدخال عدد صحيح من الأشخاص';
    if (valid) guestsInput.focus();
    valid = false;
  }

  if (!valid) return;

  // SUCCESS — show confirmation
  const formWrapper = document.getElementById('rsvp-form-wrapper');
  const successEl   = document.getElementById('rsvp-success');

  formWrapper.style.opacity    = '0';
  formWrapper.style.transform  = 'scale(0.95)';
  formWrapper.style.transition = 'all 0.4s ease';

  setTimeout(() => {
    formWrapper.classList.add('hidden');
    successEl.classList.remove('hidden');
  }, 400);

  /*
    TO CONNECT TO FIREBASE:
    firebase.database().ref('rsvps').push({ name, guests, timestamp: Date.now() });

    TO CONNECT TO GOOGLE SHEETS:
    fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, guests }),
    });
  */

  console.log('RSVP submitted:', { name, guests });
}


// ============================================================
// LIGHTBOX (Gallery)
// ============================================================
function openLightbox(element) {
  const src = element.querySelector('img').src;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src   = src;
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


// ============================================================
// BACKGROUND MUSIC
// ============================================================
const musicBtn   = document.getElementById('music-btn');
const bgMusic    = document.getElementById('bg-music');
let musicPlaying = false;
let musicEnabled = false;

function tryPlayMusic() {
  if (!CONFIG.musicUrl) return;  // No music file configured
  bgMusic.src = CONFIG.musicUrl;
  bgMusic.volume = 0;

  bgMusic.play().then(() => {
    musicPlaying = true;
    musicEnabled = true;
    fadeInMusic();
    updateMusicBtn();
  }).catch(() => {
    // Autoplay blocked — user must interact
    musicEnabled = false;
    updateMusicBtn();
  });
}

function fadeInMusic() {
  let vol = 0;
  const interval = setInterval(() => {
    vol = Math.min(vol + 0.03, 0.4);
    bgMusic.volume = vol;
    if (vol >= 0.4) clearInterval(interval);
  }, 200);
}

function toggleMusic() {
  if (!CONFIG.musicUrl) {
    alert('يرجى إضافة ملف الموسيقى في إعدادات CONFIG');
    return;
  }

  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
  } else {
    bgMusic.play().catch(() => {});
    musicPlaying = true;
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  const icon  = musicBtn.querySelector('.music-icon');
  const label = musicBtn.querySelector('.music-label');
  if (musicPlaying) {
    icon.textContent  = '♫';
    label.textContent = 'إيقاف الموسيقى';
    musicBtn.classList.add('playing');
  } else {
    icon.textContent  = '♪';
    label.textContent = 'تشغيل الموسيقى';
    musicBtn.classList.remove('playing');
  }
}

musicBtn.addEventListener('click', toggleMusic);


// ============================================================
// ADD TO CALENDAR
// ============================================================
function addToCalendar() {
  const title    = encodeURIComponent('حفل زفاف مهند وأسماء');
  const details  = encodeURIComponent('نتشرف بدعوتكم لمشاركتنا أجمل لحظات العمر');
  const date     = '20260820';
  const dateEnd  = '20260821';

  // Google Calendar URL
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${dateEnd}&details=${details}`;
  window.open(url, '_blank');
}


// ============================================================
// SAVE THE DATE (download .ics file)
// ============================================================
function saveTheDate() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding//AR//EN',
    'BEGIN:VEVENT',
    'DTSTART:20260820T180000Z',
    'DTEND:20260820T230000Z',
    'SUMMARY:حفل زفاف مهند وأسماء',
    'DESCRIPTION:نتشرف بدعوتكم لمشاركتنا أجمل لحظات العمر',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'wedding-mohannad-asmaa.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ============================================================
// MAP DIRECTIONS BUTTON
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const mapBtn = document.getElementById('mapDirectionsBtn');
  if (mapBtn && CONFIG.mapsUrl && CONFIG.mapsUrl !== '#') {
    mapBtn.href = CONFIG.mapsUrl;
  }
});


// ============================================================
// SMOOTH SCROLL — for any anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ============================================================
// VENUE IMAGE — cinematic zoom on scroll
// ============================================================
window.addEventListener('scroll', () => {
  const venueImg = document.querySelector('.venue-img');
  if (!venueImg) return;
  const rect   = venueImg.getBoundingClientRect();
  const center = rect.top + rect.height / 2;
  const factor = (window.innerHeight / 2 - center) / window.innerHeight;
  const scale  = 1 + Math.abs(factor) * 0.06;
  venueImg.style.transform = `scale(${Math.min(scale, 1.08)})`;
}, { passive: true });


// ============================================================
// NUMBER INPUT — Arabic / LTR fix
// ============================================================
document.getElementById('rsvp-guests')?.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});


// ============================================================
// COUNTER CARD TRANSITIONS — add CSS transition
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transition = 'transform 0.2s ease, color 0.2s ease';
      el.style.display    = 'inline-block';
    }
  });
});
