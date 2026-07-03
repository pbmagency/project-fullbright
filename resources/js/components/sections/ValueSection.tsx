import { BookOpen, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';

const pillars = [
    { Icon: Target,    accentColor: '#D70808', borderColor: '#D70808', title: 'TOEFL Pattern Recognition Method™',  desc: 'Kamu tidak perlu hafal semua soal. Cukup kenali polanya, karena soal TOEFL selalu berulang. Ini yang bikin alumni kami bisa naik skor dalam waktu singkat.' },
    { Icon: Zap,       accentColor: '#151515', borderColor: '#151515', title: 'Shortcut Structure Framework™',       desc: 'Grammar terasa susah karena kamu belajar semuanya. Kami hanya ajarkan struktur yang benar-benar keluar di tes. Lebih cepat, lebih efektif, tanpa buku tebal.' },
    { Icon: TrendingUp,accentColor: '#D70808', borderColor: '#D70808', title: 'Score-Focused Learning System™',      desc: 'Kami tidak ajarkan semua. Kami hanya ajarkan yang tepat. Materi high-impact, pola yang paling sering muncul, dan jebakan yang paling banyak menjatuhkan skor.' },
];

const whyPoints = [
    { Icon: BookOpen,   title: 'Lembaga Resmi ITP & IIEF Jakarta',          why: 'Sertifikat terjamin sah, langsung diterima untuk syarat beasiswa, CPNS, dan rekrutmen.' },
    { Icon: Users,      title: 'Pengajar Praktisi Skor 600+',               why: 'Belajar dari yang sudah membuktikannya sendiri, bukan yang hanya tahu teori.' },
    { Icon: TrendingUp, title: 'Alumni Lulus Beasiswa ke Luar Negeri',      why: 'UK, Jerman, Australia: bukti nyata metode ini bekerja, bukan sekadar janji.' },
    { Icon: Clock,      title: 'Cukup 1 Jam 1 Hari, Fleksibel',           why: 'Cocok untuk karyawan dan mahasiswa sibuk. Tidak perlu luangkan waktu berjam-jam.' },
];

export default function ValueSection() {
    return (
        <>
            <div style={{ lineHeight: 0, marginTop: '-1px', backgroundColor: '#F3F3F3' }}>
                <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '56px' }}>
                    <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,0 L0,0 Z" fill="#ffffff" />
                </svg>
            </div>

            <SectionWrapper id="value" bg="white" className="py-20 md:py-28">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        💡 Metode Eksklusif Full Bright
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Belajar Pola, <span style={{ color: '#D70808' }}>Bukan Menghafal</span> Ribuan Soal.
                    </h2>
                    <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
                        Ini cara Full Bright membantu <strong style={{ color: '#151515' }}>45.000+ orang</strong> akhirnya lolos beasiswa dan karir impian mereka, hanya dengan mengubah cara belajarnya.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-14">
                    {/* Cara Lama — kiri */}
                    <div className="rounded-2xl p-6 flex flex-col gap-3 border-2 border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-300"><BookOpen size={16} color="white" /></div>
                            <p className="font-black text-sm text-gray-400" style={{ fontFamily: 'var(--font-heading)' }}>Cara Lama ✗</p>
                        </div>
                        {['Hafal ratusan rumus grammar dari buku tebal', 'Belajar berbulan-bulan tanpa arah yang jelas', 'Skor stuck di tempat meski sudah kerja keras', 'Tidak tahu bagian mana yang paling penting di tes'].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-300" />{t}
                            </div>
                        ))}
                    </div>
                    {/* Metode Full Bright — kanan */}
                    <div className="rounded-2xl p-6 flex flex-col gap-3 border-2" style={{ borderColor: '#D70808', backgroundColor: '#FFF0F0' }}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D70808' }}><Target size={16} color="white" /></div>
                            <p className="font-black text-sm" style={{ color: '#D70808', fontFamily: 'var(--font-heading)' }}>Metode Full Bright ✓</p>
                        </div>
                        {['Belajar pola soal yang paling sering keluar', '1 jam per hari sudah cukup, tidak ganggu aktivitas', 'Skor naik signifikan dalam 15 hari', 'Dianalisa dan diuji pada 45.000+ alumni'].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-sm" style={{ color: '#151515' }}>
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#D70808' }} />{t}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {pillars.map(({ Icon, accentColor, borderColor, title, desc }) => (
                        <div key={title} className="rounded-2xl p-8 flex flex-col gap-5 border border-gray-100 hover:border-gray-200 hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-default" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderLeft: `4px solid ${borderColor}` }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: accentColor === '#D70808' ? '#FFF0F0' : '#F3F3F3' }}>
                                <Icon size={22} color={accentColor} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black text-base leading-snug" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>{title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{desc}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <LpButton href="#pricing" size="md">Mulai Belajar Sekarang →</LpButton>
                        <LpButton href="#testimonials" variant="ghost" size="md">Lihat Bukti Alumni →</LpButton>
                    </div>
                    <SocialProofMicro />
                </div>
            </SectionWrapper>

            <SectionWrapper bg="cultured" className="py-20 md:py-24">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>🏅 Mengapa Full Bright?</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Mengapa <span style={{ color: '#D70808' }}>45.000+</span> Orang Memilih Full Bright?
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
                    {whyPoints.map(({ Icon, title, why }) => (
                        <div key={title} className="flex items-start gap-4 bg-white rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#D70808' }}><Icon size={16} color="white" /></div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold leading-snug" style={{ color: '#151515' }}>{title}</p>
                                <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{why}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <LpButton href="#pricing" size="md">Mulai Belajar Sekarang →</LpButton>
                        <LpButton href="#testimonials" variant="ghost" size="md">Lihat Bukti Alumni →</LpButton>
                    </div>
                    <SocialProofMicro />
                </div>
            </SectionWrapper>
        </>
    );
}
