import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Assuming these are your local imports that you'll need to adjust
import { MY_STACK } from '../lib/data';
import SectionTitle from './SectionTitle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const slideUpEl = containerRef.current?.querySelectorAll('.slide-up');

            if (!slideUpEl?.length) return;

            slideUpEl.forEach((element, index) => {
                gsap.set(element, { 
                    opacity: 0,
                    y: 120, 
                    scale: 0.7
                });
                
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%", 
                        end: "top 60%",
                        toggleActions: "play none none none",
                        // markers: true, // Remove in production
                    },
                    delay: index * 0.05
                });
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: -150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    return (
        <section id="my-stack" ref={containerRef} className="py-12 md:py-24 min-h-[100vh] overflow-hidden">
            <div className="container">
                <div className="px-4 md:px-10 lg:px-20">
                    <SectionTitle title="My Stack" />
                    <div className="space-y-14 md:space-y-20 text-white">
                        {Object.entries(MY_STACK).map(([key, value]) => (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" key={key}>
                                <div className="md:col-span-4 lg:col-span-3">
                                    <p className="slide-up text-4xl md:text-5xl anton-font leading-none text-muted-foreground uppercase mb-6 md:mb-0">
                                        {key}
                                    </p>
                                </div>

                                <div className="md:col-span-8 lg:col-span-9">
                                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
                                        {value.map((item) => (
                                            <div
                                                className="slide-up flex flex-col xs:flex-row items-center gap-3 group"
                                                key={item.name}
                                            >
                                                <div className="w-18 h-18 xs:w-20 xs:h-20 md:w-24 md:h-24 flex items-center justify-center bg-background-light/20 p-4 rounded-lg group-hover:bg-background-light/40 group-hover:scale-110 transition-all duration-300">
                                                    <img
                                                        src={item.icon}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <span className="text-base xs:text-lg md:text-xl font-medium whitespace-nowrap capitalize mt-2 xs:mt-0 group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
