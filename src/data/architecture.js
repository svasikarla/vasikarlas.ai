// System-architecture flow diagrams for the flagship case studies.
// Each entry is an ordered pipeline of stages (data flows left→right / top→down).
// `kind` drives the node colour; `tags` are the concrete tech at that stage.
// Derived from each project's caseStudy.architecture / hardParts.

export const ARCHITECTURE = {
  'stock-analyst': {
    caption: 'As-filed facts flow through a declared metric registry; gates run before the score and outside it.',
    stages: [
      { label: 'NSE Filings', sub: 'XBRL, as filed', kind: 'input' },
      { label: 'Fact Store', sub: 'Append-only · point-in-time', kind: 'store' },
      { label: 'Metric Registry', sub: '75 metrics in YAML', kind: 'engine' },
      { label: 'Sector Router', sub: 'Banks vs. non-financials', kind: 'pipeline' },
      { label: 'Forensic Gates', sub: '13 gates · 6 vetoes', kind: 'guard' },
      { label: 'Working Paper', sub: 'Parameters & flags', kind: 'output' },
    ],
  },
  thermotwin: {
    caption: 'A measured heat field and real geometry feed the physics; a surrogate trained on the physics makes it interactive.',
    stages: [
      { label: 'Site', sub: 'Downtown Seattle · 1.57 km²', kind: 'input', tags: ['Overture Maps', 'DuckDB'] },
      { label: 'Measured Field', sub: '114 tiles · 1,733 buildings', kind: 'store' },
      { label: 'SOLWEIG Physics', sub: 'Shadows · Tmrt → UTCI', kind: 'engine' },
      { label: 'Surrogate', sub: 'LightGBM · R² 0.992', kind: 'llm' },
      { label: 'Simulator', sub: 'Sub-second what-ifs', kind: 'output', tags: ['FastAPI', 'Cloud Run'] },
    ],
  },
  skillpilot: {
    caption: 'Listings are scored for trust before they are ranked for fit; Claude only writes once a match is chosen.',
    stages: [
      { label: 'Job Sources', sub: 'Boards & marketplaces', kind: 'input' },
      { label: 'Ingestion', sub: 'Daily · dedup · relevance', kind: 'pipeline' },
      { label: 'Reliability Score', sub: '0–100 · 20+ signals', kind: 'guard' },
      { label: 'Match Engine', sub: 'Skill 60 · rate 20 · recency 20', kind: 'engine' },
      { label: 'Claude', sub: '3 proposal variants', kind: 'llm' },
      { label: 'Tracker', sub: '9 stages · group stats', kind: 'output' },
    ],
  },
  'society-finance': {
    caption: 'Everything posts to one append-only ledger; statements and year-end accounts are derived from it.',
    stages: [
      { label: 'Flats & Rates', sub: 'Effective-dated', kind: 'input' },
      { label: 'Billing', sub: 'Occupancy-based dues', kind: 'pipeline' },
      { label: 'Receipts', sub: 'Gap-free · oldest dues first', kind: 'engine' },
      { label: 'Ledger', sub: 'Append-only · audit trail', kind: 'store' },
      { label: 'DB Rules', sub: 'Roles · corpus approval', kind: 'guard' },
      { label: 'Accounts', sub: 'Statements · I&E · Balance Sheet', kind: 'output' },
    ],
  },
  'core-pragya-advanced': {
    caption: 'Three coordinated agents over a multi-LLM router and a vector + graph store.',
    stages: [
      { label: 'Sources', sub: 'Articles · RSS · PDFs', kind: 'input' },
      { label: 'Ingestion', sub: 'Dedup pipeline', kind: 'pipeline' },
      { label: 'Knowledge Base', sub: 'Embeddings · semantic recall', kind: 'store', tags: ['Supabase', 'Vectors'] },
      { label: 'Model choice', sub: 'Provider + model per run', kind: 'llm', tags: ['Anthropic', 'OpenAI', 'Groq'] },
      { label: '3 Agents', sub: 'Curator · Research · Studio', kind: 'agent' },
      { label: '7 Formats', sub: 'Medium · LinkedIn · X · Substack · Dev.to · blog', kind: 'output' },
    ],
  },
  'bima-buddy-advanced': {
    caption: 'A multilingual voice front end over a policy store, with a claim check before filing.',
    stages: [
      { label: 'User', sub: 'Voice / text · 10 languages', kind: 'input' },
      { label: 'Voice Pipeline', sub: 'Speech in · speech out', kind: 'llm', tags: ['10 languages'] },
      { label: 'Policy Store', sub: 'Plans → one schema', kind: 'store' },
      { label: 'Claim Check', sub: 'Document gaps · similar cases', kind: 'engine' },
      { label: 'Guided Result', sub: 'Compare · predict · advise', kind: 'output' },
    ],
  },
  'nlsql-pro': {
    caption: 'Guardrails and a schema cache wrap Claude; vector memory and dialect adapters bracket it.',
    stages: [
      { label: 'NL Query', sub: 'Plain English', kind: 'input' },
      { label: 'Injection Guard', sub: '30+ jailbreak patterns', kind: 'guard' },
      { label: 'Schema Cache', sub: '24h TTL', kind: 'cache' },
      { label: 'Claude', sub: 'NL → query intent', kind: 'llm' },
      { label: 'Glossary + Golden Query', sub: 'Vector recall', kind: 'store' },
      { label: 'Dialect SQL', sub: 'PG · MySQL · SQLite · MSSQL · read-only', kind: 'output' },
    ],
  },
  'igcse-student-guide': {
    caption: 'A staged generation pipeline with two verification gates before anything publishes.',
    stages: [
      { label: 'Syllabus Map', sub: 'Aligned to revisions', kind: 'input' },
      { label: 'LLM Generation', sub: 'Cards · quizzes · guides', kind: 'llm' },
      { label: 'Fact-Check', sub: 'Hallucination filter', kind: 'guard' },
      { label: 'Adversarial Review', sub: 'Second-pass verify', kind: 'guard' },
      { label: 'Publish', sub: 'Free study material', kind: 'output' },
    ],
  },
  'concept-forge': {
    caption: 'A 4-factor mastery model reads a prerequisite graph to route practice to the blocking concept.',
    stages: [
      { label: 'Student Signals', sub: 'Performance · accuracy · difficulty · recency', kind: 'input' },
      { label: 'Mastery Model', sub: '4-factor score', kind: 'engine' },
      { label: 'Prerequisite DAG', sub: 'Blocking-concept detection', kind: 'store' },
      { label: 'Adaptive Selector', sub: 'Streak-based difficulty', kind: 'engine' },
      { label: 'Targeted Practice', sub: 'Real-time adjustment', kind: 'output' },
    ],
  },
};
