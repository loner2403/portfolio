import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';

type Props = (
  | { back: true; to?: never }
  | { back?: false; to: string }
) &
  Omit<React.ComponentProps<typeof Link>, 'to' | 'onClick'> & {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

gsap.registerPlugin(useGSAP);

const TransitionLink = ({
  to,
  onClick,
  children,
  back = false,
  ...rest
}: Props) => {
  const navigate = useNavigate();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP(() => {});

  // Create and initialize transition elements
  useEffect(() => {
    // Add custom ease for ultra-smooth transitions
    gsap.registerEase("smoothEaseInOut", function(progress) {
      // Custom easing function with reduced motion at start and end points
      return progress < 0.5
        ? 4 * Math.pow(progress, 3)
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    });
    
    // Add a soft bounce ease
    gsap.registerEase("softBounce", function(progress) {
      const value = 1 - Math.cos(progress * Math.PI * 2) * (1 - progress);
      return 0.5 - Math.sin(Math.acos(value * 2 - 1) / 3) * 0.5;
    });
    
    // Create or get transition container
    let transitionContainer = document.querySelector('.page-transition') as HTMLDivElement;
    if (!transitionContainer) {
      transitionContainer = document.createElement('div');
      transitionContainer.classList.add('page-transition');
      document.body.appendChild(transitionContainer);
    }
    
    transitionContainer.style.position = 'fixed';
    transitionContainer.style.inset = '0';
    transitionContainer.style.zIndex = '10000';
    transitionContainer.style.pointerEvents = 'none';
    transitionContainer.style.display = 'flex';
    transitionContainer.style.flexDirection = 'column';
    transitionContainer.style.visibility = 'hidden';
    
    // Create transition elements if they don't exist
    if (transitionContainer.children.length === 0) {
      // First layer - gradient ribbons container
      const ribbonsContainer = document.createElement('div');
      ribbonsContainer.classList.add('ribbons-container');
      ribbonsContainer.style.position = 'absolute';
      ribbonsContainer.style.inset = '0';
      ribbonsContainer.style.overflow = 'hidden';
      transitionContainer.appendChild(ribbonsContainer);
      
      // Create gradient ribbons
      
      
      // Second layer - main reveal mask
      const revealMask = document.createElement('div');
      revealMask.classList.add('reveal-mask');
      revealMask.style.position = 'absolute';
      revealMask.style.inset = '0';
      revealMask.style.transform = 'scaleX(0)';
      revealMask.style.transformOrigin = 'left';
      revealMask.style.backgroundColor = '#000';
      transitionContainer.appendChild(revealMask);
      
      // Third layer - accent lines
      const accentLinesContainer = document.createElement('div');
      accentLinesContainer.classList.add('accent-lines-container');
      accentLinesContainer.style.position = 'absolute';
      accentLinesContainer.style.inset = '0';
      accentLinesContainer.style.overflow = 'hidden';
      transitionContainer.appendChild(accentLinesContainer);
      
      
      
     
      
      // Create pulse circle
      const pulseCircle = document.createElement('div');
      pulseCircle.classList.add('pulse-circle');
      pulseCircle.style.width = '50px';
      pulseCircle.style.height = '50px';
      pulseCircle.style.borderRadius = '50%';
      pulseCircle.style.background = 'radial-gradient(circle, #22d3ee 0%, rgba(34, 211, 238, 0) 70%)';
      pulseCircle.style.transform = 'scale(0.5)';
     
    }
    
    // Initialize with GSAP
    gsap.set('.reveal-mask', { scaleX: 0 });
    gsap.set('.accent-line', { scaleX: 0 });
    gsap.set('.pulse-container', { opacity: 0 });
    gsap.set('.pulse-circle', { scale: 0.5 });
    gsap.set('.page-transition', { visibility: 'hidden' });
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleLinkClick = contextSafe(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      // Disable scrolling during transition
      document.body.style.overflow = 'hidden';
      
      // Show transition container with smooth fade-in
      gsap.to('.page-transition', {
        autoAlpha: 1, // Use autoAlpha instead of just setting visibility
        duration: 0.3,
        ease: 'power1.in',
        onStart: () => {
          gsap.set('.page-transition', { visibility: 'visible' });
        }
      });
      
      // Main timeline with ultra-smooth easing
      const tl = gsap.timeline({
        defaults: { ease: "smoothEaseInOut" }, // Use custom ultra-smooth easing
        onComplete: () => {
          // Fade out container smoothly when complete
          gsap.to('.page-transition', {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => {
              document.body.style.overflow = 'auto';
              gsap.set('.page-transition', { visibility: 'hidden' });
            }
          });
        }
      });

      // Phase 1: Ultra-smooth gradient ribbons animation
      tl.to('.gradient-ribbon', {
        scaleY: 1,
        opacity: 0.8,
        duration: 1.6, // Even longer duration
        stagger: { 
          amount: 0.35, 
          from: "center",
          ease: "power1.inOut" // Smoother stagger easing
        },
        ease: 'softBounce' // Subtle bounce for more organic feel
      })
      
      // Phase 2: Pulse effect - ultra-smooth
      .to('.pulse-container', {
        opacity: 0.8, // Reduced for subtlety
        duration: 0.9,
        ease: 'power1.inOut'
      }, "-=1.4") // Start much earlier
      .to('.pulse-circle', {
        scale: 30, // Even larger scale for smoother expansion
        opacity: 0.15, // More subtle
        duration: 1.8, // Much longer duration
        ease: 'power2.inOut' // More balanced acceleration/deceleration
      }, "-=0.8")
      
      // Phase 3: Reveal mask animation - ultra smooth
      .to('.reveal-mask', {
        scaleX: 1,
        duration: 1.4, // Even longer duration
        ease: 'smoothEaseInOut' // Ultra-smooth easing
      }, "-=1.5") // Start much earlier for better overlap
      
      // Slight delay before navigation for smoother transition
      .to({}, { duration: 0.15 })
      
      // Trigger navigation
      .call(() => {
        if (back) {
          navigate(-1);
        } else if (to) {
          navigate(to);
        }
        onClick?.(e);
        
        // Reset scroll position with smooth behavior
        window.scrollTo({ top: 0, behavior: 'auto' });
      })
      
      // Phase 4: Accent lines animation - ultra smooth
      .to('.accent-line', {
        scaleX: 1,
        duration: 1.2, // Longer duration
        stagger: { 
          amount: 0.35, // More controlled stagger
          ease: "power1.inOut" // Smoother stagger easing
        },
        ease: 'power3.out' // Smoother acceleration
      }, "-=0.8")
      
      // Smoother transition between phases
      .to({}, { duration: 0.5 })
      
      // Phase 5: Change reveal mask origin with smoother transition
      .set('.reveal-mask', {
        transformOrigin: 'right'
      })
      .to('.reveal-mask', {
        scaleX: 0,
        duration: 1.4, // Longer duration
        ease: 'smoothEaseInOut' // Ultra-smooth easing
      }, "+=0.1") // Small delay for smoother sequence
      
      // Phase 6: Fade out accent lines - ultra smooth
      .to('.accent-line', {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 1.1, // Longer duration
        stagger: { 
          amount: 0.25, // More controlled stagger
          ease: "power1.inOut" // Smoother stagger easing
        },
        ease: 'smoothEaseInOut' // Ultra-smooth easing
      }, "-=1.1") // Better overlap
      
      // Phase 7: Fade out gradient ribbons - ultra smooth exit
      .to('.gradient-ribbon', {
        scaleY: 0,
        opacity: 0,
        duration: 1.3, // Longer duration
        stagger: {
          amount: 0.4, // More stagger for wave-like exit
          from: "center", // From center for balanced exit
          ease: "power1.inOut" // Smoother stagger easing
        },
        transformOrigin: 'bottom',
        ease: 'smoothEaseInOut' // Ultra-smooth easing
      }, "-=1.0");
      
      // Safety timeout - increased for longer animations
      setTimeout(() => {
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = 'auto';
          gsap.set('.page-transition', { visibility: 'hidden' });
        }
      }, 5000);
    }
  );

  return (
    <Link
      ref={linkRef}
      to={back ? '#' : (to || '#')}
      {...rest}
      onClick={handleLinkClick}
      className="inline-flex items-center relative overflow-hidden group"
    >
      <span className="relative z-10 inline-block transition-all duration-300 ">
        {children}
      </span>
      
      
    </Link>
  );
};

export default TransitionLink;
