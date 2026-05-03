/* Variation 1 — Terminal / Bloomberg-style dense index */
const { useState, useEffect, useMemo } = React;

function TickerStrip() {
  const items = [
    'CorePragyaAdvanced', 'BimaBuddyAdvanced', 'IGCSEStudentGuide', 'NLSQLPro',
    'health-insurance-india', 'LocalRAG', 'wisecachepro', 'CorePragya',
  ];
  // build strings like NAME +0.42% ↑ PROD
  const track = items.map((n, i) => ({
    name: n,
    delta: (Math.random() * 2 - 0.3).toFixed(2),
    up: i % 3 !== 2,
  }));
  return (
    <div className="ticker">
      <div className="ticker-track">
        {[...track, ...track].map((t, i) => (
          <span key={i}>
            <b>{t.name}</b> {t.up ? <em>▲ +{Math.abs(t.delta)}%</em> : <em style={{color:'var(--danger)'}}>▼ {t.delta}%</em>}
          </span>
        ))}
      </div>
    </div>
  );
}

function Typewriter({ phrases, speed = 60, pause = 1800 }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[i];
    if (!del && txt === cur) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && txt === '') {
      setDel(false);
      setI((i + 1) % phrases.length);
      return;
    }
    const t = setTimeout(() => {
      setTxt(del ? cur.slice(0, txt.length - 1) : cur.slice(0, txt.length + 1));
    }, del ? 28 : speed);
    return () => clearTimeout(t);
  }, [txt, del, i, phrases, speed, pause]);
  return <span className="accent">{txt}</span>;
}

function StatusPill({ status }) {
  const label = { live: 'Live', beta: 'Beta', wip: 'WIP', archived: 'Archived' }[status] || status;
  return <span className={`pill ${status}`}><span className="d" />{label}</span>;
}

function V1() {
  const projects = window.PROJECTS;
  const profile = window.PROFILE;
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const categories = ['all', 'AI', 'FinTech', 'EdTech', 'Infra'];
  const matchCat = (p) => {
    if (filter === 'all') return true;
    if (filter === 'AI') return p.category.startsWith('AI');
    if (filter === 'FinTech') return p.category.includes('FinTech');
    if (filter === 'EdTech') return p.category.includes('EdTech');
    if (filter === 'Infra') return p.category.includes('Infrastructure');
    return true;
  };
  const rows = projects.filter(matchCat);

  return (
    <div className="v1">
      <section className="hero">
        <div className="hero-head">
          <span>// Index ⟡ Apr 20, 2026</span>
          <span className="line" />
          <span>Rev 17.3 · Live</span>
        </div>
        <h1>
          Shipping AI knowledge systems
          <span className="cursor" />
        </h1>
        <p className="sub">
          <b>{profile.name}.</b> Productive apps with AI. Seventeen repositories, fourteen
          production deployments, measured by ship-rate — not by slides.
        </p>

        <div className="stats-strip">
          <div className="cell">
            <span className="k">Active Projects</span>
            <span className="v">{profile.stats.projects}</span>
            <span className="d">▲ 4 this quarter</span>
          </div>
          <div className="cell">
            <span className="k">Prod Deploys</span>
            <span className="v">{profile.stats.deploys}</span>
            <span className="d">▲ 12 / 30d</span>
          </div>
          <div className="cell">
            <span className="k">Commits (12mo)</span>
            <span className="v">{profile.stats.commits}</span>
            <span className="d">▲ Sustained</span>
          </div>
          <div className="cell">
            <span className="k">Avg Uptime</span>
            <span className="v">{profile.stats.uptime}%</span>
            <span className="d">Last 30 days</span>
          </div>
        </div>
      </section>

      <div className="index-wrap">
        <div className="index-toolbar">
          <span>Projects · <span className="count">{rows.length}</span></span>
          <span className="spacer" />
          <div className="filter">
            {categories.map(c => (
              <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="idx">
          <div className="row head">
            <div className="n">#</div>
            <div>Project</div>
            <div>Category</div>
            <div>Stack</div>
            <div className="num">Commits</div>
            <div className="num">Deploys</div>
            <div className="num">Updated</div>
            <div>Status</div>
            <div></div>
          </div>
          {rows.map((p, i) => {
            const isOpen = expanded === p.id;
            return (
              <React.Fragment key={p.id}>
                <div className={`row data ${isOpen ? 'expanded' : ''}`} onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <div className="name">
                    <span>{p.name}</span>
                    <span className="t">{p.tagline}</span>
                  </div>
                  <div className="cat">{p.category}</div>
                  <div className="stack">
                    {p.stack.slice(0, 3).map(s => <span key={s} className="chip">{s}</span>)}
                  </div>
                  <div className="num">{p.commits}</div>
                  <div className={`num ${p.deploys === 0 ? 'muted' : ''}`}>{p.deploys || '—'}</div>
                  <div className="num">{p.lastUpdate}</div>
                  <div><StatusPill status={p.status} /></div>
                  <div className="arrow">{isOpen ? '▾' : '▸'}</div>
                </div>
                {isOpen && (
                  <div className="expand open">
                    <div className="desc">
                      {p.description}
                    </div>
                    <div className="meta">
                      <span className="k">Version</span><span className="v">{p.version}</span>
                      <span className="k">Region</span><span className="v">{p.region}</span>
                      <span className="k">Uptime 30d</span><span className="v">{p.uptime ? `${p.uptime}%` : '—'}</span>
                      <span className="k">Live URL</span><span className="v">{p.url ? <a href={p.url} target="_blank" rel="noopener">{p.url.replace(/^https?:\/\//, '')}</a> : '—'}</span>
                      <span className="k">Repository</span><span className="v">{p.repo ? <a href={p.repo} target="_blank" rel="noopener">github.com/{p.repo.split('github.com/')[1]}</a> : 'Private'}</span>
                    </div>
                    <div className="actions">
                      {p.url && <a className="btn primary" href={p.url} target="_blank" rel="noopener">Visit Live ↗</a>}
                      {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noopener">View Source ↗</a>}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="foot">
          <span>© 2026 Vasikarla · AI</span>
          <span>{profile.email}</span>
          <span>Data refreshed · Apr 20 2026 18:42 IST</span>
        </div>
      </div>
    </div>
  );
}

window.V1 = V1;
window.TickerStrip = TickerStrip;
window.StatusPill = StatusPill;
