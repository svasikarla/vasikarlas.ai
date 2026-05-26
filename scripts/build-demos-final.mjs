import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DEMOS = join(ROOT, 'public', 'demos');
mkdirSync(DEMOS, { recursive: true });

// Curated slides — only real, confirmed screenshots
const APPS = [
  {
    id: 'core-pragya-advanced',
    title: 'CorePragya Advanced',
    tagline: 'AI Knowledge Base · Multi-Agent Research & Publishing',
    accent: '#8b5cf6', accentRgb: '139,92,246',
    slides: [
      { file: 'landing.png',          label: 'Platform',        desc: 'AI Knowledge Base Overview' },
      { file: 'dashboard.png',        label: 'Dashboard',       desc: 'Knowledge Analytics & Insights' },
      { file: 'personal-rag-bot.png', label: 'RAG Bot',         desc: 'Ask Anything About Your Knowledge' },
      { file: 'research.png',         label: 'Research Agent',  desc: 'Multi-Agent Web Synthesis Engine' },
      { file: 'content-studio.png',   label: 'Content Studio',  desc: '6-Platform AI Publishing Pipeline' },
    ],
  },
  {
    id: 'bima-buddy-advanced',
    title: 'BimaBuddy Advanced',
    tagline: 'AI-Powered Health Insurance Suite · India',
    accent: '#10b981', accentRgb: '16,185,129',
    slides: [
      { file: 'landing.png',              label: 'Platform',          desc: "India's AI Health Insurance Hub" },
      { file: 'compare-plans.png',        label: 'Compare Plans',     desc: '50+ Plans Side-by-Side' },
      { file: 'claim-intelligence.png',   label: 'Claim Intelligence',desc: '85%+ Prediction Accuracy Before Filing' },
      { file: 'find-best-plan.png',       label: 'Find Best Plan',    desc: 'Personalized AI Recommendations' },
      { file: 'voice-assistant.png',      label: 'Voice Assistant',   desc: '10 Indian Languages · 95%+ Accuracy' },
    ],
  },
  {
    id: 'igcse-student-guide',
    title: 'IGCSE Student Guide',
    tagline: 'Free Grade 9-10 Adaptive Learning Platform',
    accent: '#f59e0b', accentRgb: '245,158,11',
    slides: [
      { file: 'landing.png',   label: 'Platform',  desc: 'Free IGCSE Grade 9-10 Study Hub' },
      { file: 'subjects.png',  label: 'Subjects',  desc: 'Full IGCSE Syllabus · Maths, Bio, Physics, Chemistry' },
    ],
  },
  {
    id: 'nlsql-pro',
    title: 'NLSQLPro',
    tagline: 'Natural Language to SQL · Production Engine',
    accent: '#3b82f6', accentRgb: '59,130,246',
    slides: [
      { file: 'landing.png', label: 'Platform',     desc: 'Production NL-to-SQL Engine' },
      { file: 'query.png',   label: 'Query Engine', desc: 'Type English · Get Production SQL' },
    ],
  },
  {
    id: 'concept-forge',
    title: 'ConceptForge',
    tagline: 'Adaptive Learning for IIT JEE',
    accent: '#ef4444', accentRgb: '239,68,68',
    slides: [
      { file: 'landing.png',       label: 'Platform',     desc: 'IIT JEE Adaptive Learning Engine' },
      { file: 'features.png',      label: 'Features',     desc: '4-Factor Mastery Algorithm · Active' },
      { file: 'how-it-works.png',  label: 'How It Works', desc: '3 Steps: Create · Practice · Build Mastery' },
    ],
  },
];

