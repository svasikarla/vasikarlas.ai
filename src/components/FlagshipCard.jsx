import Link from 'next/link';
import { formatShipped } from '@/data/projects';
import ProjectVisual from './ProjectVisual';
import StatusPill from './StatusPill';
import TechCardWrapper from './TechCardWrapper';

export default function FlagshipCard({ project, reversed = false, priority = false }) {
  const p = project;
  const shipped = formatShipped(p.shipped);
  return (
    <TechCardWrapper id={p.id} className={`flagship-card ${reversed ? 'reversed' : ''}`}>
      <div className="flagship-visual">
        <ProjectVisual project={p} priority={priority} />
      </div>
      <div className="flagship-body">
        <div className="flagship-head">
          <div>
            <h3 className="flagship-name">
              <Link href={`/work/${p.id}`}>{p.name}</Link>
            </h3>
            <span className="flagship-category">
              {p.domain}
              {shipped && <> · Shipped {shipped}</>}
            </span>
          </div>
          <StatusPill status={p.status} />
        </div>

        <p className="flagship-tagline">{p.tagline}</p>

        <div className="flagship-narrative">
          <div className="narrative-block">
            <span className="narrative-label">Challenge</span>
            <p>{p.narrative?.challenge || p.description}</p>
          </div>
          {p.narrative?.solution && (
            <div className="narrative-block">
              <span className="narrative-label">Solution</span>
              <p>{p.narrative.solution}</p>
            </div>
          )}
        </div>

        <div className="flagship-footer">
          <div className="flagship-chips">
            {p.stack.slice(0, 4).map((s) => <span key={s}>{s}</span>)}
          </div>
          <div className="flagship-actions">
            <Link className="btn-ghost small" href={`/work/${p.id}`}>Case study →</Link>
            {p.url && (
              <a className="btn-primary small" href={p.url} target="_blank" rel="noopener noreferrer">
                {p.status === 'private' ? 'Visit ↗' : 'Live ↗'}
              </a>
            )}
          </div>
        </div>
      </div>
    </TechCardWrapper>
  );
}
