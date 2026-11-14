import Link from 'next/link';
import { PROFILE, getPortfolioFacts } from '@/data/projects';
import { getProjects } from '@/lib/vercel';
import { CapabilitiesSection, ContactSection } from '@/components/Sections';

export const metadata = {
  title: 'About',
  description:
    'Satish Vasikarla is an AI Product Engineer building analytics, simulation and LLM products where every figure can be traced, reproduced or challenged.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const facts = getPortfolioFacts(await getProjects());
  return (
    <div className="v4">
      <div className="v4-content">
        <header className="page-header">
          <span className="section-label">About · {PROFILE.location}</span>
          <h1>I&apos;m {PROFILE.name}, an {PROFILE.role}.</h1>
          <p className="page-lede">{PROFILE.bio}</p>
          <div className="hero-ctas page-header-ctas">
            <a className="btn-primary" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <a className="btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            {PROFILE.linkedin && (
              <a className="btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            )}
            {PROFILE.resume && (
              <a className="btn-ghost" href={PROFILE.resume} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
            )}
          </div>
          <p className="hero-availability"><span className="hero-dot" aria-hidden="true" />{PROFILE.availability}</p>
        </header>

        <section className="v4-section about-bio">
          <div className="section-header">
            <span className="section-label">Profile</span>
            <h2>How I work</h2>
          </div>
          <div className="about-bio-body">
            <p>
              The products I am proudest of share one rule: a number on the screen has to be defensible.
              In <Link href="/work/stock-analyst">StockAnalyst</Link> every metric opens to its formula and the
              filing it came from. In <Link href="/work/thermotwin">ThermoTwin AI</Link> nothing is typed in —
              each value is measured, simulated or cited. In <Link href="/work/society-finance">Society Finance</Link> balances
              are derived from one append-only ledger.
            </p>
            <p>
              I work end to end: data ingestion and modelling, the API, the interface, and the deployment.
              I use LLMs where they do a bounded job well — drafting, retrieval, translation of intent into
              SQL — and put guardrails and real data around them.
            </p>
          </div>
          <dl className="about-stats">
            <div className="about-stat">
              <dt className="about-stat-num">{facts.products}</dt>
              <dd className="about-stat-label">Shipped products</dd>
            </div>
            <div className="about-stat">
              <dt className="about-stat-num">{facts.live}</dt>
              <dd className="about-stat-label">Running today</dd>
            </div>
            <div className="about-stat">
              <dt className="about-stat-num">{facts.domains}</dt>
              <dd className="about-stat-label">Domains</dd>
            </div>
          </dl>
        </section>

        <CapabilitiesSection />

        <ContactSection />
      </div>
    </div>
  );
}
