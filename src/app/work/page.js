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

const TELEMETRY_EVENTS = [
  { time: 'Just now', type: 'deploy', text: 'BimaBuddyAdvanced: Deployed to production (bom1) · Uptime 99.99%', color: 'var(--accent)' },
  { time: '2m ago', type: 'commit', text: 'CorePragyaAdvanced: Satish committed "feat: multi-agent research pipeline v2"', color: 'var(--info)' },
  { time: '8m ago', type: 'build', text: 'NLSQLPro: Prompt guardrails security scan ... PASSED (30/30)', color: 'oklch(0.72 0.17 140)' },
  { time: '14m ago', type: 'sync', text: 'ConceptForge: Syllabi DAG synchronization completed successfully', color: 'var(--accent)' },
  { time: '25m ago', type: 'deploy', text: 'IGCSEStudentGuide: Automatic fact-check verification pipeline active', color: 'var(--info)' },
  { time: '1h ago', type: 'telemetry', text: 'System Check: All 5 flagship production clusters reporting HEALTHY', color: 'oklch(0.72 0.17 140)' },
];

export default function WorkPage() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDomain, setActiveDomain] = useState('all');
  const [activeCard, setActiveCard] = useState('');
  const [latencies, setLatencies] = useState({
    'core-pragya-advanced': 82,
    'bima-buddy-advanced': 105,
    'igcse-student-guide': 68,
    'nlsql-pro': 42,
    'concept-forge': 91
  });
  const [visibleEvents, setVisibleEvents] = useState([]);

  // Telemetry rotation
  useEffect(() => {
    setVisibleEvents(TELEMETRY_EVENTS.slice(0, 3));
    const interval = setInterval(() => {
      setVisibleEvents(prev => {
        if (prev.length < 3) return prev;
        const nextEvents = [...prev];
        const lastEventText = prev[2]?.text;
        const lastEventIdx = TELEMETRY_EVENTS.findIndex(e => e.text === lastEventText);
        const nextIdx = (lastEventIdx + 1) % TELEMETRY_EVENTS.length;
        nextEvents.shift();
        nextEvents.push(TELEMETRY_EVENTS[nextIdx]);
        return nextEvents;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Telemetry latency jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const delta = Math.floor(Math.random() * 7) - 3;
          next[key] = Math.max(30, Math.min(150, prev[key] + delta));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
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
            {/* Live System Telemetry */}
            <div className="sidebar-glass-card telemetry-card">
              <div className="card-label">Live Telemetry</div>
              <div className="telemetry-grid">
                {flagshipProjects.map((p) => {
                  const currentLatency = latencies[p.id] || 60;
                  return (
                    <div key={p.id} className="telemetry-row">
                      <div className="telemetry-info">
                        <span className="app-name">{p.name}</span>
                        <span className="app-latency">{currentLatency}ms</span>
                      </div>
                      <div className="telemetry-bar-container">
                        <div
                          className="telemetry-bar-fill"
                          style={{
                            width: `${Math.min(100, (currentLatency / 150) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="telemetry-meta">
                        <span className="app-uptime">{p.uptime ? `${p.uptime}%` : '99.9%'}</span>
                        <span className="live-pulse-dot" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="sidebar-glass-card activity-card">
              <div className="card-label">Live Activity Feed</div>
              <div className="activity-feed-list">
                {visibleEvents.map((ev, index) => (
                  <div key={index} className="activity-event-item" style={{ borderColor: ev.color }}>
                    <div className="event-header">
                      <span className="event-type" style={{ color: ev.color }}>{ev.type.toUpperCase()}</span>
                      <span className="event-time">{ev.time}</span>
                    </div>
                    <p className="event-text">{ev.text}</p>
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
