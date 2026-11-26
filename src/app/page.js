import { getPortfolioFacts } from '@/data/projects';
import { getProjects } from '@/lib/vercel';
import { Hero, PrinciplesSection, FeaturedWork, ContactSection } from '@/components/Sections';

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <div className="v4">
      <Hero facts={getPortfolioFacts(projects)} />
      <div className="v4-content">
        <FeaturedWork projects={projects} limit={3} />
        <PrinciplesSection />
        <ContactSection />
      </div>
    </div>
  );
}
