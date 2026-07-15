/* ═══════════════════════════════════════════════════
   admin.js — Admin Panel Logic
   ═══════════════════════════════════════════════════ */

/* ────────────────────────────────────
   TOAST
──────────────────────────────────── */
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast${type === 'error' ? ' error' : ''}`;
  t.innerHTML = `<span class="toast-icon">${type === 'error' ? '❌' : '✅'}</span>${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

/* ────────────────────────────────────
   AUTH
──────────────────────────────────── */
async function doLogin() {
  const pw  = document.getElementById('login-pw').value.trim();
  const err = document.getElementById('login-error');
  if (!pw) { err.textContent = 'Enter your password.'; err.classList.add('show'); return; }

  const ok = await checkPassword(pw);
  if (ok) {
    setLoggedIn(true);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').classList.add('visible');
    loadAllPanels();
  } else {
    err.textContent = '⚠ Incorrect password. Default is admin123';
    err.classList.add('show');
    document.getElementById('login-pw').focus();
  }
}

function doLogout() {
  setLoggedIn(false);
  document.getElementById('admin-app').classList.remove('visible');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').classList.remove('show');
}

/* ────────────────────────────────────
   NAVIGATION
──────────────────────────────────── */
let currentPanel = 'dashboard';

function navigateTo(section) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${section}"]`)?.classList.add('active');
  document.getElementById(`panel-${section}`)?.classList.add('active');
  document.querySelector('.topbar-title span').textContent = section.toUpperCase();
  currentPanel = section;
}

