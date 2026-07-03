import { Shield, Star, Users } from 'lucide-react';

interface SocialProofMicroProps {
    variant?: 'default' | 'light' | 'badges';
}

export default function SocialProofMicro({ variant = 'default' }: SocialProofMicroProps) {
    if (variant === 'badges') {
        return (
            <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                    <Star size={10} fill="#B45309" color="#B45309" /> 4.9/5
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#F0FDF4', color: '#15803d' }}>
                    <Users size={10} /> 45.000+
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#EFF6FF', color: '#1d4ed8' }}>
                    <Shield size={10} /> Garansi 100%
                </span>
            </div>
        );
    }

    const color = variant === 'light' ? 'rgba(255,255,255,0.75)' : '#6b7280';

    return (
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mt-3">
            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
                <span className="ml-1">4.9/5 Google Review</span>
            </span>
            <span className="text-xs" style={{ color }}>•</span>
            <span className="text-xs font-semibold" style={{ color }}>45.000+ Alumni Sukses</span>
            <span className="text-xs" style={{ color }}>•</span>
            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}><Shield size={11} />Garansi 100%</span>
        </div>
    );
}
