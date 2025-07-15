'use client';
import { GENERAL_INFO, SOCIAL_LINKS } from '../lib/data';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const socialIcons = {
        github: <Github size={24} />,
        linkedin: <Linkedin size={24} />
        // Add more social icons as needed
    };

    return (
        <footer className="text-center py-10 mt-20 border-t border-white/10 text-white" id="contact">
            <div className="container mx-auto px-4">
                <p className="text-lg text-muted-foreground">Have a project in mind?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-3xl sm:text-4xl anton-font inline-flex items-center gap-2 mt-4 mb-10 hover:text-primary transition-colors"
                >
                    <Mail className="size-6" />
                    {GENERAL_INFO.email}
                </a>

                <div className="flex flex-col items-center">
                    <div className="flex gap-6 mb-5">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label={social.name}
                            >
                                {socialIcons[social.name as keyof typeof socialIcons]}
                            </a>
                        ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Harshal Lade. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;