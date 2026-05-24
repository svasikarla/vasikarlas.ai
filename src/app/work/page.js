'use client';

import React, { useState } from 'react';
import { PROFILE } from '@/data/projects';
import {
  useProjectsData,
  FlagshipsSection,
  ContactSection,
  SiteFooter,
  DetailPanel,
} from '@/components/V4';

export default function WorkPage() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="v4">
      <div className="v4-content" style={{ paddingTop: 48 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-label">Case Studies</span>
          <h2>All flagship work</h2>
          <p className="hero-sub" style={{ marginTop: 12 }}>
            Five production AI products spanning insurance, education, knowledge management, and developer tools — each shipped to live users.
          </p>
        </div>
        <FlagshipsSection
          projects={projects}
          onSelectProject={setSelectedProject}
          headerLabel="Selected Work"
          headerTitle="Flagship Case Studies"
        />
        <ContactSection profile={profile} />
        <SiteFooter profile={profile} />
      </div>
      {selectedProject && (
        <DetailPanel project={selectedProject} profile={profile} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
