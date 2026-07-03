import { type ReactNode } from 'react';

interface SectionWrapperProps {
    children: ReactNode;
    bg?: 'white' | 'cultured' | 'dark';
    className?: string;
    id?: string;
}

export default function SectionWrapper({ children, bg = 'white', className = '', id }: SectionWrapperProps) {
    const backgrounds: Record<string, string> = {
        white:    'bg-white',
        cultured: 'bg-[#F3F3F3]',
        dark:     'bg-[#151515]',
    };

    return (
        <section id={id} className={`${backgrounds[bg]} ${className}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}
