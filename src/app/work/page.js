'use client';

import React, { useState, useEffect } from 'react';
import { PROFILE } from '@/data/projects';
import {
  useProjectsData,
  FlagshipsSection,
  ContactSection,
  SiteFooter,
  DetailPanel,
} from '@/components/V4';
import { getGithubData } from '@/actions/github';

export default function WorkPage() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDomain, setActiveDomain] = useState('all');
  const [activeCard, setActiveCard] = useState('');
  const [github, setGithub] = useState(null);

  // Real GitHub activity — replaces the old hardcoded telemetry feed
  useEffect(() => {
    let mounted = true;
    getGithubData().then((data) => { if (mounted) setGithub(data); });
    return () => { mounted = false; };
  }, []);

  // Filter projects by domain (only flagship projects)
  const flagshipProjects = projects.filter(p => p.flagship);
  
  const filteredProjects = flagshipProjects.filter(p => {
    if (activeDomain === 'all') return true;
    return p.category.toLowerCase().includes(activeDomain.toLowerCase());
  });

  // IntersectionObserver to highlight sidebar jump-links on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.05
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCard(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const elements = document.querySelectorAll('.flagship-card');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [projects, activeDomain]);

  const scrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveCard(id);
    }
  };

  const domains = [
    { id: 'all', label: 'All Domains' },
    { id: 'AI', label: 'AI & Knowledge' },
    { id: 'FinTech', label: 'FinTech / InsureTech' },
    { id: 'EdTech', label: 'EdTech' }
  ];

  return (
    <div className="v4">
      <div className="v4-content work-page-content" style={{ paddingTop: 48 }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <span className="section-label">Case Studies</span>
          <h2>All flagship work</h2>
          <p className="hero-sub" style={{ marginTop: 12 }}>
            Five production AI products spanning insurance, education, knowledge management, and developer tools — each shipped to live users.
          </p>
        </div>

        <div className="work-layout-container">
          {/* Left Sidebar */}
          <aside className="work-sidebar-left">
            {/* Profile Card */}
            <div className="sidebar-glass-card profile-card">
              <div className="profile-header">
                <div className="profile-avatar">V</div>
                <div className="profile-info">
                  <span className="profile-name">Satish Vasikarla</span>
                  <span className="profile-handle">@svasikarla</span>
                </div>
              </div>
              <div className="status-indicator">
                <span className="status-dot pulsing" />
                <span className="status-text">Active & Shipped</span>
              </div>
            </div>

            {/* Jump-Links TOC */}
            <div className="sidebar-glass-card links-card">
              <div className="card-label">Jump to Case Study</div>
              <div className="jump-links-list">
                {flagshipProjects.map((p) => {
                  const isVisible = filteredProjects.some(fp => fp.id === p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => isVisible && scrollToCard(p.id)}
                      className={`jump-link-item ${activeCard === p.id ? 'active' : ''} ${!isVisible ? 'disabled' : ''}`}
                      disabled={!isVisible}
                    >
                      <span className="jump-link-dot" />
                      <span className="jump-link-name">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Domain Filters */}
            <div className="sidebar-glass-card filters-card">
              <div className="card-label">Filter by Domain</div>
              <div className="filter-buttons">
                {domains.map((dom) => (
                  <button
                    key={dom.id}
                    onClick={() => setActiveDomain(dom.id)}
                    className={`filter-btn ${activeDomain === dom.id ? 'active' : ''}`}
                  >
                    {dom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Connect & Links */}
            <div className="sidebar-glass-card contact-card">
              <div className="card-label">Let's Connect</div>
              <div className="contact-links">
                <a href={`mailto:${profile.email}`} className="contact-link-item">
                  <span className="icon">✉</span>
                  <span className="text">{profile.email}</span>
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-link-item">
                  <span className="icon">◆</span>
                  <span className="text">GitHub Profile</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Pane */}
          <div className="work-main-pane">
            {filteredProjects.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 20px', border: '1px solid var(--line)', borderRadius: 16, background: 'var(--bg-1)' }}>
                <div className="empty-icon">⌘</div>
                <div className="empty-title">No case studies matching filters</div>
                <button className="btn-ghost small" style={{ marginTop: 16 }} onClick={() => setActiveDomain('all')}>Reset filter</button>
              </div>
            ) : (
              <FlagshipsSection
                projects={filteredProjects}
                onSelectProject={setSelectedProject}
                headerLabel="Selected Work"
                headerTitle="Flagship Case Studies"
              />
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="work-sidebar-right">
            {/* GitHub Language Breakdown (real data) */}
            <div className="sidebar-glass-card telemetry-card">
              <div className="card-label">
                GitHub · Stack
                {github?.repoCount != null && <span className="card-label-meta">{github.repoCount} repos</span>}
              </div>
              {!github && <div className="gh-loading">Loading from GitHub…</div>}
              {github?.error && <div className="gh-loading">GitHub unavailable</div>}
              {github?.languages && (
                <div className="gh-lang-list">
                  {github.languages.map((l) => (
                    <div key={l.name} className="gh-lang-row">
                      <div className="gh-lang-head">
                        <span className="gh-lang-name">{l.name}</span>
                        <span className="gh-lang-pct">{l.pct}%</span>
                      </div>
                      <div className="gh-lang-track">
                        <div className="gh-lang-fill" style={{ width: `${l.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent GitHub Activity (real data) */}
            <div className="sidebar-glass-card activity-card">
              <div className="card-label">
                Recent Activity
                {github?.lastActive && <span className="card-label-meta">{github.lastActive}</span>}
              </div>
              <div className="activity-feed-list">
                {!github && <div className="gh-loading">Loading commits…</div>}
                {github?.error && <div className="gh-loading">Couldn’t reach GitHub</div>}
                {github?.events?.map((ev) => (
                  <div key={ev.id} className={`activity-event-item gh-${ev.kind}`}>
                    <div className="event-header">
                      <span className="event-type">{ev.kind.toUpperCase()}</span>
                      <span className="event-time">{ev.time}</span>
                    </div>
                    <p className="event-text">{ev.label}</p>
                    {ev.detail && <p className="event-detail">{ev.detail}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Console */}
            <div className="sidebar-glass-card console-actions-card">
              <div className="card-label">Developer Console</div>
              <button
                className="console-action-btn primary-glow"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: true,
                    metaKey: true,
                    bubbles: true,
                    cancelable: true
                  });
                  window.dispatchEvent(event);
                }}
              >
                <span className="icon">⌘</span>
                <span className="text">Search / Quick jump</span>
                <kbd className="shortcut">⌘K</kbd>
              </button>
            </div>
          </aside>
        </div>

        <ContactSection profile={profile} />
        <SiteFooter profile={profile} />
      </div>
      {selectedProject && (
        <DetailPanel project={selectedProject} profile={profile} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
