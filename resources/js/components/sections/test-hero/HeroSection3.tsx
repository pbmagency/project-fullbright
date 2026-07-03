import { ShieldCheck, Star, Award, Users } from 'lucide-react';
import { memo } from 'react';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const stats = [
    { icon: <Users size={18} />, value: '45.000+', label: 'Alumni Sukses' },
    { icon: <Star size={18} />, value: '4.9/5', label: 'Rating Alumni' },
    { icon: <Award size={18} />, value: '13+', label: 'Tahun Pengalaman' },
    { icon: <ShieldCheck size={18} />, value: 'Resmi', label: 'Lembaga ITP & IIEF' },
];

export default memo(function HeroSection() {
    const { trackCTA } = useAnalytics();

    return (
        <section id="hero" className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #fff 55%, #FFF5F5 100%)' }}>
            <div className="absolute -top-32 -right-32 md:-top-24 md:-right-24 w-96 h-96 rounded-full pointer-events-none" style={{ backgroundColor: '#D70808', filter: 'blur(120px)', opacity: 0.07 }} />
            <div className="absolute -bottom-32 -left-32 md:-bottom-16 md:-left-16 w-72 h-72 rounded-full pointer-events-none" style={{ backgroundColor: '#151515', filter: 'blur(100px)', opacity: 0.05 }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 md:pt-10 md:pb-14">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* Left column — text content, full-width on mobile */}
                    <div className="flex flex-col gap-3 lg:gap-4">
                        {/* a. Badges */}
                        <div className="flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="#ffd000" color="#ffd000" />)}
                                </div>
                                <span className="uppercase tracking-widest">45.000+ ALUMNI</span>
                                <div className="flex items-center -space-x-2 ml-2">
                                    <img src="/people/People 1.webp" alt="alumni" loading="lazy" decoding="async" className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                                    <img src="/people/People 2.webp" alt="alumni" loading="lazy" decoding="async" className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                                    <img src="/people/People 3.webp" alt="alumni" loading="lazy" decoding="async" className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* b. Headline */}
                        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                            Raih Skor <span style={{ color: '#D70808' }}>TOEFL 500+</span> untuk Kampus dan Karir Impian dalam{' '}
                            <span style={{ color: '#D70808' }}>15 Hari</span>
                        </h1>

                        {/* c. Sub-copy */}
                        <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                            <strong style={{ color: '#151515' }}>Deadline LPDP, CPNS, atau rekrutmen semakin dekat?</strong> Pelajari pola soal yang paling sering muncul di tes, cukup <strong style={{ color: '#151515' }}>1 jam sehari</strong>, dan <strong style={{ color: '#151515' }}>tingkatkan skor TOEFL dalam 15 hari</strong>.
                        </p>

                        {/* d. Trust badges */}
                        <div className="flex flex-wrap gap-2">
                            {['Lembaga Resmi ITP & IIEF', '13+ Tahun Pengalaman'].map((b) => (
                                <span key={b} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                                    ✓ {b}
                                </span>
                            ))}
                        </div>

                        {/* e. CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <LpButton href="#pricing" size="md" fullWidth className="sm:w-auto" onClick={() => trackCTA('hero_primary', 'Mulai Belajar Sekarang', '#pricing')}>
                                Mulai Belajar Sekarang →
                            </LpButton>
                            <LpButton href="#testimonials" variant="ghost" size="md" fullWidth className="sm:w-auto" onClick={() => trackCTA('hero_secondary', 'Lihat Bukti Alumni', '#testimonials')}>
                                Lihat Bukti Alumni →
                            </LpButton>
                        </div>

                        <SocialProofMicro />
                    </div>

                    {/* Right column — score card, desktop only */}
                    <div className="hidden lg:flex justify-center">
                        <div className="w-full max-w-[360px]">
                            <div className="relative">
                                <div className="rounded-3xl p-8 text-white" style={{ background: 'linear-gradient(145deg, #3d6ab0 0%, #1e3a6e 100%)', boxShadow: '0 24px 80px rgba(30,58,110,0.45), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                                    <p className="text-sm font-semibold opacity-75 mb-2">Rata-rata skor TOEFL alumni kami</p>
                                    <div className="flex items-end gap-3 mb-2">
                                        <p className="text-6xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#F59E0B' }}>527</p>
                                        <div className="pb-1">
                                            <p className="text-sm font-black" style={{ color: '#4ade80' }}>+100 poin</p>
                                            <p className="text-xs opacity-60">rata-rata kenaikan</p>
                                        </div>
                                    </div>
                                    <div className="h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                    <div className="grid grid-cols-2 gap-3">
                                        {stats.map((s) => (
                                            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                <p className="text-xl font-black mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                                                <p className="text-xs opacity-70">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[220px]" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
                                    <span className="text-2xl">🎓</span>
                                    <p className="text-xs font-black leading-snug" style={{ color: '#151515', fontFamily: 'var(--font-heading)' }}>Alumni kami tersebar di seluruh dunia</p>
                                </div>

                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-3 py-2 flex items-center gap-1.5" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                                    <span className="text-xs font-black ml-1" style={{ color: '#151515' }}>4.9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ lineHeight: 0, marginBottom: '-1px' }}>
                <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-8 md:h-14" style={{ display: 'block' }}>
                    <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#F3F3F3" />
                </svg>
            </div>
        </section>
    );
});