/* ────────────────────────────────────
   TAGS INPUT HELPER
──────────────────────────────────── */
function makeTagsInput(container, initialTags, onChange) {
  let tags = [...initialTags];

  function render() {
    container.innerHTML = '';
    tags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button type="button" data-i="${i}">✕</button>`;
      chip.querySelector('button').onclick = () => { tags.splice(i, 1); render(); onChange(tags); };
      container.appendChild(chip);
    });
    const inp = document.createElement('input');
    inp.className = 'tag-input';
    inp.placeholder = 'Type & press Enter...';
    inp.onkeydown = (e) => {
      if ((e.key === 'Enter' || e.key === ',') && inp.value.trim()) {
        e.preventDefault();
        tags.push(inp.value.trim());
        render();
        onChange(tags);
      }
      if (e.key === 'Backspace' && !inp.value && tags.length) {
        tags.pop();
        render();
        onChange(tags);
      }
    };
    container.appendChild(inp);
  }
  render();
  return { getTags: () => tags, setTags: (t) => { tags = t; render(); } };
}

/* ────────────────────────────────────
   COLLAPSIBLE CARD
──────────────────────────────────── */
function makeCollapsible(header, body) {
  header.addEventListener('click', (e) => {
    if (e.target.closest('.icon-btn')) return;
    body.classList.toggle('open');
    header.querySelector('.expand-icon').textContent = body.classList.contains('open') ? '▲' : '▼';
  });
}

/* ────────────────────────────────────
   LOAD ALL PANELS
──────────────────────────────────── */
function loadAllPanels() {
  const d = getData();
  renderDashboard(d);
  renderHeroPanel(d);
  renderAboutPanel(d);
  renderArsenalPanel(d);
  renderExperiencePanel(d);
  renderProjectsPanel(d);
  renderCertsPanel(d);
  renderAchievementsPanel(d);
  renderStatsPanel(d);
  renderResearchPanel(d);
  renderConnectPanel(d);
  renderSettingsPanel(d);
}

/* ────────────────────────────────────
   SAVE
──────────────────────────────────── */
function saveAll() {
  const d = collectAll();
  saveData(d);
  toast('All changes saved!');
}

/* ── Collect data from all forms ── */
function collectAll() {
  const d = getData();

  // SEO
  d.seo.title       = v('seo-title') || d.seo.title;
  d.seo.description = v('seo-desc')  || d.seo.description;

  // Hero
  d.hero.firstName   = v('hero-firstname')   || d.hero.firstName;
  d.hero.lastName    = v('hero-lastname')    || d.hero.lastName;
  d.hero.statusText  = v('hero-status')      || d.hero.statusText;

  // About
  d.about.designation = v('about-designation') || d.about.designation;
  d.about.location    = v('about-location')    || d.about.location;
  d.about.phone       = v('about-phone')       || d.about.phone;
  d.about.email       = v('about-email')       || d.about.email;
  d.about.experience  = v('about-experience')  || d.about.experience;
  d.about.postgrad    = v('about-postgrad')     || d.about.postgrad;
  d.about.undergrad   = v('about-undergrad')   || d.about.undergrad;
  d.about.workStyle   = v('about-workstyle')   || d.about.workStyle;

  // Connect
  d.connect.linkedin = v('connect-linkedin') || d.connect.linkedin;
  d.connect.email    = v('connect-email')    || d.connect.email;
  d.connect.medium   = v('connect-medium')   || d.connect.medium;
  d.connect.twitter  = v('connect-twitter')  || d.connect.twitter;
  d.connect.github   = v('connect-github')   || d.connect.github;
  d.connect.phone    = v('connect-phone')    || d.connect.phone;

  // Settings
  d.settings.accentColor  = v('setting-accent') || d.settings.accentColor;
  d.settings.defaultTheme = v('setting-theme')  || d.settings.defaultTheme;
  d.settings.footerYear   = v('setting-year')   || d.settings.footerYear;

  return d;
}

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

/* ────────────────────────────────────
   DASHBOARD PANEL
──────────────────────────────────── */
function renderDashboard(d) {
  const el = document.getElementById('panel-dashboard');
  el.innerHTML = `
    <div class="panel-title">🏠 Dashboard</div>
    <div class="panel-sub">Welcome back! Here's an overview of your portfolio content.</div>

    <div class="overview-grid">
      <div class="overview-card">
        <div class="ov-icon">🔬</div>
        <div class="ov-value">${d.projects.length}</div>
        <div class="ov-label">Projects</div>
      </div>
      <div class="overview-card">
        <div class="ov-icon">📜</div>
        <div class="ov-value">${d.certs.length}</div>
        <div class="ov-label">Certifications</div>
      </div>
      <div class="overview-card">
        <div class="ov-icon">💼</div>
        <div class="ov-value">${d.experience.length}</div>
        <div class="ov-label">Experience Entries</div>
      </div>
      <div class="overview-card">
        <div class="ov-icon">🔭</div>
        <div class="ov-value">${d.research.length}</div>
        <div class="ov-label">Research Domains</div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="qa-title">▶ QUICK ACTIONS</div>
      <div class="qa-grid">
        <div class="qa-btn" onclick="navigateTo('projects')"><span class="qa-btn-icon">🔬</span>Edit Projects</div>
        <div class="qa-btn" onclick="navigateTo('experience')"><span class="qa-btn-icon">💼</span>Edit Experience</div>
        <div class="qa-btn" onclick="navigateTo('certs')"><span class="qa-btn-icon">📜</span>Edit Certs</div>
        <div class="qa-btn" onclick="navigateTo('hero')"><span class="qa-btn-icon">🦸</span>Edit Hero</div>
        <div class="qa-btn" onclick="navigateTo('connect')"><span class="qa-btn-icon">📡</span>Edit Links</div>
        <div class="qa-btn" onclick="window.open('index.html','_blank')"><span class="qa-btn-icon">👁</span>Preview Site</div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ SEO SETTINGS</div>
      <div class="form-grid single">
        <div class="form-group">
          <label class="form-label">PAGE TITLE</label>
          <input id="seo-title" class="form-input" value="${esc(d.seo.title)}" />
        </div>
        <div class="form-group">
          <label class="form-label">META DESCRIPTION</label>
          <textarea id="seo-desc" class="form-textarea" style="min-height:60px">${esc(d.seo.description)}</textarea>
        </div>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────
   HERO PANEL
──────────────────────────────────── */
function renderHeroPanel(d) {
  const el = document.getElementById('panel-hero');
  el.innerHTML = `
    <div class="panel-title">🦸 Hero Section</div>
    <div class="panel-sub">Controls the top banner — name, typing animation, status pills, and CTA buttons.</div>

    <div class="form-section">
      <div class="form-section-title">▶ NAME & STATUS</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">FIRST NAME</label>
          <input id="hero-firstname" class="form-input" value="${esc(d.hero.firstName)}" />
        </div>
        <div class="form-group">
          <label class="form-label">LAST NAME (accent color)</label>
          <input id="hero-lastname" class="form-input" value="${esc(d.hero.lastName)}" />
        </div>
        <div class="form-group full">
          <label class="form-label">STATUS BADGE TEXT</label>
          <input id="hero-status" class="form-input" value="${esc(d.hero.statusText)}" />
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ TYPING PHRASES (one per entry)</div>
      <div class="tags-container" id="hero-phrases-tags"></div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ STATUS PILLS</div>
      <div class="tags-container" id="hero-pills-tags"></div>
    </div>
  `;
  makeTagsInput(document.getElementById('hero-phrases-tags'), d.hero.typingPhrases, (tags) => {
    const cur = getData(); cur.hero.typingPhrases = tags; saveData(cur);
  });
  makeTagsInput(document.getElementById('hero-pills-tags'), d.hero.pills, (tags) => {
    const cur = getData(); cur.hero.pills = tags; saveData(cur);
  });
}

/* ────────────────────────────────────
   ABOUT PANEL
──────────────────────────────────── */
function renderAboutPanel(d) {
  const el = document.getElementById('panel-about');
  el.innerHTML = `
    <div class="panel-title">👤 About Section</div>
    <div class="panel-sub">Controls the identity JSON block and navigation tree.</div>

    <div class="form-section">
      <div class="form-section-title">▶ IDENTITY INFO</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">DESIGNATION</label>
          <input id="about-designation" class="form-input" value="${esc(d.about.designation)}" />
        </div>
        <div class="form-group">
          <label class="form-label">LOCATION</label>
          <input id="about-location" class="form-input" value="${esc(d.about.location)}" />
        </div>
        <div class="form-group">
          <label class="form-label">PHONE</label>
          <input id="about-phone" class="form-input" value="${esc(d.about.phone)}" />
        </div>
        <div class="form-group">
          <label class="form-label">EMAIL</label>
          <input id="about-email" class="form-input" value="${esc(d.about.email)}" />
        </div>
        <div class="form-group full">
          <label class="form-label">EXPERIENCE SUMMARY</label>
          <input id="about-experience" class="form-input" value="${esc(d.about.experience)}" />
        </div>
        <div class="form-group">
          <label class="form-label">POSTGRADUATE DEGREE</label>
          <input id="about-postgrad" class="form-input" value="${esc(d.about.postgrad)}" />
        </div>
        <div class="form-group">
          <label class="form-label">UNDERGRADUATE DEGREE</label>
          <input id="about-undergrad" class="form-input" value="${esc(d.about.undergrad)}" />
        </div>
        <div class="form-group full">
          <label class="form-label">WORK STYLE QUOTE</label>
          <input id="about-workstyle" class="form-input" value="${esc(d.about.workStyle)}" />
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ PASSIONS (JSON array items)</div>
      <div class="tags-container" id="about-passions-tags"></div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ ACTIVE DIRECTIVES (current missions)</div>
      <div class="tags-container" id="about-directives-tags"></div>
    </div>
  `;
  makeTagsInput(document.getElementById('about-passions-tags'), d.about.passions, (tags) => {
    const cur = getData(); cur.about.passions = tags; saveData(cur);
  });
  makeTagsInput(document.getElementById('about-directives-tags'), d.about.directives, (tags) => {
    const cur = getData(); cur.about.directives = tags; saveData(cur);
  });
}

/* ────────────────────────────────────
   ARSENAL PANEL
──────────────────────────────────── */
function renderArsenalPanel(d) {
  const el = document.getElementById('panel-arsenal');
  let html = `
    <div class="panel-title">⚡ Tech Arsenal</div>
    <div class="panel-sub">Manage skill badge categories and proficiency matrix.</div>
    <div id="arsenal-categories"></div>
    <div class="form-section" style="margin-top:1.5rem">
      <div class="form-section-title">▶ PROFICIENCY MATRIX</div>
      <div id="prof-rows"></div>
      <button class="add-btn" id="add-prof-btn">+ Add Skill Row</button>
    </div>
  `;
  el.innerHTML = html;

  // Render categories
  const catContainer = document.getElementById('arsenal-categories');
  d.arsenal.categories.forEach((cat, ci) => {
    const sec = document.createElement('div');
    sec.className = 'form-section';
    sec.innerHTML = `
      <div class="form-section-title">▶ ${cat.icon} ${cat.title.toUpperCase()}</div>
      <div class="form-group" style="margin-bottom:0.6rem">
        <label class="form-label">CATEGORY TITLE</label>
        <input class="form-input cat-title-inp" data-ci="${ci}" value="${esc(cat.title)}" />
      </div>
      <div class="form-group">
        <label class="form-label">BADGES (press Enter to add)</label>
        <div class="tags-container" id="cat-badges-${ci}"></div>
      </div>
    `;
    catContainer.appendChild(sec);
    sec.querySelector('.cat-title-inp').addEventListener('change', (e) => {
      const cur = getData(); cur.arsenal.categories[ci].title = e.target.value; saveData(cur);
    });
    makeTagsInput(document.getElementById(`cat-badges-${ci}`), cat.badges, (tags) => {
      const cur = getData(); cur.arsenal.categories[ci].badges = tags; saveData(cur);
    });
  });

  // Render proficiency rows
  renderProfRows(d);

  document.getElementById('add-prof-btn').onclick = () => {
    const cur = getData();
    cur.arsenal.proficiency.push({ label: 'New Skill', width: '50%', level: 'Intermediate' });
    saveData(cur);
    renderProfRows(cur);
  };
}

function renderProfRows(d) {
  const c = document.getElementById('prof-rows');
  if (!c) return;
  c.innerHTML = '';
  d.arsenal.proficiency.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'prof-admin-row';
    row.innerHTML = `
      <input class="form-input" placeholder="Skill label" value="${esc(p.label)}" data-i="${i}" id="prof-label-${i}" />
      <input class="form-input" placeholder="75%" value="${esc(p.width)}" data-i="${i}" id="prof-width-${i}" />
      <input class="form-input" placeholder="Expert" value="${esc(p.level)}" data-i="${i}" id="prof-level-${i}" />
      <button class="icon-btn delete" data-i="${i}" title="Delete">🗑</button>
    `;
    row.querySelector('.delete').onclick = (e) => {
      const cur = getData();
      cur.arsenal.proficiency.splice(+e.currentTarget.dataset.i, 1);
      saveData(cur);
      renderProfRows(cur);
    };
    ['label','width','level'].forEach(f => {
      row.querySelector(`#prof-${f}-${i}`).addEventListener('change', () => {
        const cur = getData();
        cur.arsenal.proficiency[i].label = document.getElementById(`prof-label-${i}`).value;
        cur.arsenal.proficiency[i].width = document.getElementById(`prof-width-${i}`).value;
        cur.arsenal.proficiency[i].level = document.getElementById(`prof-level-${i}`).value;
        saveData(cur);
      });
    });
    c.appendChild(row);
  });
}

