'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Download } from 'lucide-react';
import Button from './Button';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const experienceCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [activeExperience, setActiveExperience] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [, setIsTablet] = useState<boolean>(false);

    // Enhanced device detection
    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };
        
        checkDeviceType();
        window.addEventListener('resize', checkDeviceType);
        
        return () => {
            window.removeEventListener('resize', checkDeviceType);
        };
    }, []);

    // Experience data
    const experiences = [
        {
            id: 1,
            company: "BNP Paribas",
            role: "Technical Architect Intern",
            location: "Mumbai",
            period: "Jan - Jul 2024",
            description: [
                "Developed a data management app using Spring Boot and React.js, reducing processing time by 30%.",
                "Built a Project Lifecycle System with React, Spring Boot and Camunda BPM.",
                "Implemented workflow automation, reducing manual tasks by 25%."
            ],
            skills: ["Spring Boot", "React.js", "Camunda", "Git", "Agile"]
        },
        {
            id: 2,
            company: "Freelance",
            role: "Full Stack Developer",
            location: "Remote",
            period: "Aug 2024 - Present",
            description: [
                "Developed web apps using React, Tailwind CSS, and Prisma.",
                "Created backend services with MongoDB and PostgreSQL.",
                "Deployed on Cloudflare Workers for improved scalability."
            ],
            skills: ["React", "Tailwind CSS", "Prisma", "MongoDB", "PostgreSQL"]
        },
        {
            id: 3,
            company: "Scale AI",
            role: "LLM Trainer - Software Engineer",
            location: "Remote",
            period: "May 2025 - Present",
            description: [
                "Fine-tuned large language models for enhanced code generation capabilities across multiple programming languages.",
                "Optimized model performance for Java, JavaScript, and TypeScript development workflows.",
                "Collaborated with ML engineering teams to implement robust training pipelines and evaluation metrics.",
                "Developed specialized training datasets to improve model accuracy in software engineering tasks."
            ],
            skills: ["LLM Fine-tuning", "Java", "JavaScript", "TypeScript", "Machine Learning", "Python", "AI Training"]
        }
    ];
    

    // Optimized timeline positioning for desktop only
    useEffect(() => {
        if (!timelineRef.current || isMobile) return;
        
        const updateTimeline = () => {
            const timelineDots = timelineRef.current!.querySelectorAll('.timeline-dot');
            const timelineLines = timelineRef.current!.querySelectorAll('.timeline-line');
            
            experienceCardsRef.current.forEach((card, index) => {
                if (card && index < timelineDots.length) {
                    const dot = timelineDots[index] as HTMLElement;
                    const cardRect = card.getBoundingClientRect();
                    const timelineRect = timelineRef.current!.getBoundingClientRect();
                    
                    const relativeTop = cardRect.top - timelineRect.top + (cardRect.height * 0.1);
                    dot.style.top = `${relativeTop}px`;
                    
                    if (index < timelineLines.length) {
                        const line = timelineLines[index] as HTMLElement;
                        line.style.top = `${relativeTop + 8}px`;
                        
                        if (index < experienceCardsRef.current.length - 1 && experienceCardsRef.current[index + 1]) {
                            const nextCardRect = experienceCardsRef.current[index + 1]!.getBoundingClientRect();
                            const nextDotTop = nextCardRect.top - timelineRect.top + (nextCardRect.height * 0.1);
                            line.style.height = `${Math.max(nextDotTop - relativeTop - 8, 0)}px`;
                        }
                    }
                }
            });
        };
        
        const resizeObserver = new ResizeObserver(updateTimeline);
        resizeObserver.observe(timelineRef.current);
        experienceCardsRef.current.forEach(card => {
            if (card) resizeObserver.observe(card);
        });
        
        updateTimeline();
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [isMobile]);

    // Mobile-optimized GSAP animations[1][3][6][11]
    useGSAP(
        () => {
            if (!container.current) return;
            
            const ctx = gsap.context(() => {
                // Mobile-first approach with simplified animations[9][11]
                if (isMobile) {
                    // Simplified mobile animations for better performance[3][11]
                    const aboutTextElements = container.current!.querySelectorAll('.about-text');
                    gsap.fromTo(aboutTextElements, 
                        {
                            opacity: 0,
                            y: 20 // Reduced movement for mobile[11]
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6, // Shorter duration for mobile[11]
                            stagger: 0.1, // Reduced stagger for performance[6][11]
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: '.about-section',
                                start: "top 85%",
                                toggleActions: "play none none none"
                            }
                        }
                    );
                    
                    // Simple card animations for mobile[11]
                    const cards = container.current!.querySelectorAll('.experience-card');
                    gsap.fromTo(cards,
                        {
                            opacity: 0,
                            y: 30 // Minimal movement for performance[11]
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.15, // Optimized stagger timing[6][11]
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: '.experience-section',
                                start: "top 85%",
                                once: true
                            }
                        }
                    );
                    
                    // Simplified skill tags for mobile[11]
                    const skillTags = container.current!.querySelectorAll('.skill-tag');
                    gsap.fromTo(skillTags,
                        {
                            opacity: 0,
                            scale: 0.9
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            stagger: 0.03, // Faster stagger for mobile[6][11]
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: '.skills-section',
                                start: "top 90%",
                                once: true
                            }
                        }
                    );
                    
                    // No glow animations on mobile for performance[3][11]
                    
                } else {
                    // Full desktop animations (unchanged)
                    const aboutTextElements = container.current!.querySelectorAll('.about-text');
                    gsap.fromTo(aboutTextElements, 
                        {
                            y: 60,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            stagger: 0.2,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: '.about-section',
                                start: "top 75%",
                                toggleActions: "play none none none"
                            }
                        }
                    );
                    
                    // Timeline animations (desktop only)
                    if (timelineRef.current) {
                        const timelineDots = timelineRef.current.querySelectorAll('.timeline-dot');
                        const timelineLines = timelineRef.current.querySelectorAll('.timeline-line');
                        
                        gsap.set(timelineDots, { scale: 0, opacity: 0 });
                        gsap.set(timelineLines, { scaleY: 0, transformOrigin: "top" });
                        
                        gsap.to(timelineDots, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.3,
                            ease: "back.out(1.7)",
                            scrollTrigger: {
                                trigger: '.experience-section',
                                start: "top 80%",
                                once: true
                            }
                        });
                        
                        gsap.to(timelineLines, {
                            scaleY: 1,
                            duration: 1,
                            stagger: 0.3,
                            ease: "power2.inOut",
                            scrollTrigger: {
                                trigger: '.experience-section',
                                start: "top 80%",
                                once: true
                            }
                        });
                    }
                    
                    // Experience cards animation
                    const cards = container.current!.querySelectorAll('.experience-card');
                    gsap.fromTo(cards,
                        {
                            opacity: 0,
                            x: -50
                        },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            stagger: 0.3,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: '.experience-section',
                                start: "top 80%",
                                once: true
                            }
                        }
                    );
                    
                    // Skills tags reveal
                    const skillTags = container.current!.querySelectorAll('.skill-tag');
                    gsap.fromTo(skillTags,
                        {
                            opacity: 0,
                            y: 20,
                            scale: 0.8
                        },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.4,
                            stagger: 0.05,
                            ease: "back.out(1.7)",
                            scrollTrigger: {
                                trigger: '.skills-section',
                                start: "top 85%",
                                once: true
                            }
                        }
                    );
                    
                    // Glow animations (desktop only)[11]
                    const glowElements = container.current!.querySelectorAll('.glow-element');
                    glowElements.forEach((element, index) => {
                        const tl = gsap.timeline({
                            repeat: -1,
                            yoyo: true,
                            defaults: { ease: "sine.inOut" }
                        });
                        
                        const xRange = 8 + (index * 2);
                        const yRange = 8 + (index * 2);
                        
                        tl.to(element, {
                            x: xRange,
                            y: yRange,
                            duration: 4 + Math.random() * 2,
                        }).to(element, {
                            x: -xRange,
                            y: -yRange,
                            duration: 4 + Math.random() * 2,
                        });
                    });
                }
                
            }, container.current);
            
            return () => ctx.revert();
        },
        { scope: container, dependencies: [isMobile] }
    );

    // Optimized Framer Motion variants
    const cardVariants = {
        hidden: { opacity: 0, y: isMobile ? 15 : 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: isMobile ? 0.4 : 0.6, 
                ease: [0.22, 1, 0.36, 1] 
            }
        }
    };
    
    const titleVariants = {
        hidden: { opacity: 0, x: isMobile ? -10 : -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                duration: isMobile ? 0.3 : 0.5, 
                delay: isMobile ? 0.05 : 0.1 
            }
        }
    };

    const handleCardInteraction = (id: number) => {
        setActiveExperience(id);
    };

    return (
        <section 
            className="relative py-16 md:py-32 overflow-hidden z-[1] bg-gradient-to-b from-background via-background to-background/90" 
            id="about-me"
        >
            {/* Conditional background glow elements - desktop only for performance[3][11] */}
            {!isMobile && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="glow-element absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/5 blur-3xl opacity-60"></div>
                    <div className="glow-element absolute top-[50%] right-[5%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/5 blur-3xl opacity-50"></div>
                    <div className="glow-element absolute bottom-[10%] left-[30%] w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/5 blur-3xl opacity-40"></div>
                </div>
            )}
            
            <div className="container relative z-10 px-4 sm:px-6 mx-auto max-w-6xl" ref={container}>
                
                {/* About section - Mobile optimized layout[5][10] */}
                <div className={`about-section ${isMobile ? 'space-y-6 mb-12' : 'grid md:grid-cols-12 gap-8 mb-16 md:mb-24'}`}>
                    <div className={isMobile ? 'text-center' : 'md:col-span-5'}>
                        <h3 className={`about-text ${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl lg:text-5xl'} font-light text-white mb-4 main-heading`}>
                            Hi, I'm <span className="text-cyan-400 font-normal">Harshal</span>.
                        </h3>
                        <div className={`flex mt-6 ${isMobile ? 'justify-center' : ''} space-x-4 about-text`}>
                            <Button 
                                variant="neon" 
                                size={isMobile ? "sm" : "sm"}
                                icon={<Download size={isMobile ? 12 : 14} />}
                                iconPosition="left"
                                as="link"
                                href="/My_Resume.pdf"
                                download
                            >
                                Resume
                            </Button>
                        </div>
                    </div>
                    <div className={isMobile ? '' : 'md:col-span-7'}>
                        <div className={`space-y-3 text-white/80 ${isMobile ? 'text-sm leading-relaxed' : ''}`}>
                            <p className="about-text">
                                Full Stack developer with 1.5+ years of experience creating intuitive web experiences that balance form and function.
                            </p>
                            <p className="about-text">
                                My work prioritizes performance, accessibility, and responsive design across enterprise applications and custom web solutions.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Experience section - Mobile-first design[5][10] */}
                <div className={`experience-section ${isMobile ? 'mb-12' : 'mb-16 md:mb-24'}`}>
                    <motion.h3 
                        className={`${isMobile ? 'text-xl mb-6' : 'text-2xl md:text-3xl mb-8 md:mb-12'} text-white flex items-center anton-font ${isMobile ? 'justify-center' : ''}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={titleVariants}
                    >
                        <Briefcase className={`mr-3 text-cyan-400 ${isMobile ? 'w-5 h-5' : ''}`} size={isMobile ? 20 : 28} />
                        <span>Work Experience</span>
                    </motion.h3>
                    
                    <div className="relative flex">
                        {/* Timeline - Desktop only for performance[11] */}
                        {!isMobile && (
                            <div 
                                className="hidden md:block w-8 lg:w-12 relative mr-6 lg:mr-8 min-h-full"
                                ref={timelineRef}
                            >
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className="relative">
                                        <div 
                                            className={`timeline-dot absolute left-1/2 w-4 h-4 rounded-full z-10 transform -translate-x-1/2 transition-all duration-300 shadow-lg ${
                                                activeExperience === exp.id 
                                                    ? 'bg-cyan-400 shadow-cyan-400/50' 
                                                    : 'bg-white/50 shadow-white/25'
                                            }`}
                                        />
                                        {index < experiences.length - 1 && (
                                            <div 
                                                className="timeline-line absolute left-1/2 w-0.5 bg-gradient-to-b from-white/30 to-white/10 transform -translate-x-1/2"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Mobile-optimized Experience cards[5][10] */}
                        <div className={`flex-1 ${isMobile ? 'space-y-4' : 'space-y-6 sm:space-y-8 md:space-y-12'}`}>
                            {experiences.map((exp, index) => (
                                <motion.div 
                                    key={exp.id}
                                    className={`experience-card relative ${isMobile ? 'p-4' : 'p-4 sm:p-5 md:p-6 lg:p-8'} rounded-lg sm:rounded-xl md:rounded-2xl border transition-all duration-300 cursor-pointer group ${
                                        activeExperience === exp.id 
                                            ? 'border-cyan-400/40 bg-white/10 backdrop-blur-md shadow-2xl shadow-cyan-500/10' 
                                            : `border-white/20 ${isMobile ? 'bg-white/8' : 'bg-white/5'} backdrop-blur-sm hover:bg-white/8 hover:border-white/30 hover:backdrop-blur-md`
                                    }`}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-10%" }}
                                    variants={cardVariants}
                                    onMouseEnter={() => !isMobile && handleCardInteraction(exp.id)}
                                    onTouchStart={() => isMobile && handleCardInteraction(exp.id)}
                                    onFocus={() => handleCardInteraction(exp.id)}
                                    tabIndex={0}
                                    ref={(el) => {
                                        experienceCardsRef.current[index] = el;
                                    }}
                                >
                                    {/* Simplified glassmorphism for mobile[5] */}
                                    <div className={`absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-white/5 to-transparent ${isMobile ? 'opacity-30' : 'opacity-50'} pointer-events-none`} />
                                    
                                    <div className="relative z-10">
                                        <div className={`mb-3 ${isMobile ? 'space-y-2' : 'flex flex-wrap justify-between items-start gap-2'}`}>
                                            <div>
                                                <h4 className={`${isMobile ? 'text-base' : 'text-lg sm:text-xl'} font-medium text-white mb-1 group-hover:text-cyan-100 transition-colors`}>
                                                    {exp.role}
                                                </h4>
                                                <p className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} text-cyan-400 group-hover:text-cyan-300 transition-colors`}>
                                                    {exp.company} 
                                                    <span className={`${isMobile ? 'text-xs block mt-1' : 'text-xs sm:text-sm ml-2'} text-white/60`}>
                                                        {exp.location}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs ${isMobile ? 'self-start' : 'sm:text-sm'} text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 shrink-0`}>
                                                {exp.period}
                                            </div>
                                        </div>
                                        
                                        <div className={`text-white/80 ${isMobile ? 'space-y-1.5 mb-3 text-xs' : 'space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base'}`}>
                                            {exp.description.map((item, idx) => (
                                                <p key={idx} className={`relative ${isMobile ? 'pl-3' : 'pl-5'} before:content-['•'] before:absolute before:left-0 before:text-cyan-400 leading-relaxed`}>
                                                    {item}
                                                </p>
                                            ))}
                                        </div>
                                        
                                        <div className={`skills-section flex flex-wrap ${isMobile ? 'gap-1 mt-2' : 'gap-1.5 sm:gap-2 mt-3 sm:mt-4'}`}>
                                            {exp.skills.map((skill, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`skill-tag ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm'} rounded-full bg-cyan-400/10 backdrop-blur-sm text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20 ${!isMobile ? 'hover:scale-105' : ''} transition-all duration-200`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
