/* ============================================================
   Wedding Invitation — Mohannad & Asmaa — script.js
============================================================ */
'use strict';

const CONFIG = {
  weddingDate : new Date('2026-08-20T18:00:00'),
  mapsUrl     : '#',
  musicUrl    : '',
};

/* ── LOADING ── */
window.addEventListener('load', () => {
  const ls = document.getElementById('loading-screen');
  setTimeout(() => {
    ls.classList.add('fade-out');
    setTimeout(() => ls.style.display = 'none', 900);
  }, 2400);
});

/* ── PARTICLES ── */
(function(){
  const cv = document.getElementById('particles-canvas');
  const cx = cv.getContext('2d');
  let W, H, pts = [];
  function resize(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  class P {
    constructor(){ this.reset(true); }
    reset(init){
      this.x = Math.random()*W;
      this.y = init ? Math.random()*H : H+20;
      this.vy = -(Math.random()*.38+.14);
      this.vx = (Math.random()-.5)*.2;
      this.a  = Math.random()*.42+.08;
      this.sz = Math.random()*9+5;
      this.g  = ['✦','✧','·','•'][0|Math.random()*4];
      this.r  = Math.random()*Math.PI*2;
      this.rv = (Math.random()-.5)*.016;
    }
    update(){ this.y+=this.vy; this.x+=this.vx; this.r+=this.rv; if(this.y<-20)this.reset(); }
    draw(){
      cx.save(); cx.globalAlpha=this.a;
      cx.translate(this.x,this.y); cx.rotate(this.r);
      cx.font=`${this.sz}px serif`; cx.fillStyle='#C9A86A';
      cx.textAlign='center'; cx.fillText(this.g,0,0); cx.restore();
    }
  }
  for(let i=0;i<55;i++) pts.push(new P());
  (function loop(){ cx.clearRect(0,0,W,H); pts.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); })();
})();

/* ── SVG ENVELOPE ── */
(function(){
  const wrap   = document.getElementById('envelopeWrapper');
  const env    = document.getElementById('mainEnvelope');
  const flap   = document.getElementById('envFlapGroup');
  const seal   = document.getElementById('waxSealSVG');
  const sparks = document.getElementById('svgSparkles');
  const cta    = document.getElementById('envCta');
  const screen = document.getElementById('envelope-screen');
  const main   = document.getElementById('main-invitation');
  let opened = false;

  // Only the seal is clickable
  seal.addEventListener('click', open);
  // Also allow tapping the whole wrapper for easier mobile use
  wrap.addEventListener('click', function(e){
    // if user clicks envelope body too, open
    if(!opened) open();
  });

  function open(){
    if(opened) return;
    opened = true;

    // Fade CTA
    cta.style.transition = 'opacity .4s';
    cta.style.opacity    = '0';

    // Pulse seal briefly, then break
    seal.style.transition = 'transform .2s var(--bounce)';
    seal.style.transform  = 'scale(1.12)';
    seal.style.transformOrigin = '200px 230px';

    setTimeout(() => {
      seal.classList.add('seal-breaking');
    }, 180);

    // Sparkles burst
    setTimeout(() => {
      sparks.classList.remove('svg-sparkles-hidden');
      sparks.classList.add('sparkle-active');
    }, 300);

    // Open flap
    setTimeout(() => {
      flap.classList.add('flap-open');
    }, 520);

    // Try music
    setTimeout(() => tryPlayMusic(), 640);

    // Envelope rises away
    setTimeout(() => {
      env.classList.add('env-rising');
    }, 1250);

    // Reveal main invitation
    setTimeout(() => {
      screen.classList.add('opening-done');
      main.classList.remove('hidden');
      document.body.style.overflowY = 'auto';
      requestAnimationFrame(() => {
        triggerReveal();
        initScrollReveal();
        startCountdown();
        initScratchCards();
      });
    }, 2100);
  }
})();

