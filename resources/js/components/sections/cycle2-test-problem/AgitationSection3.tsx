import { AlertTriangle, ArrowDown, X } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const contrastItems = [
    {
        wrong: 'Hafal ratusan grammar',
        why: 'Tidak keluar di tes',
    },
    {
        wrong: 'Belajar tiap hari tanpa struktur',
        why: 'Tidak tahu bagian mana yang keluar di test',
    },
    {
        wrong: 'Coba soal acak dari internet',
        why: 'Tidak mencerminkan pola soal asli',
    },
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-3xl mx-auto">
                {/* Section Label */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> Kenapa Skor TOEFL Kamu Belum Naik-naik?
                    </div>

                    {/* Headline */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Bukan Karena Kamu <span style={{ color: '#D70808' }}>Kurang Keras Belajar.</span>
                    </h2>

                    {/* Body Copy */}
                    <p className="text-base leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: '#3d3d3d' }}>
                        Kebanyakan orang belajar TOEFL dengan cara yang dirancang untuk <span className="font-bold" style={{ color: '#151515' }}>belajar inggris jangka panjang</span>, bukan untuk <span className="font-bold" style={{ color: '#151515' }}>naik skor dalam waktu singkat</span>. Wajar kalau hasilnya <span className="font-bold" style={{ color: '#151515' }}>stagnan</span> meski sudah usaha keras.
                    </p>
                </div>

                {/* 2 Column Contrast */}
                <div className="mb-12 rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}>
                    {/* Header Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <div className="font-bold" style={{ color: '#151515' }}>Yang Selama Ini Kamu Lakukan</div>
                        <div className="font-bold" style={{ color: '#151515' }}>Kenapa Tidak Efektif</div>
                    </div>

                    {/* Contrast Items */}
                    <div className="space-y-4">
                        {contrastItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 pb-4" style={{ borderBottom: index < contrastItems.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                                <div style={{ color: '#3d3d3d' }}>{item.wrong}</div>
                                <div style={{ color: '#3d3d3d' }}>{item.why}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="text-center space-y-4">
                    <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                        TOEFL itu bukan tes kecerdasan. Tapi Ini tes pola. Dan pola bisa dipelajari dalam waktu jauh lebih singkat dari yang kamu kira.
                    </p>
                    
                    <p className="text-base font-bold leading-relaxed" style={{ color: '#151515' }}>
                        Ini yang kami lakukan berbeda
                    </p>

                    <div className="flex justify-center mt-4">
                        <ArrowDown size={24} style={{ color: '#151515' }} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
