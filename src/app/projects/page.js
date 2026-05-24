'use client';

import React, { useState } from 'react';
import { PROFILE } from '@/data/projects';
import {
  useProjectsData,
  ArchiveSection,
  CommandPalette,
  DetailPanel,
  SiteFooter,
} from '@/components/V4';

export default function ProjectsPage() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [selectedProject, setSelectedProject] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="v4">
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} projects={projects} />
      <div className="v4-content" style={{ paddingTop: 48 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-label">Full Portfolio</span>
          <h2>All projects</h2>
          <p className="hero-sub" style={{ marginTop: 12 }}>
            The complete portfolio across AI, full-stack, insurance, education, content, and infrastructure. Search, filter, and explore.
          </p>
        </div>
        <ArchiveSection
          projects={projects}
          onSelectProject={setSelectedProject}
          headerLabel="Archive"
          headerTitle="Browse Everything"
        />
        <SiteFooter profile={profile} />
      </div>
      {selectedProject && (
        <DetailPanel project={selectedProject} profile={profile} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
