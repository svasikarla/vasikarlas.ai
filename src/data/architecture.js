// System-architecture flow diagrams for the flagship case studies.
// Each entry is an ordered pipeline of stages (data flows left→right / top→down).
// `kind` drives the node colour; `tags` are the concrete tech at that stage.
// Derived from each project's caseStudy.architecture / hardParts.

export const ARCHITECTURE = {
  'core-pragya-advanced': {
    caption: 'Three coordinated agents over a multi-LLM router and a vector + graph store.',
    stages: [
      { label: 'Sources', sub: 'Articles · RSS · PDFs', kind: 'input' },
      { label: 'Ingestion', sub: 'Dedup pipeline', kind: 'pipeline' },
      { label: 'Vector + Graph Store', sub: 'Semantic recall · concept graph', kind: 'store', tags: ['Embeddings', 'Graph DB'] },
      { label: 'Multi-LLM Router', sub: 'Task-based routing', kind: 'llm', tags: ['OpenAI', 'Claude', 'Groq'] },
      { label: '3 Agents', sub: 'Curator · Research · Studio', kind: 'agent' },
      { label: '6 Platforms', sub: 'Formatted & published', kind: 'output' },
    ],
  },
  'bima-buddy-advanced': {
    caption: 'A multilingual voice front-end over a policy vector store and a 50-factor claim classifier.',
    stages: [
      { label: 'User', sub: 'Voice / text · 10 languages', kind: 'input' },
      { label: 'Voice Pipeline', sub: 'Streaming ASR + TTS', kind: 'llm', tags: ['Regional LMs', '95% ASR'] },
      { label: 'Policy Vector Store', sub: '50+ policies → one schema', kind: 'store' },
      { label: 'Claim Classifier', sub: '50+ factor model', kind: 'llm', tags: ['85% accuracy'] },
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
      { label: 'Publish', sub: 'Free, full-syllabus', kind: 'output' },
    ],
  },
  'concept-forge': {
    caption: 'A 4-factor mastery model reads a prerequisite DAG to route IRT-calibrated practice.',
    stages: [
      { label: 'Student Signals', sub: 'Performance · accuracy · difficulty · recency', kind: 'input' },
      { label: 'Mastery Model', sub: '4-factor score', kind: 'engine' },
      { label: 'Prerequisite DAG', sub: 'Blocking-concept detection', kind: 'store' },
      { label: 'Adaptive Selector', sub: 'IRT-calibrated difficulty', kind: 'engine' },
      { label: 'Targeted Practice', sub: 'Real-time adjustment', kind: 'output' },
    ],
  },
};