/* ────────────────────────────────────
   EXPERIENCE PANEL
──────────────────────────────────── */
function renderExperiencePanel(d) {
  const el = document.getElementById('panel-experience');
  el.innerHTML = `
    <div class="panel-title">💼 Experience Timeline</div>
    <div class="panel-sub">Add, edit, or remove timeline entries.</div>
    <div class="card-list" id="exp-list"></div>
    <button class="add-btn" id="add-exp-btn">+ Add Experience Entry</button>
  `;
  renderExpList(d);
  document.getElementById('add-exp-btn').onclick = () => {
    const cur = getData();
    cur.experience.push({ period: 'YYYY → YYYY', role: 'New Role', company: '🏢 Company Name', points: ['Responsibility'] });
    saveData(cur);
    renderExpList(cur);
  };
}

function renderExpList(d) {
  const list = document.getElementById('exp-list');
  if (!list) return;
  list.innerHTML = '';
  d.experience.forEach((exp, i) => {
    const item = document.createElement('div');
    item.className = 'card-item';
    item.innerHTML = `
      <div class="card-item-header">
        <span class="card-item-icon">💼</span>
        <span class="card-item-title">${esc(exp.role)} — ${esc(exp.company)}</span>
        <div class="card-item-controls">
          <button class="icon-btn delete" title="Delete">🗑</button>
          <button class="icon-btn expand-icon">▼</button>
        </div>
      </div>
      <div class="card-item-body open">
        <div class="form-grid" style="margin-bottom:0.8rem">
          <div class="form-group">
            <label class="form-label">PERIOD</label>
            <input class="form-input exp-period" value="${esc(exp.period)}" />
          </div>
          <div class="form-group">
            <label class="form-label">ROLE / TITLE</label>
            <input class="form-input exp-role" value="${esc(exp.role)}" />
          </div>
          <div class="form-group full">
            <label class="form-label">COMPANY</label>
            <input class="form-input exp-company" value="${esc(exp.company)}" />
          </div>
        </div>
        <label class="form-label" style="margin-bottom:0.4rem;display:block">BULLET POINTS (press Enter to add)</label>
        <div class="tags-container exp-points-tags"></div>
      </div>
    `;
    const header = item.querySelector('.card-item-header');
    const body   = item.querySelector('.card-item-body');
    makeCollapsible(header, body);

    item.querySelector('.delete').onclick = (e) => {
      e.stopPropagation();
      const cur = getData(); cur.experience.splice(i, 1); saveData(cur); renderExpList(cur);
    };
    ['period','role','company'].forEach(f => {
      item.querySelector(`.exp-${f}`).addEventListener('change', () => {
        const cur = getData();
        cur.experience[i].period  = item.querySelector('.exp-period').value;
        cur.experience[i].role    = item.querySelector('.exp-role').value;
        cur.experience[i].company = item.querySelector('.exp-company').value;
        saveData(cur);
      });
    });
    makeTagsInput(item.querySelector('.exp-points-tags'), exp.points, (tags) => {
      const cur = getData(); cur.experience[i].points = tags; saveData(cur);
    });
    list.appendChild(item);
  });
}

