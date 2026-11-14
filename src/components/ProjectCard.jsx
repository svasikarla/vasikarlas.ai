import Link from 'next/link';
import { formatShipped } from '@/data/projects';
import StatusPill from './StatusPill';

/* Compact card for non-flagship projects. Links are explicit; the card itself
   is not a click target, so text stays selectable and links stay predictable. */
export default function ProjectCard({ project }) {
  const p = project;
  const shipped = formatShipped(p.shipped);
  return (
    <article className="project-card">
      <header className="project-card-top">
        <div>
          <h3 className="project-card-name">
            <Link href={`/work/${p.id}`}>{p.name}</Link>
          </h3>
          <span className="project-card-meta">
            {p.domain}
            {shipped && <> · {shipped}</>}
          </span>
        </div>
        <StatusPill status={p.status} />
      </header>
      <p className="project-card-tagline">{p.tagline}</p>
      <p className="project-card-desc">{p.description}</p>
      <div className="flagship-chips">
        {p.stack.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
      </div>
      <footer className="project-card-links">
        <Link href={`/work/${p.id}`}>Details →</Link>
        {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Live ↗</a>}
        {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer">Source ↗</a>}
      </footer>
    </article>
  );
}
