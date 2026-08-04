'use client';

import React, { useRef } from 'react';

export const TELEMETRY_MAP = {
  'nlsql-pro': '⚡ 50–200ms Latency · 30+ Jailbreak Defense · Golden Query Memory',
  'core-pragya-advanced': '🤖 3 Coordinated Agents · Multi-LLM Router · 99.98% Uptime',
  'bima-buddy-advanced': '🎯 85%+ Claim Approval Model · 10 Indian Languages ASR',
  'concept-forge': '📊 4-Signal Mastery DAG · Real-Time Prerequisite Engine',
  'igcse-student-guide': '🛡️ 3-Stage Verification Pipeline · Full Syllabus Coverage',
};

export default function TechCardWrapper({
  children,
  className = '',
  projectId = null,
  telemetryOverride = null,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const telemetry = telemetryOverride || (projectId ? TELEMETRY_MAP[projectId] : null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className={`tech-interactive-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style }}
      {...props}
    >
      <div className="tech-card-neural-bg" aria-hidden="true" />
      <div className="tech-card-spotlight" aria-hidden="true" />
      {telemetry && (
        <div className="tech-telemetry-badge" aria-hidden="true">
          <span className="telemetry-pulse-dot" />
          <span className="telemetry-text">{telemetry}</span>
        </div>
      )}
      <div className="tech-card-content">{children}</div>
    </div>
  );
}
