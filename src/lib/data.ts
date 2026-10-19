export interface ProjectType {
    title: string;
    slug: string;
    liveUrl?: string;
    year: number;
    description: string;
    role?: string;
    techStack: string[];
    thumbnail: string;
    longThumbnail: string;
    images: string[];
    sourceCode?: string;
}

export interface ExperienceType {
    title: string;
    company: string;
    duration: string;
    location?: string;
    points?: string[];
    skills?: string[];
    current?: boolean;
}

export const GENERAL_INFO = {
    name: 'Harshal Lade',
    firstName: 'Harshal',
    lastName: 'Lade',
    role: 'Software Engineer, AI & Data Platforms',
    tagline: 'I build AI systems and full-stack products that people can actually use.',
    email: 'harshal@harshallade.site',
    location: 'Mumbai, India',
    timezone: 'Asia/Kolkata',
    site: 'harshallade.site',
    resumeUrl: '/My_Resume.pdf',

    emailSubject: "Let's work on a project together",
    emailBody: 'Hi Harshal, I am reaching out to you because...',

    available: true,

    heroEyebrow: 'Full-stack engineer · Mumbai, India',
    heroStatement: 'Full-stack engineer who ships AI products end-to-end.',
    heroLead: 'LLM agent workflows, retrieval-augmented generation, data pipelines, and conversational assistants backed by FastAPI and React.',
    about: [
        'Software engineer building production LLM systems: agent pipelines, retrieval-augmented generation, multi-provider clients, and evaluation harnesses with prompt-schema contract tests.',
        'Product-minded full-stack engineer shipping user-facing AI features end to end: React/Next.js interfaces backed by FastAPI services, LLM workflows, and measurable evaluation loops.',
    ],
};

export const HERO_STATS: { label: string; value: number; suffix: string; source: string }[] = [
    { label: 'Full-stack apps shipped', value: 15, suffix: '+', source: 'freelance, 2024-25, self-reported' },
    { label: 'Data-processing time cut at BNP Paribas', value: 30, suffix: '%', source: 'internship, 2024' },
    { label: 'Daily users served', value: 500, suffix: '+', source: 'internship, 2024' },
    { label: 'AI & data systems built', value: 5, suffix: '', source: 'reference architectures below' },
];

export const CONTACT_FACTS: { label: string; value: string }[] = [
    { label: 'ENGINEER', value: 'Harshal Lade' },
    { label: 'BASE', value: 'Mumbai, IST (UTC+5:30)' },
    { label: 'LOCATIONS', value: 'Mumbai, Pune or Bangalore' },
    { label: 'OPEN TO', value: 'AI and data platform engineering roles' },
];

export const NAV_SECTIONS = [{ id: 'systems', label: 'systems' }, { id: 'work', label: 'work' }, { id: 'log', label: 'log' }, { id: 'stack', label: 'stack' }, { id: 'contact', label: 'contact' }] as const;

export interface FocusArea {
    id: string;
    title: string;
    line: string;
    seen: string[];
    href?: string;
}

export const FOCUS_AREAS: FocusArea[] = [
    { id: 'agents', title: 'Agent workflows', line: 'Multi-step LLM workflows with schema-validated outputs and a persistent history of every run.', seen: ['S-01'] },
    { id: 'retrieval', title: 'Retrieval (RAG)', line: 'Vector retrieval over document corpora that grounds answers and streams them to the client.', seen: ['S-01', 'S-04'] },
    { id: 'pipelines', title: 'Data pipelines', line: 'Scheduled ingestion with recoverable checkpoints, audit tables and containerised deploys.', seen: ['S-03', 'S-05'] },
    { id: 'evaluation', title: 'Evaluation and reliability', line: 'Prompt-schema contract tests, evaluation harnesses and runs you can repeat.', seen: ['S-02'] },
    { id: 'fullstack', title: 'Full-stack delivery', line: 'React and Next.js interfaces on FastAPI and Node services, shipped end to end.', seen: [], href: '#work' },
];

