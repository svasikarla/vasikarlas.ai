/* Variation 2 — Editorial ledger */

function V2() {
  const projects = window.PROJECTS;
  const profile = window.PROFILE;
  const sorted = [...projects].sort((a, b) => (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0));

  return (
    <div className="v2">
      <div className="wrap">
        <section className="hero">
          <div className="masthead">
            <span className="vol">Vol. <b>XVII</b> · No. <b>04</b></span>
            <span>An index of work in progress</span>
            <span>Monday, Apr 20, 2026</span>
          </div>
          <h1>
            Vasikarla<span className="accent">.</span>
            <br />
            <span className="italic">Productive</span> apps
            <br />
            <span className="thin">with</span> AI.
          </h1>
          <div className="under">
            <p className="lede">
              <b>A working catalogue.</b> Every project listed below is real — deployed,
              iterated on, and shipped. Figures are pulled from GitHub and Vercel.
              Click any entry to open the live application or its source.
            </p>
            <div className="stats">
              <span className="k">Repos</span><span className="v">{profile.stats.projects}</span>
              <span className="k">Deployments</span><span className="v">{profile.stats.deploys}</span>
              <span className="k">Commits / 12mo</span><span className="v">{profile.stats.commits}</span>
              <span className="k">Avg Uptime</span><span className="v">{profile.stats.uptime}%</span>
              <span className="k">Contact</span><span className="v" style={{fontSize: 11}}>outlook.com</span>
              <span className="k">Based In</span><span className="v">IN · UTC+5:30</span>
            </div>
          </div>
        </section>

        <section className="ledger">
          <div className="ledger-head">
            <span>№</span>
            <span>Project & Description</span>
            <span className="hide-mid">Domain</span>
            <span className="hide-mid">Stack</span>
            <span className="r">Commits</span>
            <span className="r">Status</span>
          </div>
          {sorted.map((p, i) => (
            <a key={p.id} className="entry" href={p.url || p.repo || '#'} target="_blank" rel="noopener">
              <span className="no">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="title">
                  {p.name}
                  <span className="arrow">↗</span>
                </div>
                <div className="desc">{p.description}</div>
              </div>
              <span className="cat hide-mid">{p.category}</span>
              <span className="stack hide-mid">{p.stack.join(' · ')}</span>
              <span className="commits">
                {p.commits}
                <small>commits</small>
              </span>
              <span className="status"><StatusPill status={p.status} /></span>
            </a>
          ))}
        </section>

        <div className="foot">
          <span>© MMXXVI · Vasikarla</span>
          <span><a href={profile.github} target="_blank" rel="noopener">github.com/svasikarla</a></span>
          <span>Set in Inter & JetBrains Mono</span>
        </div>
      </div>
    </div>
  );
}

window.V2 = V2;
