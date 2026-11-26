// Single source of truth for every project shown on the site.
//
// tier     flagship | product | research | heritage   — drives grouping on /work
// status   live (public URL) | private (invite-only or private deployment) | source (repo only)
// shipped  YYYY-MM of the last production deploy. Overridden at build/revalidate
//          time by the Vercel API when VERCEL_API_TOKEN is set (see src/lib/vercel.js).
// vercel   Vercel project name used for that lookup.
//
// Only put a number here if the product itself can show where it comes from.
export const PROJECTS = [
  {
    id: 'stock-analyst',
    name: 'StockAnalyst',
    tagline: 'Forensic screening workbench for Indian equities',
    description: 'Reads company filings the way a forensic accountant does — cash against profit, pledge against promise, what the auditor did next. It outputs parameters and flags, never recommendations, and every figure traces to the filing line it came from.',
    tier: 'flagship',
    domain: 'Finance',
    status: 'live',
    shipped: '2026-09',
    vercel: 'stockanalyst',
    url: 'https://stockanalyst-xi.vercel.app',
    repo: null,
    screenshot: '/screenshots/stock-analyst/screener.png',
    gallery: [
      { src: '/screenshots/stock-analyst/screener.png', caption: 'The screen: gate status first, metrics second. Vetoed companies stay listed with the reason, and the banner states when the analysis ran and how stale prices are.' },
      { src: '/screenshots/stock-analyst/valuation.png', caption: 'Reverse DCF: the implied growth rate the market is pricing, with a 25-cell sensitivity grid instead of a target price.' },
      { src: '/screenshots/stock-analyst/forensic-gates.png', caption: 'Forensic gates, each tied to a section of the framework. UNKNOWN is shown as its own state and never counted as a pass.' },
      { src: '/screenshots/stock-analyst/working-paper.png', caption: 'A company working paper: how many metrics could be computed, over how many periods, and which governance gates still lack data.' },
    ],
    stack: ['Next.js', 'NSE XBRL ingest', 'YAML metric registry', 'Append-only fact store'],
    highlights: [
      { value: '75', label: 'metrics declared in YAML' },
      { value: '13', label: 'forensic gates, 6 of them vetoes' },
      { value: '66', label: 'NSE large-caps covered' },
      { value: '27,314', label: 'financial facts, as filed' },
    ],
    narrative: {
      challenge: 'Screeners give away the arithmetic. What they do not give you is a reason to distrust a number — or a record you could hand to a reviewer.',
      solution: 'A workbench where forensic gates run before the score and outside it, every metric carries a state as well as a value, and each figure opens to its formula, inputs and source filing.',
    },
    features: [
      {
        name: 'Vetoes, not low scores',
        desc: 'Gates run before the score and outside it, so a strong return on capital cannot outvote an auditor who resigned mid-term.',
      },
      {
        name: 'Every number opens',
        desc: 'Hover any figure for the formula, the resolved inputs, the caveat attached to the definition, and the filing it came from.',
      },
      {
        name: 'Sector routing',
        desc: 'Banks and NBFCs get their own metric and gate packs. Ratios that are meaningless on a lending balance sheet are absent, not zero.',
      },
    ],
    caseStudy: {
      problem: 'Ratios are a commodity; judgment about them is not. A company can grow profit for five years while collecting less and less cash, and a conventional score will happily average that red flag away against a good multiple. Most tools also fill a missing input with zero and move on — which is how a bank ends up ranked at the bottom of a list it should never have appeared on.',
      solution: 'A screening workbench built for the person who has to defend the file. Thirteen forensic gates run before the score and outside it; six are vetoes that cap the verdict and say why, naming the figures that fired them. Every metric carries one of four states — computed, not applicable, not computable, or stale — and the three non-computed states render and sort differently from real values. There is no target-price field anywhere in the valuation module, the API or the interface: the output is implied expectations with a sensitivity range.',
      architecture: 'Financial results are parsed straight from NSE XBRL filings into an append-only fact store, where a restatement is a new row and a database trigger rejects updates — so any past date can be replayed as it was known then. Seventy-five metrics are declared in a YAML registry. A sector router sends each company to its metric and gate pack, and thresholds resolve to percentiles within the sector pack. Each analysis run is stamped, and the screen says when it ran and how old its prices are.',
      hardParts: [
        'Keeping missing data honest: an empty cell is a finding, so absent values never sort as small numbers and never wear a warning colour.',
        'Point-in-time correctness — answering what was known on a past date, before a restatement.',
        'Sector routing, so a bank is read on its standalone entity with banking metrics rather than as a manufacturer with different numbers.',
        "Trend signals such as pledge rising four consecutive quarters, when the exchange publishes only today's position.",
      ],
      decisions: [
        {
          choice: 'Gates are vetoes that sit outside the score',
          why: 'A cheap multiple should never be able to average away an auditor resignation or a widening cash-profit gap.',
          cost: 'One failed gate caps an otherwise attractive company, so every threshold has to be justified by the framework.',
        },
        {
          choice: 'No target price anywhere in the system',
          why: 'An implied growth rate is a claim a reader can argue with; a single price hides how sensitive it is to two assumptions.',
          cost: 'Readers who want one number get a range and a grid instead.',
        },
        {
          choice: 'Four metric states instead of a value or zero',
          why: 'Computed, not applicable, not computable and stale mean different things and must not sort together.',
          cost: 'Every table, sort and chart has to handle four states, not one.',
        },
        {
          choice: 'Append-only facts, enforced by a database trigger',
          why: 'Any past date can be replayed exactly as it was known, before restatements.',
          cost: 'Restatements add rows rather than replacing them, and every query has to pick the right as-of version.',
        },
      ],
      outcomes: [
        '66 NSE large-caps across four sector packs',
        '27,314 financial facts and 197,431 price rows loaded, with 12 years of daily history',
        '1,379 governance events classified from exchange announcements back to 2015',
        'Reverse DCF reported as implied growth with a 25-cell sensitivity grid, never a point estimate',
      ],
      benchmarks: [
        { metric: 'Metric registry', value: '75', detail: 'Metrics declared in YAML, each with formula and caveat' },
        { metric: 'Forensic gates', value: '13', detail: 'Six are vetoes that cap the verdict' },
        { metric: 'Financial facts', value: '27,314', detail: 'As filed, append-only, point-in-time' },
        { metric: 'Governance events', value: '1,379', detail: 'Auditor and divergence events since 2015' },
      ],
    },
  },
  {
    id: 'thermotwin',
    name: 'ThermoTwin AI',
    tagline: 'Pedestrian thermal-comfort simulator for Downtown Seattle',
    description: 'Simulates how shade and pavement choices change what a pedestrian actually feels — a measured heat field, real SOLWEIG physics, and a sub-second machine-learning surrogate. Built for the FortyGuard Hackathon 2026.',
    tier: 'flagship',
    domain: 'Climate & Energy',
    status: 'live',
    context: 'FortyGuard Hackathon 2026',
    shipped: '2026-08',
    vercel: 'fortyguard-thermotwin',
    url: 'https://fortyguard-thermotwin.vercel.app',
    repo: null,
    screenshot: '/screenshots/thermotwin/landing.png',
    gallery: [
      { src: '/screenshots/thermotwin/landing.png', caption: 'The headline finding up front: surface temperature and pedestrian UTCI move in opposite directions under reflective pavement.' },
      { src: '/screenshots/thermotwin/pipeline.png', caption: 'The four-step chain the simulator runs: lock the site, drape the measured field, run the physics, answer the slider through the surrogate.' },
    ],
    stack: ['Next.js', 'FastAPI', 'Cloud Run', 'LightGBM', 'SOLWEIG', 'DuckDB'],
    highlights: [
      { value: '0.992', label: 'R² of the surrogate on held-out data' },
      { value: '114', label: 'measured heat tiles on a 100 m grid' },
      { value: '1,733', label: 'real building footprints' },
      { value: '< 1 s', label: 'per what-if scenario' },
    ],
    narrative: {
      challenge: 'Reflective pavement lowers surface temperature — and bounces that radiation onto the person standing on it. Dashboards report the first number and miss the second.',
      solution: 'A simulator that drapes a measured heat field over real buildings, runs SOLWEIG physics to pedestrian-level UTCI, and answers what-if sliders in under a second through a LightGBM surrogate.',
    },
    features: [
      {
        name: 'The albedo trap, shown',
        desc: 'Raise pavement albedo without adding shade and the surface cools while pedestrian UTCI rises. The tool reports both numbers side by side.',
      },
      { name: 'Measured, not typed in', desc: 'Every temperature, UTCI value and R² comes from a measurement, a simulation or a cited constant.' },
      { name: 'Instant what-ifs', desc: 'Move a slider and the surrogate, trained on the physics chain, responds in under a second.' },
    ],
    caseStudy: {
      problem: 'Cool pavement is not cool for the person standing on it. Reflective coatings drop surface temperature and reflect that radiation onto pedestrians — field measurements put the midday effect at +4.5 to 5.8°F in mean radiant temperature (Middel & Vanos, Nature Communications, 2023). Commercial heat dashboards report surface temperature, so an intervention that makes people hotter can be scored as a win.',
      solution: "A thermal twin of Downtown Seattle that reports both numbers. A measured heat field is draped over real extruded building geometry, a physics chain computes shadows and six-directional mean radiant temperature through to pedestrian UTCI, and a surrogate model trained on that physics makes the result interactive. At albedo 0.90 with no added canopy, the tool's own physics chain shows pavement surface falling 4.6°F while pedestrian UTCI rises 1.3°F.",
      architecture: 'The site — 1.57 km² of Downtown Seattle — is locked using Overture Maps data queried with DuckDB. A 114-tile measured heat field from the FortyGuard Heatmap API is laid over 1,733 building footprints at their measured heights. SOLWEIG handles shadow casting and mean radiant temperature. A LightGBM surrogate trained on those runs serves the sliders. The front end is Next.js and React; the API is FastAPI on Cloud Run, with the baseline cached once so simulation calls never go back to the upstream API.',
      hardParts: [
        'Running real radiation physics instead of a shortcut, then making it fast enough to feel interactive.',
        'Training a surrogate that stays faithful to the physics — 0.992 R² on held-out data.',
        'Picking the hard site: at 47.6°N the summer-noon sun sits near 66°, so shadows run long and the shade-versus-albedo trade-off is sharper than in a heat-adapted city.',
        'A no-dummy-data rule: nothing in the running tool is a typed-in number.',
      ],
      decisions: [
        {
          choice: 'Real radiation physics, with a learned surrogate on top',
          why: 'A heuristic would have reproduced the dashboard mistake; SOLWEIG captures the reflected radiation that makes the albedo trap visible.',
          cost: 'The physics runs have to be generated up front, and the sliders answer from an approximation (0.992 R² held-out) rather than a fresh run.',
        },
        {
          choice: 'Report surface temperature and pedestrian UTCI side by side',
          why: 'The point of the tool is that the two can disagree; showing one would hide the finding.',
          cost: 'A busier result panel that asks the reader to compare two numbers.',
        },
        {
          choice: 'Cache the measured baseline once',
          why: 'Simulation calls never go back to the upstream heat API, so the tool stays fast and within quota.',
          cost: 'The baseline is a snapshot, not a live feed.',
        },
      ],
      outcomes: [
        'Shows the surface-versus-pedestrian reversal at a real design point',
        'Result is directionally consistent with published field measurements',
        'Sub-second scenario response from the surrogate',
        'Hackathon entry, deployed and publicly usable',
      ],
      benchmarks: [
        { metric: 'Surrogate fit', value: '0.992 R²', detail: 'LightGBM against the physics chain, held-out' },
        { metric: 'Measured field', value: '114 tiles', detail: '100 m grid from the FortyGuard Heatmap API' },
        { metric: 'Building geometry', value: '1,733', detail: 'Real footprints at measured heights' },
        { metric: 'Study area', value: '1.57 km²', detail: 'Downtown Seattle' },
      ],
    },
  },
  {
    id: 'skillpilot',
    name: 'SkillPilot',
    tagline: 'Private command centre for AI/ML freelancers',
    description: 'Pulls AI/ML gigs from job boards and freelance marketplaces, scores each for reliability, ranks them against your own skill profile, and drafts tailored proposals with Claude. Built for a private group of 25–30 practitioners.',
    tier: 'flagship',
    domain: 'AI Tooling',
    status: 'private',
    context: 'Live as “AI/ML Freelance Hub”',
    shipped: '2026-07',
    vercel: 'skillpilot',
    url: 'https://skillpilot-mauve.vercel.app',
    repo: null,
    screenshot: '/screenshots/skillpilot/ranker.png',
    gallery: [
      { src: '/screenshots/skillpilot/ranker.png', caption: 'The personal ranker: a match score broken down into skill overlap, rate alignment and recency, with the matched skills listed.' },
      { src: '/screenshots/skillpilot/proposals.png', caption: 'The proposal generator: three Claude-drafted variants per job, tuned to the platform’s style and capped per member per day.' },
      { src: '/screenshots/skillpilot/modules.png', caption: 'Eight modules in one private tool, from daily ingestion to group intelligence.' },
    ],
    stack: ['Next.js', 'Claude', 'Multi-source ingestion', 'Scoring engine'],
    highlights: [
      { value: '79', label: 'skills across 10 clusters' },
      { value: '0–100', label: 'reliability score from 20+ signals' },
      { value: '3', label: 'proposal variants per job' },
      { value: '9', label: 'stages in the application tracker' },
    ],
    narrative: {
      challenge: 'AI/ML freelancers hunt across ten job boards, most listings are irrelevant or unreliable, and every proposal starts from a blank page.',
      solution: 'One private tool that ingests gigs daily, scores each listing for trust, ranks it against your rated skills and target rate, and generates platform-tuned proposals with Claude.',
    },
    features: [
      {
        name: 'Skill-weighted matching',
        desc: '60% skill overlap weighted by self-rated proficiency, 20% rate alignment, 20% recency decay — with a hard cap when you match under 40% of required skills.',
      },
      { name: 'Reliability scoring', desc: 'A 0–100 trust score on every listing from 20+ signals, with scam patterns flagged automatically.' },
      {
        name: 'Proposal generator',
        desc: "Three inputs produce concise, standard and detailed variants tuned to each platform's style, limited to 15 generations a day per member.",
      },
    ],
    caseStudy: {
      problem: 'Finding freelance AI/ML work means checking many boards daily, filtering out listings that are irrelevant, underpaid or outright scams, and then writing a proposal from scratch for each one. Generic job boards rank by keyword, not by whether a specific person would win the work at their rate.',
      solution: "A private command centre for a closed group. Gigs are ingested daily, deduplicated and scored before anyone sees them. The feed is a personal ranker rather than a job board: each listing is scored against the member's own skill ratings and target rate. A proposal generator, a nine-stage application tracker, an upskilling roadmap ranked by jobs unlocked times average rate, and anonymised group win data sit on top.",
      architecture: 'Source adapters pull listings from job boards and freelance marketplaces on a schedule, then deduplicate and filter them for relevance. A reliability scorer assigns each listing a 0–100 trust score. A matching engine combines skill overlap, rate alignment and recency decay per member. Claude generates proposals under platform-specific style rules. Application outcomes are aggregated and anonymised before any group statistic is shown.',
      hardParts: [
        'Keeping ingestion alive as sources change or shut off — adapters have had to be repaired and new marketplaces added.',
        'Ranking by fit rather than keywords, including a hard gate so weak matches cannot float up on rate alone.',
        'Enforcing proposal quality by rule: a hook in the first sentence, fixed length bands, no filler.',
        "Sharing collective signal — win rates, agreed rates, platform rankings — without exposing any member's individual data.",
      ],
      decisions: [
        {
          choice: 'A hard cap when a member matches under 40% of required skills',
          why: 'Without it, a high rate or a fresh posting could float a job the member would not win.',
          cost: 'Some well-paid stretch jobs rank lower than a member might want.',
        },
        {
          choice: 'Claude drafts proposals; it does not choose jobs',
          why: 'Ranking stays explainable and rule-based; the model does the one job it is good at.',
          cost: 'Generation is capped at 15 a day per member to keep cost and quality in check.',
        },
        {
          choice: 'Group statistics are aggregated and anonymised before display',
          why: 'Members share win rates and agreed rates only if no individual can be identified.',
          cost: 'Members learn from group trends rather than from each other’s individual applications.',
        },
      ],
      outcomes: [
        'Eight integrated modules, from discovery to tracked outcome',
        '79 skills in 10 clusters, each self-rated 1–5',
        '52 free courses mapped to skill gaps in the roadmap',
        '10 platforms profiled with setup guides, red flags and member reviews',
      ],
      benchmarks: [
        { metric: 'Match weighting', value: '60 / 20 / 20', detail: 'Skill overlap, rate alignment, recency decay' },
        { metric: 'Reliability score', value: '0–100', detail: 'From 20+ signals per listing' },
        { metric: 'Proposal variants', value: '3', detail: 'Concise, standard and detailed' },
        { metric: 'Application stages', value: '9', detail: 'Saved through to Won' },
      ],
    },
  },
  {
    id: 'core-pragya-advanced',
    name: 'CorePragya',
    tagline: 'AI Knowledge Base with Multi-Agent Research & Writing',
    description: 'Transform articles, emails, and PDFs into an intelligent knowledge base with AI-curated trending feeds, deep insights, instant Q&A, and a multi-agent content creation studio.',
    tier: 'flagship',
    domain: 'AI Tooling',
    status: 'live',
    shipped: '2026-07',
    vercel: 'core-pragya-advanced',
    url: 'https://core-pragya-advanced.vercel.app',
    repo: 'https://github.com/svasikarla/CorePragyaAdvanced',
    screenshot: '/screenshots/core-pragya-advanced/dashboard.png',
    tour: true,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'OpenAI', 'Claude', 'Groq'],
    gallery: [
      { src: '/screenshots/core-pragya-advanced/research.png', caption: 'Research configuration: pick the provider and model per run, choose a depth, and optionally search the saved knowledge base before the web.' },
      { src: '/screenshots/core-pragya-advanced/content-studio.png', caption: 'Content Studio: one topic, several target formats drafted in parallel, each in a chosen tone.' },
      { src: '/screenshots/core-pragya-advanced/knowledge-base.png', caption: 'The knowledge base: saved articles, emails and pages, tagged by topic and searchable.' },
    ],
    narrative: {
      challenge: 'Personal knowledge from articles, feeds, and PDFs is siloed — and the loop from curation to multi-platform publishing is a manual, full-time effort.',
      solution: 'Three coordinated AI agents: a Curator that personalizes feeds, a Research Agent that combines saved knowledge with web sources into structured reports, and a Content Studio that drafts for seven publishing formats.',
    },
    features: [
      { name: 'AI-Curated Feed', desc: 'Ranks RSS articles against your interest profile.' },
      { name: 'Content Studio', desc: 'Drafts one topic for several formats at once — Medium, LinkedIn, X, Substack, Dev.to and blog — in a chosen tone.' },
      { name: 'Research Agent', desc: 'Runs at three depths, searches your knowledge base first if asked, and returns a structured report.' },
    ],
    caseStudy: {
      problem: "Personal knowledge from articles, feeds, emails, and PDFs is fragmented across tools that don't talk to each other. Note apps store text; bookmark managers store URLs; reader apps store articles. None of them understand what you're trying to learn, and none can take the next step — synthesize, write, or publish. The full loop from input to output is broken.",
      solution: 'Three AI agents in one workspace. A Curator that ranks RSS feeds against an interest profile. A Research Agent that can search your saved knowledge before the web and returns a structured report. A Content Studio that drafts one topic for several publishing formats in parallel. A personal RAG bot answers questions from everything you have saved.',
      architecture: 'Next.js + TypeScript on Supabase. Each research run picks its provider and model — Anthropic, OpenAI or Groq — and a depth from a quick overview to a five-sub-topic deep dive. Vector embeddings give semantic recall over the knowledge base, and an RSS ingestion pipeline deduplicates incoming articles.',
      hardParts: [
        'Multi-agent coordination — Curator, Research, and Studio agents share context without stepping on each other.',
        'Building a personalization model that learns from sparse interest signals.',
        'Writing one topic for seven format conventions — length, tone and structure — without seven separate prompts drifting apart.',
      ],
      outcomes: [
        'Research at three depths, from a two-minute overview to a five-sub-topic deep dive',
        'Provider and model chosen per run across Anthropic, OpenAI and Groq',
        'Seven output formats: Medium, LinkedIn post and article, X thread, Substack, Dev.to and blog',
        'A personal RAG bot over the saved knowledge base',
      ],
      benchmarks: [
        { metric: 'Agents', value: '3', detail: 'Curator, Research and Content Studio' },
        { metric: 'LLM providers', value: '3', detail: 'Anthropic, OpenAI and Groq, selectable per run' },
        { metric: 'Output formats', value: '7', detail: 'From an X thread to a Dev.to tutorial' },
        { metric: 'Research depths', value: '3', detail: 'Quick overview, standard, deep dive' },
      ],
    },
  },
  {
    id: 'nlsql-pro',
    name: 'NLSQL Pro',
    tagline: 'Natural Language to SQL Database Query Engine',
    description: 'Turns plain-English questions into read-only SQL for PostgreSQL, MySQL, SQLite and SQL Server, with a 24-hour schema cache, a Business Glossary for domain terms, and a memory of validated queries.',
    tier: 'flagship',
    domain: 'AI Tooling',
    status: 'live',
    shipped: '2026-04',
    vercel: 'nlsql-pro',
    url: 'https://nlsql-pro.vercel.app',
    repo: null,
    screenshot: '/screenshots/nlsql-pro/query.png',
    tour: true,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Claude', 'Vector Embeddings'],
    narrative: {
      challenge: "Non-technical stakeholders can't query their own data without SQL expertise, creating a permanent dependency on the engineering team.",
      solution: 'NL-to-SQL engine with a 24-hour schema cache, Business Glossary term mapping, a memory of validated queries, and prompt-injection screening against 30+ known patterns before anything reaches the database.',
    },
    features: [
      {
        name: 'Domain vocabulary',
        desc: 'A Business Glossary maps the words people use to the columns that exist; Golden Query Memory reuses queries a user has already validated.',
      },
      { name: 'Schema cache', desc: 'Schemas are cached for 24 hours, so a question does not pay to re-read the database structure every time.' },
      {
        name: 'Guardrails first',
        desc: 'Prompt-injection screening against 30+ known patterns, and generated SQL runs read-only.',
      },
    ],
    caseStudy: {
      problem: "Most NL-to-SQL demos work in clean test schemas and fail under three production realities: schema drift, business vocabulary that doesn't match column names, and adversarial users probing for jailbreaks. The result is tools that are pitched to non-technical users but unsafe to put in front of them.",
      solution: 'An NL→SQL engine designed around the failure modes that sink demo-grade tools. A 24-hour schema cache absorbs drift without re-reading the database on every question. A Business Glossary lets users speak in domain terms. Golden Query Memory reuses queries a user has already validated. Prompt-injection screening runs before the model sees the question, and generated SQL is executed read-only.',
      architecture: 'Next.js + TypeScript on Supabase. Claude translates intent into SQL. Vector embeddings power the glossary and query memory. Dialect adapters generate SQL for PostgreSQL, MySQL, SQLite and SQL Server.',
      hardParts: [
        'Screening 30+ prompt-injection patterns without rejecting legitimate complex questions.',
        'Keeping answers correct when the schema changes under a cached copy.',
        'Generating dialect-correct SQL for four database engines from one question.',
      ],
      outcomes: [
        'Four database engines: PostgreSQL, MySQL, SQLite and SQL Server',
        'Prompt-injection screening and read-only execution on every query',
        'Business Glossary and Golden Query Memory close the gap between user vocabulary and schema',
        'Query history and dashboards built into the app',
      ],
      benchmarks: [
        { metric: 'Database engines', value: '4', detail: 'PostgreSQL, MySQL, SQLite and SQL Server' },
        { metric: 'Injection patterns', value: '30+', detail: 'Screened before the model sees the question' },
        { metric: 'Schema cache', value: '24 h', detail: 'Absorbs drift without re-reading on every query' },
        { metric: 'Execution', value: 'Read-only', detail: 'Generated SQL cannot modify data' },
      ],
    },
  },
  {
    id: 'society-finance',
    name: 'Society Finance',
    tagline: 'Billing, receipts and audited accounts for housing societies',
    description: "Replaces the treasurer's spreadsheet for an apartment association: occupancy-based billing, gap-free numbered receipts, expenses, and year-end accounts, all derived from one append-only ledger.",
    tier: 'flagship',
    domain: 'Finance',
    status: 'private',
    shipped: '2026-09',
    vercel: 'mahatiwelfaresociety',
    url: null,
    repo: null,
    screenshot: '/screenshots/society-finance/landing.png',
    gallery: [
      { src: '/screenshots/society-finance/landing.png', caption: 'A phone-first overview for the treasurer: funds on hand, outstanding dues, collection progress and occupancy.' },
      { src: '/screenshots/society-finance/features.png', caption: 'The financial year end to end: billing, numbered receipts, the collection register, expenses, statements, defaulter aging and imports.' },
      { src: '/screenshots/society-finance/controls.png', caption: 'The controls, stated as product promises: append-only records, one ledger, roles in the database, an automatic audit trail.' },
    ],
    stack: ['Next.js', 'Append-only ledger', 'Database-enforced rules', 'Excel & PDF export'],
    highlights: [
      { value: '1', label: 'ledger every balance derives from' },
      { value: '0', label: 'edits or deletes — corrections are reversals' },
      { value: '3', label: 'roles enforced in the database' },
      { value: '4', label: 'defaulter aging buckets' },
    ],
    narrative: {
      challenge: 'Housing-society money runs on trust between neighbours, but it is usually kept in a spreadsheet that anyone can quietly change.',
      solution: 'A mobile-first finance system where every balance derives from one append-only ledger, corrections are reversals, and the rules are enforced by the database rather than by convention.',
    },
    features: [
      {
        name: 'Occupancy-based billing',
        desc: "Each month's dues are generated from effective-dated rates for occupied and vacant flats, so past bills stay reproducible.",
      },
      {
        name: 'Numbered receipts',
        desc: 'Cash, UPI, bank transfer or cheque. Oldest dues clear first, overpayment sits as advance credit, and receipt numbers are gap-free for audit.',
      },
      {
        name: 'Statements and year-end accounts',
        desc: 'Monthly statements reconciled to the ledger to the paise, plus Income & Expenditure, fund movements and a Balance Sheet.',
      },
    ],
    caseStudy: {
      problem: 'An apartment association collects maintenance from every flat, spends from cash, bank and a restricted corpus fund, and has to present accounts to members and an auditor each year. In a spreadsheet, cash drifts from the books, receipts can be renumbered, and nobody can reproduce what a given month looked like a year later.',
      solution: 'One system for the financial year: billing, collection, spending, and the reports that close the books. The treasurer works from a phone-first collection register, or uploads a whole month in one go. Records are append-only, every financial change is written to an audit trail automatically, and prior spreadsheet years are imported as read-only archives.',
      architecture: 'A single account ledger is the source every balance is derived from, so cash cannot drift from the books. Bills are generated from effective-dated rates. Payments allocate oldest-dues-first with advance credit. Role-based access for treasurer, committee and auditor is enforced in the database, as is the rule that a corpus withdrawal needs a committee-approval note. Bulk imports preview first and commit all-or-nothing.',
      hardParts: [
        'Reproducibility: any past month must regenerate exactly, even after rates and occupancy change.',
        'Gap-free receipt numbering alongside reversal-only corrections.',
        'Putting the controls in the database, not the interface, so they cannot be bypassed.',
        'Year-end reporting — Income & Expenditure, fund movements and a Balance Sheet on a receivables basis.',
      ],
      decisions: [
        {
          choice: 'Corrections are reversals, never edits or deletes',
          why: 'Any month can be regenerated exactly, and an auditor can see every change that was made.',
          cost: 'Mistakes stay visible as a pair of entries, and the ledger grows with every correction.',
        },
        {
          choice: 'Every balance is derived from one ledger',
          why: 'Cash cannot drift from the books, because there is no second copy to drift.',
          cost: 'Balances are computed rather than read, so reports do more work per request.',
        },
        {
          choice: 'Roles and approvals enforced in the database',
          why: 'A bug or a hand-crafted request cannot skip the corpus-withdrawal approval.',
          cost: 'Rule changes need a database migration, not just an interface change.',
        },
      ],
      outcomes: [
        "Invitation-only access, granted by the society's treasurer",
        'Statements reconcile to the ledger to the paise',
        'Defaulters aged 0–30, 31–60, 61–90 and 90+ days',
        'Export to Excel or a print-ready PDF',
      ],
      benchmarks: [
        { metric: 'Source of truth', value: '1 ledger', detail: 'Every balance is derived, never stored twice' },
        { metric: 'Corrections', value: 'Reversals only', detail: 'No edits or deletes on financial records' },
        { metric: 'Access roles', value: '3', detail: 'Treasurer, committee and auditor, enforced in the database' },
        { metric: 'Reconciliation', value: 'To the paise', detail: 'Monthly statements against the ledger' },
      ],
    },
  },
  {
    id: 'concept-forge',
    name: 'ConceptForge',
    tagline: 'Adaptive Learning for IIT JEE',
    description: 'Personalized adaptive learning platform for IIT JEE students that tracks concept mastery, identifies blocking prerequisites, and serves targeted practice questions.',
    tier: 'product',
    domain: 'Education',
    status: 'live',
    shipped: '2026-07',
    vercel: 'concept-forge',
    url: 'https://concept-forge-iota.vercel.app',
    repo: null,
    screenshot: '/screenshots/concept-forge/dashboard.png',
    tour: true,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'AI'],
    narrative: {
      challenge: 'IIT JEE prep requires mastering thousands of interconnected concepts. Most platforms ignore prerequisite gaps — the actual reason students plateau.',
      solution: 'Adaptive engine scoring mastery from four live signals — performance, accuracy, difficulty, and recency decay — then serving prerequisite-targeted practice with real-time difficulty adjustment.',
    },
    features: [
      { name: 'Mastery Algorithm', desc: 'Calculates mastery using recent performance, overall accuracy, difficulty, and recency decay.' },
      { name: 'Intelligent Paths', desc: 'Automatically identifies blocking prerequisites and prioritizes weak concepts.' },
      { name: 'Adaptive Difficulty', desc: 'Questions dynamically adjust based on user performance and streak detection.' },
    ],
    caseStudy: {
      problem: "IIT JEE preparation requires mastering thousands of interconnected concepts across physics, chemistry, and math. Most prep platforms serve content linearly — chapter 1, then chapter 2 — ignoring the prerequisite gaps that actually block a student's progress. A student stuck on rotational dynamics doesn't need more rotational dynamics; they need angular momentum first.",
      solution: 'An adaptive learning engine that scores concept mastery from four signals — recent performance, overall accuracy, question difficulty, and recency decay. The engine maps a prerequisite DAG across the syllabus and automatically routes students to the blocking prerequisite when mastery stalls. Difficulty adjusts in real time based on streak.',
      architecture: 'Next.js + TypeScript on Supabase. Mastery is stored per user and per concept. The syllabus is encoded as a prerequisite graph, so a stalled concept can be traced back to the concept that blocks it. Question difficulty steps up or down with the student’s streak.',
      hardParts: [
        'Calibrating the 4-factor mastery model so it tracks real understanding, not just recent activity.',
        'Detecting blocking prerequisites without trapping students in remedial loops.',
        'Adjusting difficulty in real time without breaking the practice flow.',
      ],
      outcomes: [
        'Four-factor mastery scoring: performance, accuracy, difficulty, recency',
        'Auto-routing to prerequisite concepts when mastery stalls',
        'Adaptive difficulty with streak detection',
      ],
      benchmarks: [
        { metric: 'Mastery signals', value: '4', detail: 'Recent performance, overall accuracy, difficulty, recency decay' },
        { metric: 'Prerequisite routing', value: 'Graph', detail: 'Stalled concepts route to the prerequisite that blocks them' },
        { metric: 'Difficulty', value: 'Adaptive', detail: 'Steps with the student’s streak' },
      ],
    },
  },
  {
    id: 'us-insurance-details',
    name: 'InsureAI',
    tagline: 'AI policy analyst for US insurance documents',
    description: 'Transform complex insurance documents into actionable insights. Upload, analyze, and manage your policies with intelligent document processing, red flag detection, and coverage analysis.',
    tier: 'product',
    domain: 'Insurance',
    status: 'live',
    shipped: '2026-07',
    vercel: 'us-insurance-details',
    url: 'https://us-insurance-details.vercel.app',
    repo: null,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Fluent UI'],
    features: [
      { name: 'Document Processing', desc: 'Automatically extracts policy information from PDF, DOCX, and TXT documents using advanced OCR technology.' },
      {
        name: 'Red Flag Detection',
        desc: 'Identifies potential coverage gaps, exclusions, severity levels, and regulatory limitations that impact claims.',
      },
      { name: 'Policy Lifecycle Management', desc: 'Full lifecycle management to track premiums, deductibles, benefits, and carrier operations.' },
    ],
  },
  {
    id: 'igcse-student-guide',
    name: 'IGCSE Student Guide',
    tagline: 'Comprehensive IGCSE Grade 9-10 Learning Platform',
    description: 'A comprehensive learning platform for IGCSE Grade 9-10 students, featuring interactive flashcards, adaptive quizzes, and high-quality study materials designed to democratize exam prep.',
    tier: 'product',
    domain: 'Education',
    status: 'live',
    shipped: '2025-12',
    vercel: 'igcse-student-guide',
    url: 'https://igcse-student-guide.vercel.app',
    repo: 'https://github.com/svasikarla/IGCSEStudentGuide',
    screenshot: '/screenshots/igcse-student-guide/dashboard.png',
    tour: true,
    stack: ['React', 'TypeScript', 'Supabase'],
    narrative: {
      challenge: "Quality IGCSE exam prep sits behind paywalls, creating an access gap for students who can't pay for structured study resources.",
      solution: 'Automated pipeline delivering curriculum-aligned study cards, adaptive quizzes, and topic guides — with multi-step accuracy verification built in.',
    },
    features: [
      { name: 'Interactive Study Cards', desc: 'Fast, structured reviews across core IGCSE subjects.' },
      { name: 'Smart Revision Quizzes', desc: 'Adaptive quizzes with instant feedback to test comprehension.' },
      { name: 'Curated Topic Guides', desc: 'In-depth study guides aligned with the latest IGCSE syllabus standards.' },
    ],
    caseStudy: {
      problem: "Quality IGCSE Grade 9–10 exam prep is paywalled, leaving many students dependent on inconsistent free resources. The free content that exists is often factually wrong, off-syllabus, or shallow — and there's no scalable way for human authors to keep up with the breadth of subjects multiplied by curriculum updates.",
      solution: 'A fully automated content generation pipeline that produces curriculum-aligned study cards, adaptive quizzes, and topic guides — with multi-step accuracy verification baked in. The output is free, structured, and broad enough to cover the full IGCSE syllabus.',
      architecture: 'React + TypeScript on Supabase. Content pipeline runs in stages: syllabus mapping → generation → fact-check → adversarial review → publish. Adaptive quiz engine tracks per-student confidence and routes to weak areas.',
      hardParts: [
        'Multi-step factual verification that catches LLM hallucinations before publication.',
        'Mapping generated content to the latest official IGCSE syllabus revisions.',
        'Scaling content quality without scaling human review headcount.',
      ],
      outcomes: [
        'Free access to Grade 9–10 IGCSE prep',
        'Full subject coverage across core IGCSE syllabus',
        'Adaptive quizzes with instant feedback and confidence tracking',
      ],
      benchmarks: [
        { metric: 'Quality gates', value: '3', detail: 'Syllabus mapping → fact-check → adversarial review' },
        { metric: 'Grades', value: '9–10', detail: 'Core IGCSE subjects' },
        { metric: 'Study formats', value: '3', detail: 'Study cards, adaptive quizzes and topic guides' },
      ],
    },
  },
  {
    id: 'bima-buddy-advanced',
    name: 'BimaBuddy',
    tagline: 'AI-Powered Health Insurance Suite',
    description: 'Compare health insurance plans side by side, check a claim for document gaps before filing, and ask questions by voice in 10 Indian languages.',
    tier: 'product',
    domain: 'Insurance',
    status: 'live',
    shipped: '2025-11',
    vercel: 'bima-buddy-advanced',
    url: 'https://bima-buddy-advanced.vercel.app',
    repo: 'https://github.com/svasikarla/BimaBuddyAdvanced',
    screenshot: '/screenshots/bima-buddy-advanced/dashboard.png',
    tour: true,
    stack: ['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'AI'],
    narrative: {
      challenge: "Health insurance in India spans dozens of providers with no local-language accessibility — driving high claim rejection among users who don't understand their own coverage.",
      solution: 'An insurance assistant that normalises plans into one comparable view, checks a claim against its policy before filing, and answers by voice in 10 Indian languages.',
    },
    features: [
      { name: 'Claim Intelligence', desc: 'Checks a claim before filing: a document-gap checklist, similar past cases and an approval estimate.' },
      {
        name: 'Multilingual Voice Assistant',
        desc: 'Ask questions by voice in 10 Indian languages and get answers in the same language.',
      },
      { name: 'Plan comparison', desc: 'Individual, family and senior-citizen plans normalised into one view of premium and coverage.' },
    ],
    caseStudy: {
      problem: "Health insurance in India is fragmented across dozens of providers, each with opaque policy documents in English. For a population speaking 22+ official languages, this creates two compounding failures: people pick the wrong plan, and even when they pick correctly, they file claims that get rejected for procedural reasons they couldn't have predicted. The customer-service safety net is thin and language-blocked.",
      solution: 'Three integrated AI capabilities that meet users at their actual decision points. A comparison engine that normalises plans from different insurers into one schema. A claim check that flags missing documents and estimates approval before submission. A multilingual voice assistant in 10 Indian languages for people who would rather speak than read a policy.',
      architecture: 'Next.js + TypeScript front end on Supabase. A vector store supports semantic retrieval over policy text. The voice pipeline chains speech recognition, the assistant and speech synthesis per language.',
      hardParts: [
        "Reconciling insurers' inconsistent policy schemas into a single comparable structure.",
        'Handling speech across 10 Indian languages, including code-mixed speech.',
        'Modeling claim rejection in a domain where ground-truth data is partial and adversarial.',
      ],
      outcomes: [
        'Plan comparison across individual, family and senior-citizen plans',
        'Claim check with a document-gap checklist before filing',
        'Voice assistant in 10 Indian languages',
      ],
      benchmarks: [
        { metric: 'Languages', value: '10', detail: 'Indian languages in the voice assistant' },
        { metric: 'Plan types', value: '3', detail: 'Individual, family and senior-citizen' },
        { metric: 'Claim check', value: 'Pre-filing', detail: 'Document gaps flagged before submission' },
      ],
    },
  },
  {
    id: 'local-rag',
    name: 'LocalRAG',
    tagline: 'Local RAG for Private Documents',
    description: 'Private, on-device retrieval-augmented generation engine utilizing lightweight local models for secure, zero-cloud sensitive document analysis.',
    tier: 'product',
    domain: 'AI Tooling',
    status: 'source',
    shipped: null,
    url: null,
    repo: 'https://github.com/svasikarla/LocalRAG',
    stack: ['Python', 'LangChain', 'Local LLMs'],
    features: [
      { name: 'On-Device Inference', desc: 'Completely private execution ensuring sensitive data never leaves your environment.' },
      { name: 'Multi-Format Ingestion', desc: 'Seamlessly extract and chunk text from PDFs, DOCX, and plain text files.' },
      { name: 'Contextual Retrieval', desc: 'Vector search selects the passages that go into each prompt.' },
    ],
  },
  {
    id: 'wisecache-pro',
    name: 'WiseCache Pro',
    tagline: 'Production Knowledge Caching and Optimization',
    description: 'A semantic and exact-match caching layer for LLM applications, built to cut latency and token spend on repeated questions.',
    tier: 'product',
    domain: 'AI Tooling',
    status: 'source',
    shipped: null,
    url: null,
    repo: 'https://github.com/svasikarla/wisecachepro',
    stack: ['TypeScript', 'Node.js'],
    features: [
      { name: 'Semantic Caching', desc: 'Avoids redundant API calls by matching semantically equivalent queries using embeddings.' },
      { name: 'Exact Key Caching', desc: 'Exact string matches are answered from cache before any embedding is computed.' },
      { name: 'TTL & Eviction', desc: 'Entries expire and are evicted, so stale answers and memory growth stay bounded.' },
    ],
  },
  {
    id: 'ami-2-0-road-map',
    name: 'AMI 2.0 Roadmap',
    tagline: 'AMI 2.0 Strategic Grid Modernization Framework',
    description: 'A comprehensive strategic framework for utility service providers transitioning from AMI 1.0 to AMI 2.0, enabling real-time grid intelligence, AI-driven analytics, distributed edge computing, and NERC/FERC-compliant DER integration.',
    tier: 'research',
    domain: 'Climate & Energy',
    status: 'live',
    shipped: '2026-01',
    vercel: 'ami-2-0-road-map',
    url: 'https://ami-2-0-road-map.vercel.app',
    repo: null,
    stack: ['Next.js', 'TailwindCSS'],
    features: [
      { name: 'Grid-Edge Intelligence', desc: 'Distributed edge computing enabling real-time, sub-second processing directly at utility smart meters.' },
      {
        name: 'DER/EV Integration',
        desc: 'Bidirectional optimization platforms supporting rooftop solar, storage systems, and flexible EV charging loads.',
      },
      { name: 'Predictive Outage Management', desc: 'Advanced outage intelligence predicting equipment faults and optimizing field maintenance schedules.' },
    ],
  },
  {
    id: 'ai-roadmap',
    name: 'Oracle Utilities AI Briefing',
    tagline: 'Oracle Utilities AI Strategic Briefing',
    description: 'Interactive strategic briefing showcasing Oracle AI capabilities, competitive analysis, and architectural blueprints for energy and water utility systems.',
    tier: 'research',
    domain: 'Climate & Energy',
    status: 'live',
    shipped: '2026-02',
    vercel: 'ai-road-map',
    url: 'https://ai-road-map-rho.vercel.app',
    repo: 'https://github.com/svasikarla/AI_RoadMap',
    stack: ['HTML', 'CSS', 'Vanilla JS'],
    features: [
      { name: 'Competitive Intelligence', desc: 'Detailed comparison of utility AI solutions across top enterprise platforms.' },
      { name: 'Interactive Briefing', desc: 'Self-contained strategic briefing dashboard with accordion guides and tables.' },
      { name: 'Architectural Blueprints', desc: 'Technology selection matrices and technical reference systems for utilities.' },
    ],
  },
  {
    id: 'telugu-sahityam',
    name: 'Telugu Sahityam',
    tagline: 'Preserving Classical Telugu Literary Heritage',
    description: "Explore authentic moral and philosophical teachings of classical Telugu literature through Yogi Vemana's verses and Sumathi Shatakam, complete with original Telugu text, standard IAST transliterated guides, English translations, and modern contextual relevance.",
    tier: 'heritage',
    domain: 'Heritage',
    status: 'live',
    shipped: '2026-05',
    vercel: 'telugu-sahityam',
    url: 'https://telugu-sahityam.vercel.app',
    repo: null,
    stack: ['Next.js', 'TailwindCSS'],
    features: [
      { name: 'Authentic Telugu Text', desc: 'Original verses rendered in high-quality Unicode Telugu script alongside standard IAST transliteration.' },
      { name: 'Bilingual Study Guides', desc: 'Verse-by-verse English translation and structural breakdown preserving the poetic beauty.' },
      { name: 'Contemporary Relevance', desc: 'In-depth analysis mapping ancient literary wisdom to contemporary life situations.' },
    ],
  },
  {
    id: 'adi-shankaracharya',
    name: 'Adi Shankaracharya',
    tagline: 'Wisdom of Adi Shankaracharya and Advaita Vedanta',
    description: 'Comprehensive digital knowledge base dedicated to the timeless non-dual wisdom of Advaita Vedanta philosophy, featuring biographical accounts, sacred texts study, interactive learning paths, and a digital chant counter.',
    tier: 'heritage',
    domain: 'Heritage',
    status: 'live',
    shipped: '2025-12',
    vercel: 'adishankaracharysite',
    url: 'https://adishankaracharysite.vercel.app',
    repo: 'https://github.com/svasikarla/adishankaracharysite',
    stack: ['Next.js', 'TailwindCSS'],
    features: [
      { name: 'Sacred Texts Study', desc: 'Verse-by-verse translation and philosophical analysis of works like Bhaja Govindam and Atma Bodha.' },
      {
        name: 'Interactive Study Paths',
        desc: 'Guided educational journeys mapped from foundational concepts (Atman, Brahman, Maya) to advanced non-dual contemplation.',
      },
      { name: 'Digital Chant Counter', desc: 'An interactive practice tool designed for tracking mantra chanting and spiritual sadhana.' },
    ],
  },
  {
    id: 'gauthama-buddha',
    name: 'Gautama Buddha',
    tagline: 'Teachings and Philosophy of Gautama Buddha',
    description: 'Content platform dedicated to the life, teachings, and core philosophy of Gautama Buddha, featuring bilingual sutras, structured commentaries, and philosophical maps.',
    tier: 'heritage',
    domain: 'Heritage',
    status: 'live',
    shipped: '2025-12',
    vercel: 'gauthama-buddha',
    url: 'https://gauthama-buddha.vercel.app',
    repo: null,
    stack: ['Next.js', 'TailwindCSS'],
    features: [
      { name: 'Bilingual Sutras', desc: 'Verse-by-verse original translation alongside modern English explanations.' },
      { name: 'Structured Commentaries', desc: 'In-depth analytical reviews of classical Buddhist concepts (Four Noble Truths, Eightfold Path).' },
      { name: 'Philosophical Navigation', desc: 'Interactive guidance through spiritual pathways and teachings.' },
    ],
  },
];

