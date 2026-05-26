/**
 * Generates HTML animated-slideshow demo files from captured screenshots.
 * Run after capture-screenshots.mjs has populated public/screenshots/
 * Usage: node scripts/build-demos.mjs
 */
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SHOTS_DIR = join(ROOT, 'public', 'screenshots');
const DEMOS_DIR = join(ROOT, 'public', 'demos');

mkdirSync(DEMOS_DIR, { recursive: true });

const APPS = [
  {
    id: 'core-pragya-advanced',
    title: 'CorePragya Advanced',
    tagline: 'AI Knowledge Base · Multi-Agent Research & Writing',
    accentColor: '#8b5cf6',
    accentRgb: '139,92,246',
    screenLabels: {
      landing:   ['Home', 'Knowledge Platform Overview'],
      dashboard: ['Dashboard', 'AI-Curated Intelligence Feed'],
      feed:      ['Feed', 'Personalized RSS & Article Curation'],
      research:  ['Research Agent', 'Autonomous Web Synthesis Engine'],
      studio:    ['Content Studio', 'Multi-Agent Publishing Pipeline'],
    },
  },
  {
    id: 'bima-buddy-advanced',
    title: 'BimaBuddy Advanced',
    tagline: 'AI-Powered Health Insurance Suite · India',
    accentColor: '#10b981',
    accentRgb: '16,185,129',
    screenLabels: {
      landing:   ['Home', 'Insurance Platform Overview'],
      dashboard: ['Dashboard', 'Policy Overview & Recommendations'],
      compare:   ['Compare', '50+ Plans Side-by-Side Comparison'],
      claim:     ['Claim Intelligence', '85%+ Accuracy Before Filing'],
      voice:     ['Voice Assistant', '10 Indian Languages · 95%+ Accuracy'],
    },
  },
  {
    id: 'igcse-student-guide',
    title: 'IGCSE Student Guide',
    tagline: 'Grade 9-10 Adaptive Learning Platform',
    accentColor: '#f59e0b',
    accentRgb: '245,158,11',
    screenLabels: {
      landing:   ['Home', 'Free IGCSE Exam Prep Platform'],
      dashboard: ['Dashboard', 'Study Progress & Subject Overview'],
      flashcards:['Flashcards', 'AI-Generated Study Cards'],
      quiz:      ['Quiz', 'Adaptive Questions · Instant Feedback'],
      subjects:  ['Subjects', 'Full IGCSE Syllabus Coverage'],
    },
  },
  {
    id: 'nlsql-pro',
    title: 'NLSQLPro',
    tagline: 'Natural Language to SQL · Production Engine',
    accentColor: '#3b82f6',
    accentRgb: '59,130,246',
    screenLabels: {
      landing:   ['Home', 'NL-to-SQL Platform Overview'],
      dashboard: ['Dashboard', 'Query History & Schema Overview'],
      query:     ['Query Engine', 'Type in English · Get SQL Instantly'],
      glossary:  ['Business Glossary', 'Map Domain Terms to Schema'],
      history:   ['Query Memory', 'Golden Queries & Learning Engine'],
    },
  },
  {
    id: 'concept-forge',
    title: 'ConceptForge',
    tagline: 'Adaptive Learning for IIT JEE',
    accentColor: '#ef4444',
    accentRgb: '239,68,68',
    screenLabels: {
      landing:   ['Home', 'IIT JEE Adaptive Learning Platform'],
      dashboard: ['Dashboard', 'Concept Mastery Overview'],
      practice:  ['Practice', 'Adaptive Question Engine'],
      mastery:   ['Mastery Tracker', '4-Factor Mastery Scoring'],
      subjects:  ['Subjects', 'Physics · Chemistry · Mathematics'],
    },
  },
];

