import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';
import { waUrl } from '@/lib/wa-number';

const jadwalSlots = ['Pagi (09.00 – 10.00 WIB)', 'Siang (13.00 – 14.00 WIB)', 'Sore (16.00 – 17.00 WIB)', 'Malam (19.00 – 20.00 WIB)', 'Malam (20.15 – 21.15 WIB)'];

const faqs: { category: string; q: string; a: string; node?: ReactNode }[] = [
    {
        category: 'Jadwal & Format',
        q: 'Kapan jadwal kelas dan apakah bisa disesuaikan?',
        a: 'Kami menyediakan 5 pilihan sesi harian: Pagi (09.00–10.00 WIB), Siang (13.00–14.00 WIB), Sore (16.00–17.00 WIB), Malam (19.00–20.00 WIB), dan Malam (20.15–21.15 WIB). Jika berhalangan hadir LIVE ZOOM, jangan khawatir — materi bisa diakses di rekaman ZOOM.',
        node: (
            <div className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                <p className="mb-2.5" style={{ color: '#3d3d3d' }}>Pilihan Jam Belajar (Pilih Salah Satunya)</p>
                <ul className="flex flex-col gap-1.5 mb-3">
                    {jadwalSlots.map((s) => (
                        <li key={s} className="flex items-center gap-2">
                            <span className="font-black" style={{ color: '#D70808' }}>•</span> {s}
                        </li>
                    ))}
                </ul>
                <p className="text-xs italic" style={{ color: '#6b7280' }}>Catatan: Jika berhalangan hadir LIVE ZOOM, jangan khawatir — materi bisa diakses di rekaman ZOOM.</p>
            </div>
        ),
    },
    { category: 'Jadwal & Format', q: 'Apakah kelasnya online atau offline?', a: 'Kelas berlangsung sepenuhnya secara online via Zoom. Kamu bisa mengikuti dari mana saja, baik dari rumah, kantor, maupun kafe. Yang kamu butuhkan hanya smartphone atau laptop dengan koneksi internet yang stabil.' },
    { category: 'Jadwal & Format', q: 'Bagaimana cara akses LMS dan materinya?', a: 'Setelah mendaftar dan melakukan pembayaran, kamu akan mendapatkan email berisi link dan akun untuk masuk ke platform LMS Full Bright. Di sana tersedia video e-course, e-book, dan bank soal yang bisa diakses kapan saja selama 2 tahun. Rekaman ZOOM juga bisa diakses seumur hidup.' },
    { category: 'Sertifikat & Legalitas', q: 'Apakah sertifikat Full Bright valid untuk melamar kerja atau kuliah?', a: 'Full Bright Indonesia adalah lembaga resmi dengan legalitas lengkap: SK Kemenkumham RI Nomor AHU-0055720-AH.0114 Tahun 2020, SK Izin Operasional LKP 503/20177/LKP/DPM-PTSP/8/2024, NPSN Nomor K9998700, dan bekerja sama dengan IIEF Jakarta. Sertifikat dapat digunakan untuk: Daftar Kuliah S1/S2/S3, Lamar Kerja, Seleksi CPNS, Rekrutmen BUMN, Ujian Skripsi, Kenaikan Pangkat, dan Pendaftaran Beasiswa.' },
    { category: 'Metode & Efektivitas', q: 'Apakah metode ini cocok untuk pemula yang grammar-nya sangat lemah?', a: 'Sangat cocok! Kurikulum kami dirancang dari level dasar menggunakan Pattern Recognition Method™. Kamu tidak perlu memiliki grammar yang sempurna untuk memulai. Instruktur kami akan membimbingmu dari fondasi dasar hingga pola soal yang paling sering keluar, langkah demi langkah.' },
    { category: 'Metode & Efektivitas', q: 'Berapa kenaikan skor yang bisa saya harapkan dalam 15 hari?', a: 'Berdasarkan data alumni kami, rata-rata peningkatan berkisar 80–100 poin dalam 15 hari bagi yang mengikuti program secara konsisten. Kuncinya sederhana: hadir di setiap sesi dan kerjakan semua bank soal yang diberikan.' },
    { category: 'Untuk Orang Sibuk', q: 'Bagaimana jika saya sangat sibuk bekerja atau kuliah?', a: 'Kelas Full Bright dirancang compact: hanya 60 menit per hari. Rekaman ZOOM tersedia dan bisa diakses seumur hidup, sehingga kamu bisa menonton ulang kapan saja. Banyak alumni kami adalah dokter, PNS aktif, dan karyawan korporat yang berhasil dengan keterbatasan waktu mereka.' },
    { category: 'Pendaftaran & Pembayaran', q: 'Bagaimana cara mendaftar dan metode pembayaran apa saja?', a: 'Pendaftaran sangat mudah: klik tombol "Mulai Belajar Sekarang" atau "Bayar Sekarang", pilih paket yang sesuai, lalu selesaikan pembayaran. Setelah pembayaran berhasil, kamu akan mendapatkan email konfirmasi beserta akses ke LMS dan grup WhatsApp kelas. Pembayaran dapat dilakukan via transfer bank, GoPay, OVO, DANA, dan QRIS.' },
    { category: 'Jaminan & Garansi', q: 'Apa yang terjadi jika saya tidak puas atau skor tidak sesuai harapan?', a: 'Garansi mengulang 1 bulan berlaku khusus untuk Paket Bundling. Jika setelah mengikuti program secara penuh dan konsisten skor kamu belum mencapai 500, kamu bisa claim garansi.' },
    { category: 'Pendaftaran & Pembayaran', q: 'Apa saja fasilitas yang didapat dan berapa harganya?', a: 'Kami menyediakan 3 paket: Starter (Rp 250.000) untuk 10 hari dengan target skor 450+, Intermediate (Rp 350.000) untuk 15 hari dengan target skor 500+, dan Bundling Starter + Intermediate (Rp 375.000) untuk 25 hari dengan target skor 500+ plus garansi mengulang. Setiap paket sudah termasuk LIVE ZOOM, rekaman, video materi, e-book, grup WA diskusi, placement test, post test, dan sertifikat TOEFL Prediction. Lihat detail lengkap di bagian Harga.' },
    { category: 'Metode & Efektivitas', q: 'Apakah ada batasan usia untuk mengikuti program ini?', a: 'Program Full Bright terbuka untuk peserta berusia 17 hingga 45 tahun. Cocok untuk pelajar, mahasiswa, fresh graduate, maupun karyawan yang ingin meningkatkan skor TOEFL untuk keperluan studi, karir, atau beasiswa.' },
    { category: 'Metode & Efektivitas', q: 'Apakah dijamin bisa mencapai skor 500?', a: 'Kami tidak bisa memberikan jaminan skor 500 secara mutlak karena hasil sangat tergantung pada kesungguhan dan konsistensi belajar masing-masing peserta. Yang bisa kami jamin: metode yang sudah terbukti pada 45.000+ alumni, materi yang fokus dan terstruktur, serta pendampingan penuh selama program. Peserta yang hadir konsisten dan mengerjakan semua latihan soal rata-rata mengalami kenaikan 80–100 poin dalam 15 hari.' },
];

