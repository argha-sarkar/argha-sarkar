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

/* ═══════════════════════════════════════════════════
   APPLY DATA FROM ADMIN PANEL (localStorage)
   ═══════════════════════════════════════════════════ */
function applyData() {
  if (typeof getData !== 'function') return;
  const d = getData();

  // SEO
  const titleEl = document.getElementById('site-title');
  const descEl  = document.getElementById('site-desc');
  if (titleEl) document.title = titleEl.textContent = d.seo.title;
  if (descEl)  descEl.setAttribute('content', d.seo.description);

  // Theme
  if (d.settings && d.settings.defaultTheme) {
    const saved = localStorage.getItem('argha-theme');
    if (!saved) applyTheme(d.settings.defaultTheme);
  }

  // Accent color
  if (d.settings && d.settings.accentColor) {
    document.documentElement.style.setProperty('--accent', d.settings.accentColor);
    document.documentElement.style.setProperty('--accent-dim', d.settings.accentColor + 'cc');
    document.documentElement.style.setProperty('--accent-glow', d.settings.accentColor + '33');
  }

  // Hero
  const heroFirst = document.getElementById('hero-name-first');
  const heroLast  = document.getElementById('hero-name-last');
  if (heroFirst) heroFirst.textContent = d.hero.firstName;
  if (heroLast)  heroLast.textContent  = d.hero.lastName;

  // Update typing phrases
  if (window._typingPhrases !== undefined) window._typingPhrases = d.hero.typingPhrases;

  // Status pills
  const pillsRow = document.getElementById('hero-pills-row');
  if (pillsRow && d.hero.pills) {
    pillsRow.innerHTML = d.hero.pills.map(p =>
      `<span class="status-pill">${p.startsWith('5+') ? '<span class="dot"></span>' : ''}${p}</span>`
    ).join('');
  }

  // About — JSON body
  const ab = d.about;
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setT('about-designation', ab.designation);
  setT('about-location',    ab.location);
  setT('about-experience',  ab.experience);
  setT('about-phone',       ab.phone);
  setT('about-email',       ab.email);
  setT('about-postgrad',    ab.postgrad);
  setT('about-undergrad',   ab.undergrad);
  setT('about-workstyle',   ab.workStyle);

  const passionEl = document.getElementById('about-passions');
  if (passionEl && ab.passions) {
    passionEl.innerHTML = ab.passions.map(p =>
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-str">"${p}"</span><span class="code-punc">,</span><br>`
    ).join('');
  }

  // Projects
  const projContainer = document.getElementById('projects-container');
  if (projContainer && d.projects) {
    const isAllProjectsPage = window.location.pathname.endsWith('projects.html');
    const projectsToShow = isAllProjectsPage ? d.projects : d.projects.slice(0, 6);
    let html = projectsToShow.map((p, i) => `
      <div class="project-card reveal reveal-delay-${(i%4)+1}">
        <span class="project-icon">${p.icon}</span>
        <div class="project-name">${p.name}</div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-stack">${p.stack.map(s => `<span class="stack-tag">${s}</span>`).join('')}</div>
      </div>
    `).join('');
    
    if (!isAllProjectsPage && d.projects.length > 6) {
      html += `
        <div class="project-card reveal" style="display:flex;align-items:center;justify-content:center;background:transparent;border:1px dashed var(--border);">
          <a href="projects.html" class="btn btn-outline">View All Projects →</a>
        </div>
      `;
    }
    projContainer.innerHTML = html;
  }

  // Experience
  const expContainer = document.getElementById('timeline-container');
  if (expContainer && d.experience) {
    expContainer.innerHTML = d.experience.map((e, i) => `
      <div class="timeline-item reveal${i > 0 ? ' reveal-delay-2' : ''}">
        <div class="timeline-period">${e.period}</div>
        <div class="timeline-role">${e.role}</div>
        <div class="timeline-company">${e.company}</div>
        <ul class="timeline-points">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  // Certifications
  const certBody = document.getElementById('certs-tbody');
  if (certBody && d.certs) {
    const isAllCertsPage = window.location.pathname.endsWith('certifications.html');
    const certsToShow = isAllCertsPage ? d.certs : d.certs.slice(0, 6);
    let html = certsToShow.map(c => `
      <tr>
        <td>${c.issuer}</td>
        <td>${c.name}</td>
        <td><span class="cert-status-icon">✅</span> ${c.status}</td>
      </tr>
    `).join('');
    
    if (!isAllCertsPage && d.certs.length > 6) {
      html += `
      <tr>
        <td colspan="3" style="text-align:center;">
          <a href="certifications.html" class="btn btn-outline" style="margin-top:1rem;display:inline-block;">View All Certifications →</a>
        </td>
      </tr>
      `;
    }
    certBody.innerHTML = html;
  }

  // Metrics
  const metricsContainer = document.getElementById('metrics-container');
  if (metricsContainer && d.achievements && d.achievements.metrics) {
    metricsContainer.innerHTML = d.achievements.metrics.map((m, i) => `
      <div class="metric-card reveal reveal-delay-${(i%4)+1}">
        <div class="metric-value" data-count="${m.value === '∞' ? '∞' : m.value}" data-suffix="${m.suffix || ''}">${m.value}${m.suffix || ''}</div>
        <div class="metric-label">${m.label1}<br>${m.label2}</div>
      </div>
    `).join('');
  }

  // Languages chart
  const langsContainer = document.getElementById('langs-container');
  if (langsContainer && d.stats && d.stats.languages) {
    const langs = d.stats.languages;
    const barsHtml = langs.map(l => `
      <div class="lang-row">
        <span class="lang-dot" style="background:${l.color}"></span>
        <span class="lang-name">${l.name}</span>
        <div class="lang-bar-track"><div class="lang-bar-fill" data-w="${l.pct}%" style="background:${l.color}"></div></div>
        <span class="lang-pct">${l.pct}%</span>
      </div>
    `).join('');
    const stackHtml = langs.map((l, i) => `
      <div style="width:${l.pct}%;background:${l.color};${i===0?'border-radius:4px 0 0 4px':i===langs.length-1?'border-radius:0 4px 4px 0':''}" title="${l.name} ${l.pct}%"></div>
    `).join('');
    langsContainer.innerHTML = `
      <div class="top-langs-bars">${barsHtml}</div>
      <div class="lang-stack-bar">${stackHtml}</div>
    `;
  }

  // Weekly stats
  const weeklyContainer = document.getElementById('weekly-container');
  if (weeklyContainer && d.stats && d.stats.weekly) {
    weeklyContainer.innerHTML = d.stats.weekly.map(w => `
      <div class="log-row">
        <span class="log-label">${w.label}</span>
        <div class="log-bar-wrap">
          <div class="log-bar"><div class="log-bar-inner" style="width:${w.pct}%"></div></div>
          <span class="log-time">${w.time}</span>
        </div>
      </div>
    `).join('');
  }

  // Research
  const researchContainer = document.getElementById('research-container');
  if (researchContainer && d.research) {
    researchContainer.innerHTML = d.research.map((r, i) => `
      <div class="research-card reveal reveal-delay-${(i%4)+1}">
        <div class="research-title">${r.title}</div>
        <p class="research-desc">${r.desc}</p>
      </div>
    `).join('');
  }

  // Social Links
  const linkMap = {
    'link-linkedin': d.connect?.linkedin,
    'link-email':    d.connect?.email ? `mailto:${d.connect.email}` : null,
    'link-medium':   d.connect?.medium,
    'link-twitter':  d.connect?.twitter,
    'link-github':   d.connect?.github
  };
  Object.entries(linkMap).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el && href) el.href = href;
  });

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl && d.settings?.footerYear) yearEl.textContent = d.settings.footerYear;
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  applyData();       // ← Apply admin changes FIRST
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

