import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import  { useRef } from 'react';

gsap.registerPlugin(useGSAP);

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ParticleBackground = () => {
    const particlesRef = useRef<HTMLDivElement[]>([]);

    const particleCount = window.innerWidth < 768 ? 20 : 40;

    useGSAP(() => {
        if (prefersReducedMotion()) return;

        const tweens = particlesRef.current.map((particle) => {
            gsap.set(particle, {
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.5,
                left: Math.random() * window.innerWidth,
                top: Math.random() * (window.innerHeight + 1),
            });

            return gsap.to(particle, {
                y: window.innerHeight,
                duration: Math.random() * 10 + 10,
                opacity: 0,
                repeat: -1,
                ease: 'none',
                // yoyo: true,
            });
        });

        const handleVisibility = () => {
            if (document.hidden) {
                tweens.forEach((tween) => tween.pause());
            } else {
                tweens.forEach((tween) => tween.play());
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            tweens.forEach((tween) => tween.kill());
        };
    }, []);

    if (prefersReducedMotion()) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {[...Array(particleCount)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current.push(el!);
                    }}
                    className="absolute rounded-full bg-white"
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
