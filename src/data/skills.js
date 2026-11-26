// Skill → proof map. Each capability links to the shipped projects that
// demonstrate it, with a concrete one-line proof point. `id` references a
// project in PROJECTS; every project has a /work/<id> page.

// The four skill areas shown in the home-page hero, each backed by a shipped
// project and a figure that appears on that project's case-study page.
export const HERO_PROOF = [
  {
    skill: 'LLM apps & agents',
    items: [
      { id: 'core-pragya-advanced', point: '3 coordinated agents across 3 LLM providers' },
      { id: 'nlsql-pro', point: 'Plain English to SQL on 4 database engines, injection-screened' },
    ],
  },
  {
    skill: 'Machine learning & simulation',
    items: [{ id: 'thermotwin', point: 'LightGBM surrogate over SOLWEIG physics, 0.992 R² held-out' }],
  },
  {
    skill: 'Data engineering & analytics',
    items: [{ id: 'stock-analyst', point: '27,314 filed facts, 75 declared metrics, 13 forensic gates' }],
  },
  {
    skill: 'Full-stack systems',
    items: [{ id: 'society-finance', point: 'Append-only ledger, with roles enforced in the database' }],
  },
];

export const SKILL_PROOFS = [
  {
    skill: 'Traceable analytics',
    blurb: 'Numbers that open to their formula, inputs and source.',
    proofs: [
      { id: 'stock-analyst', point: '75 metrics declared in YAML; every figure links to the filing line it came from.' },
      { id: 'society-finance', point: 'Every balance derives from one append-only ledger, reconciled to the paise.' },
      { id: 'thermotwin', point: 'Every temperature and R² comes from a measurement, a simulation or a cited constant.' },
    ],
  },
  {
    skill: 'Simulation & ML',
    blurb: 'Real physics, with a learned surrogate where speed matters.',
    proofs: [
      { id: 'thermotwin', point: 'LightGBM surrogate at 0.992 R² over a SOLWEIG radiation model, answering in under a second.' },
      { id: 'concept-forge', point: 'Four-factor mastery model routing practice through a prerequisite graph.' },
    ],
  },
  {
    skill: 'LLM workflows',
    blurb: 'Models doing one well-bounded job inside a larger system.',
    proofs: [
      { id: 'skillpilot', point: 'Claude drafts three platform-tuned proposal variants under explicit style rules.' },
      { id: 'core-pragya-advanced', point: 'Curator, Research and Studio agents over a multi-LLM router.' },
      { id: 'nlsql-pro', point: 'Plain-English questions to dialect-specific, read-only SQL.' },
    ],
  },
  {
    skill: 'RAG & retrieval',
    blurb: 'Vector search, embeddings and knowledge graphs over messy sources.',
    proofs: [
      { id: 'core-pragya-advanced', point: 'Vector and graph store for semantic recall across RSS sources.' },
      { id: 'nlsql-pro', point: 'Business Glossary and Golden Query memory backed by vector embeddings.' },
      { id: 'local-rag', point: 'On-device retrieval for documents that cannot leave the machine.' },
    ],
  },
  {
    skill: 'Guardrails & controls',
    blurb: 'Rules enforced where they cannot be bypassed.',
    proofs: [
      { id: 'nlsql-pro', point: 'Blocks 30+ prompt-injection patterns, with read-only sandboxing.' },
      { id: 'stock-analyst', point: 'A database trigger rejects any update to a filed fact; restatements are new rows.' },
      { id: 'society-finance', point: 'Roles and corpus-withdrawal approval enforced in the database, not the interface.' },
    ],
  },
  {
    skill: 'Data pipelines',
    blurb: 'Ingestion that survives sources changing underneath it.',
    proofs: [
      { id: 'skillpilot', point: 'Daily multi-source job ingestion with deduplication and reliability scoring.' },
      { id: 'stock-analyst', point: 'Exchange XBRL parsed as filed, with 12 years of daily price history.' },
      { id: 'igcse-student-guide', point: 'Staged content pipeline with fact-check and adversarial-review gates.' },
    ],
  },
  {
    skill: 'Multilingual & voice',
    blurb: 'Interfaces that meet users in their own language.',
    proofs: [
      { id: 'bima-buddy-advanced', point: 'Voice assistant across 10 Indian languages for insurance decisions.' },
      { id: 'telugu-sahityam', point: 'Classical Telugu verse with IAST transliteration and English translation.' },
    ],
  },
];

/** Skills a project is cited as proof for, with the proof line for each. */
export function getSkillsFor(id) {
  return SKILL_PROOFS.flatMap((s) => {
    const proof = s.proofs.find((pr) => pr.id === id);
    return proof ? [{ skill: s.skill, point: proof.point }] : [];
  });
}
