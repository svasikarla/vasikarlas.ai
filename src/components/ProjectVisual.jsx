'use client';

import React, { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import { getHighlights } from '@/data/projects';

/* Flagships with an interactive AI demo that runs against a real model. */
const LIVE_DEMOS = {
  'nlsql-pro': lazy(() => import('./NlSqlDemo')),
  'core-pragya-advanced': lazy(() => import('./CorePragyaDemo')),
  'concept-forge': lazy(() => import('./ConceptForgeDemo')),
};

/* Typographic panel for projects without a screenshot: the key facts, large. */
function SpecPanel({ project }) {
  const facts = getHighlights(project);
  return (
    <div className="pv-spec">
      <span className="pv-spec-label">{project.context || project.domain}</span>
      <dl className="pv-spec-grid">
        {facts.map((f) => (
          <div key={f.label} className="pv-spec-cell">
            <dt>{f.value}</dt>
            <dd>{f.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The visual half of a project card.
 * Default view is a full-bleed screenshot (or a spec panel when there is none).
 * The recorded app tour and the live AI demo open in place, on request, so the
 * page never loads five iframes up front.
 */
export default function ProjectVisual({ project, priority = false }) {
  const [mode, setMode] = useState('cover');
  const LiveDemo = LIVE_DEMOS[project.id];

  if (mode !== 'cover') {
    return (
      <div className="pv pv--open">
        <div className="pv-bar">
          <span className="pv-bar-title">{mode === 'tour' ? 'App tour' : 'Live demo'} · {project.name}</span>
          <button type="button" className="pv-btn" onClick={() => setMode('cover')}>Close</button>
        </div>
        <div className="pv-stage">
          {mode === 'tour' ? (
            <iframe
              src={`/demos/${project.id}-demo.html`}
              title={`${project.name} app tour`}
              className="pv-iframe"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flagship-demo-widget flagship-demo-widget--live pv-live">
              <Suspense fallback={<div className="pv-loading">Loading demo…</div>}>
                <LiveDemo />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pv">
      {project.screenshot ? (
        <Image
          src={project.screenshot}
          alt={`${project.name} — application screenshot`}
          fill
          sizes="(max-width: 960px) 100vw, 520px"
          className="pv-img"
          priority={priority}
        />
      ) : (
        <SpecPanel project={project} />
      )}
      {(project.tour || LiveDemo) && (
        <div className="pv-actions">
          {project.tour && (
            <button type="button" className="pv-btn" onClick={() => setMode('tour')}>▶ App tour</button>
          )}
          {LiveDemo && (
            <button type="button" className="pv-btn pv-btn--accent" onClick={() => setMode('live')}>Try it live</button>
          )}
        </div>
      )}
    </div>
  );
}
