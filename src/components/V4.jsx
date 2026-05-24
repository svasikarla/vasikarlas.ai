'use client';

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';

const ParallaxBubbles = lazy(() => import('./ParallaxBubbles'));
const ParticleField   = lazy(() => import('./ParticleField'));
import { PROJECTS, PROFILE } from '@/data/projects';
import { getVercelProjects } from '@/actions/vercel';
import {
  Badge,
  TabList,
  Tab,
  Dropdown,
  Option,
  SearchBox,
} from '@fluentui/react-components';

/* ─── Helpers ─── */

function parseDuration(s) {
  const unit = { h: 0, d: 1, w: 2, mo: 3, y: 4 };
  const m = s && s.match(/^(\d+)(h|d|w|mo|y)$/);
  return m ? parseInt(m[1]) + unit[m[2]] * 1000 : 9999;
}

function useCountUp(target, duration = 1200, deps = []) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setN(target * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [target, duration, ...deps]);
  return n;
}

function useTypewriter(text, { startDelay = 500, baseSpeed = 50 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text); setDone(true); return;
    }
    let tid;
    let i = 0;
    const type = () => {
      if (i >= text.length) { setDone(true); return; }
      i++;
      setDisplayed(text.slice(0, i));
      const ch = text[i - 1];
      const extra = '.!?'.includes(ch) ? 150 : ',;:'.includes(ch) ? 70 : 0;
      tid = setTimeout(type, baseSpeed + Math.random() * 30 + extra);
    };
    tid = setTimeout(type, startDelay);
    return () => clearTimeout(tid);
    // eslint-disable-next-line
  }, []);
  return { displayed, done };
}

export function CountUp({ value, decimals = 0, suffix = '' }) {
  const v = useCountUp(value);
  const f = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return <span>{f}{suffix}</span>;
}

export function StatusPill({ status }) {
  const label = { live: 'Live', beta: 'Beta', wip: 'WIP', archived: 'Archived' }[status] || status;
  const color = { live: 'success', beta: 'warning', wip: 'informative', archived: 'subtle' }[status] || 'subtle';
  return (
    <Badge appearance="outline" color={color} size="small" shape="rounded">
      {label}
    </Badge>
  );
}

/* ─── Live data hook ─── */

export function useProjectsData() {
  const [projects, setProjects] = useState(PROJECTS);

  useEffect(() => {
    let mounted = true;
    getVercelProjects().then((res) => {
      if (!mounted || !res.projects) return;
      const formatTimeAgo = (ms) => {
        const h = Math.floor(ms / 3600000);
        if (h === 0) return '1h';
        if (h < 24) return h + 'h';
        const d = Math.floor(h / 24);
        if (d < 7) return d + 'd';
        const w = Math.floor(d / 7);
        if (w < 4) return w + 'w';
        const mo = Math.floor(d / 30);
        if (mo < 12) return mo + 'mo';
        return Math.floor(d / 365) + 'y';
      };
      setProjects(prev => {
        const merged = prev.map(p => {
          const pRepoName = p.repo ? p.repo.split('/').pop().toLowerCase() : '';
          const pIdName = p.id.toLowerCase();
          const vp = res.projects.find(v => {
            const vName = v.name.toLowerCase();
            const vRepo = v.link?.repo ? v.link.repo.split('/').pop().toLowerCase() : '';
            return vName === pIdName || vName === pRepoName || vRepo === pIdName || vRepo === pRepoName || vName === p.name.toLowerCase();
          });
          if (vp) {
            const latestDeploy = vp.latestDeployments?.[0];
            let newStatus = p.status;
            let lastUpdate = p.lastUpdate;
            let newUrl = p.url;
            if (latestDeploy) {
              const msAgo = Date.now() - latestDeploy.createdAt;
              lastUpdate = formatTimeAgo(msAgo);
              if (latestDeploy.readyState === 'READY') {
                newStatus = 'live';
                if (!newUrl && latestDeploy.url) newUrl = `https://${latestDeploy.url}`;
              }
            }
            return { ...p, lastUpdate, status: newStatus, url: newUrl };
          }
          return p;
        });
        const existingIds = new Set();
        merged.forEach(p => {
          existingIds.add(p.id.toLowerCase());
          if (p.repo) existingIds.add(p.repo.split('/').pop().toLowerCase());
        });
        const newProjects = res.projects.filter(vp => {
          const vName = vp.name.toLowerCase();
          const vRepo = vp.link?.repo ? vp.link.repo.split('/').pop().toLowerCase() : '';
          return !existingIds.has(vName) && (!vRepo || !existingIds.has(vRepo));
        }).map(vp => {
          const latestDeploy = vp.latestDeployments?.[0];
          let status = 'wip';
          let lastUpdate = '1h';
          let url = null;
          if (latestDeploy) {
            const msAgo = Date.now() - latestDeploy.createdAt;
            lastUpdate = formatTimeAgo(msAgo);
            if (latestDeploy.readyState === 'READY') {
              status = 'live';
              url = latestDeploy.url ? `https://${latestDeploy.url}` : null;
            }
          }
          return {
            id: vp.name, name: vp.name.charAt(0).toUpperCase() + vp.name.slice(1),
            category: vp.framework || 'Web', status, description: `Auto-discovered Vercel deployment: ${vp.name}`,
            tagline: 'Vercel Deployment', url,
            repo: vp.link?.repo ? `https://github.com/${vp.link.repo}` : null,
            stack: [vp.framework || 'Vercel'], version: '—', commits: 0, deploys: 1,
            uptime: null, region: '—', lastUpdate, flagship: false,
          };
        });
        return [...merged, ...newProjects];
      });
    }).catch(err => console.error('Failed to update live projects', err));
    return () => { mounted = false; };
  }, []);

  return projects;
}

