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

// import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'harshal03.lade@gmail.com',

    emailSubject: "Let's work on a project together",
    emailBody: 'Hi Harshal, I am reaching out to you because...',

    
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/loner2403' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/harshal-lade-a2a41b232/' },
    
    
];

export const MY_STACK = {
    frontend: [
        {
            name: 'Javascript',
            icon: '/logo/js.png',
        },
        {
            name: 'Typescript',
            icon: '/logo/ts.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'Frammer Motion',
            icon: '/logo/framer-motion.png',
        },
        
        
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'Spring-boot',
            icon: '/logo/spring-boot.png',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
        {
            name: 'flask',
            icon: '/logo/flask.png',
        }
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
        {
            name: 'chromadb',
            icon: '/logo/chromadb.png',
        }
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ]
    
    
};

export const PROJECTS: ProjectType[] = [
    {
        title: 'Music Portfolio',
        slug: 'music-portfolio',
        liveUrl: 'https://portfolio-website-rust-phi-19.vercel.app/',
        year: 2025,
        description: `
        A modern interactive portfolio for a musician showcasing their work, albums, and contact information.  
        
        Key Features:<br/>
        <ul>
          <li>🎵 Music Player: Interactive audio player with playlist functionality</li>
          <li>🎨 3D Visuals: Three.js powered interactive music visualizations</li>
          <li>📱 Fully Responsive: Optimized for all device sizes</li>
          <li>🎥 Video Showcase: Embedded music videos and performances</li>
          <li>📄 Resume Integration: Downloadable musician resume</li>
        </ul><br/>
        
        Technical Highlights:
        <ul>
          <li>Built with React and TypeScript for type safety</li>
          <li>Three.js integration for 3D music visualizations</li>
          <li>GSAP animations for smooth transitions</li>
          <li>Tailwind CSS for responsive styling</li>
          <li>EmailJS integration for contact forms</li>
        </ul>
        , role: 
        Frontend Developer 
        Responsibilities:
        
        🎨 UI/UX: Designed all interactive components and animations
        🎼 Audio Integration: Implemented music player functionality
        🖥️ 3D Visuals: Created Three.js music visualizations
        📱 Responsive: Ensured cross-device compatibility
        📧 Contact: Set up EmailJS integration
        
        `,
        techStack: [
        'React',
        'TypeScript',
        'Three.js',
        'GSAP',
        'Tailwind CSS',
        'Framer Motion',
        'Vite',
        'Vercel'
        ],
        sourceCode: 'https://github.com/loner2403/portfolio-website',
        thumbnail: '/long/akash-image-long.png',
        longThumbnail: '/long/akash.png',
        images: [
        '/Images/Akash1.png',
        '/Images/Akash2.png',
        '/Images/Akash3.png'
        ],
        },
        {
            title: 'Blogging Platform',
            slug: 'medium-blog-clone',
            liveUrl: 'https://blogs.harshallade.xyz/',
            year: 2025,
            description: `
            A full-stack blogging platform inspired by Medium, providing a clean writing and reading experience.  
            
            Key Features:<br/>
            <ul>
                <li>✍️ Blog Management: Create, edit and publish blog posts with rich text formatting</li>
                <li>🔍 Blog Discovery: Browse and search through published articles</li>
                <li>🔐 User Authentication: Secure signup and login system</li>
                <li>👤 User Profiles: Personalized profile pages for authors</li>
                <li>📱 Fully Responsive: Optimized for all device sizes</li>
                <li>⚡ Fast Performance: Vite-powered frontend with optimized builds</li>
            </ul><br/>
            
            Technical Highlights:
            <ul>
                <li>Implemented Hono.js for lightweight backend API routes</li>
                <li>Used Prisma ORM for type-safe database access</li>
                <li>Built reusable UI components with Tailwind CSS</li>
                <li>Developed authentication flows with secure session management</li>
                <li>Configured Vercel deployment with optimized build settings</li>
            </ul>
            `,
            role: `
            Full-Stack Developer <br/>
            Owned the entire development lifecycle:
            <ul>
                <li>✅ Backend: Built Hono.js API with Prisma ORM for database access</li>
                <li>🎨 Frontend: Developed React components with Vite and Tailwind CSS</li>
                <li>🔐 Authentication: Implemented secure signup/login flows</li>
                <li>📝 Content Management: Created blog publishing and viewing system</li>
                <li>🚀 Deployment: Configured Vercel hosting with CI/CD pipeline</li>
            </ul>
            `,
            techStack: [
                'React',
                'Vite',
                'Tailwind CSS',
                'Hono.js',
                'Prisma',
                'TypeScript',
                'Vercel'
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
            'Postgressql',
            'Prisma',
            'Tailwind CSS',
        ],
        thumbnail: '/long/cold-email-gen.png',
        longThumbnail: '/long/cold-email-gen.png',
        images: [
            '/long/cold-email-gen.png',
            '/long/cold-email-gen.png',
            '/long/cold-email-gen.png',
            '/long/cold-email-gen.png',
        ],
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

export const MY_EXPERIENCE = [
    {
        title: 'Full Stack Developer (Freelance)',
        company: 'Self-Employed',
        duration: 'Sep 2024 - Present',
    },
    {
        title: 'Technical Architect Intern',
        company: 'BNP Paribas',
        duration: 'Jan 2024 - Jul 2024',
    },
];
