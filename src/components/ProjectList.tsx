import SectionTitle from '../components/SectionTitle';
import { PROJECTS } from '../lib/data';
import { cn } from '../lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef, useState, MouseEvent } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectListRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS[0].slug,
    );

    useGSAP(
        (_, contextSafe) => {
            if (window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const handleMouseMove = contextSafe?.((e: MouseEvent) => {
                if (!containerRef.current || !imageContainer.current) return;

                const containerRect = containerRef.current.getBoundingClientRect();
                const imageRect = imageContainer.current.getBoundingClientRect();
                const offsetTop = e.clientY - containerRect.y;

                if (
                    containerRect.y > e.clientY ||
                    containerRect.bottom < e.clientY ||
                    containerRect.x > e.clientX ||
                    containerRect.right < e.clientX
                ) {
                    return gsap.to(imageContainer.current, {
                        duration: 0.3,
                        opacity: 0,
                    });
                }

                // Clamp preview within the container so the top/bottom never get cut off
                let targetY = offsetTop - imageRect.height / 2;
                const minY = 0;
                const maxY = Math.max(0, containerRect.height - imageRect.height);
                if (targetY < minY) targetY = minY;
                if (targetY > maxY) targetY = maxY;

                gsap.to(imageContainer.current, {
                    y: targetY,
                    duration: 1,
                    opacity: 1,
                });
            }) as any;

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        },
        { scope: containerRef, dependencies: [containerRef.current] },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }
        setSelectedProject(slug);
    };

    return (
        <section className="pb-section pl-5 md:pl-25" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-[200px] top-0 z-[1] pointer-events-none w-[200px] xl:w-[350px] aspect-[3/4] overflow-hidden opacity-0"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project) => (
                                <img
                                    src={project.longThumbnail}
                                    alt="Project"
                                    width={400}
                                    height={500}
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500 w-full h-full object-contain object-top',
                                        {
                                            'opacity-0': project.slug !== selectedProject,
                                        },
                                    )}
                                    ref={imageRef}
                                    key={project.slug}
                                />
                            ))}
                        </div>
                    )}

                    <div
                        className="flex flex-col max-md:gap-10"
                        ref={projectListRef}
                    >
                        {PROJECTS.map((project, index) => (
                        <Project
                            index={index}
                            project={project}
                            onMouseEnter={handleMouseEnter}
                            isSelected={selectedProject !== null && selectedProject !== project.slug}
                            key={project.slug}
                        />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
