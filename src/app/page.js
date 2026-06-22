'use client';

import React, { useState } from 'react';
import { PROFILE } from '@/data/projects';
import {
  useProjectsData,
  Hero,
  ProblemsSection,
  FlagshipsSection,
  ContactSection,
  SiteFooter,
  DetailPanel,
} from '@/components/V4';
import SkillsMatrix from '@/components/SkillsMatrix';

export default function HomePage() {
  const projects = useProjectsData();
  const profile = PROFILE;
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="v4">
      <Hero profile={profile} ctaHref="/work" ctaLabel="View Case Studies →" />
      <div className="v4-content">
        <ProblemsSection />
        <FlagshipsSection
          projects={projects}
          onSelectProject={setSelectedProject}
          limit={3}
          headerLabel="Selected Work"
          headerTitle="Featured Case Studies"
        />
        <SkillsMatrix />
        <ContactSection profile={profile} />
        <SiteFooter profile={profile} />
      </div>
      {selectedProject && (
        <DetailPanel project={selectedProject} profile={profile} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