export const PRINCIPLES: { title: string; line: string; seen: string[] }[] = [
    { title: 'Validate every output', line: 'Model output is parsed against a schema before anything downstream trusts it.', seen: ['S-01'] },
    { title: 'Test prompts like contracts', line: 'Prompt and schema changes are checked by contract tests, not by eyeballing a sample.', seen: ['S-02'] },
    { title: 'Make runs repeatable', line: 'A run can be replayed from cached steps, which makes results auditable.', seen: ['S-02'] },
    { title: 'Checkpoint what can fail', line: 'Long jobs resume from a recoverable checkpoint instead of starting over.', seen: ['S-03'] },
    { title: 'Evaluate before shipping', line: 'Evaluation harnesses decide whether a change is better, not a hunch.', seen: ['S-02'] },
];

export interface CaseStudy {
    period: string;
    role: string;
    problem: string;
    built: string[];
    decisions: { title: string; body: string }[];
    results: { value: string; label: string; note: string }[];
}

export interface SystemType {
    id: string;
    slug: string;
    title: string;
    summary: string;
    stages?: string[];
    highlights: string[];
    stack: string[];
    caseStudy: CaseStudy;
}

export const SYSTEMS: SystemType[] = [
    {
        id: 'S-01',
        slug: 'research-agent-workflows',
        title: 'Research agent workflows',
        summary: 'Multi-step LLM agent workflows that research a domain, retrieve supporting evidence, validate outputs against schemas and persist every run.',
        stages: ['plan', 'retrieve', 'analyse', 'synthesise', 'validate', 'persist'],
        highlights: [
            'Vector retrieval over a document corpus',
            'Versioned prompts and schema-validated outputs',
            'Multi-provider LLM clients',
            'Persistent run history',
        ],
        stack: ['LangGraph', 'Vector DB', 'PostgreSQL', 'Gemini', 'OpenAI', 'Python'],
        caseStudy: {
            period: 'Bull AI · Sep 2025 to now',
            role: 'Software Engineer, AI & Data Platforms',
            problem: 'Equity research means reading market data, filings and annual reports for many companies and turning them into analysis people can act on. Doing it by hand does not scale, and a free-form LLM answer cannot be trusted or audited.',
            built: [
                'LangGraph workflows for Indian equities covering market analysis, financial projections and annual-report processing.',
                'Each run plans, retrieves evidence from a document corpus, analyses, synthesises and validates before anything is saved.',
                'Persistent state and run history, designed so a result can be traced back to the inputs and prompt versions that produced it.',
                'Clients for several LLM providers behind one interface.',
            ],
            decisions: [
                { title: 'Schema first', body: 'Every model output is parsed against a schema. A run that fails validation is rejected instead of being passed downstream.' },
                { title: 'Grounded in sources', body: 'Claims are tied to retrieved sources, so an analyst can check where a statement came from.' },
                { title: 'Benchmark the providers', body: 'Providers are compared on the same tasks, and point-in-time backtesting checks projections against what happened later.' },
                { title: 'Version the prompts', body: 'Prompts are versioned like code, so a change in output can be tied to a change in prompt.' },
            ],
            results: [{ value: '3', label: 'workflow families', note: 'market analysis, projections and annual reports' }],
        },
    },
    {
        id: 'S-02',
        slug: 'document-extraction-pipeline',
        title: 'Document extraction pipeline',
        summary: 'Extracts structured data from long documents through an auditable, repeatable multi-stage pipeline.',
        stages: ['retrieve', 'parse', 'discover', 'extract', 'validate'],
        highlights: [
            'Cached intermediate steps',
            'Contract tests for prompts and schemas',
            'Evaluation harnesses',
            'Repeatable runs for auditability',
        ],
        stack: ['Python', 'LangGraph', 'Pydantic', 'PostgreSQL'],
        caseStudy: {
            period: 'Bull AI · Sep 2025 to now',
            role: 'Software Engineer, AI & Data Platforms',
            problem: 'Segment-level revenue for listed Indian companies sits inside PDFs such as annual reports, results filings and presentations, often as scanned tables and charts. It has to be extracted for about 3,000 companies every quarter, and it has to be right.',
            built: [
                'A six-stage pipeline (retrieve, OCR, parse, discover, extract, validate) that works through about 3,000 listed companies across 18 to 19 sectors, one company at a time.',
                'It maintains roughly 5 to 7 years of quarterly segment-level revenue and related decision metrics for each company, fusing several data sources.',
                'The OCR backend underneath: self-hosted layout analysis turns each page into a semantic block graph, and only tables and charts go to a lightweight vision model.',
                'Extraction runs as an HTTP service with an engine pool, an admission queue, deadlines and graceful drain.',
            ],
            decisions: [
                { title: 'Send only what needs vision', body: 'Layout analysis decides which regions are tables or charts. Prose never reaches the vision model, which keeps cost and latency down.' },
                { title: 'Cache by content', body: 'OCR, vision and extraction results are content-addressed, so a rerun only redoes the steps whose inputs changed, and a run can be replayed from its stored artifacts.' },
                { title: 'Prompt changes are tested', body: 'Prompt and schema changes are checked by contract tests, and evaluation harnesses with tracing compare every change against a hand-checked sample.' },
                { title: 'Repair numbers, then validate', body: 'Strict output validation plus repair passes for periods, currency units and table totals. Cost and latency are recorded for every page.' },
            ],
            results: [
                { value: '~3,000', label: 'listed companies covered', note: 'across 18 to 19 sectors' },
                { value: '95 to 98%', label: 'extraction accuracy', note: 'against a hand-checked sample' },
                { value: '~30 s', label: 'per page', note: 'end-to-end extraction time' },
                { value: '~Rs 3,000', label: 'per million pages', note: 'extraction cost' },
            ],
        },
    },
    {
        id: 'S-03',
        slug: 'data-ingestion-services',
        title: 'Data ingestion services',
        summary: 'Scheduled ingestion and transform services that pull external data feeds into a relational store.',
        stages: ['ingest', 'transform', 'checkpoint', 'load'],
        highlights: [
            'Schedule-aware polling',
            'Recoverable checkpoints',
            'Audit tables',
            'Containerised cloud deployments',
        ],
        stack: ['Python', 'PostgreSQL', 'Docker', 'Cloud'],
        caseStudy: {
            period: 'Bull AI · Sep 2025 to now',
            role: 'Software Engineer, AI & Data Platforms',
            problem: 'Every downstream system depends on an accurate master list of listed companies and links to their filings. Exchange data changes daily, and some of it is only reachable through slow, paginated web pages.',
            built: [
                'A daily sync that downloads the latest company data from both Indian exchanges, shows what changed and then updates the master table in a relational store.',
                'A headless-browser scraper that walks paginated exchange search results to collect filing links.',
                'Market-cap rules that decide which companies stay in coverage.',
                'Scheduled, containerised jobs with checkpoints, so a long run can resume instead of starting over.',
            ],
            decisions: [
                { title: 'Diff before write', body: 'The sync computes and shows what changed before touching the database, so a bad upstream file is caught before it overwrites good data.' },
                { title: 'Plan for flaky pages', body: 'The scraper restarts its browser after crashes, retries failed pages and saves a screenshot of every error for debugging.' },
                { title: 'Resume after failure', body: 'Long jobs write checkpoints, so a failure picks up from the last good step.' },
            ],
            results: [],
        },
    },
    {
        id: 'S-04',
        slug: 'conversational-assistant',
        title: 'Conversational assistant',
        summary: 'A domain-focused assistant that grounds answers in documents and live data and streams responses to the client.',
        stages: ['resolve', 'lookup', 'rag', 'answer', 'stream'],
        highlights: [
            'Server-sent-event streaming API',
            'Document retrieval (RAG)',
            'Structured, chart-ready responses',
        ],
        stack: ['FastAPI', 'React', 'LangChain', 'Vector DB', 'Gemini'],
        caseStudy: {
            period: 'Bull AI · Sep 2025 to now',
            role: 'Software Engineer, AI & Data Platforms',
            problem: 'Visitors to the company website wanted quick answers about Indian companies (what a company does, how its numbers look, what its documents say) in a chat, not in a research report.',
            built: [
                'The backend of an India-focused financial copilot: company lookup, financial snapshots, document Q&A and chart-ready answers.',
                'A FastAPI service that streams answers to the client over server-sent events.',
                'Retrieval over company documents with vector search, with data in MongoDB.',
                'Integration into the company website chatbot.',
            ],
            decisions: [
                { title: 'Stream everything', body: 'Answers stream over SSE, so a response starts to appear immediately instead of after the whole answer is ready.' },
                { title: 'Answer in structure', body: 'Responses can carry chart-ready data, so the front end draws a chart instead of describing numbers in prose.' },
                { title: 'Ground in documents', body: 'Document questions are answered from retrieved passages, not from the model\'s memory.' },
            ],
            results: [{ value: '~9,000', label: 'active users', note: 'through the company website chatbot' }],
        },
    },
    {
        id: 'S-05',
        slug: 'batch-analysis-jobs',
        title: 'Batch analysis jobs',
        summary: 'Scheduled and webhook-triggered batch jobs for summarisation, comparison and chart generation.',
        stages: ['schedule', 'summarise', 'chart', 'store'],
        highlights: [
            'LLM batch processing',
            'Schedulers and webhooks',
            'Storage-backed chart generation',
        ],
        stack: ['Python', 'Gemini', 'Cloud'],
        caseStudy: {
            period: 'Bull AI · Sep 2025 to now',
            role: 'Software Engineer, AI & Data Platforms',
            problem: 'Some analysis does not need a chat. Every quarter there are earnings calls to summarise, competitors to compare and revenue charts to refresh, for many companies at once.',
            built: [
                'Three batch workflows on Vertex AI and Gemini: earnings-call summaries, competitor analysis and revenue visualisation.',
                'Runs start on a schedule or from a webhook.',
                'Generated summaries and charts are written to storage for the product to serve.',
            ],
            decisions: [
                { title: 'Batch, not chat', body: 'Jobs run offline in batches, which suits work with a natural schedule and lets results be checked before they are published.' },
                { title: 'Two kinds of trigger', body: 'Schedulers cover the regular cadence, and webhooks start a job as soon as new input arrives.' },
            ],
            results: [{ value: '3', label: 'batch workflows', note: 'concall summaries, competitor analysis and revenue charts' }],
        },
    },
];

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/loner2403' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/harshal-lade-a2a41b232/' },
];

