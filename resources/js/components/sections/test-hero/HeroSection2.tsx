import { ShieldCheck, Star, Award, Users } from 'lucide-react';
import { memo } from 'react';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const stats = [
    { icon: <Users size={18} />, value: '45.000+', label: 'Alumni Sukses' },
    { icon: <Star size={18} />, value: '4.9/5', label: 'Rating Alumni' },
    { icon: <Award size={18} />, value: '13+', label: 'Tahun Pengalaman' },
    {
        icon: <ShieldCheck size={18} />,
        value: 'Resmi',
        label: 'Lembaga ITP & IIEF',
    },
];

export default memo(function HeroSection() {
    const { trackCTA } = useAnalytics();

    return (
        <section
            id="hero"
            className="relative overflow-hidden"
            style={{
                background: 'linear-gradient(160deg, #fff 55%, #FFF5F5 100%)',
            }}
        >
            <div
                className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full md:-top-24 md:-right-24"
                style={{
                    backgroundColor: '#D70808',
                    filter: 'blur(120px)',
                    opacity: 0.07,
                }}
            />
            <div
                className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full md:-bottom-16 md:-left-16"
                style={{
                    backgroundColor: '#151515',
                    filter: 'blur(100px)',
                    opacity: 0.05,
                }}
            />

            <div className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 md:pt-10 md:pb-14 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* Left column — text content, full-width on mobile */}
                    <div className="flex flex-col gap-3 lg:gap-4">
                        {/* a. Badges */}
                        <div className="flex flex-wrap gap-2">
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide"
                                style={{
                                    backgroundColor: '#FFF0F0',
                                    color: '#D70808',
                                    border: '1px solid #ffb3b3',
                                }}
                            >
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill="#ffd000"
                                            color="#ffd000"
                                        />
                                    ))}
                                </div>
                                <span className="tracking-widest uppercase">
                                    45.000+ ALUMNI
                                </span>
                                <div className="ml-2 flex items-center -space-x-2">
                                    <img
                                        src="/people/People 1.webp"
                                        alt="alumni"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 2.webp"
                                        alt="alumni"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 3.webp"
                                        alt="alumni"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* b. Headline */}
                        <h1
                            className="text-3xl leading-tight font-black sm:text-4xl lg:text-[2.75rem]"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                color: '#151515',
                            }}
                        >
                            Capai{' '}
                            <span style={{ color: '#D70808' }}>
                                TOEFL 500+ Dalam 15 Hari
                            </span>{' '}
                            Untuk LPDP Dan CPNS Yang{' '}
                            <span style={{ color: '#D70808' }}>
                                Sisa 1 Bulan Lagi{' '}
                            </span>
                        </h1>

                        {/* c. Sub-copy */}
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: '#3d3d3d' }}
                        >
                            <strong style={{ color: '#151515' }}>
                                Persiapkan skor TOEFL-mu
                            </strong>{' '}
                            sekarang dengan strategi{' '}
                            <strong style={{ color: '#151515' }}>
                                belajar 1 jam sehari
                            </strong>{' '}
                            yang telah membantu{' '}
                            <strong style={{ color: '#151515' }}>
                                45.000+ alumni.
                            </strong>
                        </p>

                        {/* d. Trust badges */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Lembaga Resmi ITP & IIEF',
                                '13+ Tahun Pengalaman',
                            ].map((b) => (
                                <span
                                    key={b}
                                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
                                    style={{
                                        backgroundColor: '#FFF0F0',
                                        color: '#D70808',
                                        border: '1px solid #ffb3b3',
                                    }}
                                >
                                    ✓ {b}
                                </span>
                            ))}
                        </div>

                        {/* e. CTA buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <LpButton
                                href="#pricing"
                                size="md"
                                fullWidth
                                className="sm:w-auto"
                                onClick={() =>
                                    trackCTA(
                                        'hero_primary',
                                        'Mulai Belajar Sekarang',
                                        '#pricing',
                                    )
                                }
                            >
                                Mulai Belajar Sekarang →
                            </LpButton>
                            <LpButton
                                href="#testimonials"
                                variant="ghost"
                                size="md"
                                fullWidth
                                className="sm:w-auto"
                                onClick={() =>
                                    trackCTA(
                                        'hero_secondary',
                                        'Lihat Bukti Alumni',
                                        '#testimonials',
                                    )
                                }
                            >
                                Lihat Bukti Alumni →
                            </LpButton>
                        </div>

                        <SocialProofMicro />
                    </div>

                    {/* Right column — score card, desktop only */}
                    <div className="hidden justify-center lg:flex">
                        <div className="w-full max-w-[360px]">
                            <div className="relative">
                                <div
                                    className="rounded-3xl p-8 text-white"
                                    style={{
                                        background:
                                            'linear-gradient(145deg, #3d6ab0 0%, #1e3a6e 100%)',
                                        boxShadow:
                                            '0 24px 80px rgba(30,58,110,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    }}
                                >
                                    <p className="mb-2 text-sm font-semibold opacity-75">
                                        Rata-rata skor TOEFL alumni kami
                                    </p>
                                    <div className="mb-2 flex items-end gap-3">
                                        <p
                                            className="text-6xl font-black"
                                            style={{
                                                fontFamily:
                                                    'var(--font-heading)',
                                                color: '#F59E0B',
                                            }}
                                        >
                                            527
                                        </p>
                                        <div className="pb-1">
                                            <p
                                                className="text-sm font-black"
                                                style={{ color: '#4ade80' }}
                                            >
                                                +100 poin
                                            </p>
                                            <p className="text-xs opacity-60">
                                                rata-rata kenaikan
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="mb-6 h-px"
                                        style={{
                                            backgroundColor:
                                                'rgba(255,255,255,0.15)',
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        {stats.map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-2xl p-3 text-center"
                                                style={{
                                                    backgroundColor:
                                                        'rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                <p
                                                    className="mb-0.5 text-xl font-black"
                                                    style={{
                                                        fontFamily:
                                                            'var(--font-heading)',
                                                    }}
                                                >
                                                    {s.value}
                                                </p>
                                                <p className="text-xs opacity-70">
                                                    {s.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className="absolute -bottom-5 -left-4 flex max-w-[220px] items-center gap-3 rounded-2xl bg-white px-4 py-3"
                                    style={{
                                        boxShadow:
                                            '0 8px 32px rgba(0,0,0,0.14)',
                                    }}
                                >
                                    <span className="text-2xl">🎓</span>
                                    <p
                                        className="text-xs leading-snug font-black"
                                        style={{
                                            color: '#151515',
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Alumni kami tersebar di seluruh dunia
                                    </p>
                                </div>

                                <div
                                    className="absolute -top-4 -right-4 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2"
                                    style={{
                                        boxShadow:
                                            '0 8px 32px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill="#F59E0B"
                                            color="#F59E0B"
                                        />
                                    ))}
                                    <span
                                        className="ml-1 text-xs font-black"
                                        style={{ color: '#151515' }}
                                    >
                                        4.9
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ lineHeight: 0, marginBottom: '-1px' }}>
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    className="h-8 w-full md:h-14"
                    style={{ display: 'block' }}
                >
                    <path
                        d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z"
                        fill="#F3F3F3"
                    />
                </svg>
            </div>
        </section>
    );
});
