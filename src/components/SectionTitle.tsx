import { ReactNode } from 'react';

import { cn } from '../lib/utils';
import SvgSectionFlower from './SectionFlower';

interface Props {
    icon?: ReactNode;
    className?: string;
    classNames?: {
        container?: string;
        title?: string;
        icon?: string;
    };
    title: string;
}

const SectionTitle = ({ icon, title, className, classNames }: Props) => {
    return (
        <div
            className={cn(
                'flex items-center gap-4 mb-10',
                className,
                classNames?.container,
            )}
        >
            {icon ? (
                icon
            ) : (
                <SvgSectionFlower
                    width={25}
                    className={cn(
                        'animate-spin duration-8000',
                        classNames?.icon,
                    )}
                />
            )}
            <h2
                className={cn(
                'text-xl uppercase leading-none text-white',
                classNames?.title,
                )}
            >
                {title}
            </h2>
        </div>
    );
};

export default SectionTitle;