function buildDemoHtml(app, shots) {
  const { accentColor, accentRgb } = app;

  const slides = shots.map((shot, i) => {
    const [screenTitle, screenDesc] = app.screenLabels[shot] || [shot, ''];
    return {
      index: i,
      imgSrc: `/screenshots/${app.id}/${shot}.png`,
      title: screenTitle,
      desc: screenDesc,
    };
  });

  const totalSecs = slides.length * 4; // 4s per slide

  const slideHtml = slides.map((s, i) => `
    <div class="slide" id="s${i}" ${i === 0 ? 'style="opacity:1;transform:scale(1)"' : ''}>
      <div class="slide-img-wrap">
        <img src="${s.imgSrc}" alt="${s.title}" loading="${i === 0 ? 'eager' : 'lazy'}" />
        <div class="slide-overlay"></div>
      </div>
      <div class="slide-caption">
        <span class="caption-tag">${s.title}</span>
        <span class="caption-desc">${s.desc}</span>
      </div>
    </div>`).join('');

  const dotsHtml = slides.map((_, i) =>
    `<span class="dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${app.title} Demo</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0a0a0f;overflow:hidden;font-family:'Inter',system-ui,sans-serif}

.demo-root{position:relative;width:100%;height:100vh;background:#0a0a0f;overflow:hidden;border-radius:0}

/* Header */
.demo-header{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;gap:10px;padding:12px 16px;background:linear-gradient(#0a0a0f 60%,transparent)}
.demo-title{font-size:13px;font-weight:600;color:#fff;letter-spacing:-0.01em}
.demo-sub{font-size:11px;color:rgba(255,255,255,0.4);flex:1}
.demo-badge{font-size:10px;letter-spacing:1px;border:1px solid rgba(${accentRgb},0.4);color:${accentColor};padding:3px 8px;border-radius:20px}

/* Slides */
.slides-wrap{position:absolute;inset:0}
.slide{position:absolute;inset:0;opacity:0;transform:scale(1.03);transition:opacity 0.7s ease,transform 0.7s ease;display:flex;flex-direction:column}
.slide.active{opacity:1;transform:scale(1)}

.slide-img-wrap{flex:1;overflow:hidden;position:relative}
.slide-img-wrap img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.slide-overlay{position:absolute;inset:0;background:linear-gradient(transparent 60%,#0a0a0f)}

/* Caption */
.slide-caption{position:absolute;bottom:52px;left:0;right:0;padding:0 16px 8px;display:flex;align-items:baseline;gap:8px}
.caption-tag{font-size:12px;font-weight:700;color:${accentColor};letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap}
.caption-desc{font-size:11px;color:rgba(255,255,255,0.55);line-height:1.4}

/* Controls */
.controls{position:absolute;bottom:0;left:0;right:0;z-index:50;padding:8px 16px 10px;background:linear-gradient(transparent,rgba(10,10,15,0.98))}
.progress-track{height:2px;background:rgba(255,255,255,0.1);border-radius:2px;margin-bottom:8px;cursor:pointer;overflow:hidden}
.progress-fill{height:100%;background:${accentColor};border-radius:2px;width:0%;transition:width 0.1s linear}

.ctrl-row{display:flex;align-items:center;gap:10px}
.play-btn{width:24px;height:24px;border-radius:50%;background:${accentColor};border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:8px}
.dots{display:flex;gap:5px;flex:1}
.dot{width:5px;height:5px;border-radius:3px;background:rgba(255,255,255,0.2);cursor:pointer;transition:all 0.3s}
.dot.active{background:${accentColor};width:14px}
.time-lbl{font-size:10px;color:rgba(255,255,255,0.35);font-variant-numeric:tabular-nums;letter-spacing:0.02em}

/* Loading state */
.slide-img-wrap img.loading{opacity:0;transition:opacity 0.3s}
.slide-img-wrap img.loaded{opacity:1}
</style>
</head>
<body>
<div class="demo-root">
  <div class="demo-header">
    <span class="demo-title">${app.title}</span>
    <span class="demo-sub">${app.tagline}</span>
    <span class="demo-badge">DEMO</span>
  </div>

  <div class="slides-wrap">
    ${slideHtml}
  </div>

  <div class="controls">
    <div class="progress-track" id="track">
      <div class="progress-fill" id="fill"></div>
    </div>
    <div class="ctrl-row">
      <button class="play-btn" id="playBtn" aria-label="Play/Pause">▶</button>
      <div class="dots" id="dots">${dotsHtml}</div>
      <span class="time-lbl" id="timeLbl">0:00 / ${Math.floor(totalSecs/60)}:${String(totalSecs%60).padStart(2,'0')}</span>
    </div>
  </div>
</div>

<script>
const SLIDES = ${JSON.stringify(slides)};
const SLIDE_DURATION = 4000;
const TOTAL = ${totalSecs * 1000};

let cur = 0, playing = true, elapsed = 0, lastTick = null, slideTimer = null;

const slides   = document.querySelectorAll('.slide');
const fill     = document.getElementById('fill');
const timeLbl  = document.getElementById('timeLbl');
const playBtn  = document.getElementById('playBtn');
const dots     = document.querySelectorAll('.dot');

function showSlide(i) {
  slides.forEach((s,j) => s.classList.toggle('active', j===i));
  dots.forEach((d,j) => d.classList.toggle('active', j===i));
}

function fmtTime(ms) {
  const s = Math.floor(ms/1000);
  return Math.floor(s/60)+':'+ String(s%60).padStart(2,'0');
}

function tick(ts) {
  if (!playing) return;
  if (lastTick === null) lastTick = ts;
  const dt = ts - lastTick;
  lastTick = ts;
  elapsed = Math.min(elapsed + dt, TOTAL);

  const pct = (elapsed / TOTAL) * 100;
  fill.style.width = pct + '%';
  timeLbl.textContent = fmtTime(elapsed) + ' / ' + fmtTime(TOTAL);

  const newSlide = Math.min(Math.floor(elapsed / SLIDE_DURATION), SLIDES.length - 1);
  if (newSlide !== cur) { cur = newSlide; showSlide(cur); }

  if (elapsed >= TOTAL) {
    elapsed = 0; cur = 0; lastTick = null;
    showSlide(0);
    requestAnimationFrame(tick);
    return;
  }
  requestAnimationFrame(tick);
}

playBtn.addEventListener('click', () => {
  playing = !playing;
  playBtn.textContent = playing ? '▶' : '⏸';
  if (playing) { lastTick = null; requestAnimationFrame(tick); }
});

dots.forEach((d, i) => {
  d.addEventListener('click', () => {
    cur = i; elapsed = i * SLIDE_DURATION; lastTick = null;
    showSlide(cur);
    if (!playing) { fill.style.width = ((elapsed/TOTAL)*100)+'%'; timeLbl.textContent = fmtTime(elapsed)+' / '+fmtTime(TOTAL); }
  });
});

document.getElementById('track').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  elapsed    = pct * TOTAL;
  cur        = Math.min(Math.floor(elapsed / SLIDE_DURATION), SLIDES.length-1);
  lastTick   = null;
  showSlide(cur);
});

// Preload images
SLIDES.forEach(s => { const img = new Image(); img.src = s.imgSrc; });

showSlide(0);
if (playing) requestAnimationFrame(tick);
</script>
</body>
</html>`;
}

// Build demos for all apps that have screenshots
let built = 0;
for (const app of APPS) {
  const appShotsDir = join(SHOTS_DIR, app.id);
  if (!existsSync(appShotsDir)) {
    console.log(`⚠ No screenshots for ${app.id}, skipping`);
    continue;
  }

  const files = readdirSync(appShotsDir).filter(f => f.endsWith('.png'));
  if (files.length === 0) {
    console.log(`⚠ Empty screenshots dir for ${app.id}, skipping`);
    continue;
  }

  // Sort by the order defined in screenLabels
  const labelKeys = Object.keys(app.screenLabels);
  const shots = files
    .map(f => f.replace('.png', ''))
    .sort((a, b) => {
      const ai = labelKeys.indexOf(a), bi = labelKeys.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const html = buildDemoHtml(app, shots);
  const outPath = join(DEMOS_DIR, `${app.id}-demo.html`);
  writeFileSync(outPath, html, 'utf8');
  console.log(`✅ ${app.id}-demo.html — ${shots.length} slides: [${shots.join(', ')}]`);
  built++;
}

if (built === 0) {
  console.log('\nNo demos built — run capture-screenshots.mjs first.');
} else {
  console.log(`\n✅ Built ${built} demos in public/demos/`);
}
