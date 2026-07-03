import { type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';

interface LpButtonProps {
    children: ReactNode;
    variant?: Variant;
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    fullWidth?: boolean;
    target?: string;
    rel?: string;
}

export default function LpButton({
    children,
    variant = 'primary',
    size = 'md',
    href,
    onClick,
    className = '',
    fullWidth = false,
    target,
    rel,
}: LpButtonProps) {
    const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-200 cursor-pointer';

    const sizes: Record<string, string> = {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-7 py-3.5 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClass: Record<Variant, string> = {
        primary:  'text-white',
        secondary:'text-white',
        outline:  'border-2 bg-transparent border-[#D70808] text-[#D70808]',
        ghost:    'border-2 bg-transparent border-[#151515] text-[#151515]',
        whatsapp: 'text-white',
    };

    const styles: Record<Variant, React.CSSProperties> = {
        primary:  { backgroundColor: '#D70808', boxShadow: '0 4px 20px rgba(215,8,8,0.35)' },
        secondary:{ backgroundColor: '#151515' },
        outline:  {},
        ghost:    {},
        whatsapp: { backgroundColor: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' },
    };

    const hoverClass: Record<Variant, string> = {
        primary:  'hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(215,8,8,0.5)] active:translate-y-0',
        secondary:'hover:brightness-110 hover:-translate-y-1 active:translate-y-0',
        outline:  'hover:bg-red-50 hover:border-red-400 hover:text-red-500 hover:-translate-y-1 active:translate-y-0',
        ghost:    'hover:bg-gray-100 hover:border-gray-400 hover:text-gray-500 hover:-translate-y-1 active:translate-y-0',
        whatsapp: 'hover:brightness-105 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(37,211,102,0.45)] active:translate-y-0',
    };

    const cls = `${base} ${sizes[size]} ${variantClass[variant]} ${hoverClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

    if (href) {
        return <a href={href} onClick={onClick} className={cls} style={styles[variant]} target={target} rel={rel}>{children}</a>;
    }
    return <button type="button" onClick={onClick} className={cls} style={styles[variant]}>{children}</button>;
}
