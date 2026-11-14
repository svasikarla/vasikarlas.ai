import Link from 'next/link';
import { PROFILE } from '@/data/projects';
import RevealOnScroll from './RevealOnScroll';
import FlagshipCard from './FlagshipCard';

/* ─── Hero ─── */
export function Hero({ facts }) {
  return (
    <section className="v4-hero">
      <div className="v4-hero-glow" />
      <div className="v4-hero-inner">
        <div className="hero-topline">
          <span>{PROFILE.name}</span>
          <span className="hero-topline-sep" />
          <span>{PROFILE.role}</span>
        </div>

        <h1>{PROFILE.headline}</h1>
        <p className="hero-sub">{PROFILE.bio}</p>

        <div className="hero-ctas">
          <Link className="btn-primary" href="/work">See the work →</Link>
          <a className="btn-ghost" href="#contact">Hire me or start a project</a>
        </div>
        <p className="hero-availability"><span className="hero-dot" aria-hidden="true" />{PROFILE.availability}</p>

        {facts && (
          <dl className="hero-facts">
            <div><dt>{facts.products}</dt><dd>shipped products</dd></div>
            <div><dt>{facts.flagships}</dt><dd>full case studies</dd></div>
            <div><dt>{facts.lastShipped}</dt><dd>last shipped</dd></div>
          </dl>
        )}
      </div>
    </section>
  );
}

/* ─── How I build ─── */
const PRINCIPLES = [
  {
    title: 'Every number opens',
    body: 'A figure should lead to its formula, its inputs and its source. If it cannot be traced, it does not go on the screen.',
    proof: { id: 'stock-analyst', label: 'StockAnalyst' },
  },
  {
    title: 'Missing is a finding',
    body: 'Absent data is reported as absent — never filled with zero, averaged, or coloured like a warning.',
    proof: { id: 'stock-analyst', label: 'StockAnalyst' },
  },
  {
    title: 'Rules live in the database',
    body: 'Append-only records, roles and approvals are enforced where they cannot be bypassed, not in the interface.',
    proof: { id: 'society-finance', label: 'Society Finance' },
  },
  {
    title: 'Models do one bounded job',
    body: 'An LLM or a surrogate sits inside a system with guardrails around it, and real physics or real data behind it.',
    proof: { id: 'thermotwin', label: 'ThermoTwin AI' },
  },
];

export function PrinciplesSection() {
  return (
    <section className="v4-section problems-section">
      <div className="section-header">
        <span className="section-label">Approach</span>
        <h2>How I build</h2>
      </div>
      <div className="problems-grid">
        {PRINCIPLES.map((p, i) => (
          <RevealOnScroll key={p.title} delay={i * 80}>
            <div className="problem-card">
              <span className="problem-num">0{i + 1}</span>
              <h3 className="problem-pain">{p.title}</h3>
              <p className="problem-solve">{p.body}</p>
              <Link className="problem-proof" href={`/work/${p.proof.id}`}>See it in {p.proof.label} →</Link>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

/* ─── Featured flagships (home) ─── */
export function FeaturedWork({ projects, limit = 3 }) {
  const flagships = projects.filter((p) => p.tier === 'flagship');
  const shown = flagships.slice(0, limit);
  return (
    <section id="flagships" className="v4-section">
      <div className="section-header section-header--row">
        <div>
          <span className="section-label">Selected work</span>
          <h2>Featured case studies</h2>
        </div>
        <Link className="btn-ghost small" href="/work">All {projects.length} projects →</Link>
      </div>
      <div className="flagships-list">
        {shown.map((p, i) => (
          <RevealOnScroll key={p.id} delay={i * 80}>
            <FlagshipCard project={p} reversed={i % 2 === 1} priority={i === 0} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

/* ─── Capabilities (about) ─── */
const CAPABILITIES = [
  {
    title: 'Analytics & data engineering',
    tags: ['Point-in-time fact stores', 'Declared metric registries', 'Ingestion pipelines', 'PostgreSQL / Supabase'],
  },
  {
    title: 'AI & modelling',
    tags: ['LLM workflows', 'RAG & vector search', 'NL-to-SQL', 'ML surrogates over physics'],
  },
  {
    title: 'Product engineering',
    tags: ['Next.js / React', 'FastAPI', 'Database-enforced controls', 'Mobile-first interfaces'],
  },
];

export function CapabilitiesSection() {
  return (
    <section className="v4-section capabilities-section">
      <div className="section-header">
        <span className="section-label">Technical focus</span>
        <h2>Capabilities</h2>
      </div>
      <div className="capabilities-strip">
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="capability-col">
            <h3>{c.title}</h3>
            <div className="capability-tags">
              {c.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ─── */
const mail = (subject) => `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}`;

export function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <span className="contact-label">Work with me</span>
        <h2>Have a system where the numbers matter?</h2>
        <p>{PROFILE.availability}</p>
      </div>
      <div className="contact-paths">
        <div className="contact-path">
          <h3>Hiring</h3>
          <p>
            For AI product engineering roles. The quickest read on how I work is two case studies:
            {' '}<Link href="/work/stock-analyst">StockAnalyst</Link> and{' '}
            <Link href="/work/thermotwin">ThermoTwin AI</Link>.
          </p>
          <div className="contact-path-actions">
            <a className="btn-primary small" href={mail('Role enquiry')}>Email about a role</a>
            {PROFILE.resume && (
              <a className="btn-ghost small" href={PROFILE.resume} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
            )}
            {PROFILE.linkedin && (
              <a className="btn-ghost small" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            )}
          </div>
        </div>
        <div className="contact-path">
          <h3>Building something</h3>
          <p>
            For freelance builds: analytics tools, LLM features with guardrails, and internal finance or
            operations systems. Send the problem, the data you have, and when you need it.
          </p>
          <div className="contact-path-actions">
            <a className="btn-primary small" href={mail('Project enquiry')}>Email about a project</a>
            <a className="btn-ghost small" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
      </div>
      <p className="contact-direct">Or write directly: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></p>
    </section>
  );
}

/* ─── Footer ─── */
export function SiteFooter() {
  return (
    <footer className="v4-footer">
      <span>© {new Date().getFullYear()} {PROFILE.brand}</span>
      <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </footer>
  );
}