/* ─── Static content ─── */

export const FLAGSHIP_IDS = ['core-pragya-advanced', 'nlsql-pro', 'concept-forge', 'bima-buddy-advanced', 'igcse-student-guide'];

export const FLAGSHIP_NARRATIVES = {
  'bima-buddy-advanced': {
    challenge: "Health insurance in India is fragmented across dozens of providers and lacks local-language accessibility, leading to high claim rejection rates.",
    solution: "AI-powered insurance intelligence suite with automated 50+ policy comparisons, an 85%+ accuracy claim predictor, and voice assistant supporting 10 Indian languages."
  },
  'core-pragya-advanced': {
    challenge: "Personal knowledge from articles, feeds, and PDFs is fragmented — and the full loop of curating, researching, and publishing across platforms is a full-time job.",
    solution: "Three AI agents in one workspace — a Curator that personalizes your RSS feeds, an autonomous Research Agent that synthesizes the web into structured reports, and a multi-agent Content Studio that drafts, refines, and formats content for 6 publishing platforms."
  },
  'nlsql-pro': {
    challenge: "Non-technical decision-makers can't query databases without SQL expertise, creating severe operational bottlenecks.",
    solution: "Secure NL-to-SQL engine with 24-hour schema caching, Business Glossary mapping, Golden Query memory learning, and prompt injection protection against 30+ jailbreak patterns."
  },
  'igcse-student-guide': {
    challenge: "Quality exam prep materials are locked behind paywalls, creating inequality of educational access for millions of IGCSE students.",
    solution: "Fully automated content generation pipeline delivering curriculum-aligned study cards, adaptive quizzes, and topic guides with multi-step accuracy verification."
  },
  'concept-forge': {
    challenge: "IIT JEE preparation requires mastering thousands of interconnected concepts — most platforms serve content linearly and ignore the prerequisite gaps that actually block a student's progress.",
    solution: "Adaptive learning engine that scores concept mastery from four signals — recent performance, overall accuracy, question difficulty, and recency decay — then identifies prerequisite blockers and serves targeted practice that adjusts difficulty in real time."
  }
};

const PROBLEMS = [
  {
    pain: 'Unstructured knowledge is hard to search',
    solve: 'RAG pipelines, ingestion workflows, and knowledge graphs that turn scattered sources into retrievable intelligence.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /><path d="M8 11h6M11 8v6" />
      </svg>
    ),
  },
  {
    pain: 'Business users cannot access their own data',
    solve: 'NL-to-SQL interfaces with schema awareness and guardrails — plain English in, production SQL out.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
        <ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </svg>
    ),
  },
  {
    pain: 'High-stakes decisions feel opaque and low-trust',
    solve: 'Multilingual, guided workflows with AI-assisted comparison — built for insurance, health, and regulated domains.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
        <path d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    pain: 'Sensitive documents can’t go to public LLMs',
    solve: 'Private, on-device RAG and local-LLM pipelines for compliance-bound document workflows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
        <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.2" />
      </svg>
    ),
  },
];