/* ────────────────────────────────────
   PROJECTS PANEL
──────────────────────────────────── */
function renderProjectsPanel(d) {
  const el = document.getElementById('panel-projects');
  el.innerHTML = `
    <div class="panel-title">🔬 Projects</div>
    <div class="panel-sub">Add, edit, or remove project cards shown on the portfolio.</div>
    <div class="card-list" id="proj-list"></div>
    <button class="add-btn" id="add-proj-btn">+ Add New Project</button>
  `;
  renderProjList(d);
  document.getElementById('add-proj-btn').onclick = () => {
    const cur = getData();
    cur.projects.push({ icon: '🚀', name: 'New Project', desc: 'Project description', stack: ['Python'] });
    saveData(cur);
    renderProjList(cur);
  };
}

function renderProjList(d) {
  const list = document.getElementById('proj-list');
  if (!list) return;
  list.innerHTML = '';
  d.projects.forEach((proj, i) => {
    const item = document.createElement('div');
    item.className = 'card-item';
    item.innerHTML = `
      <div class="card-item-header">
        <span class="card-item-icon">${proj.icon}</span>
        <span class="card-item-title">${esc(proj.name)}</span>
        <div class="card-item-controls">
          <button class="icon-btn delete" title="Delete">🗑</button>
          <button class="icon-btn expand-icon">▼</button>
        </div>
      </div>
      <div class="card-item-body open">
        <div class="form-grid" style="margin-bottom:0.8rem">
          <div class="form-group">
            <label class="form-label">ICON (emoji)</label>
            <input class="form-input proj-icon" value="${esc(proj.icon)}" maxlength="4" />
          </div>
          <div class="form-group">
            <label class="form-label">PROJECT NAME</label>
            <input class="form-input proj-name" value="${esc(proj.name)}" />
          </div>
          <div class="form-group full">
            <label class="form-label">DESCRIPTION</label>
            <textarea class="form-textarea proj-desc">${esc(proj.desc)}</textarea>
          </div>
        </div>
        <label class="form-label" style="margin-bottom:0.4rem;display:block">TECH STACK TAGS (press Enter)</label>
        <div class="tags-container proj-stack-tags"></div>
      </div>
    `;
    const header = item.querySelector('.card-item-header');
    const body   = item.querySelector('.card-item-body');
    makeCollapsible(header, body);

    item.querySelector('.delete').onclick = (e) => {
      e.stopPropagation();
      const cur = getData(); cur.projects.splice(i, 1); saveData(cur); renderProjList(cur);
    };
    ['icon','name','desc'].forEach(f => {
      item.querySelector(`.proj-${f}`).addEventListener('change', () => {
        const cur = getData();
        cur.projects[i].icon = item.querySelector('.proj-icon').value;
        cur.projects[i].name = item.querySelector('.proj-name').value;
        cur.projects[i].desc = item.querySelector('.proj-desc').value;
        saveData(cur);
        item.querySelector('.card-item-icon').textContent = cur.projects[i].icon;
        item.querySelector('.card-item-title').textContent = cur.projects[i].name;
      });
    });
    makeTagsInput(item.querySelector('.proj-stack-tags'), proj.stack, (tags) => {
      const cur = getData(); cur.projects[i].stack = tags; saveData(cur);
    });
    list.appendChild(item);
  });
}

