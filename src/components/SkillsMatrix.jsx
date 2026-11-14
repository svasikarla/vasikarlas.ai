'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
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
          <p className="section-blurb">Pick a capability to see the shipped products that prove it.</p>
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
            {proofs.map(({ id, point, project }) => (
              <Link key={id} className="proof-card" href={`/work/${id}`}>
                <div className="proof-card-head">
                  <span className="proof-project">{project.name}</span>
                  <span className="proof-cat">{project.domain}</span>
                </div>
                <p className="proof-point">{point}</p>
                <span className="proof-link">{project.caseStudy ? 'Case study →' : 'Details →'}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
