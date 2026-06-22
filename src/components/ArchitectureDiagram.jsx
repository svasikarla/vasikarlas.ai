import React from 'react';

/* Presentational flow diagram for a flagship's pipeline.
   Renders a row of stage nodes joined by connectors — horizontal on desktop,
   vertical on mobile (the connector chevron rotates via CSS). */
export default function ArchitectureDiagram({ stages, caption }) {
  if (!stages || stages.length === 0) return null;
  return (
    <figure className="arch-diagram">
      <div className="arch-flow">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`arch-node arch-${s.kind}`}>
              <span className="arch-node-kind">{s.kind}</span>
              <span className="arch-node-label">{s.label}</span>
              {s.sub && <span className="arch-node-sub">{s.sub}</span>}
              {s.tags && s.tags.length > 0 && (
                <span className="arch-node-tags">
                  {s.tags.map((t) => <span key={t}>{t}</span>)}
                </span>
              )}
            </div>
            {i < stages.length - 1 && <span className="arch-conn" aria-hidden>→</span>}
          </React.Fragment>
        ))}
      </div>
      {caption && <figcaption className="arch-caption">{caption}</figcaption>}
    </figure>
  );
}
