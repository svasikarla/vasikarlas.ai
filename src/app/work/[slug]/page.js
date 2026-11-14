import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS, getProject, getHighlights, formatShipped } from '@/data/projects';
import { getProjects } from '@/lib/vercel';
import { ARCHITECTURE } from '@/data/architecture';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import ProjectVisual from '@/components/ProjectVisual';
import StatusPill from '@/components/StatusPill';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

// Only the projects in the data file exist; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };

  const title = `${project.name} — ${project.tagline}`;
  const description = project.description;
  return {
    title,
    description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: { title, description, type: 'article', url: `/work/${project.id}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = (await getProjects()).find((p) => p.id === slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const arch = ARCHITECTURE[project.id];
  const highlights = getHighlights(project);
  const shipped = formatShipped(project.shipped);

  // Previous / next within the same ordering used on /work.
  const index = PROJECTS.findIndex((p) => p.id === project.id);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <div className="v4">
      <article className="v4-content case-study">
        <nav className="case-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/work">Work</Link>
          <span>/</span>
          <span className="current">{project.name}</span>
        </nav>

        <header className="case-hero">
          <div className="case-hero-left">
            <div className="case-meta">
              <StatusPill status={project.status} />
              <span className="case-cat">{project.domain}</span>
              {shipped && <span className="case-cat">Shipped {shipped}</span>}
              {project.context && <span className="case-flag">{project.context}</span>}
            </div>
            <h1 className="case-title">{project.name}</h1>
            <p className="case-tagline">{project.tagline}</p>
            <p className="case-desc">{project.description}</p>
            <div className="case-actions">
              {project.url && (
                <a className="btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.status === 'private' ? 'Visit landing page ↗' : 'Visit live ↗'}
                </a>
              )}
              {project.repo && (
                <a className="btn-ghost" href={project.repo} target="_blank" rel="noopener noreferrer">View source ↗</a>
              )}
              {!project.url && !project.repo && <span className="case-private">Private deployment</span>}
            </div>
          </div>
          <div className="case-hero-visual">
            <ProjectVisual project={project} priority />
          </div>
        </header>

        {/* Without a screenshot the hero panel already shows these facts. */}
        {project.screenshot && highlights.length > 0 && (
          <dl className="case-highlights">
            {highlights.map((h) => (
              <div key={h.label} className="case-highlight">
                <dt>{h.value}</dt>
                <dd>{h.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {(cs?.problem || project.narrative?.challenge) && (
          <section className="case-section">
            <h2 className="section-label">The problem</h2>
            <p className="case-prose">{cs?.problem || project.narrative.challenge}</p>
          </section>
        )}

        {(cs?.solution || project.narrative?.solution) && (
          <section className="case-section">
            <h2 className="section-label">The solution</h2>
            <p className="case-prose">{cs?.solution || project.narrative.solution}</p>
          </section>
        )}

        {cs?.architecture && (
          <section className="case-section">
            <h2 className="section-label">Architecture</h2>
            <p className="case-prose">{cs.architecture}</p>
            {arch && <ArchitectureDiagram stages={arch.stages} caption={arch.caption} />}
          </section>
        )}

        {cs?.hardParts?.length > 0 && (
          <section className="case-section">
            <h2 className="section-label">What made it hard</h2>
            <ul className="case-list">
              {cs.hardParts.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </section>
        )}

        {cs?.outcomes?.length > 0 && (
          <section className="case-section">
            <h2 className="section-label">Outcomes</h2>
            <ul className="case-outcomes">
              {cs.outcomes.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </section>
        )}

        {cs?.benchmarks?.length > 0 && (
          <section className="case-section">
            <h2 className="section-label">By the numbers</h2>
            <div className="case-features case-features--metrics">
              {cs.benchmarks.map((b) => (
                <div key={b.metric} className="case-feature">
                  <div className="case-metric-value">{b.value}</div>
                  <div className="case-feature-name">{b.metric}</div>
                  <div className="case-feature-desc">{b.detail}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.features?.length > 0 && (
          <section className="case-section">
            <h2 className="section-label">Key features</h2>
            <div className="case-features">
              {project.features.map((f) => (
                <div key={f.name} className="case-feature">
                  <div className="case-feature-name">{f.name}</div>
                  <div className="case-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="case-section">
          <h2 className="section-label">Stack</h2>
          <div className="case-stack">
            {project.stack.map((s) => <span key={s} className="case-chip">{s}</span>)}
          </div>
        </section>

        <nav className="case-footer-nav" aria-label="More work">
          <Link className="btn-ghost" href="/work">← All work</Link>
          <Link className="btn-ghost" href={`/work/${next.id}`}>Next: {next.name} →</Link>
        </nav>
      </article>
    </div>
  );
}