const defaultOpen = new Set(['Kapan jadwal kelas dan apakah bisa disesuaikan?', 'Berapa kenaikan skor yang bisa saya harapkan dalam 15 hari?', 'Apa yang terjadi jika saya tidak puas atau skor tidak sesuai harapan?']);
const categories  = [...new Set(faqs.map((f) => f.category))];

const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
};

function FAQItem({ q, a, node }: { q: string; a: string; node?: ReactNode }) {
    const [open, setOpen] = useState(defaultOpen.has(q));
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button onClick={() => setOpen((o) => !o)} className="cursor-pointer w-full flex items-start justify-between text-left py-5 gap-4">
                <span className="text-sm font-bold leading-snug transition-colors duration-200" style={{ fontFamily: 'var(--font-heading)', color: open ? '#D70808' : '#151515' }}>{q}</span>
                <ChevronDown size={18} className="shrink-0 mt-0.5 transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: open ? '#D70808' : '#9ca3af' }} />
            </button>
            <div style={{ maxHeight: open ? '600px' : '0', overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)', opacity: open ? 1 : 0 }} className="transition-opacity duration-300">
                <div className="pb-6 pr-8">
                    {node ?? <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{a}</p>}
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const { trackCTA } = useAnalytics();
    const filtered = activeCategory ? faqs.filter((f) => f.category === activeCategory) : faqs;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <SectionWrapper id="faq" bg="cultured" className="pt-20 md:pt-28 pb-12 md:pb-16">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>❓ FAQ</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Pertanyaan yang Sering Ditanyakan <span style={{ color: '#D70808' }}>Sebelum Daftar</span>
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <button onClick={() => setActiveCategory(null)} className="cursor-pointer text-xs font-bold px-4 py-2 rounded-full transition-all" style={{ backgroundColor: activeCategory === null ? '#D70808' : '#fff', color: activeCategory === null ? '#fff' : '#D70808', border: '1.5px solid #D70808' }}>Semua</button>
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className="cursor-pointer text-xs font-bold px-4 py-2 rounded-full transition-all" style={{ backgroundColor: activeCategory === cat ? '#D70808' : '#fff', color: activeCategory === cat ? '#fff' : '#D70808', border: '1.5px solid #D70808' }}>{cat}</button>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto bg-white rounded-3xl px-7 py-2 mb-12" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                    {filtered.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} node={item.node} />)}
                </div>

                <div className="max-w-lg mx-auto text-center">
                    <p className="text-sm font-semibold mb-6" style={{ color: '#3d3d3d' }}>Masih ada pertanyaan lain? Hubungi kami sekarang.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-1">
                        <LpButton href={waUrl('Halo Admin Full Bright Indonesia. Saya minat mau daftar kelas TOEFL. Saya mau tanya-tanya dulu.')} size="md" onClick={() => {
                            try {
                                (window as { fbq?: (e: string, n: string, p?: object) => void }).fbq?.(
                                    'track', 'Search',
                                    { search_string: 'TOEFL Full Bright - WhatsApp Inquiry' },
                                );
                            } catch { /* fbq not loaded */ }
                            trackCTA('faq_primary', 'Chat Via WA', '#pricing');
                        }}>Chat Via WA →</LpButton>
                        <LpButton href="#testimonials" variant="ghost" size="md" onClick={() => trackCTA('faq_testimonials', 'Lihat Bukti Alumni', '#testimonials')}>Lihat Bukti Alumni →</LpButton>
                    </div>
                    <SocialProofMicro />
                </div>
            </SectionWrapper>
        </>
    );
}
