import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PROJECTS, PROFILE, STATUS_LABELS, getProject, getHighlights, formatShipped } from '@/data/projects';
import { getSkillsFor } from '@/data/skills';
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

/* The key numbers once: benchmark tiles (with their explanation) when the
   project has them, otherwise its highlights. */
function numbersFor(project) {
  const b = project.caseStudy?.benchmarks;
  if (b?.length) return b.map((x) => ({ value: x.value, label: x.metric, detail: x.detail }));
  return getHighlights(project).map((h) => ({ value: h.value, label: h.label }));
}

function Section({ title, children }) {
  return (
    <section className="case-section">
      <h2 className="section-label">{title}</h2>
      {children}
    </section>
  );
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = (await getProjects()).find((p) => p.id === slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const arch = ARCHITECTURE[project.id];
  const shipped = formatShipped(project.shipped);
  const skills = getSkillsFor(project.id);
  const numbers = numbersFor(project);
  // Without a screenshot the hero panel already shows the highlights.
  const showNumbers = numbers.length > 0 && (project.screenshot || cs?.benchmarks?.length);
  // The hero panel lists the features itself when there is nothing else to show.
  const featuresInHero = !project.screenshot && getHighlights(project).length === 0;
  const problem = cs?.problem || project.narrative?.challenge;
  const solution = cs?.solution || project.narrative?.solution;
  const hasMain = Boolean(problem || solution || project.gallery?.length || cs || (project.features?.length && !featuresInHero));

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

        {showNumbers && (
          <dl className="case-highlights">
            {numbers.map((n) => (
              <div key={n.label} className="case-highlight">
                <dt>{n.value}</dt>
                <dd>
                  <span className="case-highlight-label">{n.label}</span>
                  {n.detail && <span className="case-highlight-detail">{n.detail}</span>}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className={`case-body ${hasMain ? '' : 'case-body--aside-only'}`}>
          <div className="case-main">
            {problem && (
              <Section title="The problem">
                <p className="case-prose">{problem}</p>
              </Section>
            )}

            {solution && (
              <Section title="The solution">
                <p className="case-prose">{solution}</p>
              </Section>
            )}

            {project.gallery?.length > 0 && (
              <Section title="Inside the product">
                <div className="case-gallery">
                  {project.gallery.map((g, i) => (
                    <figure key={g.src} className={`case-shot ${i === 0 ? 'case-shot--lead' : ''}`}>
                      <a href={g.src} target="_blank" rel="noopener noreferrer" className="case-shot-frame">
                        <Image
                          src={g.src}
                          alt={`${project.name}: ${g.caption}`}
                          fill
                          sizes={i === 0 ? '(max-width: 960px) 100vw, 760px' : '(max-width: 960px) 100vw, 380px'}
                          className="case-shot-img"
                        />
                      </a>
                      <figcaption>{g.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </Section>
            )}

            {cs?.architecture && (
              <Section title="Architecture">
                <p className="case-prose">{cs.architecture}</p>
                {arch && <ArchitectureDiagram stages={arch.stages} caption={arch.caption} />}
              </Section>
            )}

            {cs?.decisions?.length > 0 && (
              <Section title="Decisions and trade-offs">
                <ol className="case-decisions">
                  {cs.decisions.map((d) => (
                    <li key={d.choice} className="case-decision">
                      <h3>{d.choice}</h3>
                      <p><span>Why</span>{d.why}</p>
                      <p><span>Cost</span>{d.cost}</p>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {cs?.hardParts?.length > 0 && (
              <Section title="What made it hard">
                <ul className="case-list">
                  {cs.hardParts.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </Section>
            )}

            {cs?.outcomes?.length > 0 && (
              <Section title="Outcomes">
                <ul className="case-outcomes">
                  {cs.outcomes.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </Section>
            )}

            {project.features?.length > 0 && !featuresInHero && (
              <Section title="Key features">
                <div className="case-features">
                  {project.features.map((f) => (
                    <div key={f.name} className="case-feature">
                      <div className="case-feature-name">{f.name}</div>
                      <div className="case-feature-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="case-aside" aria-label="At a glance">
            <div className="case-aside-inner">
              <h2 className="section-label">At a glance</h2>
              <dl className="case-facts">
                <div><dt>Status</dt><dd>{STATUS_LABELS[project.status]}</dd></div>
                <div><dt>Domain</dt><dd>{project.domain}</dd></div>
                {shipped && <div><dt>Last shipped</dt><dd>{shipped}</dd></div>}
                {project.role && <div><dt>My role</dt><dd>{project.role}</dd></div>}
                {project.context && <div><dt>Context</dt><dd>{project.context}</dd></div>}
              </dl>

              <h3 className="case-aside-label">Stack</h3>
              <div className="case-stack">
                {project.stack.map((s) => <span key={s} className="case-chip">{s}</span>)}
              </div>

              {skills.length > 0 && (
                <>
                  <h3 className="case-aside-label">Skills this demonstrates</h3>
                  <ul className="case-skills">
                    {skills.map((s) => (
                      <li key={s.skill}>
                        <strong>{s.skill}</strong>
                        <span>{s.point}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>

        <section className="case-cta">
          <div>
            <h2>Hiring for this kind of work, or need something like it built?</h2>
            <p>{PROFILE.availability} Tell me what you are working on.</p>
          </div>
          <div className="case-cta-actions">
            <a
              className="btn-primary"
              href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(`About ${project.name}`)}`}
            >
              Email me
            </a>
            <Link className="btn-ghost" href="/about">About me</Link>
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
