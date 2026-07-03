import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';

const mediaList = [
    { name: 'Kompas.com',  abbr: 'K' },
    { name: 'Liputan6',    abbr: 'L6' },
    { name: 'Detik.com',   abbr: 'D' },
    { name: 'Tribun News', abbr: 'TN' },
    { name: 'iNews',       abbr: 'iN' },
    { name: 'JPNN',        abbr: 'JP' },
];

export default function MediaCoverageSection() {
    return (
        <SectionWrapper bg="white" className="py-20">
            <div className="text-center mb-8">
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>
                    Diliput oleh Media Nasional sebagai Tempat Belajar TOEFL Online Terpercaya
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                {mediaList.map(m => (
                    <div key={m.name}
                        className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-200 select-none">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                            style={{ backgroundColor: '#151515', fontFamily: 'var(--font-heading)' }}>
                            {m.abbr.slice(0, 1)}
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: '#151515' }}>
                            {m.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition hover:brightness-110 hover:-translate-y-0.5"
                    style={{ backgroundColor: '#D70808', fontFamily: 'var(--font-heading)', boxShadow: '0 4px 20px rgba(215,8,8,0.3)' }}>
                    Mulai Belajar Bersama Kami →
                </a>
                <SocialProofMicro />
            </div>
        </SectionWrapper>
    );
}
