'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  const loadingWords = ['Creating', 'Designing', 'Building', 'Crafting', 'Launching'];

  // Realistic loading simulation
  useEffect(() => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += Math.random() * 8 + 4;
      setProgress(Math.min(progressValue, 100));
      
      if (progressValue >= 100) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Dynamic word animation
  useEffect(() => {
    let wordIndex = 0;
    const wordInterval = setInterval(() => {
      setCurrentWord(loadingWords[wordIndex]);
      wordIndex = (wordIndex + 1) % loadingWords.length;
    }, 800);

    return () => clearInterval(wordInterval);
  }, []);

  // Main animations with modern approach
  useGSAP(() => {
    if (!preloaderRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states for smooth entry
      gsap.set('.morph-shape', {
        scale: 0,
        rotation: -180,
        opacity: 0
      });

      gsap.set('.loading-text', {
        y: 50,
        opacity: 0
      });

      gsap.set('.progress-ring', {
        scale: 0,
        opacity: 0
      });

      gsap.set('.brand-text', {
        y: 30,
        opacity: 0
      });

      // Entrance timeline with staggered animations
      const entranceTl = gsap.timeline();

      entranceTl
        .to('.morph-shape', {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)'
        })
        .to('.brand-text', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.6')
        .to('.loading-text', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .to('.progress-ring', {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)'
        }, '-=0.3');

      // Continuous morphing animation
      const morphTl = gsap.timeline({ repeat: -1 });
      
      morphTl
        .to('.morph-shape', {
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          duration: 2,
          ease: 'power2.inOut'
        })
        .to('.morph-shape', {
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 60%, 50% 100%, 0% 60%)',
          duration: 2,
          ease: 'power2.inOut'
        })
        .to('.morph-shape', {
          clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
          duration: 2,
          ease: 'power2.inOut'
        })
        .to('.morph-shape', {
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          duration: 2,
          ease: 'power2.inOut'
        });

      // Floating particles animation
      gsap.to('.floating-particle', {
        y: gsap.utils.random(-30, -60),
        x: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(0, 360),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random'
        }
      });

    }, preloaderRef.current);

    return () => ctx.revert();
  }, []);

  // Exit animation
  useGSAP(() => {
    if (!isComplete || !preloaderRef.current) return;

    const exitTl = gsap.timeline({ delay: 0.5 });

    exitTl
      .to('.loading-text, .progress-ring', {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      })
      .to('.brand-text', {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.2')
      .to('.morph-shape', {
        scale: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.in'
      }, '-=0.1')
      .to('.floating-particle', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power2.in'
      }, '-=0.8')
      .to('.brand-text', {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, '-=0.4')
      .to(preloaderRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => {
          document.body.style.overflow = 'auto';
        }
      });

  }, { dependencies: [isComplete] });

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-gray-900 to-black overflow-hidden"
    >
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
      
      {/* Floating particles for ambiance */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="floating-particle absolute w-1 h-1 bg-cyan-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        
        {/* Morphing shape - central focus */}
        <div className="relative mb-12 sm:mb-16">
          <div 
            className="morph-shape w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/25"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          />
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl -z-10" />
        </div>

        {/* Brand name with modern typography */}
        <div className="brand-text text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl anton-font text-white tracking-wider">
            HARSHAL
          </h1>
          <p className="text-cyan-400/80 text-sm sm:text-base md:text-lg mt-2 font-mono tracking-widest">
            PORTFOLIO
          </p>
        </div>

        {/* Dynamic loading text */}
        <div className="loading-text text-center mb-8">
          <p className="text-white/60 text-lg sm:text-xl md:text-2xl font-light">
            {currentWord}
            <span className="text-cyan-400 animate-pulse ml-2">...</span>
          </p>
        </div>

        {/* Minimalist progress indicator */}
        <div className="progress-ring relative">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Background ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#modernGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${(progress * 283) / 100} 283`,
                  transition: 'stroke-dasharray 0.3s ease'
                }}
              />
              <defs>
                <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#64ffda" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/80 text-xs sm:text-sm font-mono">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Preloader;