export const EDUCATION = {
    school: 'Sardar Patel Institute of Technology',
    degree: 'B.Tech, Electronics and Telecommunication Engineering',
    location: 'Mumbai, India',
    period: 'Aug 2020 - Jun 2024',
};

export const RESUME_SKILL_GROUPS = [
    {
        label: 'AI / LLM',
        items: ['LangGraph', 'LangChain', 'RAG', 'LLM evaluation', 'Prompt engineering', 'Schema validation', 'Gemini', 'OpenAI', 'MiniMax', 'DeepSeek', 'Embeddings'],
    },
    {
        label: 'Languages',
        items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML5', 'CSS3'],
    },
    {
        label: 'Backend / Data',
        items: ['FastAPI', 'Node/Express', 'Hono', 'Spring Boot', 'REST APIs', 'Redis', 'MongoDB', 'Supabase/PostgreSQL', 'Qdrant', 'Prisma', 'Playwright'],
    },
    {
        label: 'Frontend / Cloud',
        items: ['React', 'Next.js', 'Tailwind CSS', 'Cloudflare Workers', 'Docker', 'AWS', 'GCP Cloud Run / Build', 'Git'],
    },
];

export const PROJECTS: ProjectType[] = [
    {
        title: 'VyaparDrishti',
        slug: 'vyapardrishti',
        year: 2026,
        description: `Photographed and handwritten supplier bills (including Hinglish and Devanagari) and spoken sales become one explainable stock-and-cash ledger, which then recommends what to reorder, where cash is trapped and how much short-term funding is needed.\n\nAI is used only where input is unstructured. Deterministic Python handles everything involving money: models extract structured events, while stock and finance arithmetic, reconciliation and confidence flags (smudged rates, total mismatches) are rule-based.\n\nAn evaluation harness (8 synthetic bills covering smudged, skewed, handwritten and mismatched cases, plus 14 voice clips) compared 7 models on parse rate, item mapping, totals and latency. The best model reached 100% bill-total and mismatch-flag accuracy and 86% correct stock movements on voice, at a median 10 to 15 s per bill.\n\nShipped as a FastAPI service with 22 endpoints, about 5,600 lines of Python and 262 tests across 24 files.`,
        role: 'Built for the Paytm Build for India AI Hackathon (AI for Small Businesses track).',
        techStack: ['Python', 'FastAPI', 'Sarvam AI', 'LLM evals'],
        thumbnail: '',
        longThumbnail: '',
        images: [],
    },
    {
        title: 'Thumbnail AI',
        slug: 'thumbnail-ai',
        liveUrl: '',
        year: 2024,
        description: `A credit-based SaaS for creating thumbnails. Background removal runs in the browser in a web worker, with an editor for text, effects and filters.\n\nClerk authentication with webhook-synced users, Razorpay checkout for credit packs (10 free credits on signup, Rs 10 per credit) and server-side credit deduction, plus landing, pricing and dashboard pages.`,
        role: `Sole developer: designed and built the full product: generation pipeline, template editor, and batch processing on Cloudflare infrastructure.`,
        techStack: [
            'Next.js',
            'TypeScript',
            'Prisma',
            'Clerk',
            'Razorpay',
            'AWS',
        ],
        thumbnail: '',
        longThumbnail: '',
        images: [],
        sourceCode: 'https://github.com/loner2403/thumbnailAI',
    },
    {
        title: 'Blog Platform',
        slug: 'medium-blog-clone',
        liveUrl: 'https://blog-ten-pi-91.vercel.app/',
        year: 2024,
        description: `A publishing platform with a JWT-authenticated Hono API on Cloudflare Workers: 12 REST endpoints for sign-up and sign-in, post CRUD and author profiles, on Prisma Accelerate and PostgreSQL. The React and Tailwind front end has a rich-text editor and sanitised rendering.\n\nZod validation schemas are shared between the front end and the API as a published npm package. 95+ PageSpeed score.`,
        role: `Full-stack developer: owned the entire lifecycle: Hono API on Cloudflare Workers, Prisma/PostgreSQL data layer, React frontend, and performance work to hit 95+ PageSpeed.`,
        techStack: [
            'Hono',
            'Cloudflare Workers',
            'React',
            'Prisma',
            'PostgreSQL',
        ],
        thumbnail: '/long/blog.png',
        sourceCode: 'https://github.com/loner2403/blog',
        longThumbnail: '/long/blog.png',
        images: [
            '/Images/blog-1.png',
            '/Images/blog-2.png',
        ],
    },
    {
        title: 'Resume Roaster',
        slug: 'resume-roaster',
        techStack: [
            'GPT-4',
            'Next.js',
            'PostgreSQL',
            'Prisma',
            'Tailwind CSS',
        ],
        thumbnail: '/long/cold-email-gen.png',
        longThumbnail: '/long/cold-email-gen.png',
        images: ['/long/cold-email-gen.png'],
        liveUrl: '',
        year: 2023,
        description:
            'Resume Roaster is a web application designed to provide tailored resume feedback and professional writing services. Built with Next.js, PostgreSQL, Prisma, and Tailwind CSS, it integrates GPT-4 for AI-powered recommendations. The platform also includes peer-to-peer reviews with a points-based system, fostering a collaborative and engaging experience. Targeting freshers, experienced professionals, and programmers, it helps optimize resumes for job-specific success.',
        role: `As the sole developer and business owner, I:<br/>
        - Designed and developed the platform end-to-end using Next.js, PostgreSQL, Prisma, and Tailwind CSS.<br/>
        - Integrated GPT-4 for AI-driven feedback and insights.<br/>
        - Implemented complex SQL queries, including one to identify the top two resumes based on user points.`,
    },
];

