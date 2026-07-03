import { AlertTriangle, ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const bulletPoints = [
    'Deadline LPDP / CPNS tinggal hitungan minggu',
    'Udah belajar sendiri tapi skor ga naik juga',
    'Takut kesempatan ini lewat cuma karena masalah skor',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-3xl mx-auto">
                {/* Section Label */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> SEBELUM KAMU LANJUT BACA
                    </div>

                    {/* Headline */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        IPK Kamu Bagus, <span style={{ color: '#D70808' }}>Niat Ada.</span> Tapi <span style={{ color: '#D70808' }}>Skor TOEFL Belum Sampai.</span>
                    </h2>
                </div>

                {/* Bullet Points */}
                <div className="mb-10 max-w-2xl mx-auto">
                    {bulletPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D70808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13.207 19.793a.707.707 0 0 1-1.207-.5V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1V4.707a.707.707 0 0 1 1.207-.5l6.94 6.94a1.207 1.207 0 0 1 0 1.707z"/>
                                </svg>
                            </div>
                            <p className="text-base md:text-lg font-medium" style={{ color: '#151515' }}>
                                {point}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Closing Bridge */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                        Kami paham rasanya. Bukan karena kamu tidak mampu. Tapi karena cara belajar TOEFL yang kebanyakan orang pakai memang tidak dirancang untuk kejar waktu.
                    </p>
                    
                    <p className="text-base font-bold leading-relaxed" style={{ color: '#151515' }}>
                        Di bawah ini, kenapa kami bisa bantu kamu dan apa yang berbeda
                    </p>

                    <div className="flex justify-center mt-6">
                        <ArrowDown size={24} style={{ color: '#151515' }} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
