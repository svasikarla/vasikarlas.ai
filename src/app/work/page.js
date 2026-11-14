import { getPortfolioFacts } from '@/data/projects';
import { getProjects } from '@/lib/vercel';
import WorkExplorer from '@/components/WorkExplorer';
import { ContactSection } from '@/components/Sections';

export const metadata = {
  title: 'Work',
  description:
    'Case studies and shipped products: forensic equity screening, physics-backed heat simulation, LLM workflows, NL-to-SQL, and auditable finance systems.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const projects = await getProjects();
  const facts = getPortfolioFacts(projects);
  return (
    <div className="v4">
      <div className="v4-content">
        <header className="page-header">
          <span className="section-label">Work</span>
          <h1>Everything I have shipped</h1>
          <p className="page-lede">
            {facts.total} projects across {facts.domains} domains. {facts.flagships} have full case studies;
            the rest are grouped by what they are. Most recent release: {facts.lastShipped}.
          </p>
        </header>
        <WorkExplorer projects={projects} />
        <ContactSection />
      </div>
    </div>
  );
}