const CAPABILITIES = [
  {
    title: 'LLM & Semantic Systems',
    tags: ['RAG Pipelines', 'Vector Search', 'Knowledge Graphs', 'Multi-Agent Orchestration']
  },
  {
    title: 'Product & Data Engineering',
    tags: ['Next.js / React', 'NL-to-SQL Interfaces', 'PostgreSQL / Supabase', 'Schema-Aware AI']
  },
  {
    title: 'Production & Reliability',
    tags: ['LLM Guardrails', 'Multilingual UX', 'Sub-100ms Retrieval', 'Observability & Iteration']
  }
];

/* ─── Command Palette (⌘K) ─── */
export function CommandPalette({ open, setOpen, projects }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = React.useRef();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQ(''); setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const filtered = projects.filter((p) =>
    !q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    if (e.key === 'Enter' && filtered[idx]) {
      window.open(filtered[idx].url || filtered[idx].repo || '#', '_blank');
      setOpen(false);
    }
  };

  if (!open) return null;
  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }} onKeyDown={onKeyDown} placeholder="Search projects…" />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div className="cmdk-empty">No matches</div>}
          {filtered.map((p, i) => (
            <div key={p.id} className={`cmdk-row ${i === idx ? 'sel' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => { window.open(p.url || p.repo || '#', '_blank'); setOpen(false); }}>
              <div className="cmdk-name">
                <span className={`pill ${p.status}`}><span className="d" /></span>
                {p.name}
                <span className="cmdk-cat">{p.category}</span>
              </div>
              <div className="cmdk-meta">{p.url ? 'Open ↗' : p.repo ? 'Source ↗' : 'Private'}</div>
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>⌘K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Flagship Visual Widgets ─── */
export function FlagshipVisual({ id }) {
  if (id === 'bima-buddy-advanced') {
    return (
      <div className="widget-mini">
        <div className="voice-claim-widget">
          <div className="widget-row">
            <span className="widget-label">Claim Evaluator</span>
            <span className="widget-header-badge">Online</span>
          </div>
          <div className="claims-gauge-container">
            <svg className="claims-circle-svg">
              <circle className="claims-circle-bg" cx="50" cy="50" r="40" />
              <circle className="claims-circle-fill" cx="50" cy="50" r="40" />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-percent">85%</span>
              <span className="gauge-lbl">Approval</span>
            </div>
          </div>
          <div className="voice-wave">
            <div className="wave-bar" /><div className="wave-bar" /><div className="wave-bar" />
            <div className="wave-bar" /><div className="wave-bar" /><div className="wave-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (id === 'core-pragya-advanced') {
    return (
      <div className="widget-mini">
        <div className="knowledge-graph-widget">
          <span className="graph-widget-title">Knowledge Graph</span>
          <svg className="graph-svg">
            <line className="graph-line" x1="40" y1="120" x2="160" y2="60" />
            <line className="graph-line" x1="160" y1="60" x2="280" y2="130" />
            <line className="graph-line" x1="160" y1="60" x2="160" y2="190" />
            <line className="graph-line" x1="40" y1="120" x2="160" y2="190" />
            <line className="graph-line" x1="160" y1="190" x2="280" y2="130" />
            <g className="graph-node">
              <circle className="node-pulse" cx="160" cy="60" r="14" fill="var(--accent)" opacity="0.3" />
              <circle className="graph-node-circle" cx="160" cy="60" r="7" />
              <text className="graph-label" x="160" y="44" textAnchor="middle">AI CORE</text>
            </g>
            <g className="graph-node">
              <circle className="graph-node-circle" cx="40" cy="120" r="6" />
              <text className="graph-label" x="40" y="105" textAnchor="middle">RAG</text>
            </g>
            <g className="graph-node">
              <circle className="graph-node-circle" cx="160" cy="190" r="6" />
              <text className="graph-label" x="160" y="210" textAnchor="middle">Vector DB</text>
            </g>
            <g className="graph-node">
              <circle className="graph-node-circle" cx="280" cy="130" r="6" />
              <text className="graph-label" x="280" y="115" textAnchor="middle">Graph</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (id === 'nlsql-pro') {
    return (
      <div className="widget-mini">
        <div className="sql-translator-widget">
          <div className="editor-header">
            <span className="editor-dot r" /><span className="editor-dot y" /><span className="editor-dot g" />
            <span className="editor-title">NL→SQL</span>
          </div>
          <div className="pane-nl">
            <span>Show live policies in &apos;bom1&apos; with uptime &gt; 99%</span>
            <span className="typing-cursor" />
          </div>
          <div className="pane-sql">
            <span className="sql-keyword">SELECT</span> * <span className="sql-keyword">FROM</span> policies <br />
            <span className="sql-keyword">WHERE</span> region = <span className="sql-string">&apos;bom1&apos;</span> <br />
            <span className="sql-keyword">AND</span> uptime &gt; <span className="sql-keyword">99</span>;
          </div>
        </div>
      </div>
    );
  }

  if (id === 'concept-forge') {
    return (
      <div className="widget-mini">
        <div className="mastery-widget">
          <div className="mastery-header">
            <span className="mastery-badge">IIT JEE · Physics</span>
            <span className="mastery-rank">Active Concept</span>
          </div>
          <div className="mastery-concept">Rotational Dynamics</div>
          <div className="mastery-progress">
            <div className="mastery-bar"><div className="mastery-fill" style={{ width: '68%' }} /></div>
            <span className="mastery-pct">68%</span>
          </div>
          <div className="mastery-factors">
            <div className="factor"><span>Performance</span><b>72%</b></div>
            <div className="factor"><span>Accuracy</span><b>81%</b></div>
            <div className="factor"><span>Difficulty</span><b>L4</b></div>
            <div className="factor"><span>Recency</span><b>2d</b></div>
          </div>
          <div className="mastery-next">→ Next: Angular Momentum <span className="mastery-tag">prerequisite</span></div>
        </div>
      </div>
    );
  }

  if (id === 'igcse-student-guide') {
    return (
      <div className="widget-mini">
        <div className="study-card-widget">
          <div className="study-card-header">
            <span className="study-card-badge">Physics · Grade 10</span>
          </div>
          <div className="study-card-body">
            <h4 className="study-card-question">Newton&apos;s Second Law?</h4>
            <p className="study-card-answer-preview">
              <span className="study-card-check">✓</span> F = ma
            </p>
          </div>
          <div className="study-card-footer">
            <div className="study-card-stats">
              <div className="study-stat">
                <label>Confidence</label>
                <span>94%</span>
              </div>
              <div className="study-stat">
                <label>Grade</label>
                <span>A*</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Detail Panel ─── */
export function DetailPanel({ project, profile, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="dp-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="dp-header">
          <div className="dp-title">
            <span className="dp-name">{project.name}</span>
            {project.flagship && <span className="dp-flag">Flagship</span>}
          </div>
          <StatusPill status={project.status} />
        </div>

        <div className="dp-meta">
          <span>{project.category}</span>
          <span className="dp-sep">·</span>
          <span>{project.version !== '—' ? project.version : 'pre-release'}</span>
          <span className="dp-sep">·</span>
          <span>{project.region !== '—' ? project.region : 'local'}</span>
          <span className="dp-sep">·</span>
          <span>Updated {project.lastUpdate} ago</span>
        </div>

        <p className="dp-desc">{project.description}</p>

        {project.features && project.features.length > 0 && (
          <div className="dp-section">
            <div className="dp-section-label">Key Features</div>
            <div className="dp-features-grid">
              {project.features.map((f, i) => (
                <div key={i} className="dp-feature-card">
                  <div className="dp-feature-name">{f.name}</div>
                  <div className="dp-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dp-section">
          <div className="dp-section-label">Tech Stack</div>
          <div className="dp-stack">
            {project.stack.map((s) => <span key={s} className="dp-chip">{s}</span>)}
          </div>
        </div>

        <div className="dp-stats">
          <div className="dp-stat"><span className="k">Commits</span><span className="v">{project.commits}</span></div>
          <div className="dp-stat"><span className="k">Deploys</span><span className="v">{project.deploys || '—'}</span></div>
          <div className="dp-stat"><span className="k">Uptime</span><span className="v">{project.uptime ? `${project.uptime}%` : '—'}</span></div>
          <div className="dp-stat"><span className="k">Region</span><span className="v">{project.region !== '—' ? project.region : 'local'}</span></div>
        </div>

        <div className="dp-actions">
          {project.url
            ? <a className="dp-btn primary" href={project.url} target="_blank" rel="noopener noreferrer">Visit Live ↗</a>
            : <span className="dp-btn disabled">Offline</span>
          }
          {project.repo
            ? <a className="dp-btn" href={project.repo} target="_blank" rel="noopener noreferrer">View Source ↗</a>
            : <span className="dp-btn disabled">Private Repo</span>
          }
        </div>

        <div className="dp-attribution">
          <span className="dp-attr-pulse" />
          Part of <b>Vasikarla · AI</b> · {profile.location}
          <a className="dp-attr-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    </div>
  );
}

const HERO_HEADING = 'I build AI products that solve real business workflows.';

/* ─── Hero ─── */
export function Hero({ profile, onOpenPalette, ctaHref = '/work', ctaLabel = 'View Case Studies →', showStats = true, compact = false }) {
  const { displayed, done } = useTypewriter(HERO_HEADING);
  return (
    <section className={`v4-hero ${compact ? 'compact' : ''}`}>
      <div className="v4-hero-glow" />
      {!compact && (
        <Suspense fallback={null}>
          <ParticleField />
          <ParallaxBubbles />
        </Suspense>
      )}
      <div className="v4-hero-inner">
        <div className="hero-topline">
          <span>Vasikarla · AI</span>
          <span className="hero-topline-sep" />
          <span>AI Product Engineer</span>
          {onOpenPalette && (
            <button className="cmdk-btn" onClick={onOpenPalette}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              Search
              <kbd>⌘K</kbd>
            </button>
          )}
        </div>

        <h1 suppressHydrationWarning>
          {displayed}
          <span className={`cursor${done ? '' : ' typing'}`} />
        </h1>

        <p className="hero-sub">
          From RAG knowledge systems and NL-to-SQL interfaces to insurance and education platforms — production systems with real deployment and iteration discipline.
        </p>

        <div className="hero-ctas">
          <a className="btn-primary" href={ctaHref}>{ctaLabel}</a>
          <a className="btn-ghost" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="btn-ghost" href={`mailto:${profile.email}`}>Contact ↗</a>
        </div>

        {showStats && (
          <div className="hero-stats">
            <div className="stat-cell">
              <span className="stat-num"><CountUp value={profile.stats.projects} /></span>
              <span className="stat-lbl">Live Products</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num"><CountUp value={profile.stats.deploys} /></span>
              <span className="stat-lbl">Production Deploys</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num"><CountUp value={profile.stats.uptime} decimals={2} suffix="%" /></span>
              <span className="stat-lbl">Fleet Uptime</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Problems I Solve ─── */
export function ProblemsSection() {
  return (
    <section className="v4-section problems-section">
      <div className="section-header">
        <span className="section-label">What I Build For</span>
        <h2>Problems I Solve</h2>
      </div>
      <div className="problems-grid">
        {PROBLEMS.map((p, i) => (
          <div key={i} className="problem-card">
            <div className="problem-icon">{p.icon}</div>
            <h4 className="problem-pain">{p.pain}</h4>
            <p className="problem-solve">{p.solve}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Flagships ─── */
export function FlagshipsSection({ projects, onSelectProject, limit, headerLabel = 'Selected Work', headerTitle = 'Flagship Case Studies' }) {
  const flagshipProjects = useMemo(() => {
    const list = FLAGSHIP_IDS.map(id => projects.find(p => p.id === id)).filter(Boolean);
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }, [projects, limit]);

  return (
    <section id="flagships" className="v4-section">
      <div className="section-header">
        <span className="section-label">{headerLabel}</span>
        <h2>{headerTitle}</h2>
      </div>
      <div className="flagships-list">
        {flagshipProjects.map((p, idx) => {
          const narr = FLAGSHIP_NARRATIVES[p.id] || {
            challenge: p.description,
            solution: "Production-grade system design."
          };
          const isEven = idx % 2 === 1;
          return (
            <div key={p.id} className={`flagship-card ${isEven ? 'reversed' : ''}`}>
              <div className="flagship-visual">
                <FlagshipVisual id={p.id} />
              </div>
              <div className="flagship-body">
                <div className="flagship-head">
                  <div>
                    <h3 className="flagship-name">{p.name}</h3>
                    <span className="flagship-category">{p.category}</span>
                  </div>
                  <StatusPill status={p.status} />
                </div>

                <div className="flagship-narrative">
                  <div className="narrative-block">
                    <span className="narrative-label">Challenge</span>
                    <p>{narr.challenge}</p>
                  </div>
                  <div className="narrative-block">
                    <span className="narrative-label">Solution</span>
                    <p>{narr.solution}</p>
                  </div>
                </div>

                <div className="flagship-footer">
                  <div className="flagship-chips">
                    {p.stack.slice(0, 4).map(s => <span key={s}>{s}</span>)}
                  </div>
                  <div className="flagship-actions">
                    <a className="btn-ghost small" href={`/work/${p.id}`}>Case Study →</a>
                    {p.url && <a className="btn-primary small" href={p.url} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                    {onSelectProject && (
                      <button className="btn-ghost small" onClick={() => onSelectProject(p)}>Details</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Capabilities ─── */
export function CapabilitiesSection() {
  return (
    <section className="v4-section capabilities-section">
      <div className="section-header">
        <span className="section-label">Technical Focus</span>
        <h2>Capabilities</h2>
      </div>
      <div className="capabilities-strip">
        {CAPABILITIES.map((c, idx) => (
          <div key={idx} className="capability-col">
            <h4>{c.title}</h4>
            <div className="capability-tags">
              {c.tags.map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Archive ─── */
export function ArchiveSection({ projects, onSelectProject, headerLabel = 'Full Portfolio', headerTitle = 'All Projects' }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('flagship');

  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const p of projects) c[p.status] = (c[p.status] || 0) + 1;
    return c;
  }, [projects]);

  let visible = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  visible = [...visible].sort((a, b) => {
    if (sort === 'flagship') return (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0) || b.commits - a.commits;
    if (sort === 'commits') return b.commits - a.commits;
    if (sort === 'deploys') return b.deploys - a.deploys;
    if (sort === 'recent') return parseDuration(a.lastUpdate) - parseDuration(b.lastUpdate);
    return 0;
  });

  return (
    <section id="archive" className="v4-section">
      <div className="section-header">
        <span className="section-label">{headerLabel}</span>
        <h2>{headerTitle}</h2>
      </div>

      <div className="archive-toolbar">
        <SearchBox
          placeholder="Search projects…"
          value={q}
          onChange={(_, data) => setQ(data.value)}
          appearance="outline"
          size="medium"
          className="archive-searchbox"
        />
        <TabList
          selectedValue={filter}
          onTabSelect={(_, data) => setFilter(data.value)}
          size="small"
          className="archive-tablist"
        >
          {['all', 'live', 'beta', 'wip', 'archived'].map((s) => (
            <Tab key={s} value={s}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] || 0})
            </Tab>
          ))}
        </TabList>
        <div className="archive-sort">
          <Dropdown
            value={({ flagship: 'Flagship First', recent: 'Recent', commits: 'Commits', deploys: 'Deploys' })[sort]}
            selectedOptions={[sort]}
            onOptionSelect={(_, data) => setSort(data.optionValue)}
            size="medium"
          >
            <Option value="flagship">Flagship First</Option>
            <Option value="recent">Recent</Option>
            <Option value="commits">Commits</Option>
            <Option value="deploys">Deploys</Option>
          </Dropdown>
        </div>
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⌘</div>
          <div className="empty-title">No projects match</div>
          <button className="btn-ghost small" onClick={() => { setQ(''); setFilter('all'); }}>Reset filters</button>
        </div>
      )}

      <div className="archive-grid">
        {visible.map((p, i) => (
          <div
            key={p.id}
            className={`archive-card ${p.flagship ? 'is-flagship' : ''}`}
            onClick={() => onSelectProject && onSelectProject(p)}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="archive-card-top">
              <div>
                <div className="archive-card-name">{p.name}</div>
                <div className="archive-card-cat">{p.category}</div>
              </div>
              <StatusPill status={p.status} />
            </div>
            <div className="archive-card-chips">
              {p.stack.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ─── */
export function ContactSection({ profile }) {
  return (
    <section className="contact-section">
      <div className="contact-inner">
        <span className="contact-label">Collaborations & Roles</span>
        <h2>Let&apos;s build something that ships.</h2>
        <p>Looking for an engineer who builds functional, high-observability AI systems? Let&apos;s connect.</p>
        <a href={`mailto:${profile.email}`} className="btn-primary">
          Get in Touch →
        </a>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
export function SiteFooter({ profile }) {
  return (
    <footer className="v4-footer">
      <span>© 2026 Vasikarla · AI</span>
      <span>{profile.email}</span>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEFAULT V4 — kept for backward compatibility / single-page use
   ═══════════════════════════════════════════════════════════ */
function V4() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="v4">
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} projects={projects} />
      <Hero profile={profile} onOpenPalette={() => setPaletteOpen(true)} ctaHref="#flagships" ctaLabel="View Case Studies ↓" />
      <div className="v4-content">
        <ProblemsSection />
        <FlagshipsSection projects={projects} onSelectProject={setSelectedProject} />
        <CapabilitiesSection />
        <ArchiveSection projects={projects} onSelectProject={setSelectedProject} />
        <ContactSection profile={profile} />
        <SiteFooter profile={profile} />
      </div>
      {selectedProject && (
        <DetailPanel project={selectedProject} profile={profile} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}

export default V4;