export const TIERS = [
  {
    id: 'flagship',
    label: 'Flagship case studies',
    blurb: 'The six products that best show how I work, each with a full write-up.',
  },
  {
    id: 'product',
    label: 'More products',
    blurb: 'Shipped applications and tools across insurance, education and AI infrastructure.',
  },
  {
    id: 'research',
    label: 'Domain research',
    blurb: 'Strategy briefings for energy and water utilities.',
  },
  {
    id: 'heritage',
    label: 'Heritage library',
    blurb: 'Personal projects preserving classical Indian literature and philosophy.',
  },
];

export const DOMAINS = ['Finance', 'Climate & Energy', 'AI Tooling', 'Insurance', 'Education', 'Heritage'];

export const STATUS_LABELS = { live: 'Live', private: 'Invite-only', source: 'Source' };

export const FLAGSHIP_IDS = PROJECTS.filter((p) => p.tier === 'flagship').map((p) => p.id);

export function getProject(id) {
  return PROJECTS.find((p) => p.id === id) || null;
}

/** Key facts for a project: its own highlights, else its first benchmark tiles. */
export function getHighlights(project, max = 4) {
  if (project.highlights?.length) return project.highlights.slice(0, max);
  const b = project.caseStudy?.benchmarks || [];
  return b.slice(0, max).map((x) => ({ value: x.value, label: x.metric }));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-09' -> 'Sep 2026' */
export function formatShipped(ym) {
  if (!ym) return null;
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** Counts shown on the home and about pages — computed, never typed in. */
export function getPortfolioFacts(projects = PROJECTS) {
  const shipped = projects.map((p) => p.shipped).filter(Boolean).sort();
  const products = projects.filter((p) => p.tier === 'flagship' || p.tier === 'product');
  return {
    total: projects.length,
    products: products.length,
    flagships: projects.filter((p) => p.tier === 'flagship').length,
    live: products.filter((p) => p.status !== 'source').length,
    research: projects.filter((p) => p.tier === 'research').length,
    heritage: projects.filter((p) => p.tier === 'heritage').length,
    domains: new Set(products.map((p) => p.domain)).size,
    lastShipped: formatShipped(shipped[shipped.length - 1]),
  };
}

export const PROFILE = {
  name: 'Satish Vasikarla',
  brand: 'Vasikarla · AI',
  role: 'AI Product Engineer',
  headline: 'I build AI products end to end — from the data pipeline and the model to the interface people use.',
  // The technologies the shipped products are built with (see each project's stack).
  stack: ['Python', 'TypeScript', 'Next.js', 'React', 'FastAPI', 'PostgreSQL / Supabase', 'LightGBM', 'Claude · OpenAI · Groq'],
  bio: 'I design and ship full-stack products — forensic analytics, physics-backed simulation and LLM workflows — and build them so that every figure can be traced, reproduced or challenged.',
  specializations: ['Forensic analytics', 'Simulation & ML surrogates', 'LLM workflows', 'RAG & knowledge systems', 'NL→SQL', 'Auditable ledgers'],
  email: 'vasikarla.satish@outlook.com',
  location: 'India · UTC+5:30',
  github: 'https://github.com/svasikarla',
  // Set these to show them on the About page and in the contact section.
  linkedin: null,
  resume: null,
  availability: 'Open to AI product engineering roles and to freelance builds.',
};
