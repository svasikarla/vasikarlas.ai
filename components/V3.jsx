/* Variation 3 — Enterprise admin console */

function Sparkline({ seed, color }) {
  const pts = useMemo(() => {
    const out = [];
    let y = 14;
    for (let i = 0; i < 24; i++) {
      const delta = (Math.sin(i * 0.6 + seed) + Math.cos(i * 0.3 + seed * 2)) * 3 + (Math.random() - 0.5) * 2;
      y = Math.max(3, Math.min(22, y + delta * 0.4));
      out.push(`${(i / 23) * 100},${y}`);
    }
    return out.join(' ');
  }, [seed]);
  return (
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="spark" style={{width: '100%'}}>
      <polyline points={pts} fill="none" stroke={color || 'var(--accent)'} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function V3() {
  const projects = window.PROJECTS;
  const profile = window.PROFILE;
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const p of projects) {
      c[p.status] = (c[p.status] || 0) + 1;
    }
    return c;
  }, [projects]);

  const visible = projects.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="v3">
      <aside className="sidebar">
        <div className="user">
          <div className="av">V</div>
          <div className="n">Vasikarla · AI</div>
          <div className="h">@svasikarla</div>
        </div>
        <div className="group">
          <div className="group-h">Workspace</div>
          <div className="nav-item active">Projects <span className="ct">{projects.length}</span></div>
          <div className="nav-item">Deployments <span className="ct">149</span></div>
          <div className="nav-item">Activity <span className="ct">215</span></div>
          <div className="nav-item">Insights</div>
        </div>
        <div className="group">
          <div className="group-h">Filter by Domain</div>
          <div className="nav-item">AI & Knowledge <span className="ct">5</span></div>
          <div className="nav-item">FinTech <span className="ct">3</span></div>
          <div className="nav-item">EdTech <span className="ct">2</span></div>
          <div className="nav-item">Infrastructure <span className="ct">3</span></div>
        </div>
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
          <div style={{display:'flex', gap:8, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--fg-3)'}}>
            <span>Last sync · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          </div>
        </div>

        <div className="kpis">
          <div className="kpi">
            <span className="k">Active Projects</span>
            <span className="v">{profile.stats.projects}</span>
            <span className="d">▲ 4 · Q2</span>
            <Sparkline seed={1} />
          </div>
          <div className="kpi">
            <span className="k">Prod Deploys / 30d</span>
            <span className="v">42</span>
            <span className="d">▲ 12 vs prev</span>
            <Sparkline seed={4} />
          </div>
          <div className="kpi">
            <span className="k">Commits / 12mo</span>
            <span className="v">{profile.stats.commits}</span>
            <span className="d">Sustained</span>
            <Sparkline seed={7} />
          </div>
          <div className="kpi">
            <span className="k">Fleet Uptime</span>
            <span className="v">{profile.stats.uptime}%</span>
            <span className="d">All green · 30d</span>
            <Sparkline seed={10} color="var(--info)" />
          </div>
        </div>

        <div className="tools">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <input placeholder="Search projects…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {['all', 'live', 'beta', 'wip', 'archived'].map(s => (
            <button key={s} className="pill-btn" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s.toUpperCase()} · {counts[s] || 0}
            </button>
          ))}
        </div>

        <div className="cards">
          {visible.map(p => (
            <div key={p.id} className="card" onClick={() => p.url ? window.open(p.url, '_blank') : p.repo && window.open(p.repo, '_blank')}>
              <div className="top">
                <div>
                  <div className="name">{p.name}</div>
                  <div className="cat">{p.category}</div>
                </div>
                <StatusPill status={p.status} />
              </div>
              <div className="desc">{p.description}</div>
              <div className="stack-row">
                {p.stack.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
              <div className="mini">
                <div>
                  <div className="k">Commits</div>
                  <div className="v">{p.commits}</div>
                </div>
                <div>
                  <div className="k">Deploys</div>
                  <div className="v">{p.deploys || '—'}</div>
                </div>
                <div>
                  <div className="k">Updated</div>
                  <div className="v">{p.lastUpdate}</div>
                </div>
              </div>
              <div className="actions">
                {p.url && <a className="ab primary" href={p.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>Visit ↗</a>}
                {p.repo && <a className="ab" href={p.repo} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>Source ↗</a>}
                {!p.url && !p.repo && <span className="ab" style={{cursor:'default'}}>Private</span>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

window.V3 = V3;
window.Sparkline = Sparkline;
