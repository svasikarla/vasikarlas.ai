import React, { useState, useEffect, useMemo } from 'react';
import { PROJECTS, PROFILE } from '@/data/projects';
import { StatusPill } from './V1';
import { Sparkline } from './V3';
import { getVercelProjects } from '@/actions/vercel';

/* Variation 4 — Modern hybrid: hero + console with live UX components */

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
    const from = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setN(from + (target - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [target, duration, ...deps]);
  return n;
}

function CountUp({ value, decimals = 0, suffix = '' }) {
  const v = useCountUp(value);
  const f = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return <span>{f}{suffix}</span>;
}

function CommandPalette({ open, setOpen, projects }) {
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
      const p = filtered[idx];
      window.open(p.url || p.repo || '#', '_blank');
      setOpen(false);
    }
  };

  if (!open) return null;
  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }} onKeyDown={onKeyDown} placeholder="Search projects, jump to live app, find source…" />
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
              <div className="cmdk-meta">{p.url ? 'Open live ↗' : p.repo ? 'View source ↗' : 'Private'}</div>
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

function Heatmap() {
  // Generate 26 weeks × 7 days of activity, weighted toward recent
  const data = useMemo(() => {
    const out = [];
    for (let w = 0; w < 26; w++) {
      for (let d = 0; d < 7; d++) {
        const recency = w / 26;
        const r = Math.random();
        const v = r < 0.35 - recency * 0.2 ? 0
          : r < 0.6 ? 1
            : r < 0.8 ? 2
              : r < 0.93 ? 3 : 4;
        out.push({ w, d, v });
      }
    }
    return out;
  }, []);
  return (
    <div className="heatmap">
      <div className="heat-grid">
        {data.map((c, i) => (
          <div key={i} className="heat-cell" data-l={c.v} style={{ animationDelay: `${i * 4}ms` }} title={`Week ${c.w}, day ${c.d}: ${c.v} commits`} />
        ))}
      </div>
      <div className="heat-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => <div key={l} className="heat-cell" data-l={l} />)}
        <span>More</span>
      </div>
    </div>
  );
}

