/* ════════════════════════════════════════
   PRINCE GOHEL — PORTFOLIO JS
   Shared across all pages
   ════════════════════════════════════════ */
'use strict';

/* ── Helpers ── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ══════════════════════════════════════
   INJECT SHARED NAVBAR & FOOTER
   (called before anything else)
══════════════════════════════════════ */
(function injectLayout() {
  /* Detect active page for nav highlight */
  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome     = page === 'index.html' || page === '';
  const isAbout    = page === 'about.html';
  const isProjects = page === 'projects.html';
  const isContact  = page === 'contact.html';

  const activeClass = (flag) => flag ? ' active' : '';

  /* ── Navbar ── */
  const navHTML = `
    <nav id="navbar">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">PRINCE GOHEL</a>
        <ul class="nav-links" id="navLinks">
          <li><a href="index.html"    class="nav-link${activeClass(isHome)}">Home</a></li>
          <li><a href="about.html"    class="nav-link${activeClass(isAbout)}">About</a></li>
          <li><a href="projects.html" class="nav-link${activeClass(isProjects)}">Projects</a></li>
          <li><a href="contact.html"  class="nav-link${activeClass(isContact)}">Contact</a></li>
        </ul>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>`;

  /* ── Footer ── */
  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <p class="footer-copy">© 2025 Prince Gohel. Built with passion &amp; code.</p>
        </div>
      </div>
    </footer>`;

  /* ── Scroll-to-top button ── */
  const scrollTopHTML = `
    <button class="scroll-top" id="scrollTop" aria-label="Scroll to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>`;

  /* Mount into #nav-placeholder / #footer-placeholder */
  const navSlot    = $('#nav-placeholder');
  const footerSlot = $('#footer-placeholder');
  if (navSlot)    navSlot.outerHTML    = navHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML + scrollTopHTML;
})();


/* ══════════════════════════════════════
   1. ANIMATED BACKGROUND CANVAS
══════════════════════════════════════ */
(function initCanvas() {
  const canvas = $('#bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const BLOB_COLORS = ['rgba(79,141,255,','rgba(168,85,247,','rgba(0,229,255,','rgba(57,217,138,'];

  class Blob {
    constructor(i) { this.i = i; this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = 180 + Math.random() * 220;
      this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = 0.04 + Math.random() * 0.06;
      this.color = BLOB_COLORS[this.i % BLOB_COLORS.length];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -this.r) this.x = W + this.r;
      if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
      g.addColorStop(0, this.color + this.alpha + ')');
      g.addColorStop(1, this.color + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
    }
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.size = Math.random()*1.5+0.3; this.speed = Math.random()*0.4+0.1;
      this.angle = Math.random()*Math.PI*2; this.alpha = Math.random()*0.5+0.1;
      this.pulse = Math.random()*Math.PI*2; this.pulseSpeed = 0.01+Math.random()*0.02;
    }
    update() {
      this.x += Math.cos(this.angle)*this.speed*0.3;
      this.y += Math.sin(this.angle)*this.speed*0.3;
      this.pulse += this.pulseSpeed;
      if (this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw() {
      const a = this.alpha*(0.7+0.3*Math.sin(this.pulse));
      ctx.fillStyle = `rgba(180,210,255,${a})`;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill();
    }
  }

  const particles = [], blobs = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function init() {
    resize(); particles.length = 0; blobs.length = 0;
    for (let i=0;i<60;i++) particles.push(new Particle());
    for (let i=0;i<4;i++) blobs.push(new Blob(i));
  }

  function tick() {
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{b.update();b.draw();});
    particles.forEach(p=>{p.update();p.draw();});
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<100) {
          ctx.strokeStyle=`rgba(79,141,255,${0.06*(1-d/100)})`;
          ctx.lineWidth=0.5; ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize, {passive:true});
  init(); tick();
})();


/* ══════════════════════════════════════
   2. NAVBAR SCROLL + HAMBURGER
══════════════════════════════════════ */
(function initNav() {
  const navbar = $('#navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, {passive:true});

  const btn = $('#hamburger'), links = $('#navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      links.classList.toggle('open');
    });
    $$('.nav-link').forEach(l => l.addEventListener('click', () => {
      btn.classList.remove('open'); links.classList.remove('open');
    }));
  }
})();


/* ══════════════════════════════════════
   3. TYPED TEXT (home page only)
══════════════════════════════════════ */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;
  const phrases = ['Web Developer','Android Developer','AI Enthusiast','Full-Stack Builder'];
  let pi=0, ci=0, del=false;
  function type() {
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0,ci-1) : cur.slice(0,ci+1);
    del ? ci-- : ci++;
    if (!del && ci===cur.length) { del=true; setTimeout(type,1800); return; }
    if (del && ci===0)           { del=false; pi=(pi+1)%phrases.length; }
    setTimeout(type, del?50:80);
  }
  setTimeout(type, 1000);
})();


/* ══════════════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════
   5. SCROLL TO TOP
══════════════════════════════════════ */
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();


/* ══════════════════════════════════════
   6. CONTACT FORM
══════════════════════════════════════ */
(function initForm() {
  const form    = $('#contactForm');
  const sendBtn = $('#sendBtn');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = $('#name').value.trim();
    const email   = $('#email').value.trim();
    const message = $('#message').value.trim();
    if (!name || !email || !message) {
      form.style.animation = 'shake 0.4s ease';
      setTimeout(() => form.style.animation = '', 400);
      return;
    }
    sendBtn.disabled  = true;
    sendBtn.innerHTML = '<span>Sending…</span>';
    setTimeout(() => {
      sendBtn.style.display = 'none';
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        success.classList.remove('show');
        sendBtn.style.display = '';
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      }, 4000);
    }, 1200);
  });
})();


/* ══════════════════════════════════════
   7. PROJECT CARD MOUSE-FOLLOW GLOW
══════════════════════════════════════ */
(function initCardGlow() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const glow = card.querySelector('.project-glow');
      if (glow) { glow.style.left=(e.clientX-rect.left-90)+'px'; glow.style.top=(e.clientY-rect.top-90)+'px'; glow.style.transform='none'; }
    });
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.project-glow');
      if (glow) { glow.style.left=''; glow.style.top=''; glow.style.transform=''; }
    });
  });
})();


/* ══════════════════════════════════════
   8. STAT COUNTER (home page)
══════════════════════════════════════ */
(function initCounters() {
  const stats = $$('.stat-num');
  if (!stats.length) return;
  const targets = ['15','3','∞'];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;
      const el = entry.target, val = targets[idx];
      if (val==='∞') { el.textContent='∞'; obs.unobserve(el); return; }
      let cur=0; const target=parseInt(val);
      const iv = setInterval(()=>{ cur=Math.min(cur+1,target); el.textContent=cur+'+'; if(cur>=target)clearInterval(iv); },40);
      obs.unobserve(el);
    });
  }, {threshold:0.5});
  stats.forEach(s => obs.observe(s));
})();


/* ── Shake keyframe ── */
const _s = document.createElement('style');
_s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(_s);

console.log('%cPrince Gohel — Portfolio', 'color:#4f8dff;font-size:16px;font-weight:700;');