function html(app) {
  const { accent, accentRgb, slides } = app;
  const totalSecs = slides.length * 4;

  const slideMarkup = slides.map((s, i) => `
  <div class="slide${i === 0 ? ' active' : ''}" id="s${i}">
    <img src="/screenshots/${app.id}/${s.file}" alt="${s.label}" ${i < 2 ? '' : 'loading="lazy"'}>
    <div class="slide-gradient"></div>
    <div class="caption">
      <span class="cap-tag">${s.label}</span>
      <span class="cap-desc">${s.desc}</span>
    </div>
  </div>`).join('');

  const dots = slides.map((_, i) =>
    `<span class="dot${i === 0 ? ' on' : ''}" data-i="${i}"></span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${app.title}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:#09090f;font-family:system-ui,-apple-system,sans-serif}
.root{position:relative;width:100%;height:100vh;background:#09090f;overflow:hidden}

/* Header */
.hdr{position:absolute;top:0;left:0;right:0;z-index:20;padding:10px 14px;display:flex;align-items:center;gap:10px;background:linear-gradient(#09090f 55%,transparent)}
.hdr-title{font-size:13px;font-weight:700;color:#fff;letter-spacing:-.01em;white-space:nowrap}
.hdr-sub{font-size:10px;color:rgba(255,255,255,.35);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hdr-badge{font-size:9px;letter-spacing:1.2px;border:1px solid rgba(${accentRgb},.45);color:${accent};padding:2px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0}

/* Slides */
.slides{position:absolute;inset:0}
.slide{position:absolute;inset:0;opacity:0;transform:scale(1.04);transition:opacity .65s ease,transform .65s ease;display:flex;flex-direction:column}
.slide.active{opacity:1;transform:scale(1)}
.slide img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.slide-gradient{position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(9,9,15,.95))}

/* Caption */
.caption{position:absolute;bottom:46px;left:14px;right:14px;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.cap-tag{font-size:11px;font-weight:700;color:${accent};letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.cap-desc{font-size:11px;color:rgba(255,255,255,.5);line-height:1.4}

/* Controls */
.ctrl{position:absolute;bottom:0;left:0;right:0;z-index:30;padding:6px 14px 9px;background:linear-gradient(transparent,rgba(9,9,15,.98))}
.prog{height:2px;background:rgba(255,255,255,.1);border-radius:1px;margin-bottom:7px;cursor:pointer;overflow:hidden}
.prog-fill{height:100%;background:${accent};width:0%;transition:width .1s linear}
.ctrl-row{display:flex;align-items:center;gap:9px}
.pbtn{width:22px;height:22px;border-radius:50%;background:${accent};border:none;cursor:pointer;color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dots{display:flex;gap:4px;flex:1}
.dot{width:5px;height:5px;border-radius:3px;background:rgba(255,255,255,.18);cursor:pointer;transition:all .3s}
.dot.on{background:${accent};width:14px}
.tlbl{font-size:10px;color:rgba(255,255,255,.3);font-variant-numeric:tabular-nums}
</style>
</head>
<body>
<div class="root">
  <div class="hdr">
    <span class="hdr-title">${app.title}</span>
    <span class="hdr-sub">${app.tagline}</span>
    <span class="hdr-badge">LIVE APP</span>
  </div>
  <div class="slides">${slideMarkup}</div>
  <div class="ctrl">
    <div class="prog" id="prog"><div class="prog-fill" id="fill"></div></div>
    <div class="ctrl-row">
      <button class="pbtn" id="pbtn">&#9654;</button>
      <div class="dots" id="dots">${dots}</div>
      <span class="tlbl" id="tlbl">0:00 / ${String(Math.floor(totalSecs/60)).padStart(1,'0')}:${String(totalSecs%60).padStart(2,'0')}</span>
    </div>
  </div>
</div>
<script>
const N=${slides.length}, DUR=4000, TOTAL=${totalSecs*1000};
let cur=0, playing=true, elapsed=0, last=null;
const slides=document.querySelectorAll('.slide');
const fill=document.getElementById('fill');
const tlbl=document.getElementById('tlbl');
const pbtn=document.getElementById('pbtn');
const dots=document.querySelectorAll('.dot');
function show(i){slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((d,j)=>d.classList.toggle('on',j===i));}
function fmt(ms){const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function frame(ts){
  if(!playing)return;
  if(last===null)last=ts;
  elapsed=Math.min(elapsed+(ts-last),TOTAL);
  last=ts;
  fill.style.width=(elapsed/TOTAL*100)+'%';
  tlbl.textContent=fmt(elapsed)+' / '+fmt(TOTAL);
  const ni=Math.min(Math.floor(elapsed/DUR),N-1);
  if(ni!==cur){cur=ni;show(cur);}
  if(elapsed>=TOTAL){elapsed=0;cur=0;last=null;show(0);}
  requestAnimationFrame(frame);
}
pbtn.onclick=()=>{playing=!playing;pbtn.innerHTML=playing?'&#9654;':'&#9646;&#9646;';if(playing){last=null;requestAnimationFrame(frame);}};
dots.forEach((d,i)=>d.addEventListener('click',()=>{cur=i;elapsed=i*DUR;last=null;show(cur);fill.style.width=(elapsed/TOTAL*100)+'%';tlbl.textContent=fmt(elapsed)+' / '+fmt(TOTAL);}));
document.getElementById('prog').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();elapsed=(e.clientX-r.left)/r.width*TOTAL;cur=Math.min(Math.floor(elapsed/DUR),N-1);last=null;show(cur);});
show(0);requestAnimationFrame(frame);
</script>
</body>
</html>`;
}

for (const app of APPS) {
  const out = join(DEMOS, `${app.id}-demo.html`);
  writeFileSync(out, html(app), 'utf8');
  console.log(`✅ ${app.id}-demo.html  (${app.slides.length} slides)`);
}
console.log('\nAll demos written to public/demos/');