/* ────────────────────────────────────
   CERTIFICATIONS PANEL
──────────────────────────────────── */
function renderCertsPanel(d) {
  const el = document.getElementById('panel-certs');
  el.innerHTML = `
    <div class="panel-title">📜 Certifications</div>
    <div class="panel-sub">Manage your certifications shown in the terminal window.</div>
    <div class="card-list" id="cert-list"></div>
    <button class="add-btn" id="add-cert-btn">+ Add Certification</button>
  `;
  renderCertList(d);
  document.getElementById('add-cert-btn').onclick = () => {
    const cur = getData();
    cur.certs.push({ issuer: '[Issuer]', name: 'Certification Name', status: 'ACTIVE' });
    saveData(cur);
    renderCertList(cur);
  };
}

function renderCertList(d) {
  const list = document.getElementById('cert-list');
  if (!list) return;
  list.innerHTML = '';
  d.certs.forEach((cert, i) => {
    const item = document.createElement('div');
    item.className = 'card-item';
    item.innerHTML = `
      <div class="card-item-header">
        <span class="card-item-icon">📜</span>
        <span class="card-item-title">${esc(cert.issuer)} — ${esc(cert.name)}</span>
        <div class="card-item-controls">
          <button class="icon-btn delete">🗑</button>
          <button class="icon-btn expand-icon">▼</button>
        </div>
      </div>
      <div class="card-item-body open">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ISSUER</label>
            <input class="form-input cert-issuer" value="${esc(cert.issuer)}" />
          </div>
          <div class="form-group">
            <label class="form-label">STATUS</label>
            <select class="form-select cert-status">
              <option ${cert.status==='ACTIVE'?'selected':''}>ACTIVE</option>
              <option ${cert.status==='EXPIRED'?'selected':''}>EXPIRED</option>
              <option ${cert.status==='PENDING'?'selected':''}>PENDING</option>
            </select>
          </div>
          <div class="form-group full">
            <label class="form-label">CERTIFICATION NAME</label>
            <input class="form-input cert-name" value="${esc(cert.name)}" />
          </div>
        </div>
      </div>
    `;
    const header = item.querySelector('.card-item-header');
    const body   = item.querySelector('.card-item-body');
    makeCollapsible(header, body);
    item.querySelector('.delete').onclick = (e) => {
      e.stopPropagation();
      const cur = getData(); cur.certs.splice(i, 1); saveData(cur); renderCertList(cur);
    };
    ['issuer','name','status'].forEach(f => {
      item.querySelector(`.cert-${f}`).addEventListener('change', () => {
        const cur = getData();
        cur.certs[i].issuer = item.querySelector('.cert-issuer').value;
        cur.certs[i].name   = item.querySelector('.cert-name').value;
        cur.certs[i].status = item.querySelector('.cert-status').value;
        saveData(cur);
      });
    });
    list.appendChild(item);
  });
}

