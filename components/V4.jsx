/* Variation 4 — Modern hybrid: hero + console with live UX components */

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

function ActivityFeed() {
  const items = [
    { t: '4m', repo: 'BimaBuddyAdvanced', msg: 'feat: add competitive matrix v2', kind: 'commit' },
    { t: '32m', repo: 'CorePragyaAdvanced', msg: 'Deployment to production · iad1', kind: 'deploy' },
    { t: '1h', repo: 'IGCSEStudentGuide', msg: 'fix: validation pipeline edge case', kind: 'commit' },
    { t: '3h', repo: 'NLSQLPro', msg: 'chore: bump @supabase/ssr', kind: 'commit' },
    { t: '6h', repo: 'BimaBuddyAdvanced', msg: 'Deployment ready · bom1', kind: 'deploy' },
    { t: '1d', repo: 'health-insurance-india', msg: 'docs: README multilingual notes', kind: 'commit' },
    { t: '2d', repo: 'LocalRAG', msg: 'experiment: bge-small-en embeddings', kind: 'commit' },
  ];
  return (
    <div className="feed">
      <div className="feed-head">
        <span className="feed-title">Recent Activity</span>
        <span className="feed-live"><span className="dot" />Live</span>
      </div>
      <div className="feed-list">
        {items.map((a, i) => (
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

function V4() {
  const projects = window.PROJECTS;
  const profile = window.PROFILE;
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('flagship');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

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
    if (sort === 'recent') {
      const order = { 'h': 0, 'd': 1, 'w': 2, 'mo': 3, 'y': 4 };
      const parse = (s) => {
        const m = s.match(/^(\d+)(h|d|w|mo|y)$/);
        return m ? parseInt(m[1]) + order[m[2]] * 1000 : 9999;
      };
      return parse(a.lastUpdate) - parse(b.lastUpdate);
    }
    return 0;
  });

  return (
    <div className="v4">
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} projects={projects} />

      {/* Hero */}
      <section className="v4-hero">
        <div className="v4-hero-orb" />
        <div className="v4-hero-inner">
          <div className="hero-head">
            <span>// Index ⟡ May 4, 2026</span>
            <span className="line" />
            <button className="cmdk-btn" onClick={() => setPaletteOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              Quick jump
              <kbd>⌘K</kbd>
            </button>
          </div>
          <div className="hero-role">AI Product Engineer</div>
          <h1>
            Delivering AI Solutions
            <span className="cursor" />
          </h1>
          <div className="hero-subhead">LLMs · RAG · Production</div>
          <p className="sub">
            <b>Satish Vasikarla.</b> Building production LLM applications for high-stakes domains. LLM integration, RAG pipelines, knowledge graphs, and NL-to-SQL — shipped to live users, not just demoed.
          </p>
          <div className="hero-skills">
            <div className="hero-skills-row">
              <span className="hero-skills-label">Stack</span>
              {['Next.js','TypeScript','Azure OpenAI','LangChain','Supabase','PostgreSQL','Python','RAG'].map((s) => (
                <span key={s} className="hero-skill-chip">{s}</span>
              ))}
            </div>
            <div className="hero-skills-row">
              <span className="hero-skills-label">Focus</span>
              {['InsureTech','EdTech','AI Knowledge','RAG / LLM','NL→SQL','Developer Tools'].map((s) => (
                <span key={s} className="hero-skill-chip domain">{s}</span>
              ))}
            </div>
          </div>

          <div className="hero-grid">
            <div className="stats-strip">
              <div className="cell">
                <span className="k">Live Products</span>
                <span className="v"><CountUp value={profile.stats.projects} /></span>
                <span className="d">Across 5 domains</span>
              </div>
              <div className="cell">
                <span className="k">Prod Deploys</span>
                <span className="v"><CountUp value={profile.stats.deploys} /></span>
                <span className="d">India · US · Global</span>
              </div>
              <div className="cell">
                <span className="k">Commits 12mo</span>
                <span className="v"><CountUp value={profile.stats.commits} /></span>
                <span className="d">Shipping, not planning</span>
              </div>
              <div className="cell">
                <span className="k">Fleet Uptime</span>
                <span className="v"><CountUp value={profile.stats.uptime} decimals={2} suffix="%" /></span>
                <span className="d">Production SLAs met</span>
              </div>
            </div>
            <div className="hero-heatmap">
              <div className="hh-head">
                <span className="feed-title">Activity · last 26w</span>
                <span className="feed-meta tnum">{profile.stats.commits} commits</span>
              </div>
              <Heatmap />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="v4-body">
        <aside className="sidebar">
          <div className="user">
            <div className="av">V</div>
            <div className="n">Vasikarla · AI</div>
            <div className="h">@svasikarla</div>
          </div>
          <div className="group">
            <div className="group-h">Workspace</div>
            <div className="nav-item active">Projects <span className="ct">{projects.length}</span></div>
            <div className="nav-item">Deployments <span className="ct">{profile.stats.deploys}</span></div>
            <div className="nav-item">Activity <span className="ct">{profile.stats.commits}</span></div>
            <div className="nav-item">Insights</div>
          </div>
          <div className="group">
            <div className="group-h">Filter by Domain</div>
            <div className="nav-item">AI & Knowledge <span className="ct">{projects.filter(p => p.category.includes('AI')).length}</span></div>
            <div className="nav-item">FinTech <span className="ct">{projects.filter(p => p.category.includes('FinTech')).length}</span></div>
            <div className="nav-item">EdTech <span className="ct">{projects.filter(p => p.category.includes('EdTech')).length}</span></div>
            <div className="nav-item">Infrastructure <span className="ct">{projects.filter(p => p.category.includes('Infrastructure')).length}</span></div>
          </div>
          <ActivityFeed />
          <div className="group">
            <div className="group-h">External</div>
            <a className="nav-item" href={profile.github} target="_blank" rel="noopener">GitHub ↗</a>
            <a className="nav-item" href={`mailto:${profile.email}`}>Contact ↗</a>
          </div>
        </aside>

        <main className="main">
          <div className="bread">
            <span>Workspace</span><span className="s">/</span><b>Projects</b>
          </div>
          <div className="pghead">
            <div>
              <h1>Projects</h1>
              <div className="sub">
                All applications, research, and infrastructure — indexed.
                <span className="live"><span className="d" />SYSTEMS NOMINAL</span>
              </div>
            </div>
            <div className="pghead-actions">
              <span className="last-sync">Last sync · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              <button className="cmdk-btn small" onClick={() => setPaletteOpen(true)}>
                <kbd>⌘K</kbd>
              </button>
            </div>
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
              <input placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} />
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
                onClick={() => p.url ? window.open(p.url, '_blank') : p.repo && window.open(p.repo, '_blank')}
                style={{ animationDelay: `${i * 30}ms` }}
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
                  {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
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
                  {p.url && <a className="ab primary" href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Visit Live ↗</a>}
                  {p.repo && <a className="ab" href={p.repo} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>Source ↗</a>}
                  {!p.url && !p.repo && <span className="ab" style={{ cursor: 'default' }}>Private</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="v4-foot">
            <span>© 2026 Vasikarla · AI</span>
            <span>{profile.email}</span>
            <span className="tnum">Data refreshed · May 4 2026</span>
          </div>
        </main>
      </div>
    </div>
  );
}

window.V4 = V4;