export const MY_EXPERIENCE: ExperienceType[] = [
    {
        title: 'Software Engineer, AI & Data Platforms',
        company: 'Bull AI',
        duration: 'Sep 2025 - Present',
        location: 'Mumbai, India',
        current: true,
        points: [
            'Built and hardened LLM agent workflows for research-style tasks, with retrieval, prompt versioning, schema validation, multi-provider LLM clients, and persistent run history',
            'Designed a multi-stage document-extraction pipeline with retrieve, parse, discover, extract and validate stages, step caching, prompt-schema contract tests, evaluation harnesses, and repeatable runs for auditability',
            'Engineered scheduled ingestion and transform services that load external data feeds into a relational store with recoverable checkpoints, audit tables, and containerised cloud deployment',
            'Developed a conversational assistant using FastAPI streaming, React, LangChain, and retrieval over documents to return grounded, chart-ready responses',
            'Built batch-processing workflows for summarisation, comparison, and chart generation using managed LLM batch services, schedulers, webhooks, and storage-backed outputs',
        ],
    },
    {
        title: 'LLM Trainer, Software Developer, Frontend Specialization',
        company: 'Scale AI',
        duration: 'Sep 2024 - Sep 2025',
        location: 'Remote',
        points: [
            'Evaluated, corrected, and ranked LLM-generated frontend code for React.js, Next.js, and TypeScript, producing high-signal RLHF/SFT feedback for code-generation quality',
        ],
        skills: ['LLM Fine-tuning', 'Java', 'JavaScript', 'TypeScript', 'Machine Learning', 'Python', 'AI Training'],
    },
    {
        title: 'Full Stack Developer',
        company: 'Freelance',
        duration: 'Sep 2024 - Sep 2025',
        location: 'Remote',
        points: [
            'Delivered 15+ full-stack web applications using Next.js, React, TypeScript, Prisma, PostgreSQL, MongoDB, and Express.js, including AI-powered image-processing and content-management features',
        ],
        skills: ['React', 'Tailwind CSS', 'Prisma', 'MongoDB', 'PostgreSQL'],
    },
    {
        title: 'Technical Architect Intern',
        company: 'BNP Paribas',
        duration: 'Jan 2024 - Jul 2024',
        location: 'Mumbai, India',
        points: [
            'Built a Spring Boot and React data-management application with REST APIs, reducing data-processing time by 30% for workflows serving 500+ daily users',
            'Developed a Project Lifecycle Management system using Spring Boot, React, Camunda BPM, and H2 Database, with dynamic forms and workflow automation for 100+ concurrent projects',
        ],
        skills: ['Spring Boot', 'React.js', 'Camunda', 'Git', 'Agile'],
    },
];

export const COLOPHON: { label: string; value: string }[] = [
    { label: 'Framework', value: 'React 19 + Vite' },
    { label: 'Styling', value: 'Tailwind CSS v4' },
    { label: 'Animation', value: 'Motion + GSAP' },
    { label: 'Type', value: 'Space Grotesk, Instrument Serif, JetBrains Mono' },
    { label: 'Hosting', value: 'Vercel' },
];