/* ────────────────────────────────────
   ACHIEVEMENTS PANEL
──────────────────────────────────── */
function renderAchievementsPanel(d) {
  const el = document.getElementById('panel-achievements');
  let metricsHtml = d.achievements.metrics.map((m, i) => `
    <div class="form-section" style="margin-bottom:0.8rem">
      <div class="form-grid triple">
        <div class="form-group">
          <label class="form-label">VALUE</label>
          <input class="form-input" id="metric-val-${i}" value="${esc(m.value)}" />
        </div>
        <div class="form-group">
          <label class="form-label">SUFFIX</label>
          <input class="form-input" id="metric-suf-${i}" value="${esc(m.suffix)}" placeholder="+ or empty" />
        </div>
        <div class="form-group">
          <label class="form-label">LABEL LINE 1</label>
          <input class="form-input" id="metric-l1-${i}" value="${esc(m.label1)}" />
        </div>
        <div class="form-group full">
          <label class="form-label">LABEL LINE 2</label>
          <input class="form-input" id="metric-l2-${i}" value="${esc(m.label2)}" />
        </div>
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="panel-title">🏆 Achievements</div>
    <div class="panel-sub">Edit the metric cards and daily rhythm code block.</div>
    <div class="form-section">
      <div class="form-section-title">▶ METRIC CARDS</div>
      ${metricsHtml}
      <button class="add-btn" id="add-metric-btn">+ Add Metric</button>
    </div>
    <div class="form-section">
      <div class="form-section-title">▶ DAILY RHYTHM</div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">MORNING</label>
          <input class="form-input" id="rhythm-morning" value="${esc(d.achievements.rhythm.morning)}" /></div>
        <div class="form-group"><label class="form-label">AFTERNOON</label>
          <input class="form-input" id="rhythm-afternoon" value="${esc(d.achievements.rhythm.afternoon)}" /></div>
        <div class="form-group"><label class="form-label">EVENING</label>
          <input class="form-input" id="rhythm-evening" value="${esc(d.achievements.rhythm.evening)}" /></div>
        <div class="form-group"><label class="form-label">MIDNIGHT</label>
          <input class="form-input" id="rhythm-midnight" value="${esc(d.achievements.rhythm.midnight)}" /></div>
        <div class="form-group full"><label class="form-label">PHILOSOPHY</label>
          <input class="form-input" id="rhythm-philosophy" value="${esc(d.achievements.rhythm.philosophy)}" /></div>
      </div>
    </div>
  `;

  // Wire metric saves
  d.achievements.metrics.forEach((m, i) => {
    ['val','suf','l1','l2'].forEach(f => {
      document.getElementById(`metric-${f}-${i}`)?.addEventListener('change', () => {
        const cur = getData();
        cur.achievements.metrics[i].value  = document.getElementById(`metric-val-${i}`).value;
        cur.achievements.metrics[i].suffix = document.getElementById(`metric-suf-${i}`).value;
        cur.achievements.metrics[i].label1 = document.getElementById(`metric-l1-${i}`).value;
        cur.achievements.metrics[i].label2 = document.getElementById(`metric-l2-${i}`).value;
        saveData(cur);
      });
    });
  });

  // Rhythm saves
  ['morning','afternoon','evening','midnight','philosophy'].forEach(k => {
    document.getElementById(`rhythm-${k}`)?.addEventListener('change', () => {
      const cur = getData(); cur.achievements.rhythm[k] = document.getElementById(`rhythm-${k}`).value; saveData(cur);
    });
  });

  document.getElementById('add-metric-btn').onclick = () => {
    const cur = getData();
    cur.achievements.metrics.push({ value: '0', suffix: '', label1: 'New', label2: 'Metric' });
    saveData(cur);
    renderAchievementsPanel(cur);
  };
}

/* ────────────────────────────────────
   STATS PANEL
──────────────────────────────────── */
function renderStatsPanel(d) {
  const el = document.getElementById('panel-stats');
  el.innerHTML = `
    <div class="panel-title">📊 GitHub Stats</div>
    <div class="panel-sub">Edit the Top Languages chart and Weekly Activity Log.</div>
    <div class="form-section">
      <div class="form-section-title">▶ TOP LANGUAGES</div>
      <div id="lang-rows"></div>
      <button class="add-btn" id="add-lang-btn">+ Add Language</button>
    </div>
    <div class="form-section">
      <div class="form-section-title">▶ WEEKLY ACTIVITY LOG</div>
      <div id="weekly-rows"></div>
      <button class="add-btn" id="add-weekly-btn">+ Add Activity</button>
    </div>
  `;
  renderLangRows(d);
  renderWeeklyRows(d);
  document.getElementById('add-lang-btn').onclick = () => {
    const cur = getData();
    cur.stats.languages.push({ name: 'New Lang', pct: 5, color: '#888888' });
    saveData(cur); renderLangRows(cur);
  };
  document.getElementById('add-weekly-btn').onclick = () => {
    const cur = getData();
    cur.stats.weekly.push({ label: '🔧 Activity', pct: 20, time: '01h 00m' });
    saveData(cur); renderWeeklyRows(cur);
  };
}

function renderLangRows(d) {
  const c = document.getElementById('lang-rows'); if (!c) return; c.innerHTML = '';
  d.stats.languages.forEach((lang, i) => {
    const row = document.createElement('div'); row.className = 'lang-admin-row';
    row.innerHTML = `
      <input type="color" class="lang-color-swatch" id="lang-color-${i}" value="${lang.color}" title="Color" />
      <input class="form-input" id="lang-name-${i}" value="${esc(lang.name)}" placeholder="Language" />
      <input class="form-input" id="lang-pct-${i}" value="${lang.pct}" type="number" min="0" max="100" placeholder="%" />
      <button class="icon-btn delete">🗑</button>
    `;
    row.querySelector('.delete').onclick = () => {
      const cur = getData(); cur.stats.languages.splice(i,1); saveData(cur); renderLangRows(cur);
    };
    ['name','pct','color'].forEach(f => {
      const el = row.querySelector(`#lang-${f}-${i}`) || row.querySelector('.lang-color-swatch');
      row.querySelector(`#lang-${f === 'color' ? `lang-color-${i}` : `lang-${f}-${i}`}`)?.addEventListener('change', () => {
        const cur = getData();
        cur.stats.languages[i].name  = document.getElementById(`lang-name-${i}`).value;
        cur.stats.languages[i].pct   = +document.getElementById(`lang-pct-${i}`).value;
        cur.stats.languages[i].color = document.getElementById(`lang-color-${i}`).value;
        saveData(cur);
      });
    });
    c.appendChild(row);
  });
}

function renderWeeklyRows(d) {
  const c = document.getElementById('weekly-rows'); if (!c) return; c.innerHTML = '';
  d.stats.weekly.forEach((w, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:1fr 80px 90px 32px;gap:0.6rem;margin-bottom:0.5rem;align-items:center';
    row.innerHTML = `
      <input class="form-input" id="weekly-label-${i}" value="${esc(w.label)}" placeholder="Label" />
      <input class="form-input" id="weekly-pct-${i}" value="${w.pct}" type="number" min="0" max="100" />
      <input class="form-input" id="weekly-time-${i}" value="${esc(w.time)}" placeholder="00h 00m" />
      <button class="icon-btn delete">🗑</button>
    `;
    row.querySelector('.delete').onclick = () => {
      const cur = getData(); cur.stats.weekly.splice(i,1); saveData(cur); renderWeeklyRows(cur);
    };
    ['label','pct','time'].forEach(f => {
      document.getElementById(`weekly-${f}-${i}`)?.addEventListener('change', () => {
        const cur = getData();
        cur.stats.weekly[i].label = document.getElementById(`weekly-label-${i}`).value;
        cur.stats.weekly[i].pct   = +document.getElementById(`weekly-pct-${i}`).value;
        cur.stats.weekly[i].time  = document.getElementById(`weekly-time-${i}`).value;
        saveData(cur);
      });
    });
    c.appendChild(row);
  });
}

/* ────────────────────────────────────
   RESEARCH PANEL
──────────────────────────────────── */
function renderResearchPanel(d) {
  const el = document.getElementById('panel-research');
  el.innerHTML = `
    <div class="panel-title">🔭 Research Domains</div>
    <div class="panel-sub">Edit research area cards displayed on the portfolio.</div>
    <div class="card-list" id="research-list"></div>
    <button class="add-btn" id="add-research-btn">+ Add Research Domain</button>
  `;
  renderResearchList(d);
  document.getElementById('add-research-btn').onclick = () => {
    const cur = getData();
    cur.research.push({ title: '🔬 New Domain', desc: 'Description of the research area.' });
    saveData(cur); renderResearchList(cur);
  };
}

function renderResearchList(d) {
  const list = document.getElementById('research-list'); if (!list) return; list.innerHTML = '';
  d.research.forEach((r, i) => {
    const item = document.createElement('div'); item.className = 'card-item';
    item.innerHTML = `
      <div class="card-item-header">
        <span class="card-item-icon">🔭</span>
        <span class="card-item-title">${esc(r.title)}</span>
        <div class="card-item-controls">
          <button class="icon-btn delete">🗑</button>
          <button class="icon-btn expand-icon">▼</button>
        </div>
      </div>
      <div class="card-item-body open">
        <div class="form-group" style="margin-bottom:0.8rem">
          <label class="form-label">TITLE</label>
          <input class="form-input res-title" value="${esc(r.title)}" />
        </div>
        <div class="form-group">
          <label class="form-label">DESCRIPTION</label>
          <textarea class="form-textarea res-desc">${esc(r.desc)}</textarea>
        </div>
      </div>
    `;
    makeCollapsible(item.querySelector('.card-item-header'), item.querySelector('.card-item-body'));
    item.querySelector('.delete').onclick = (e) => {
      e.stopPropagation();
      const cur = getData(); cur.research.splice(i,1); saveData(cur); renderResearchList(cur);
    };
    ['title','desc'].forEach(f => {
      item.querySelector(`.res-${f}`).addEventListener('change', () => {
        const cur = getData();
        cur.research[i].title = item.querySelector('.res-title').value;
        cur.research[i].desc  = item.querySelector('.res-desc').value;
        saveData(cur);
      });
    });
    list.appendChild(item);
  });
}

/* ────────────────────────────────────
   CONNECT PANEL
──────────────────────────────────── */
function renderConnectPanel(d) {
  const el = document.getElementById('panel-connect');
  el.innerHTML = `
    <div class="panel-title">📡 Connect / Social Links</div>
    <div class="panel-sub">Update all social media links and contact info.</div>
    <div class="form-section">
      <div class="form-section-title">▶ SOCIAL LINKS</div>
      <div class="form-grid single">
        ${[
          ['connect-linkedin','LinkedIn URL','linkedin',d.connect.linkedin],
          ['connect-email','Email Address','email',d.connect.email],
          ['connect-medium','Medium URL','medium',d.connect.medium],
          ['connect-twitter','Twitter/X URL','twitter',d.connect.twitter],
          ['connect-github','GitHub URL','github',d.connect.github],
          ['connect-phone','Phone Number','phone',d.connect.phone]
        ].map(([id,label,,val]) => `
          <div class="form-group">
            <label class="form-label">${label}</label>
            <input id="${id}" class="form-input" value="${esc(val)}" />
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ────────────────────────────────────
   SETTINGS PANEL
──────────────────────────────────── */
function renderSettingsPanel(d) {
  const el = document.getElementById('panel-settings');
  el.innerHTML = `
    <div class="panel-title">⚙️ Settings</div>
    <div class="panel-sub">Global site settings and admin security.</div>

    <div class="form-section">
      <div class="form-section-title">▶ SITE APPEARANCE</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">DEFAULT THEME</label>
          <select id="setting-theme" class="form-select">
            <option value="dark" ${d.settings.defaultTheme==='dark'?'selected':''}>Dark Mode</option>
            <option value="light" ${d.settings.defaultTheme==='light'?'selected':''}>Light Mode</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">FOOTER YEAR</label>
          <input id="setting-year" class="form-input" value="${esc(d.settings.footerYear)}" />
        </div>
        <div class="form-group full">
          <label class="form-label">ACCENT COLOR</label>
          <div class="color-input-wrap">
            <input type="color" id="setting-accent-picker" value="${d.settings.accentColor}"
              oninput="document.getElementById('setting-accent').value=this.value" />
            <input id="setting-accent" class="form-input" value="${d.settings.accentColor}"
              oninput="document.getElementById('setting-accent-picker').value=this.value" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ ADMIN PASSWORD</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">NEW PASSWORD</label>
          <input id="new-password" class="form-input" type="password" placeholder="Enter new password" />
        </div>
        <div class="form-group">
          <label class="form-label">CONFIRM PASSWORD</label>
          <input id="confirm-password" class="form-input" type="password" placeholder="Confirm new password" />
        </div>
      </div>
      <button class="add-btn" style="margin-top:0.8rem" id="change-pass-btn">🔐 Change Password</button>
    </div>

    <div class="form-section">
      <div class="form-section-title">▶ DATA MANAGEMENT</div>
      <div style="display:flex;gap:0.7rem;flex-wrap:wrap">
        <button class="add-btn" id="export-btn" style="flex:1;border-style:solid;color:#79c0ff;border-color:rgba(121,192,255,0.3)">📤 Export Data JSON</button>
        <button class="add-btn" id="import-btn" style="flex:1;border-style:solid;color:#79c0ff;border-color:rgba(121,192,255,0.3)">📥 Import Data JSON</button>
        <button class="add-btn" id="reset-btn" style="flex:1;border-style:solid;color:#ff4444;border-color:rgba(255,68,68,0.3)">🔄 Reset to Defaults</button>
      </div>
    </div>
  `;

  document.getElementById('change-pass-btn').onclick = async () => {
    const np = document.getElementById('new-password').value;
    const cp = document.getElementById('confirm-password').value;
    if (!np) return toast('Enter a new password', 'error');
    if (np !== cp) return toast('Passwords do not match', 'error');
    if (np.length < 6) return toast('Password must be at least 6 chars', 'error');
    await changePassword(np);
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    toast('Password changed!');
  };

  document.getElementById('export-btn').onclick = () => openExportModal();
  document.getElementById('import-btn').onclick = () => openImportModal();
  document.getElementById('reset-btn').onclick = () => {
    if (confirm('Reset ALL content to defaults? This cannot be undone.')) {
      resetData();
      loadAllPanels();
      toast('Reset to defaults!');
    }
  };
}

/* ────────────────────────────────────
   EXPORT / IMPORT
──────────────────────────────────── */
function openExportModal() {
  const modal = document.getElementById('export-modal');
  document.getElementById('export-textarea').value = JSON.stringify(getData(), null, 2);
  modal.classList.add('open');
}

function openImportModal() {
  const modal = document.getElementById('import-modal');
  document.getElementById('import-textarea').value = '';
  modal.classList.add('open');
}

function doImport() {
  try {
    const raw = document.getElementById('import-textarea').value;
    const parsed = JSON.parse(raw);
    saveData(parsed);
    document.getElementById('import-modal').classList.remove('open');
    loadAllPanels();
    toast('Data imported!');
  } catch(e) {
    toast('Invalid JSON format', 'error');
  }
}

/* ── Escape HTML ── */
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ────────────────────────────────────
   INIT
──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Enter key on login
  document.getElementById('login-pw')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.section));
  });

  // Top bar buttons
  document.getElementById('save-btn')?.addEventListener('click', saveAll);
  document.getElementById('preview-btn')?.addEventListener('click', () => window.open('index.html', '_blank'));
  document.getElementById('topbar-export-btn')?.addEventListener('click', openExportModal);

  // Modal close
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  // Auto-restore session
  if (isLoggedIn()) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').classList.add('visible');
    loadAllPanels();
  }
});
