import TransitionLink from './TransitionLink';
import { ProjectType } from '../lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef} from 'react';

interface Props {
  index: number;
  project: ProjectType;
  onMouseEnter: (_slug: string) => void;
  isSelected: boolean;
}

type TechItemRef = HTMLDivElement | null;

gsap.registerPlugin(useGSAP);

const Project = ({ index, project, onMouseEnter, isSelected }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLSpanElement>(null);
  const hoverElementRef = useRef<HTMLDivElement>(null);
  const techItemsRef = useRef<TechItemRef[]>([]);
  const externalLinkSVGRef = useRef<SVGSVGElement>(null);

  const { contextSafe } = useGSAP(() => {
    if (hoverElementRef.current) {
      gsap.set(hoverElementRef.current, {
        scaleX: 0,
        transformOrigin: 'left'
      });
    }

    return () => {
      // Cleanup GSAP animations
      if (hoverElementRef.current) gsap.killTweensOf(hoverElementRef.current);
      if (textWrapperRef.current) gsap.killTweensOf(textWrapperRef.current);
      techItemsRef.current.forEach(item => {
        if (item) gsap.killTweensOf(item);
      });
    };
  }, { scope: containerRef });

  const handleMouseEnter = contextSafe?.(() => {
    onMouseEnter(project.slug);
    
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    
    // Get SVG elements
    const arrowLine = externalLinkSVGRef.current?.querySelector('#arrow-line') as SVGPathElement;
    const arrowCurb = externalLinkSVGRef.current?.querySelector('#arrow-curb') as SVGPathElement;
    const box = externalLinkSVGRef.current?.querySelector('#box') as SVGPathElement;

    // Setup initial animation states
    gsap.set(box, {
      opacity: 0,
      strokeDasharray: box?.getTotalLength(),
      strokeDashoffset: box?.getTotalLength(),
    });
    gsap.set(arrowLine, {
      opacity: 0,
      strokeDasharray: arrowLine?.getTotalLength(),
      strokeDashoffset: arrowLine?.getTotalLength(),
    });
    gsap.set(arrowCurb, {
      opacity: 0,
      strokeDasharray: arrowCurb?.getTotalLength(),
      strokeDashoffset: arrowCurb?.getTotalLength(),
    });

    // Hover background animation
    tl.to(hoverElementRef.current, {
      scaleX: 1,
      duration: 0.8,
      transformOrigin: 'left'
    })
    // Text reveal animation
    .to(textWrapperRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'expo.out'
    }, '<0.1')
    // Tech stack items animation
    .to(techItemsRef.current, {
      opacity: 1,
      x: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out'
    }, '<0.3')
    // SVG animation
    .to(externalLinkSVGRef.current, {
      autoAlpha: 1,
    })
    .to(box, {
      opacity: 1,
      strokeDashoffset: 0,
    })
    .to(
      arrowLine,
      {
        opacity: 1,
        strokeDashoffset: 0,
      },
      '<0.2'
    )
    .to(arrowCurb, {
      opacity: 1,
      strokeDashoffset: 0,
    });
  });

  const handleMouseLeave = contextSafe?.(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
    
    tl.to(hoverElementRef.current, {
      scaleX: 0,
      duration: 0.8,
      transformOrigin: 'right'
    })
    .to(textWrapperRef.current, {
      yPercent: 0,
      duration: 0.7
    }, '<0.1')
    .to(techItemsRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.4,
      stagger: 0.05
    }, '<')
    .to(externalLinkSVGRef.current, {
      autoAlpha: 0,
    }, '<');
  });

  return (
    <TransitionLink
      to={`/projects/${project.slug}`}
      className={`group relative block py-6 md:py-8 border-b border-white/10 hover:border-transparent ${
        isSelected ? 'opacity-50' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        // Kill any active hover animations to prevent conflicts with page transition
        if (hoverElementRef.current) gsap.killTweensOf(hoverElementRef.current);
        if (textWrapperRef.current) gsap.killTweensOf(textWrapperRef.current);
        techItemsRef.current.forEach(item => {
          if (item) gsap.killTweensOf(item);
        });
        if (externalLinkSVGRef.current) gsap.killTweensOf(externalLinkSVGRef.current);
      }}
    >
      {/* Hover effect background */}
      <div
        ref={hoverElementRef}
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent origin-left transform pointer-events-none"
      />

      <div ref={containerRef} className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative overflow-hidden">
          {/* Index number */}
          <div className="md:w-24 flex-shrink-0">
            <span className="text-2xl anton-font text-white/50">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Main content */}
          <div className="flex-1 relative overflow-hidden">
            {/* Animated text wrapper */}
            <div className="relative overflow-hidden h-[1.5rem] min-h-[65px]">
              <h2 className="text-6xl md:text-6xl anton-font  text-white">
                <span className="block leading-tight">
                  {project.title}
                </span>
                <span
                  ref={textWrapperRef}
                  className="absolute inset-0 text-cyan-400/90 transform translate-y-full leading-tight"
                >
                  {project.title}
                </span>
              </h2>
            </div>

            {/* Tech stack animated items */}
            <div className="mt-4 flex gap-4 overflow-hidden">
              {project.techStack.slice(0, 4).map((tech, index) => (
                <div
                  key={tech}
                  className="opacity-100 translate-x-0"
                >
                  <span className="text-xs md:text-sm text-white/60 hover:text-cyan-400 transition-colors">
                    {tech}
                  </span>
                  {index < project.techStack.slice(0, 4).length - 1 && (
                    <span className="mx-2 text-white/30">/</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </TransitionLink>
  );
};

export default Project;