function ActivityFeed({ projects }) {
  const feed = useMemo(() => {
    const prefixes = ['feat', 'fix', 'chore', 'refactor', 'feat', 'fix', 'feat'];
    return [...projects]
      .sort((a, b) => parseDuration(a.lastUpdate) - parseDuration(b.lastUpdate))
      .slice(0, 7)
      .map((p, i) => {
        const isDeployEvent = p.deploys > 0 && p.region !== '—' &&
          (p.lastUpdate.endsWith('h') || (p.lastUpdate.endsWith('d') && parseInt(p.lastUpdate) <= 3));
        const kind = isDeployEvent ? 'deploy' : 'commit';
        const msg = kind === 'deploy'
          ? `Deployment ready · ${p.region}`
          : `${prefixes[i % prefixes.length]}: ${p.tagline.toLowerCase().split(' ').slice(0, 5).join(' ')}`;
        return { t: p.lastUpdate, repo: p.name, msg, kind };
      });
  }, [projects]);

  return (
    <div className="feed">
      <div className="feed-head">
        <span className="feed-title">Recent Activity</span>
        <span className="feed-live"><span className="dot" />Live</span>
      </div>
      <div className="feed-list">
        {feed.map((a, i) => (
          <div key={i} className="feed-row">
            <div className={`feed-icon ${a.kind}`}>
              {a.kind === 'commit' ? '◆' : '↑'}
            </div>
            <div className="feed-body">
              <div className="feed-msg">{a.msg}</div>
              <div className="feed-meta"><b>{a.repo}</b> · {a.t} ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniMap({ projects, onPick }) {
  // Bubble chart: x = commits, y = deploys, size = recency-weighted
  const max = { c: Math.max(...projects.map((p) => p.commits)), d: Math.max(...projects.map((p) => p.deploys)) };
  return (
    <div className="minimap">
      <div className="minimap-head">
        <span className="feed-title">Portfolio Map</span>
        <span className="feed-meta">commits × deploys</span>
      </div>
      <div className="minimap-plot">
        <div className="ax-y" />
        <div className="ax-x" />
        <span className="ax-y-l">deploys →</span>
        <span className="ax-x-l">commits →</span>
        {projects.map((p) => {
          const x = (p.commits / (max.c || 1)) * 90 + 4;
          const y = 92 - (p.deploys / (max.d || 1)) * 86;
          const size = p.flagship ? 14 : 9;
          return (
            <div key={p.id}
              className={`bubble ${p.status}`}
              style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
              title={`${p.name} · ${p.commits}c / ${p.deploys}d`}
              onClick={() => onPick && onPick(p)} />
          );
        })}
      </div>
    </div>
  );
}

function DetailPanel({ project, profile, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const coverColor = { live: 'var(--accent)', beta: 'var(--info)', wip: 'var(--warn)', archived: 'var(--fg-4)' }[project.status] || 'var(--accent)';

  return (
    <div className="detail-panel">

      {/* Breadcrumb */}
      <div className="bread">
        <span>Workspace</span><span className="s">/</span>
        <span className="dp-bread-back" onClick={onClose}>Projects</span>
        <span className="s">/</span><b>{project.name}</b>
      </div>

      {/* Header */}
      <div className="dp-header">
        <button className="dp-back" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          All Projects
        </button>
        <div className="dp-title">
          <span className="dp-name">{project.name}</span>
          {project.flagship && <span className="dp-flag">Flagship</span>}
        </div>
        <StatusPill status={project.status} />
      </div>

      {/* Cover */}
      <div className="dp-cover" style={{ '--dp-color': coverColor }}>
        {project.screenshot
          ? <img src={project.screenshot} alt={project.name} className="dp-cover-img" />
          : (
            <div className="dp-cover-placeholder">
              <div className="dp-cover-content">
                <div className="dp-cover-cat">{project.category}</div>
                <div className="dp-cover-name">{project.name}</div>
                <div className="dp-cover-tag">{project.tagline}</div>
              </div>
              {project.version !== '—' && (
                <span className="dp-cover-version">{project.version}</span>
              )}
            </div>
          )
        }
      </div>

      {/* Meta strip */}
      <div className="dp-meta">
        <span>{project.category}</span>
        <span className="dp-sep">·</span>
        <span>{project.version !== '—' ? project.version : 'pre-release'}</span>
        <span className="dp-sep">·</span>
        <span>{project.region !== '—' ? project.region : 'local'}</span>
        <span className="dp-sep">·</span>
        <span>Updated {project.lastUpdate} ago</span>
      </div>

      {/* Description */}
      <p className="dp-desc">{project.description}</p>

      {/* Features */}
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

      {/* Stack */}
      <div className="dp-section">
        <div className="dp-section-label">Tech Stack</div>
        <div className="dp-stack">
          {project.stack.map((s) => <span key={s} className="dp-chip">{s}</span>)}
        </div>
      </div>

      {/* Stats */}
      <div className="dp-stats">
        <div className="dp-stat"><span className="k">Commits</span><span className="v">{project.commits}</span></div>
        <div className="dp-stat"><span className="k">Deploys</span><span className="v">{project.deploys || '—'}</span></div>
        <div className="dp-stat"><span className="k">Uptime</span><span className="v">{project.uptime ? `${project.uptime}%` : '—'}</span></div>
        <div className="dp-stat"><span className="k">Region</span><span className="v">{project.region !== '—' ? project.region : 'local'}</span></div>
      </div>

      {/* Actions */}
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

      {/* Portfolio footer */}
      <div className="dp-attribution">
        <span className="dp-attr-pulse" />
        Part of <b>Vasikarla · AI</b> · {profile.location}
        <a className="dp-attr-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </div>

    </div>
  );
}

function V4() {
  const [projects, setProjects] = useState(PROJECTS);
  const profile = PROFILE;
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('flagship');
  const [domain, setDomain] = useState('all');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

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
            return {
              ...p,
              lastUpdate,
              status: newStatus,
              url: newUrl,
            };
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
            id: vp.name,
            name: vp.name.charAt(0).toUpperCase() + vp.name.slice(1),
            category: vp.framework || 'Web',
            status,
            description: `Auto-discovered Vercel deployment: ${vp.name}`,
            tagline: 'Vercel Deployment',
            url,
            repo: vp.link?.repo ? `https://github.com/${vp.link.repo}` : null,
            stack: [vp.framework || 'Vercel'],
            version: '—',
            commits: 0,
            deploys: 1,
            uptime: null,
            region: '—',
            lastUpdate,
            flagship: false,
          };
        });

        return [...merged, ...newProjects];
      });
    }).catch(err => console.error('Failed to update live projects', err));
    return () => { mounted = false; };
  }, []);

  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const p of projects) c[p.status] = (c[p.status] || 0) + 1;
    return c;
  }, [projects]);

  let visible = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (domain !== 'all' && !p.category.toLowerCase().includes(domain.toLowerCase())) return false;
    if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  visible = [...visible].sort((a, b) => {
    if (sort === 'flagship') return (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0) || b.commits - a.commits;
    if (sort === 'commits') return b.commits - a.commits;
    if (sort === 'deploys') return b.deploys - a.deploys;
    if (sort === 'recent') {
      return parseDuration(a.lastUpdate) - parseDuration(b.lastUpdate);
    }
    return 0;
  });

  const flagshipNarratives = {
    'bima-buddy-advanced': {
      problem: "Health insurance evaluation in India is historically complex, fragmented across dozens of providers, and lacks local-language accessibility for over 80% of families, leading to high claim rejection rates.",
      solution: "Designed India's first AI-powered health insurance intelligence suite. Integrates automated comparisons across 50+ policies, a claim predictor analyzing 50+ factors with 85%+ accuracy, and a native voice assistant supporting 10 Indian languages.",
      constraint: "Fusing highly irregular insurance policy PDFs into structural query models, and designing sub-second multilingual voice processing with emotion-aware feedback loops."
    },
    'core-pragya-advanced': {
      problem: "Personal learning materials, feeds, and articles are highly fragmented and noisy. Traditional bookmarking systems lack semantic context and fail to convert raw reading history into structured personal knowledge.",
      solution: "Built a personal intelligence system that ingests RSS feeds, PDF libraries, and articles. Features an interactive 3D concept graph visualization, autonomous deep research agents, and a multi-agent blog and social writing studio.",
      constraint: "Constructing dynamic, scalable graph coordinates in real-time, and orchestrating multiple parallel autonomous agents to write and format publications for 6 platforms without rate-limit lockouts."
    },
    'nlsql-pro': {
      problem: "Databases are inaccessible to non-technical business decision-makers without SQL proficiency, creating severe operational bottlenecks and query backlogs for development teams.",
      solution: "Developed a secure natural language to SQL translation query engine. Features 24-hour schema caching, a custom Business Glossary terminology mapper, and Golden Query feedback memory that learns continuously.",
      constraint: "Mitigating LLM SQL hallucinations on highly nested production database schemas while ensuring advanced prompt injection shielding against 30+ jailbreak patterns."
    },
    'igcse-student-guide': {
      problem: "High-quality secondary school exam prep materials are locked behind expensive paywalls, creating severe inequality of educational access for millions of IGCSE Grade 9-10 students.",
      solution: "Engineered a fully automated content generation and revision pipeline. Delivers curriculum-aligned, high-fidelity study cards, adaptive revision quizzes, and topic study guides designed for low-bandwidth access.",
      constraint: "Ensuring absolute academic accuracy of generated test answers through automated evaluation and multi-step sanity verification pipelines."
    }
  };

  const flagshipProjects = useMemo(() => {
    return projects.filter(p => ['bima-buddy-advanced', 'core-pragya-advanced', 'nlsql-pro', 'igcse-student-guide'].includes(p.id));
  }, [projects]);

  const problems = [
    {
      icon: '📊',
      title: 'Business Users Cannot Query Complex Data',
      desc: 'Bypassing technical bottlenecks by transforming conversational plain English into secure, highly optimized, production-ready SQL queries across diverse production schemas.',
      solution: 'NL-to-SQL Engines · Golden Query Memory · Security Sandboxing'
    },
    {
      icon: '📂',
      title: 'Unstructured Knowledge is Hard to Search',
      desc: 'Connecting fragmented reading lists, raw documents, and RSS feeds into an organized 3D knowledge map with personal AI agents summarizing trending concepts.',
      solution: '3D Knowledge Graphs · RAG Pipelines · Autonomous Agents'
    },
    {
      icon: '🏥',
      title: 'Complex Workflows Create Friction & Low Trust',
      desc: 'Translating dense, confusing regulatory domains like insurance comparisons into simplified guided wizards, multilingual voice assistant loops, and smart claim predictions.',
      solution: 'Decision Support UX · Multilingual UI · Automated Calculators'
    },
    {
      icon: '🔒',
      title: 'Private Enterprise Assets Need Secure AI',
      desc: 'Ensuring zero cloud leakage for highly sensitive documents by orchestrating local retrieval pipelines that execute entirely on-device using offline models.',
      solution: 'On-Device Embeddings · Local LLMs · Zero-Cloud Retrieval'
    }
  ];

  const capabilityPillars = [
    {
      title: 'LLM & Semantic Systems',
      tagline: 'Context-Aware Intelligence',
      skills: [
        'Advanced Retrieval-Augmented Generation (RAG)',
        'Contextual Vector Search & Semantic Chunking',
        'Autonomous Multi-Agent Collaboration Pipelines',
        'Knowledge Graph 3D Mapping & Concept Linking'
      ]
    },
    {
      title: 'Product & Database Engineering',
      tagline: 'Scale & Performance Discipline',
      skills: [
        'Production Next.js & React Frameworks',
        'Secure Schema-Aware NL-to-SQL Translators',
        'Relational Database Design (PostgreSQL, Supabase)',
        'Caching & sub-100ms Query Latency Tuning'
      ]
    },
    {
      title: 'Observability & Execution',
      tagline: 'Observable Production SLAs',
      skills: [
        'Continuous Delivery (140+ Production Deploys)',
        'Jailbreak Protection & Guardrails for LLMs',
        'Multilingual Interface Support (10+ Languages)',
        'High Fleet Availability & Performance Monitoring'
      ]
    }
  ];

  return (
    <div className="v4">
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} projects={projects} />

      {/* Hero */}
      <section className="v4-hero">
        <div className="v4-hero-orb" />
        <div className="v4-hero-inner">

          {/* Left identity column — same width & style as sidebar for visual continuity */}
          <div className="hero-left">
            <div className="hero-identity">
              <div className="av">V</div>
              <div className="hn">{profile.name}</div>
              <div className="hh">@{profile.handle}</div>
              <div className="hloc">{profile.location}</div>
            </div>
            <div className="hero-tagline-text">{profile.tagline}</div>
            <div className="hero-left-links">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a href={`mailto:${profile.email}`}>Contact ↗</a>
            </div>
          </div>

          {/* Right — hero content */}
          <div className="hero-right">
            <div className="hero-head">
              <span>// Portfolio ⟡ Deployed Work</span>
              <span className="line" />
              <button className="cmdk-btn" onClick={() => setPaletteOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
                Quick search
                <kbd>⌘K</kbd>
              </button>
            </div>
            <div className="hero-subhead">AI Product Engineer · Full-Stack Builder</div>
            <h1>
              I build AI and full-stack products that solve real business workflows.
              <span className="cursor" />
            </h1>
            <p className="sub" style={{ fontSize: '15px', color: 'var(--fg-2)', lineHeight: '1.5' }}>
              From RAG knowledge systems and NL-to-SQL interfaces to health insurance and education platforms — I build production systems with real deployment, observability, and iteration discipline.
            </p>

            <div className="hero-ctas">
              <button className="btn primary" onClick={() => {
                const el = document.getElementById('flagships');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                View Flagship Case Studies ↓
              </button>
              <button className="btn secondary" onClick={() => {
                const el = document.getElementById('archive');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                See Live Products
              </button>
            </div>

            <div className="outcome-proof-strip">
              <div className="outcome-cell">
                <span className="outcome-number"><CountUp value={profile.stats.projects} /></span>
                <span className="outcome-label">Live Products Built</span>
                <span className="outcome-desc">Across 5 high-stakes domains</span>
              </div>
              <div className="outcome-cell">
                <span className="outcome-number"><CountUp value={profile.stats.deploys} /></span>
                <span className="outcome-label">Production Deploys</span>
                <span className="outcome-desc">India · US · Global markets</span>
              </div>
              <div className="outcome-cell">
                <span className="outcome-number"><CountUp value={profile.stats.commits} /></span>
                <span className="outcome-label">Commits 12mo</span>
                <span className="outcome-desc">Continuous shipping discipline</span>
              </div>
              <div className="outcome-cell">
                <span className="outcome-number"><CountUp value={profile.stats.uptime} decimals={2} suffix="%" /></span>
                <span className="outcome-label">Fleet Live Uptime</span>
                <span className="outcome-desc">Production SLAs consistently met</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Body */}
      <div className="v4-body">
        <aside className="sidebar">
          <div className="group">
            <div className="group-h">Workspace</div>
            <div className={`nav-item ${filter === 'all' && domain === 'all' && !q ? 'active' : ''}`} onClick={() => { setFilter('all'); setDomain('all'); setQ(''); setSort('recent'); }}>Projects <span className="ct">{projects.length}</span></div>
            <div className={`nav-item ${filter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>Deployments <span className="ct">{counts['live'] || 0}</span></div>
            <div className={`nav-item ${sort === 'recent' ? 'active' : ''}`} onClick={() => setSort('recent')}>Activity <span className="ct">{profile.stats.commits}</span></div>
            <div className="nav-item" onClick={() => alert('Insights dashboard coming soon.')}>Insights</div>
          </div>
          <div className="group">
            <div className="group-h">Filter by Domain</div>
            <div className={`nav-item ${domain === 'AI' ? 'active' : ''}`} onClick={() => setDomain(domain === 'AI' ? 'all' : 'AI')}>AI Knowledge Systems <span className="ct">{projects.filter(p => p.category.includes('AI')).length}</span></div>
            <div className={`nav-item ${domain === 'FinTech' ? 'active' : ''}`} onClick={() => setDomain(domain === 'FinTech' ? 'all' : 'FinTech')}>Decision Support Platforms <span className="ct">{projects.filter(p => p.category.includes('FinTech')).length}</span></div>
            <div className={`nav-item ${domain === 'EdTech' ? 'active' : ''}`} onClick={() => setDomain(domain === 'EdTech' ? 'all' : 'EdTech')}>EdTech <span className="ct">{projects.filter(p => p.category.includes('EdTech')).length}</span></div>
            <div className={`nav-item ${domain === 'Infrastructure' ? 'active' : ''}`} onClick={() => setDomain(domain === 'Infrastructure' ? 'all' : 'Infrastructure')}>Private AI Infrastructure <span className="ct">{projects.filter(p => p.category.includes('Infrastructure')).length}</span></div>
          </div>
          <ActivityFeed projects={projects} />
          <div className="group">
            <div className="group-h">External</div>
            <a className="nav-item" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="nav-item" href={`mailto:${profile.email}`}>Contact ↗</a>
          </div>
        </aside>

        <main className="main">
          {selectedProject ? (
            <DetailPanel
              project={selectedProject}
              profile={profile}
              onClose={() => setSelectedProject(null)}
            />
          ) : (
          <>
          {/* Section 2: Problems I Solve */}
          <section className="v4-section">
            <div className="section-header-group">
              <span className="section-tagline">Consultative Value</span>
              <h2 className="section-headline">Real-World Problems I Solve</h2>
            </div>
            <div className="problems-grid">
              {problems.map((p, idx) => (
                <div key={idx} className="problem-card">
                  <div className="problem-icon">{p.icon}</div>
                  <h3 className="problem-title">{p.title}</h3>
                  <p className="problem-desc">{p.desc}</p>
                  <div className="problem-solution">
                    <span>Engineering Focus:</span> <b>{p.solution}</b>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Flagship Case Studies */}
          <section id="flagships" className="v4-section">
            <div className="section-header-group">
              <span className="section-tagline">Selected High-Impact Work</span>
              <h2 className="section-headline">Flagship Case Studies</h2>
            </div>
            <div className="flagships-grid">
              {flagshipProjects.map((p) => {
                const narrative = flagshipNarratives[p.id] || {
                  problem: p.description,
                  solution: "Designed and engineered clean modern system integration.",
                  constraint: "Scalability and structural integrity."
                };
                return (
                  <div key={p.id} className="flagship-editorial-card">
                    <div className="flagship-cover">
                      <div className="flagship-cover-bg" style={{ backgroundColor: 'var(--bg-2)' }} />
                      <div className="flagship-cover-content">
                        <div className="flagship-cover-cat">{p.category}</div>
                        <div className="flagship-cover-name">{p.name}</div>
                        <div className="flagship-cover-tag">{p.tagline}</div>
                      </div>
                    </div>
                    <div className="flagship-content">
                      <div className="flagship-head">
                        <div className="flagship-title-area">
                          <span className="flagship-editorial-title">{p.name}</span>
                          <span className="flagship-tag">FLAGSHIP</span>
                        </div>
                        <StatusPill status={p.status} />
                      </div>
                      <div className="flagship-story-grid">
                        <div className="story-block">
                          <label>The Bottleneck</label>
                          <p>{narrative.problem}</p>
                        </div>
                        <div className="story-block">
                          <label>The Architecture</label>
                          <p>{narrative.solution}</p>
                        </div>
                        <div className="story-block">
                          <label>Engineering Challenge</label>
                          <p><b>Constraint:</b> {narrative.constraint}</p>
                        </div>
                      </div>
                      <div className="flagship-bottom-strip">
                        <div className="flagship-stack-chips">
                          {p.stack.slice(0, 4).map(s => <span key={s}>{s}</span>)}
                        </div>
                        <div className="flagship-action-group">
                          {p.url && <a className="flagship-btn primary" href={p.url} target="_blank" rel="noopener noreferrer">Visit Live ↗</a>}
                          <button className="flagship-btn" onClick={() => setSelectedProject(p)}>Architecture Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Technical Capabilities */}
          <section className="v4-section">
            <div className="section-header-group">
              <span className="section-tagline">Architectural pillars</span>
              <h2 className="section-headline">Technical Capabilities & Focus</h2>
            </div>
            <div className="capabilities-grid">
              {capabilityPillars.map((c, idx) => (
                <div key={idx} className="capability-pillar">
                  <h3 className="capability-pillar-title">
                    <span>◆</span> {c.title}
                  </h3>
                  <span className="capability-tagline">{c.tagline}</span>
                  <ul className="capability-list">
                    {c.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Selected Product Archive */}
          <section id="archive" className="v4-section">
            <div className="section-header-group">
              <span className="section-tagline">Indexed Inventory</span>
              <h2 className="section-headline">Selected Project Archive</h2>
            </div>

            <div className="kpi-row">
              <div className="kpis">
                <div className="kpi">
                  <span className="k">Prod Deploys / 30d</span>
                  <span className="v"><CountUp value={42} /></span>
                  <span className="d">▲ 12 vs prev</span>
                  <Sparkline seed={4} />
                </div>
                <div className="kpi">
                  <span className="k">Commits / 12mo</span>
                  <span className="v"><CountUp value={profile.stats.commits} /></span>
                  <span className="d">Sustained</span>
                  <Sparkline seed={7} />
                </div>
                <div className="kpi">
                  <span className="k">Fleet Uptime</span>
                  <span className="v"><CountUp value={profile.stats.uptime} decimals={2} suffix="%" /></span>
                  <span className="d">All green · 30d</span>
                  <Sparkline seed={10} color="var(--info)" />
                </div>
                <div className="kpi">
                  <span className="k">Live Apps</span>
                  <span className="v"><CountUp value={counts.live || 0} /></span>
                  <span className="d">of {projects.length} total</span>
                  <Sparkline seed={13} />
                </div>
              </div>
              <MiniMap projects={projects} onPick={(p) => setQ(p.name)} />
            </div>

            <div className="tools">
              <div className="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
                <input placeholder="Search archive..." value={q} onChange={(e) => setQ(e.target.value)} />
                {q && <button className="clear" onClick={() => setQ('')}>×</button>}
              </div>
              <div className="filter-pills">
                {['all', 'live', 'beta', 'wip', 'archived'].map((s) =>
                  <button key={s} className="pill-btn" aria-pressed={filter === s} onClick={() => setFilter(s)}>
                    {s === 'all' ? 'All' : s.toUpperCase()} · {counts[s] || 0}
                  </button>
                )}
              </div>
              <div className="sort-control">
                <span className="sort-label">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="flagship">Flagship</option>
                  <option value="recent">Recent</option>
                  <option value="commits">Commits</option>
                  <option value="deploys">Deploys</option>
                </select>
              </div>
            </div>

            {visible.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">⌘</div>
                <div className="empty-title">No projects match</div>
                <div className="empty-sub">Try clearing filters or a different search term.</div>
                <button className="ab" onClick={() => { setQ(''); setFilter('all'); }}>Reset filters</button>
              </div>
            )}

            <div className="cards">
              {visible.map((p, i) => (
                <div
                  key={p.id}
                  className={`card ${p.flagship ? 'flagship' : ''} ${hovered === p.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelectedProject(p)}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  {p.flagship && <span className="flag-tag">FLAGSHIP</span>}
                  <div className="top">
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="cat">{p.category}</div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="desc">{p.description}</div>
                  <div className="stack-row">
                    {p.stack.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
                  </div>
                  <div className="mini">
                    <div>
                      <div className="k">Commits</div>
                      <div className="v tnum">{p.commits}</div>
                    </div>
                    <div>
                      <div className="k">Deploys</div>
                      <div className="v tnum">{p.deploys || '—'}</div>
                    </div>
                    <div>
                      <div className="k">Uptime</div>
                      <div className="v tnum">{p.uptime ? `${p.uptime}%` : '—'}</div>
                    </div>
                    <div>
                      <div className="k">Updated</div>
                      <div className="v">{p.lastUpdate}</div>
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className={`ab primary ${!p.url ? 'disabled' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                    >
                      {p.url ? 'Details ↗' : 'Offline'}
                    </button>
                    <button
                      className={`ab ${!p.repo ? 'disabled' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                    >
                      {p.repo ? 'Source ↗' : 'Private'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Contact & Discuss */}
          <section className="contact-cta-section">
            <div className="contact-card">
              <span className="contact-badge">Collaborations & Roles</span>
              <h2 className="contact-headline">Discuss an AI Product Pipeline</h2>
              <p className="contact-subtext">
                Looking for an engineer who builds functional, high-observability systems rather than wraps wrappers? Let's connect and solve your business workflow bottlenecks.
              </p>
              <a href={`mailto:${profile.email}`} className="contact-btn">
                Get in Touch
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" style={{ marginLeft: '4px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </section>

          <div className="v4-foot">
            <span>© 2026 Vasikarla · AI</span>
            <span>{profile.email}</span>
            <span className="tnum">Data refreshed · May 4 2026</span>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

export default V4;