/* ── REVEAL ── */
function triggerReveal(){
  document.querySelectorAll('.reveal-up').forEach(el => {
    if(el.getBoundingClientRect().top < innerHeight*.95) el.classList.add('visible');
  });
}
function initScrollReveal(){
  const obs = new IntersectionObserver(
    es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold:.1, rootMargin:'0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
}

/* ── COUNTDOWN ── */
function startCountdown(){
  const els = ['cd-days','cd-hours','cd-minutes','cd-seconds'].map(id => {
    const el = document.getElementById(id);
    if(el){ el.style.transition='transform .22s ease,color .22s ease'; el.style.display='inline-block'; }
    return el;
  });
  const cards = document.getElementById('countdownCards');
  const done  = document.getElementById('countdown-done');
  const pad   = n => String(n).padStart(2,'0');
  function bump(el,v){ if(el&&el.textContent!==v){ el.style.transform='scale(1.2)'; el.style.color='var(--gold)'; el.textContent=v; setTimeout(()=>{el.style.transform='scale(1)';el.style.color='';},220); } }
  function tick(){
    const d = CONFIG.weddingDate - new Date();
    if(d<=0){ cards&&cards.classList.add('hidden'); done&&done.classList.remove('hidden'); return; }
    const s = Math.floor(d/1000);
    bump(els[0],pad(Math.floor(s/86400)));
    bump(els[1],pad(Math.floor((s%86400)/3600)));
    bump(els[2],pad(Math.floor((s%3600)/60)));
    bump(els[3],pad(s%60));
  }
  tick(); setInterval(tick,1000);
}

/* ── SCRATCH CARDS ── */
function initScratchCards(){
  const defs = [
    { canvasId:'canvas-day',   cardId:'card-day'   },
    { canvasId:'canvas-month', cardId:'card-month' },
    { canvasId:'canvas-year',  cardId:'card-year'  },
  ];
  let revealed = 0;

  defs.forEach(({ canvasId, cardId }) => {
    const canvas = document.getElementById(canvasId);
    const card   = document.getElementById(cardId);
    const ctx    = canvas.getContext('2d');
    let scratching = false, done = false;

    /* --- Draw gold coating --- */
    function paint(){
      const W = canvas.width, H = canvas.height;

      // Rose-gold gradient base (matching envelope color scheme)
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,   '#DBA8B0');
      g.addColorStop(0.3, '#C89098');
      g.addColorStop(0.7, '#D8A0A8');
      g.addColorStop(1,   '#B88090');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Dot texture
      ctx.globalAlpha = .12;
      for(let x=6;x<W;x+=12){
        for(let y=6;y<H;y+=12){
          ctx.beginPath(); ctx.arc(x,y,1.2,0,Math.PI*2);
          ctx.fillStyle='rgba(255,255,255,.8)'; ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Decorative text
      ctx.fillStyle   = 'rgba(255,220,220,.5)';
      ctx.font        = `italic ${Math.round(W*.1)}px 'Cormorant Garamond', serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText('✦  scratch  ✦', W/2, H/2);

      // Corner glyphs
      ctx.font = `${Math.round(W*.1)}px serif`;
      ctx.fillStyle = 'rgba(255,220,220,.35)';
      ctx.textAlign='left';  ctx.textBaseline='top';    ctx.fillText('❧',8,8);
      ctx.textAlign='right'; ctx.textBaseline='top';    ctx.fillText('❦',W-8,8);
      ctx.textAlign='left';  ctx.textBaseline='bottom'; ctx.fillText('❦',8,H-8);
      ctx.textAlign='right'; ctx.textBaseline='bottom'; ctx.fillText('❧',W-8,H-8);
    }
    paint();

    /* --- Erase stroke --- */
    function pos(e){
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width  / r.width;
      const sy = canvas.height / r.height;
      const s  = e.touches ? e.touches[0] : e;
      return { x:(s.clientX-r.left)*sx, y:(s.clientY-r.top)*sy };
    }

    function scratch(e){
      if(!scratching||done) return;
      e.preventDefault();
      const {x,y} = pos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      // Larger radius for easier scratching on mobile
      ctx.arc(x, y, Math.round(canvas.width*.14), 0, Math.PI*2);
      ctx.fill();
      checkDone();
    }

    function checkDone(){
      const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let erased = 0;
      for(let i=3;i<data.length;i+=4) if(data[i]===0) erased++;
      if(erased / (canvas.width*canvas.height) > .55) fullyReveal();
    }

    function fullyReveal(){
      if(done) return;
      done = true;
      canvas.style.transition = 'opacity .5s ease';
      canvas.style.opacity    = '0';
      card.classList.add('fully-revealed');
      setTimeout(() => { canvas.style.display='none'; }, 500);
      revealed++;
      if(revealed===3) showFullDate();
    }

    canvas.addEventListener('mousedown',  e => { scratching=true; scratch(e); });
    canvas.addEventListener('mousemove',  e => scratch(e));
    canvas.addEventListener('mouseup',    () => scratching=false);
    canvas.addEventListener('mouseleave', () => scratching=false);
    canvas.addEventListener('touchstart', e => { scratching=true; scratch(e); }, {passive:false});
    canvas.addEventListener('touchmove',  e => scratch(e), {passive:false});
    canvas.addEventListener('touchend',   () => scratching=false);
  });

  function showFullDate(){
    const el = document.getElementById('stdFullDate');
    if(!el) return;
    el.classList.remove('hidden');
    setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'center'}), 250);
  }
}

/* ── LIGHTBOX ── */
function openLightbox(el){
  document.getElementById('lb-img').src = el.querySelector('img').src;
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => e.key==='Escape' && closeLightbox());

/* ── MUSIC ── */
const mBtn = document.getElementById('music-btn');
const mAudio = document.getElementById('bg-music');
let mPlaying = false;

function tryPlayMusic(){
  if(!CONFIG.musicUrl) return;
  mAudio.src = CONFIG.musicUrl; mAudio.volume = 0;
  mAudio.play().then(() => {
    mPlaying = true;
    let v=0; const iv=setInterval(()=>{ v=Math.min(v+.03,.4); mAudio.volume=v; if(v>=.4)clearInterval(iv); },200);
    updateMBtn();
  }).catch(()=>{});
}
function updateMBtn(){
  mBtn.querySelector('.music-icon').textContent = mPlaying ? '♫' : '♪';
  mBtn.querySelector('.music-label').textContent = mPlaying ? 'Pause' : 'Music';
  mBtn.classList.toggle('playing', mPlaying);
}
mBtn.addEventListener('click', () => {
  if(!CONFIG.musicUrl) return;
  mPlaying ? mAudio.pause() : mAudio.play().catch(()=>{});
  mPlaying = !mPlaying; updateMBtn();
});

/* ── CALENDAR ── */
function addToCalendar(){
  const t = encodeURIComponent('Wedding of Mohannad & Asmaa');
  const d = encodeURIComponent('You are joyfully invited to celebrate our wedding.');
  window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${t}&dates=20260820/20260821&details=${d}`,'_blank');
}

/* ── SAVE DATE .ICS ── */
function saveTheDate(){
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    'DTSTART:20260820T180000Z','DTEND:20260820T230000Z',
    'SUMMARY:Wedding of Mohannad & Asmaa',
    'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a = Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([ics],{type:'text/calendar'})),
    download:'wedding-mohannad-asmaa.ics'
  });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

/* ── VENUE PARALLAX ── */
addEventListener('scroll', () => {
  const img = document.querySelector('.venue-img');
  if(!img) return;
  const r = img.getBoundingClientRect();
  const f = (innerHeight/2-(r.top+r.height/2))/innerHeight;
  img.style.transform = `scale(${Math.min(1+Math.abs(f)*.06,1.08)})`;
}, {passive:true});

/* ── MAP BTN ── */
document.addEventListener('DOMContentLoaded', () => {
  const b = document.getElementById('mapDirectionsBtn');
  if(b && CONFIG.mapsUrl !== '#') b.href = CONFIG.mapsUrl;
});
