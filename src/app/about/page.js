'use client';

import React from 'react';
import { PROFILE } from '@/data/projects';
import { CapabilitiesSection, ContactSection, SiteFooter } from '@/components/V4';

export default function AboutPage() {
  const profile = PROFILE;

  return (
    <div className="v4">
      <section className="v4-hero compact">
        <div className="v4-hero-glow" />
        <div className="v4-hero-inner">
          <div className="hero-topline">
            <span>About</span>
            <span className="hero-topline-sep" />
            <span>{profile.location}</span>
          </div>
          <h1>
            I&apos;m Satish Vasikarla — an AI Product Engineer.
          </h1>
          <p className="hero-sub">
            I build usable, production-grade software across AI, full-stack systems, insurance, education, and knowledge platforms. Twenty-one shipped products, one hundred forty-nine production deploys, four years of iteration.
          </p>
          <div className="hero-ctas">
            <a className="btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn-ghost" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
      </section>

      <div className="v4-content">
        <section className="v4-section about-bio">
          <div className="section-header">
            <span className="section-label">Profile</span>
            <h2>How I work</h2>
          </div>
          <div className="about-bio-body">
            <p>{profile.bio}</p>
            <p>
              I focus on shipping software that runs in production for real users — LLM integration,
              RAG pipelines, knowledge graphs, and natural-language-to-SQL across insurance, education,
              and knowledge platforms. The emphasis is on reliability and usability, not demos.
            </p>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-num">{profile.stats.projects}</span>
              <span className="about-stat-label">Shipped products</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-num">{profile.stats.deploys}</span>
              <span className="about-stat-label">Production deploys</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-num">{profile.stats.uptime}%</span>
              <span className="about-stat-label">Uptime</span>
            </div>
          </div>
        </section>

        <CapabilitiesSection />

        <section className="v4-section">
          <div className="section-header">
            <span className="section-label">Specializations</span>
            <h2>What I work on</h2>
          </div>
          <div className="spec-chips">
            {profile.specializations.map((s, i) => (
              <span key={i} className="spec-chip">{s}</span>
            ))}
          </div>
        </section>
        <div id="contact">
          <ContactSection profile={profile} />
        </div>
        <SiteFooter profile={profile} />
      </div>
    </div>
  );
}
