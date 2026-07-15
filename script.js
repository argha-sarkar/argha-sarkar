/* ═══════════════════════════════════════════════════
   ARGHA SARKAR — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════════ */

/* ── Theme Toggle ── */
const THEME_KEY = 'argha-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('.theme-icon');
  const label = document.querySelector('.theme-label');
  if (icon)  icon.textContent  = theme === 'dark' ? '☀️' : '🌑';
  if (label) label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ── Matrix Rain Canvas ── */
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ';
  const charArr = chars.split('');
  const fontSize = 13;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    const theme = document.documentElement.getAttribute('data-theme');
    ctx.fillStyle = theme === 'light'
      ? 'rgba(240, 246, 255, 0.06)'
      : 'rgba(13, 17, 23, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    drops.forEach((y, i) => {
      const char = charArr[Math.floor(Math.random() * charArr.length)];
      const x = i * fontSize;
      const gradient = ctx.createLinearGradient(x, (y - 8) * fontSize, x, y * fontSize);
      gradient.addColorStop(0, theme === 'light' ? 'rgba(0,120,60,0.05)' : 'rgba(0,255,65,0.05)');
      gradient.addColorStop(1, theme === 'light' ? 'rgba(0,180,80,0.7)' : 'rgba(0,255,65,0.7)');
      ctx.fillStyle = gradient;
      ctx.fillText(char, x, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });

    columns = Math.floor(canvas.width / fontSize);
    while (drops.length < columns) drops.push(Math.floor(Math.random() * -50));
    drops.length = columns;
  }

  setInterval(draw, 50);
}

/* ── Typing Effect ── */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI Research Engineer',
    'Deep Learning Architect',
    'MLOps Engineer',
    'Deepfake Detection Researcher',
    'RAG Systems Builder',
    'Edge AI Practitioner',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseMs   = 0;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        pauseMs  = 1800;
        setTimeout(tick, pauseMs);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  tick();
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

/* ── Proficiency Bars + Lang Bars ── */
function initProfBars() {
  // Proficiency bars use data-width
  const bars = document.querySelectorAll('.prof-bar-fill');
  const io   = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => io.observe(bar));

  // Language bars use data-w
  const langBars = document.querySelectorAll('.lang-bar-fill');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w;
        io2.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  langBars.forEach(bar => io2.observe(bar));
}

/* ── Navbar scroll effect ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}

/* ── Mobile Hamburger ── */
function initHamburger() {
  const btn   = document.getElementById('hamburger-btn');
  const menu  = document.getElementById('nav-mobile');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ── Smooth active nav highlight ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.style.color = l.getAttribute('href') === `#${e.target.id}`
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
}

/* ── Counter animation for metrics ── */
function initCounters() {
  const counters = document.querySelectorAll('.metric-value[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el      = e.target;
        const target  = el.dataset.count;
        const suffix  = el.dataset.suffix || '';
        const isSymbol = isNaN(parseInt(target));

        if (isSymbol) {
          el.textContent = target + suffix;
        } else {
          let start = 0;
          const end = parseInt(target);
          const dur = 1500;
          const step = Math.ceil(end / (dur / 30));
          const timer = setInterval(() => {
            start = Math.min(start + step, end);
            el.textContent = start + suffix;
            if (start >= end) clearInterval(timer);
          }, 30);
        }
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ── Back to top button ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMatrix();
  initTyping();
  initScrollReveal();
  initProfBars();
  initNavbar();
  initHamburger();
  initActiveNav();
  initCounters();
  initBackToTop();

  // Theme toggle button
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
});
