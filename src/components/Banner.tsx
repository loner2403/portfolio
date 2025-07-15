import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef, useLayoutEffect } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GENERAL_INFO } from '../lib/data';

interface BannerProps {
  isMenuOpen: boolean;
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner: React.FC<BannerProps> = ({ isMenuOpen }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    
    // Text animation variants for Framer Motion
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 * i,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1]
            }
        })
    };
    
    // Stat counter animation
    useLayoutEffect(() => {
        const stats = [
            { el: statsRef.current?.querySelector('.years-count'), value: 1.5 },
            { el: statsRef.current?.querySelector('.projects-count'), value: 3 },
            { el: statsRef.current?.querySelector('.hours-count'), value: 4 }
        ];
        
        stats.forEach(stat => {
            if (stat.el) {
                let value = { count: 0 };
                gsap.to(value, {
                    count: stat.value,
                    duration: 2,
                    delay: 1.5,
                    ease: "power2.out",
                    onUpdate: () => {
                        if (stat.el) {
                            stat.el.textContent = stat.value <= 3
                                ? Math.floor(value.count) + "+" 
                                : Math.floor(value.count) + "K+";
                        }
                    }
                });
            }
        });
    }, []);

    useGSAP(
        () => {
            if (!containerRef.current) return;
            
            // Split text animation for the heading
            if (headingRef.current) {
                const fullStackText = headingRef.current.querySelector('.text-full-stack');
                const developerText = headingRef.current.querySelector('.text-developer');
                
                if (fullStackText && developerText) {
                    gsap.fromTo(
                        fullStackText,
                        { x: -100, opacity: 0 },
                        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
                    );
                    
                    gsap.fromTo(
                        developerText,
                        { x: 100, opacity: 0 },
                        { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
                    );
                }
            }
            
            // Background gradient animation
            const overlay = containerRef.current.querySelector('.background-gradient');
            if (overlay) {
                gsap.fromTo(
                    overlay,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.5, ease: "power1.inOut" }
                );
            }
            
            // Modified scroll animation - removed the opacity animation on stats container
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'center center',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            tl.to('.hero-content', { y: -100, opacity: 0.5, duration: 1 });
              
            // Adding the stats container to the scroll animation
            tl.to('.stats-container', { y: -100, opacity: 0.5, duration: 1 }, "<");
            
            // Animate decorative elements
            gsap.to('.decoration-circle', {
                y: -30,
                repeat: -1,
                yoyo: true,
                duration: 3,
                ease: "sine.inOut"
            });
            
            gsap.to('.decoration-square', {
                rotate: 360,
                repeat: -1,
                duration: 20,
                ease: "none"
            });
        },
        { scope: containerRef },
    );

    return (
        <section 
            className="relative overflow-hidden min-h-[100svh] flex items-center justify-center" 
            id="banner"
        >
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 bg-background">
                <div className="background-gradient absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-background to-purple-900/10 opacity-0"></div>
                
                {/* Decorative elements */}
                <div className="decoration-circle absolute top-[15%] left-[10%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-cyan-500/5 blur-xl"></div>
                <div className="decoration-square absolute bottom-[20%] right-[10%] w-32 h-32 md:w-52 md:h-52 rounded-lg bg-cyan-400/5 blur-xl rotate-12"></div>
                <div className="decoration-circle absolute top-[50%] right-[15%] w-20 h-20 md:w-28 md:h-28 rounded-full bg-cyan-600/5 blur-lg"></div>
            </div>
            
            <div
                className="container relative z-[2] px-8 py-16 mx-auto"
                ref={containerRef}
            >
                <div className={`grid md:grid-cols-12 gap-12 md:gap-8 items-center ${isMenuOpen ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Main content */}
                    <div className="hero-content md:col-span-8 space-y-8">
                        <h1 
                            ref={headingRef}
                            className="flex flex-col items-start text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight anton-font"
                        >
                            <span className="text-full-stack text-cyan-400 mb-2 opacity-0">FULL-STACK</span>
                            <span className="text-developer text-white opacity-0">DEVELOPER</span>
                        </h1>
                        
                        <motion.div 
                            className="space-y-6 max-w-2xl"
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            variants={textVariants}
                        >
                            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                                Hi! I'm{' '}
                                <span className="font-medium text-cyan-400">
                                    Harshal
                                </span>
                                . A creative Full Stack Developer with 1.5+ years of
                                experience in building high-performance, scalable, and
                                responsive web solutions.
                            </p>
                            
                            <div className="pt-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        const mailtoLink = `mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(GENERAL_INFO.emailSubject)}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`;
                                        window.location.href = mailtoLink;
                                    }}
                                    disabled={isMenuOpen}
                                >
                                    Hire Me
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Stats container - smaller and more responsive */}
                    <motion.div 
                        className="stats-container flex flex-col md:col-span-4"
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        variants={textVariants}
                        ref={statsRef}
                    >
                        <div className="stats-card group relative p-5 sm:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-500 max-w-sm mx-auto md:mx-0 w-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative flex flex-col space-y-5">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-400/10 flex items-center justify-center mr-4">
                                        <h5 className="years-count text-2xl sm:text-3xl font-anton text-cyan-400">0+</h5>
                                    </div>
                                    <p className="text-white/90 text-base sm:text-lg">Years of Experience</p>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-400/10 flex items-center justify-center mr-4">
                                        <h5 className="projects-count text-2xl sm:text-3xl font-anton text-cyan-400">0+</h5>
                                    </div>
                                    <p className="text-white/90 text-base sm:text-lg">Completed Projects</p>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-400/10 flex items-center justify-center mr-4">
                                        <h5 className="hours-count text-2xl sm:text-3xl font-anton text-cyan-400">0+</h5>
                                    </div>
                                    <p className="text-white/90 text-base sm:text-lg">Hours Worked</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll indicator - more responsive */}
                <motion.div 
                    className={`absolute bottom-5 sm:bottom-10 left-1/2 transform -translate-x-1/2 ${isMenuOpen ? 'opacity-0' : ''}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                >
                    <motion.div 
                        className="flex flex-col items-center"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <span className="text-white/50 text-xs sm:text-sm mb-2">Scroll down</span>
                        <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
