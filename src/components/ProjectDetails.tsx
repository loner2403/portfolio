import parse from 'html-react-parser';
import TransitionLink from './TransitionLink';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PROJECTS } from '../lib/data';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProjectDetails = () => {
    const { slug } = useParams();
    const project = PROJECTS.find(p => p.slug === slug);

    if (!project) {
        return <div>Project not found</div>;
    }
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            if (window.innerWidth < 992) return;

            gsap.to('#info', {
                filter: 'blur(3px)',
                autoAlpha: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: '#info',
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            gsap.utils
                .toArray<HTMLDivElement>('#images > div')
                .forEach((imageDiv, i) => {
                    gsap.to(imageDiv, {
                        backgroundPosition: `center 0%`,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: imageDiv,
                            start: () => (i ? 'top bottom' : 'top 50%'),
                            end: 'bottom top',
                            scrub: true,
                        },
                    });
                });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-5 pb-14 text-white bg-background min-h-screen">
            <div className="container" ref={containerRef}>
                <div className="flex justify-between items-center mb-6 md:mb-16 px-6 md:pl-12 md:pr-0">
                    <TransitionLink
                        back={true}
                        className="inline-flex items-center group"
                    >
                        <ArrowLeft className="size-6 group-hover:-translate-x-1 transition-all duration-300" />
                        <span className="ml-2 md:inline hidden">Back</span>
                    </TransitionLink>
                    
                    
                </div>

                <div
                    className="top-0 md:min-h-[calc(100svh-100px)] flex"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mx-auto mb-6 md:mb-10 max-w-4xl px-6 md:pl-12 md:pr-0">
                            <h1 className="fade-in-later opacity-0 text-4xl md:text-[60px] leading-tight md:leading-none anton-font overflow-hidden">
                                <span className="inline-block">
                                    {project.title}
                                </span>
                            </h1>

                            <div className="fade-in-later opacity-0 flex gap-2">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <Github size={30} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <ExternalLink className="size-6 md:size-8" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-4xl space-y-6 md:space-y-7 pb-6 md:pb-20 mx-auto px-6 md:pl-12 md:pr-0">
                            <div className="fade-in-later">
                                <p className="text-muted-foreground anton-font mb-2 md:mb-3 text-lg">
                                    Year
                                </p>
                                <div className="text-base md:text-lg">{project.year}</div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground anton-font mb-2 md:mb-3 text-lg">
                                    Tech & Technique
                                </p>
                                <div className="text-base md:text-lg leading-relaxed">
                                    {project.techStack.join(', ')}
                                </div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground anton-font mb-2 md:mb-3 text-lg">
                                    Description
                                </p>
                                <div className="text-base md:text-lg prose-xl markdown-text">
                                    {parse(project.description)}
                                </div>
                            </div>
                            {project.role && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground anton-font mb-2 md:mb-3 text-lg">
                                        My Role
                                    </p>
                                    <div className="text-base md:text-lg">
                                        {parse(project.role)}
                                    </div>
                                </div>
                            )}
                        </div>

                        
                    </div>
                </div>

                <div
                    className="fade-in-later relative left-1/2 -translate-x-1/2 w-screen ml-2 px-6 md:pl-12 md:pr-0 mt-10 md:mt-20"
                    id="images"
                >
                    <div className="flex flex-col gap-8 md:gap-14 max-w-screen-2xl mx-auto">
                        {project.images.map((image, idx) => (
                            <div
                                key={idx}
                                className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl bg-transparent shadow-lg transition-all duration-500 hover:shadow-xl"
                            >
                                <img
                                    src={image}
                                    alt={`Project image ${idx + 1}`}
                                    className="w-full h-auto max-h-[80vh] object-contain"
                                />
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 bg-background/70 text-foreground size-10 md:size-12 inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 rounded-full backdrop-blur"
                                >
                                    <ExternalLink className="size-5 md:size-6" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;