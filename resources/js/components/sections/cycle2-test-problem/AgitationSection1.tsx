import { AlertTriangle, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const timelineItems = [
    {
        period: 'Minggu ini',
        description: 'Skor masih belum cukup',
        number: '1',
    },
    {
        period: '2 minggu lagi',
        description: 'Deadline pendaftaran',
        number: '2',
    },
    {
        period: 'Setelah deadline',
        description: 'Kesempatan ini hilang minimum 12 bulan',
        number: '3',
        isHighlight: true,
    },
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-3 sm:px-4">
                {/* Warning Badge */}
                <div className="text-center mb-6 md:mb-8">
                    <div
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 md:mb-6"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <AlertTriangle size={12} />
                        <span className="hidden sm:inline">INI YANG TERJADI KALAU SKOR TIDAK TERCAPAI TEPAT WAKTU</span>
                        <span className="sm:hidden">INI YANG TERJADI KALAU SKOR TIDAK TERCAPAI</span>
                    </div>

                    {/* Main Headline */}
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-black mb-5"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Deadline Terlewat{' '}
                        <span style={{ color: '#D70808' }}>Bukan Berarti</span>{' '}
                        <br className="hidden sm:block" />
                        Coba Lagi Bulan Depan.
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="text-sm sm:text-base md:text-lg leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto"
                        style={{ color: '#5a5a5a' }}
                    >
                        Untuk LPDP, itu artinya tunggu{' '}
                        <span className="font-bold" style={{ color: '#151515' }}>
                            1 tahun lagi
                        </span>
                        . Untuk CPNS, batch berikutnya belum tentu ada. Untuk
                        kampus impian, pendaftaran tutup dan harus nunggu tahun
                        depan.
                    </p>
                </div>

                {/* Timeline Cards */}
                <div className="space-y-2 md:space-y-3 mb-8 md:mb-10">
                    {timelineItems.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-lg md:rounded-xl p-3 md:p-4 transition-all duration-200"
                            style={{
                                backgroundColor: item.isHighlight
                                    ? '#FFF5F5'
                                    : '#FAFAFA',
                                border: item.isHighlight
                                    ? '2px solid #FFC7C7'
                                    : '2px solid #f0f0f0',
                            }}
                        >
                            <div className="flex items-start gap-2 md:gap-3">
                                {/* Number Circle */}
                                <div
                                    className="flex-shrink-0 w-8 md:w-9 h-8 md:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base"
                                    style={{
                                        backgroundColor: '#D70808',
                                    }}
                                >
                                    {item.number}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="font-bold text-sm md:text-base mb-0.5 md:mb-1"
                                        style={{
                                            color: '#B33030',
                                        }}
                                    >
                                        {item.period}
                                    </h3>
                                    <p
                                        className="text-xs md:text-sm"
                                        style={{
                                            color: '#7a7a7a',
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Motivational Text */}
                <p
                    className="text-center text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6"
                    style={{ color: '#3d3d3d' }}
                >
                    Tapi ini bukan tentang menakut-nakuti. Ini tentang
                    realita yang sudah kamu tahu sendiri, makanya kamu
                    sampai di sini.
                </p>

                {/* Good News Box */}
                <div
                    className="rounded-lg md:rounded-2xl p-4 md:p-6"
                    style={{
                        backgroundColor: '#FFF5F5',
                        border: '2px solid #FFC7C7',
                    }}
                >
                    <p
                        className="text-center text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3"
                        style={{ color: '#151515' }}
                    >
                        Kabar baiknya: 15 hari masih cukup{' '}
                        <span style={{ color: '#D70808' }}>
                            kalau caranya benar.
                        </span>
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="#value"
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold hover:gap-3 transition-all"
                            style={{ color: '#D70808' }}
                        >
                            Lihat bagaimana caranya
                            <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
