'use client';

import React, { useState } from 'react';
import { TIERS, DOMAINS } from '@/data/projects';
import FlagshipCard from './FlagshipCard';
import ProjectCard from './ProjectCard';

/* The whole portfolio on one page, grouped by tier, filterable by domain. */
export default function WorkExplorer({ projects }) {
  const [domain, setDomain] = useState('all');
  const visible = domain === 'all' ? projects : projects.filter((p) => p.domain === domain);
  const count = (d) => projects.filter((p) => p.domain === d).length;

  return (
    <>
      <div className="work-filter" role="group" aria-label="Filter by domain">
        <button
          type="button"
          className={`skill-chip ${domain === 'all' ? 'active' : ''}`}
          aria-pressed={domain === 'all'}
          onClick={() => setDomain('all')}
        >
          All <span className="skill-chip-count">{projects.length}</span>
        </button>
        {DOMAINS.filter(count).map((d) => (
          <button
            key={d}
            type="button"
            className={`skill-chip ${domain === d ? 'active' : ''}`}
            aria-pressed={domain === d}
            onClick={() => setDomain(d)}
          >
            {d} <span className="skill-chip-count">{count(d)}</span>
          </button>
        ))}
      </div>

      {TIERS.map((tier) => {
        const items = visible.filter((p) => p.tier === tier.id);
        if (items.length === 0) return null;
        return (
          <section key={tier.id} id={tier.id} className="v4-section work-tier">
            <div className="section-header">
              <span className="section-label">{items.length} {items.length === 1 ? 'project' : 'projects'}</span>
              <h2>{tier.label}</h2>
              <p className="section-blurb">{tier.blurb}</p>
            </div>
            {tier.id === 'flagship' ? (
              <div className="flagships-list">
                {items.map((p, i) => (
                  <FlagshipCard key={p.id} project={p} reversed={i % 2 === 1} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div className="project-grid">
                {items.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
