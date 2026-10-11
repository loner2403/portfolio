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

export interface SystemType {
    id: string;
    title: string;
    summary: string;
    stages?: string[];
    highlights: string[];
    stack: string[];
}

export const SYSTEMS: SystemType[] = [
    {
        id: 'S-01',
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
    },
    {
        id: 'S-02',
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
    },
    {
        id: 'S-03',
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
    },
    {
        id: 'S-04',
        title: 'Conversational assistant',
        summary: 'A domain-focused assistant that grounds answers in documents and live data and streams responses to the client.',
        stages: ['resolve', 'lookup', 'rag', 'answer', 'stream'],
        highlights: [
            'Server-sent-event streaming API',
            'Document retrieval (RAG)',
            'Structured, chart-ready responses',
        ],
        stack: ['FastAPI', 'React', 'LangChain', 'Vector DB', 'Gemini'],
    },
    {
        id: 'S-05',
        title: 'Batch analysis jobs',
        summary: 'Scheduled and webhook-triggered batch jobs for summarisation, comparison and chart generation.',
        stages: ['schedule', 'summarise', 'chart', 'store'],
        highlights: [
            'LLM batch processing',
            'Schedulers and webhooks',
            'Storage-backed chart generation',
        ],
        stack: ['Python', 'Gemini', 'Cloud'],
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
        title: 'Thumbnail AI',
        slug: 'thumbnail-ai',
        liveUrl: '',
        year: 2024,
        description: `AI thumbnail generation platform with background removal, reusable templates, and batch workflows. Built with Next.js, TypeScript, AI/ML APIs, and Cloudflare.`,
        role: `Sole developer: designed and built the full product: generation pipeline, template editor, and batch processing on Cloudflare infrastructure.`,
        techStack: [
            'Next.js',
            'TypeScript',
            'AI/ML APIs',
            'Cloudflare',
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
        description: `A full-stack blogging platform with auth, comments, dark/light mode, and 95+ PageSpeed. Built on Hono + Cloudflare Workers with React, Prisma, and PostgreSQL.`,
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
