// Skill → Proof map. Each capability links to the shipped projects that
// demonstrate it, with a concrete one-line proof point. `id` references a
// project in PROJECTS; flagship ids resolve to a /work/<id> case study.

export const SKILL_PROOFS = [
  {
    skill: 'RAG & Retrieval',
    blurb: 'Vector search, embeddings, and knowledge graphs over messy sources.',
    proofs: [
      { id: 'core-pragya-advanced', point: 'Vector + graph store for semantic recall across thousands of RSS sources.' },
      { id: 'nlsql-pro', point: 'Business Glossary and Golden Query memory backed by vector embeddings.' },
      { id: 'bima-buddy-advanced', point: 'Semantic policy retrieval normalizing 50+ insurers into one schema.' },
    ],
  },
  {
    skill: 'NL → SQL',
    blurb: 'Plain-English questions to production-safe SQL.',
    proofs: [
      { id: 'nlsql-pro', point: 'Cross-dialect SQL generation with 24h schema caching and 50–200ms responses.' },
    ],
  },
  {
    skill: 'Multi-Agent Systems',
    blurb: 'Coordinated agents that share context without colliding.',
    proofs: [
      { id: 'core-pragya-advanced', point: 'Curator, Research, and Studio agents over a multi-LLM router (OpenAI · Claude · Groq).' },
    ],
  },
  {
    skill: 'LLM Guardrails',
    blurb: 'Defending generation against injection and hallucination.',
    proofs: [
      { id: 'nlsql-pro', point: 'Blocks 30+ prompt-injection patterns with read-only sandboxing and AES-256.' },
      { id: 'igcse-student-guide', point: 'Fact-check + adversarial review gates catch hallucinations before publish.' },
    ],
  },
  {
    skill: 'Multilingual & Voice',
    blurb: 'High-stakes UX across languages and modalities.',
    proofs: [
      { id: 'bima-buddy-advanced', point: 'Streaming ASR + TTS across 10 Indian languages at 95%+ accuracy.' },
    ],
  },
  {
    skill: 'Adaptive Personalization',
    blurb: 'Models that learn each user from sparse signals.',
    proofs: [
      { id: 'concept-forge', point: '4-factor mastery model routing practice via a prerequisite DAG.' },
      { id: 'igcse-student-guide', point: 'Adaptive quizzes that track per-student confidence and target weak areas.' },
      { id: 'core-pragya-advanced', point: 'Feed ranking personalized from a learned interest profile.' },
    ],
  },
  {
    skill: 'Production Reliability',
    blurb: 'Shipped to live users, not just demoed.',
    proofs: [
      { id: 'bima-buddy-advanced', point: '99.99% uptime across 41 production deploys.' },
      { id: 'nlsql-pro', point: '50–200ms responses — 10–100× faster than uncached generation.' },
      { id: 'core-pragya-advanced', point: '99.98% production uptime with autonomous research pipelines.' },
    ],
  },
];
