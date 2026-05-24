'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { PROJECTS, PROFILE } from '@/data/projects';
import {
  FLAGSHIP_NARRATIVES,
  FlagshipVisual,
  StatusPill,
  SiteFooter,
} from '@/components/V4';

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params?.slug;
  const project = PROJECTS.find((p) => p.id === slug);
  const profile = PROFILE;

  if (!project) {
    return (
      <div className="v4">
        <div className="v4-content" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div className="section-header">
            <span className="section-label">404</span>
            <h2>Project not found</h2>
            <p className="hero-sub" style={{ marginTop: 12 }}>
              We couldn&apos;t find a project with that ID.
            </p>
            <div className="hero-ctas" style={{ marginTop: 24 }}>
              <Link className="btn-primary" href="/work">← All case studies</Link>
              <Link className="btn-ghost" href="/projects">Browse all projects</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const narr = FLAGSHIP_NARRATIVES[project.id] || {
    challenge: project.description,
    solution: project.tagline,
  };
  const isFlagship = Object.prototype.hasOwnProperty.call(FLAGSHIP_NARRATIVES, project.id);
  const cs = project.caseStudy;

  return (
    <div className="v4">
      <article className="v4-content case-study">
        {/* Breadcrumb */}
        <nav className="case-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/work">Work</Link>
          <span>/</span>
          <span className="current">{project.name}</span>
        </nav>

        {/* Hero block */}
        <header className="case-hero">
          <div className="case-hero-left">
            <div className="case-meta">
              <StatusPill status={project.status} />
              <span className="case-cat">{project.category}</span>
              {isFlagship && <span className="case-flag">Flagship</span>}
            </div>
            <h1 className="case-title">{project.name}</h1>
            <p className="case-tagline">{project.tagline}</p>
            <div className="case-actions">
              {project.url && <a className="btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">Visit Live ↗</a>}
              {project.repo && <a className="btn-ghost" href={project.repo} target="_blank" rel="noopener noreferrer">View Source ↗</a>}
            </div>
            <div className="case-stats">
              <div className="case-stat"><span className="k">Commits</span><span className="v">{project.commits}</span></div>
              <div className="case-stat"><span className="k">Deploys</span><span className="v">{project.deploys || '—'}</span></div>
              <div className="case-stat"><span className="k">Uptime</span><span className="v">{project.uptime ? `${project.uptime}%` : '—'}</span></div>
              <div className="case-stat"><span className="k">Updated</span><span className="v">{project.lastUpdate} ago</span></div>
            </div>
          </div>
          {isFlagship && (
            <div className="case-hero-visual">
              <FlagshipVisual id={project.id} />
            </div>
          )}
        </header>

        {/* Problem */}
        <section className="case-section">
          <span className="section-label">The Problem</span>
          <p className="case-prose">{cs?.problem || narr.challenge}</p>
        </section>

        {/* Solution */}
        <section className="case-section">
          <span className="section-label">The Solution</span>
          <p className="case-prose">{cs?.solution || narr.solution}</p>
        </section>

        {/* Architecture */}
        {cs?.architecture && (
          <section className="case-section">
            <span className="section-label">Architecture</span>
            <p className="case-prose">{cs.architecture}</p>
          </section>
        )}

        {/* What made it hard */}
        {cs?.hardParts && cs.hardParts.length > 0 && (
          <section className="case-section">
            <span className="section-label">What Made It Hard</span>
            <ul className="case-list">
              {cs.hardParts.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </section>
        )}

        {/* Outcomes */}
        {cs?.outcomes && cs.outcomes.length > 0 && (
          <section className="case-section">
            <span className="section-label">Outcomes</span>
            <ul className="case-outcomes">
              {cs.outcomes.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </section>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <section className="case-section">
            <span className="section-label">Key Features</span>
            <div className="case-features">
              {project.features.map((f, i) => (
                <div key={i} className="case-feature">
                  <div className="case-feature-name">{f.name}</div>
                  <div className="case-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stack */}
        <section className="case-section">
          <span className="section-label">Stack</span>
          <div className="case-stack">
            {project.stack.map((s) => <span key={s} className="case-chip">{s}</span>)}
          </div>
        </section>

        {/* Footer nav */}
        <nav className="case-footer-nav">
          <Link className="btn-ghost" href="/work">← All case studies</Link>
          <Link className="btn-ghost" href="/projects">Browse archive →</Link>
        </nav>
      </article>
      <SiteFooter profile={profile} />
    </div>
  );
}
