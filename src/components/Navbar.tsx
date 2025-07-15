import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { MoveUpRight, Github, Linkedin } from 'lucide-react';
import { GENERAL_INFO, SOCIAL_LINKS } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import TransitionLink from './TransitionLink';

const COLORS = [
    'bg-yellow-500',
    'bg-blue-500',
    'bg-teal-500',
    'bg-indigo-500',
];

const MENU_LINKS = [
    { name: 'Home', url: '/#banner' },
    { name: 'About Me', url: '/#about-me' },
    { name: 'Projects', url: '/#selected-projects' },
];

interface NavbarProps {
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsMenuOpen }) => {
    const [isMenuOpenLocal, setIsMenuOpenLocalState] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll position for navbar background
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleMenuToggle = () => {
      setIsMenuOpen(!isMenuOpenLocal);
      setIsMenuOpenLocalState(!isMenuOpenLocal);
      
      // Disable body scroll when menu is open
      if (!isMenuOpenLocal) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
    };

    // More dynamic navigation variants with 3D effects
    const navVariants = {
        open: {
            x: 0,
            rotateY: 0,
            transition: {
                type: 'spring',
                stiffness: 75,
                damping: 20,
                mass: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.1,
            }
        },
        closed: {
            x: '120%',
            rotateY: -15,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                mass: 0.5,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const menuItemVariants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 350,
                damping: 25,
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 350,
                damping: 25,
            }
        }
    };

    const overlayVariants = {
        open: { 
            opacity: 1,
            backdropFilter: "blur(5px)",
        },
        closed: { 
            opacity: 0,
            backdropFilter: "blur(0px)",
        }
    };
    
    const socialIconMap: Record<string, React.ReactNode> = {
        github: <Github className="mr-2" size={16} />,
        linkedin: <Linkedin className="mr-2" size={16} />
    };

    return (
        <>
            

            {/* Hamburger Menu Button */}
            <div className="sticky top-0 z-[4]">
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                        'group size-12 fixed top-5 right-5 md:right-10 z-[4]',
                        'flex items-center justify-center overflow-hidden'
                    )}
                    onClick={handleMenuToggle}
                    aria-label="Toggle navigation menu"
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={false}
                        animate={isMenuOpenLocal ? { scale: 1.2, backgroundColor: 'rgba(0, 0, 0, 0.2)' } : { scale: 1, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        className={cn(
                            'inline-block w-8 h-0.5 bg-white rounded-full absolute',
                            'transition-transform duration-300'
                        )}
                        initial={false}
                        animate={isMenuOpenLocal ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    />
                    <motion.span
                        className={cn(
                            'inline-block w-8 h-0.5 bg-white rounded-full absolute',
                            'transition-transform duration-300'
                        )}
                        initial={false}
                        animate={isMenuOpenLocal ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    />
                </motion.button>
            </div>

            <AnimatePresence>
                {isMenuOpenLocal && (
                    <motion.div
                        key="overlay"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={overlayVariants}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[3] bg-black/60"
                        onClick={handleMenuToggle}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMenuOpenLocal && (
                    <motion.div
                        key="menu"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={navVariants}
                        className="fixed top-0 right-0 h-screen w-full md:w-[500px] max-w-[calc(100vw-3rem)] z-[3] flex flex-col bg-gradient-to-br from-background to-background-light/80 backdrop-blur-lg border-l border-white/10 text-white overflow-y-auto"
                        style={{ originX: 1, transformPerspective: 1500 }}
                    >
                        <div className="w-full flex flex-col justify-between min-h-screen py-6 sm:py-10">
                            <div className="w-full max-w-[300px] mx-4 sm:mx-auto mt-6 sm:mt-10">
                                <div className="flex flex-col md:flex-row gap-6 sm:gap-10 mt-12 sm:mt-20">
                                    {/* Social Links */}
                                    <div className="flex-col">
                                        <motion.p 
                                            variants={menuItemVariants}
                                            className="text-gray-400 mb-3 sm:mb-5 tracking-widest text-sm"
                                        >
                                            SOCIAL
                                        </motion.p>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {SOCIAL_LINKS.map((link) => (
                                                <motion.li key={link.name} variants={menuItemVariants}>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white text-base sm:text-lg flex items-center hover:text-primary transition-colors duration-300"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            <span className="mr-2">
                                                                {socialIconMap[link.name.toLowerCase()] || null}
                                                            </span>
                                                            <span className="relative overflow-hidden inline-block">
                                                                {link.name}
                                                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                                            </span>
                                                        </div>
                                                    </a>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Menu Links */}
                                    <div className="flex-col">
                                        <motion.p 
                                            variants={menuItemVariants}
                                            className="text-gray-400 mb-3 sm:mb-5 tracking-widest text-sm"
                                        >
                                            MENU
                                        </motion.p>
                                        <ul className="space-y-3 sm:space-y-4">
                                            {MENU_LINKS.map((link, idx) => (
                                                <motion.li key={link.name} variants={menuItemVariants} className="w-full flex">
                                                    {window.location.pathname.includes('/projects/') ? (
                                                        // Use TransitionLink when on project pages
                                                        <TransitionLink
                                                            to={link.url.startsWith('/#') ? '/' : link.url}
                                                            className="group text-white text-xl flex items-center hover:text-primary transition-colors duration-300 w-full"
                                                            onClick={() => {
                                                                setIsMenuOpen(false);
                                                                setIsMenuOpenLocalState(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{
                                                                        delay: 0.3 + idx * 0.05,
                                                                        type: 'spring',
                                                                        stiffness: 300
                                                                    }}
                                                                    whileHover={{ 
                                                                        scale: 1.2, 
                                                                        rotate: [0, 10, -10, 0],
                                                                        transition: { duration: 0.3 }
                                                                    }}
                                                                    className={cn(
                                                                        'size-6 rounded-full flex items-center justify-center mr-3',
                                                                        COLORS[idx % COLORS.length]
                                                                    )}
                                                                >
                                                                    <MoveUpRight
                                                                        size={14}
                                                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                </motion.span>
                                                                <span className="relative overflow-hidden inline-block text-white">
                                                                    {link.name}
                                                                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                                                </span>
                                                            </div>
                                                        </TransitionLink>
                                                    ) : (
                                                        // Use button with scroll behavior when on home page
                                                        <button
                                                            onClick={() => {
                                                                setIsMenuOpen(false);
                                                                setIsMenuOpenLocalState(false);
                                                                document.body.style.overflow = 'auto';
                                                                
                                                                // Wait for menu close animation to complete
                                                                setTimeout(() => {
                                                                    let targetId = link.url.split('#')[1]; // Remove the '/#'
                                                                    if (!targetId) {
                                                                        targetId = "banner";
                                                                    }
                                                                    
                                                                    // On home page, just scroll to the element
                                                                    const targetElement = document.getElementById(targetId);
                                                                    if (targetElement) {
                                                                        targetElement.scrollIntoView({
                                                                            behavior: 'smooth',
                                                                            block: 'start'
                                                                        });
                                                                    } else {
                                                                        // Fallback to regular anchor navigation
                                                                        console.log(`Element with id ${targetId} not found, using hash navigation`);
                                                                        window.location.hash = targetId;
                                                                    }
                                                                }, 400);
                                                            }}
                                                            className="group text-white text-xl flex items-center hover:text-primary transition-colors duration-300 w-full"
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{
                                                                        delay: 0.3 + idx * 0.05,
                                                                        type: 'spring',
                                                                        stiffness: 300
                                                                    }}
                                                                    whileHover={{ 
                                                                        scale: 1.2, 
                                                                        rotate: [0, 10, -10, 0],
                                                                        transition: { duration: 0.3 }
                                                                    }}
                                                                    className={cn(
                                                                        'size-6 rounded-full flex items-center justify-center mr-3',
                                                                        COLORS[idx % COLORS.length]
                                                                    )}
                                                                >
                                                                    <MoveUpRight
                                                                        size={14}
                                                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                </motion.span>
                                                                <span className="relative overflow-hidden inline-block text-white">
                                                                    {link.name}
                                                                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                                                </span>
                                                            </div>
                                                        </button>
                                                    )}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <motion.div 
                                className="w-full max-w-[300px] mx-4 sm:mx-auto mt-8 mb-6 sm:mb-8"
                                variants={menuItemVariants}
                            >
                                <p className="text-gray-400 mb-3 sm:mb-4 tracking-widest text-xs sm:text-sm text-center">GET IN TOUCH</p>
                                <a
                                    href={`mailto:${GENERAL_INFO.email}`}
                                    className="text-white group flex justify-center text-sm sm:text-lg hover:text-primary transition-colors duration-300 w-full break-all"
                                >
                                    <span className="relative overflow-hidden inline-block text-center">
                                        {GENERAL_INFO.email}
                                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                    </span>
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
