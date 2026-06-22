'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
import { FLAGSHIP_IDS } from '@/components/V4';
import { SKILL_PROOFS } from '@/data/skills';
import RevealOnScroll from '@/components/RevealOnScroll';

const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

export default function SkillsMatrix() {
  const [active, setActive] = useState(0);
  const current = SKILL_PROOFS[active];

  const proofs = useMemo(
    () => current.proofs.map((pr) => ({ ...pr, project: byId[pr.id] })).filter((pr) => pr.project),
    [current]
  );

  return (
    <section className="v4-section skills-matrix-section">
      <RevealOnScroll>
        <div className="section-header">
          <span className="section-label">Capabilities</span>
          <h2>Skills, proven</h2>
          <p className="hero-sub" style={{ marginTop: 12 }}>
            Pick a capability — see the shipped products that prove it.
          </p>
        </div>
      </RevealOnScroll>

      <div className="skills-matrix">
        <div className="skills-chips" role="tablist" aria-label="Capabilities">
          {SKILL_PROOFS.map((s, i) => (
            <button
              key={s.skill}
              role="tab"
              aria-selected={i === active}
              className={`skill-chip ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              {s.skill}
              <span className="skill-chip-count">{s.proofs.length}</span>
            </button>
          ))}
        </div>

        <div className="skills-proof" key={active}>
          <p className="skills-blurb">{current.blurb}</p>
          <div className="proof-grid">
            {proofs.map(({ id, point, project }) => {
              const isFlagship = FLAGSHIP_IDS.includes(id);
              const href = isFlagship ? `/work/${id}` : project.url || project.repo || null;
              const external = !isFlagship && href;
              const Card = (
                <>
                  <div className="proof-card-head">
                    <span className="proof-project">{project.name}</span>
                    <span className="proof-cat">{project.category}</span>
                  </div>
                  <p className="proof-point">{point}</p>
                  {href && (
                    <span className="proof-link">
                      {isFlagship ? 'Case study →' : 'View ↗'}
                    </span>
                  )}
                </>
              );
              if (!href) return <div key={id} className="proof-card">{Card}</div>;
              return external ? (
                <a key={id} className="proof-card" href={href} target="_blank" rel="noopener noreferrer">{Card}</a>
              ) : (
                <Link key={id} className="proof-card" href={href}>{Card}</Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
