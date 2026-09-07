'use client';

import { useState } from 'react';
import { CheckCircle2, Globe, Lock, Shield, Star, XCircle } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics, generateEventId } from '@/hooks/use-analytics';
import { waUrl } from '@/lib/wa-number';

const WA_STARTER = waUrl(
    'Halo Admin Full Bright Indonesia. Saya minat mau daftar kelas TOEFL Level Starter',
);
const WA_INTER = waUrl(
    'Halo Admin Full Bright Indonesia. Saya minat mau daftar kelas TOEFL Level Intermediate.',
);
const WA_BUNDLING = waUrl(
    'Halo Admin Full Bright Indonesia. Saya minat mau daftar paket HEMAT TOEFL Level Starter + Intermediate.',
);
const WA_SELF = waUrl(
    'Halo Admin Full Bright Indonesia. Saya minat mau daftar E-Course TOEFL (Belajar Mandiri).',
);

const PG_STARTER =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';
const PG_INTER =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-intermediate-live-zoom-intensif-flash-sale';
const PG_BUNDLING =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';
const PG_SELF =
    'https://member.fullbrightindonesia.com/paket-gold-e-course-toefl';

type FeatureItem =
    | { type: 'check'; text: string; bold?: boolean }
    | { type: 'globe'; text: string; bold?: boolean }
    | { type: 'label'; text: string; bold?: boolean }
    | { type: 'cross'; text: string; bold?: boolean };

const starterFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 10 Hari', bold: true },
    {
        type: 'check',
        text: 'Akses Latihan Soal di LMS (Total 370+ Soal)',
        bold: true,
    },
    { type: 'check', text: 'Post Test (Full Test) 1x', bold: true },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    {
        type: 'check',
        text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi',
    },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '30+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure' },
    { type: 'check', text: 'E-Book Listening dan Reading' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '10+ Link Soal Tambahan saat LIVE ZOOM' },
    { type: 'check', text: 'Tutor Tanya AI 24 Jam di setiap materi' },
    { type: 'check', text: 'Pembahasan setiap soal di LMS' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    {
        type: 'globe',
        text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.',
    },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL' },
    { type: 'cross', text: 'Tidak termasuk garansi mengulang 1 bulan' },
];

const intermediateFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 15 Hari', bold: true },
    {
        type: 'check',
        text: 'Akses Latihan Soal di LMS (Total 1000+ Soal)',
        bold: true,
    },
    {
        type: 'check',
        text: 'Progress Test & Post Test (Full Test) 2x',
        bold: true,
    },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    {
        type: 'check',
        text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi',
    },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '60+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure' },
    { type: 'check', text: 'E-Book Listening dan Reading' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '15 Link Soal Tambahan saat LIVE ZOOM' },
    { type: 'check', text: 'Tutor Tanya AI 24 Jam di setiap materi' },
    { type: 'check', text: 'Pembahasan setiap soal di LMS' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    {
        type: 'globe',
        text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.',
    },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL' },
    { type: 'cross', text: 'Tidak termasuk garansi mengulang 1 bulan' },
];

const bundlingFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 25 Hari', bold: true },
    {
        type: 'check',
        text: 'Akses Latihan Soal di LMS (Total 1.370+ Soal)',
        bold: true,
    },
    {
        type: 'check',
        text: 'Progress Test & Post Test (Full Test) 3x',
        bold: true,
    },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    {
        type: 'check',
        text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi',
    },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '90+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure (500+ Soal)' },
    { type: 'check', text: 'E-Book Listening dan Reading' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '25 Link Soal Tambahan saat LIVE ZOOM' },
    {
        type: 'check',
        text: 'Free mengulang 1 bulan jika belum capai skor 500+',
    },
    { type: 'check', text: 'Tutor Tanya AI 24 Jam di setiap materi' },
    { type: 'check', text: 'Pembahasan setiap soal di LMS' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    {
        type: 'globe',
        text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.',
    },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL' },
];

const selfFeatures: FeatureItem[] = [
    { type: 'check', text: '60+ Video Materi Pembelajaran', bold: true },
    {
        type: 'check',
        text: 'Materi Hari ke-1 s/d ke-15 (Roadmap Lengkap)',
        bold: true,
    },
    { type: 'check', text: 'Lebih dari 1.000+ Nomor Latihan Soal', bold: true },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Diagnostic Test' },
    { type: 'check', text: '84 Paket Drill Soal' },
    { type: 'label', text: 'Belum Termasuk' },
    { type: 'cross', text: 'LIVE ZOOM 15 Hari' },
    { type: 'cross', text: 'Sertifikat TOEFL' },
];

const guarantees = [
    {
        Icon: Shield,
        title: 'Garansi Sampai Skor Tercapai',
        desc: 'Ikut program secara penuh dan konsisten, tapi skor belum tercapai, gratis ulang kelas di batch berikutnya.',
    },
    {
        Icon: Shield,
        title: 'Post Test Ulang 3x Gratis',
        desc: 'Belum puas hasilnya? Ulang ujian akhir hingga 3 kali, gratis.',
    },
];

function StarRow() {
    return (
        <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
            ))}
        </span>
    );
}

function WhatsAppIcon({
    size = 18,
    color = '#25D366',
}: {
    size?: number;
    color?: string;
}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
    );
}

function PayButton({
    href,
    label,
    onClick,
    green,
}: {
    href: string;
    label: string;
    onClick?: () => void;
    green?: boolean;
}) {
    const bgClass = green ? 'bg-[#16a34a]' : 'bg-[#D70808]';
    const shadowClass = green
        ? 'shadow-[0_6px_24px_rgba(22,163,74,0.4)]'
        : 'shadow-[0_6px_24px_rgba(215,8,8,0.4)]';
    const hoverClass = green
        ? 'hover:shadow-[0_12px_32px_rgba(22,163,74,0.5)]'
        : 'hover:shadow-[0_12px_32px_rgba(215,8,8,0.5)]';

    return (
        <div className="mt-auto flex flex-col gap-1.5">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[16px] font-[900] text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:shadow-none sm:text-base sm:font-black ${bgClass} ${shadowClass} ${hoverClass}`}
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                {label}
            </a>
            <p
                className="flex items-center justify-center gap-1 text-center text-[11px] text-[#9ca3af]"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Lock size={10} strokeWidth={2.5} /> Pembayaran aman &
                terenkripsi
            </p>
        </div>
    );
}

function OrDivider() {
    return (
        <div className="my-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-xs font-semibold text-[#9ca3af]">atau</span>
            <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
    );
}

function WaButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[#25D366] bg-transparent px-5 py-3 text-[14px] font-[700] text-[#16a34a] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:text-sm sm:font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
        >
            <WhatsAppIcon size={15} color="#25D366" /> {label}
        </button>
    );
}

function FeatureList({
    features,
    isBundling,
}: {
    features: FeatureItem[];
    isBundling?: boolean;
}) {
    return (
        <div className="mb-3 flex flex-col">
            <ul className="flex flex-col gap-2">
                {features.map((f, i) => {
                    if (f.type === 'label') {
                        return (
                            <li
                                key={i}
                                className={`mt-2 block text-[10px] font-[900] tracking-widest uppercase sm:font-black ${isBundling ? 'text-[#16a34a]' : 'text-[#D70808]'}`}
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {f.text}
                            </li>
                        );
                    }

                    if (f.type === 'globe') {
                        return (
                            <li
                                key={i}
                                className={`flex items-start gap-2 text-[14px] md:text-sm ${f.bold ? 'font-[700] text-[#151515] sm:font-bold' : 'text-[#3d3d3d]'}`}
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                <Globe
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                    color="#3b82f6"
                                />
                                <span>{f.text}</span>
                            </li>
                        );
                    }

                    if (f.type === 'cross') {
                        return (
                            <li
                                key={i}
                                className={`mt-2 flex items-start gap-2 border-t border-gray-100 pt-3 text-[14px] text-[#9ca3af] md:text-sm ${f.bold ? 'font-[700] sm:font-bold' : ''}`}
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                <XCircle
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                    color="#d1d5db"
                                />
                                <span>{f.text}</span>
                            </li>
                        );
                    }

                    return (
                        <li
                            key={i}
                            className={`flex items-start gap-2 text-[14px] md:text-sm ${f.bold ? 'font-[700] text-[#151515] sm:font-bold' : 'text-[#3d3d3d]'}`}
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0"
                                color="#16a34a"
                            />
                            <span>{f.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function PricingSection() {
    // 1. Changed the initial default state to 'self'
    const [mode, setMode] = useState<'tutor' | 'self'>('self');
    const { trackCTA, trackInitiateCheckout, trackConversion } = useAnalytics();

    const handlePayClick = (
        level: 'Starter' | 'Intermediate' | 'Bundling' | 'Self',
        pgUrl: string,
    ) => {
        const eventId = generateEventId();
        const price =
            level === 'Starter'
                ? 200000
                : level === 'Intermediate'
                  ? 280000
                  : level === 'Bundling'
                    ? 325000
                    : 200000;

        try {
            (
                window as {
                    fbq?: (
                        e: string,
                        n: string,
                        p?: object,
                        o?: object,
                    ) => void;
                }
            ).fbq?.(
                'track',
                'AddToCart',
                {
                    content_name: `TOEFL Full Bright ${level}`,
                    value: price,
                    currency: 'IDR',
                },
                { eventID: eventId },
            );
        } catch {
            /* fbq not loaded */
        }

        trackCTA(`pay_${level.toLowerCase()}`, `Bayar ${level}`, pgUrl);
        trackInitiateCheckout(
            `pay_${level.toLowerCase()}`,
            { level, package: level, price, destination: pgUrl },
            eventId,
        );
    };

    const handleWaClick = (
        level: 'Starter' | 'Intermediate' | 'Bundling' | 'Self',
        waUrl: string,
    ) => {
        const eventId = generateEventId();
        const price =
            level === 'Starter'
                ? 200000
                : level === 'Intermediate'
                  ? 280000
                  : level === 'Bundling'
                    ? 325000
                    : 200000;

        try {
            (
                window as {
                    fbq?: (
                        e: string,
                        n: string,
                        p?: object,
                        o?: object,
                    ) => void;
                }
            ).fbq?.(
                'track',
                'Search',
                { search_string: `TOEFL Full Bright ${level}` },
                { eventID: eventId },
            );
        } catch {
            /* fbq not loaded */
        }

        trackCTA(`pricing_${level.toLowerCase()}`, `Daftar ${level}`, waUrl);
        trackConversion('wa_registration', {
            location: `pricing_${level.toLowerCase()}`,
            package: level,
            price,
        });
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <SectionWrapper
            id="pricing"
            bg="white"
            className="pt-20 pb-12 md:pt-28 md:pb-16"
        >
            {/* ── Updated Header ── */}
            <div className="mb-14 text-center">
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-4 py-[6px] text-[12px] font-[800] tracking-widest text-[#D70808] uppercase sm:py-1.5 sm:text-xs sm:font-bold"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    <span>⏳</span> Mulai dari Sekarang, Bukan Nanti
                </div>
                <h2
                    className="mb-4 text-[clamp(30px,4vw,48px)] leading-[1.2] font-black text-[#151515] md:text-4xl lg:text-5xl"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Persiapkan Sekarang,{' '}
                    <span className="text-[#D70808]">Jangan Ditunda</span>
                </h2>
                <p
                    className="mx-auto max-w-2xl text-[16px] leading-[1.6] text-[#3d3d3d]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Semakin cepat kamu mulai, semakin besar peluang kamu
                    diterima beasiswa karena skor 500+ tercapai sebelum deadline
                    submission.
                </p>
            </div>

            {/* ── Toggle Buttons ── */}
            <div className="mb-12 text-center">
                <p
                    className="mb-3 text-[14px] font-[700] text-[#151515] sm:text-[15px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    👇 Pilih Cara Belajarmu
                </p>
                <div className="inline-flex items-center gap-1 rounded-full border border-[#ffb3b3] bg-white p-[5px] shadow-[0_2px_12px_rgba(215,8,8,0.08)]">
                    <button
                        onClick={() => setMode('self')}
                        className={`rounded-full px-5 py-2.5 text-[15px] font-[800] transition-all ${
                            mode === 'self'
                                ? 'bg-[#D70808] text-white shadow-md hover:brightness-110 active:scale-[0.98]'
                                : 'text-gray-500 underline decoration-gray-400 decoration-dotted decoration-[1.5px] underline-offset-[5px] hover:text-gray-700'
                        }`}
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Belajar Sendiri
                    </button>
                    <button
                        onClick={() => setMode('tutor')}
                        className={`rounded-full px-5 py-2.5 text-[15px] font-[800] transition-all ${
                            mode === 'tutor'
                                ? 'bg-[#D70808] text-white shadow-md hover:brightness-110 active:scale-[0.98]'
                                : 'text-gray-500 underline decoration-gray-400 decoration-dotted decoration-[1.5px] underline-offset-[5px] hover:text-gray-700'
                        }`}
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Dibimbing Tutor
                    </button>
                </div>
            </div>

            {/* === TUTOR MODE (3 CARDS + LEGALITAS) === */}
            {mode === 'tutor' && (
                <>
                    <div className="mx-auto mb-14 grid max-w-6xl gap-6 md:grid-cols-3">
                        {/* ── Starter ── */}
                        <div className="flex flex-col rounded-3xl border-2 border-gray-200 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] md:p-7">
                            <div className="mb-1 flex items-start justify-between">
                                <div>
                                    <p
                                        className="mb-1 text-[10px] font-[700] tracking-widest text-[#9ca3af] uppercase sm:font-bold"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Paket
                                    </p>
                                    <h3
                                        className="text-[24px] font-[900] text-[#151515] sm:text-2xl sm:font-black"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Starter
                                    </h3>
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[10px] font-semibold text-[#16a34a]">
                                    <StarRow />{' '}
                                    <span className="ml-1">5.0</span>
                                </span>
                            </div>
                            <p
                                className="mb-4 text-[14px] font-[600] text-[#9ca3af] sm:text-sm sm:font-semibold"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Target Skor:{' '}
                                <span className="font-black text-[#16a34a]">
                                    450+
                                </span>
                                {' - '}
                                <span className="font-black text-[#151515]">
                                    10 Hari (2 Minggu)
                                </span>
                            </p>
                            <div className="mb-5 rounded-2xl border-[1.5px] border-[#ffb3b3] bg-[#FFF0F0] p-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <span
                                        className="text-[14px] font-[600] text-[#9ca3af] line-through sm:text-sm sm:font-semibold"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Rp 1.000.000
                                    </span>
                                    <span className="rounded-full bg-[#D70808] px-3 py-1 text-[10px] font-black text-white">
                                        HEMAT 80%
                                    </span>
                                </div>
                                <p
                                    className="text-[30px] font-[900] text-[#D70808] sm:text-3xl sm:font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Rp 200.000
                                </p>
                            </div>

                            <FeatureList features={starterFeatures} />

                            <PayButton
                                href={PG_STARTER}
                                label="Apply Sekarang →"
                                onClick={() =>
                                    handlePayClick('Starter', PG_STARTER)
                                }
                            />
                            <OrDivider />
                            <WaButton
                                onClick={() =>
                                    handleWaClick('Starter', WA_STARTER)
                                }
                                label="Tanya via WhatsApp"
                            />
                            <div className="mt-4 flex justify-center">
                                <SocialProofMicro variant="badges" />
                            </div>
                        </div>

                        {/* ── Bundling ── HIGHLIGHTED */}
                        <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#16a34a] bg-[linear-gradient(165deg,#ffffff_0%,#f0fdf4_100%)] p-6 shadow-[0_16px_56px_rgba(22,163,74,0.2),0_0_0_1px_rgba(22,163,74,0.08)] md:p-7">
                            <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#16a34a] px-4 py-2 font-['var(--font-heading)'] text-[10px] font-black text-white">
                                ⭐ PALING HEMAT
                            </div>
                            <div className="mt-4 mb-1 flex items-start justify-between">
                                <div>
                                    <p
                                        className="mb-1 text-[10px] font-[700] tracking-widest text-[#D70808] uppercase sm:font-bold"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Paket
                                    </p>
                                    <h3
                                        className="text-[24px] font-[900] text-[#151515] sm:text-2xl sm:font-black"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Bundling
                                    </h3>
                                    <p
                                        className="mt-0.5 text-[11px] font-[600] text-[#D70808] sm:font-semibold"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Starter + Intermediate
                                    </p>
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-[#FFF0F0] px-2.5 py-1 text-[10px] font-semibold text-[#D70808]">
                                    <StarRow />{' '}
                                    <span className="ml-1">5.0</span>
                                </span>
                            </div>
                            <p
                                className="mb-4 text-[14px] font-[600] text-[#9ca3af] sm:text-sm sm:font-semibold"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Target Skor:{' '}
                                <span className="font-black text-[#D70808]">
                                    500+
                                </span>
                                {' - '}
                                <span className="font-black text-[#151515]">
                                    25 Hari Total
                                </span>
                            </p>
                            <div className="mb-5 rounded-2xl border-[1.5px] border-[#ffb3b3] bg-[#FFF0F0] p-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <span
                                        className="text-[14px] font-[600] text-[#9ca3af] line-through sm:text-sm sm:font-semibold"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        Rp 1.875.000
                                    </span>
                                    <span className="rounded-full bg-[#D70808] px-3 py-1 text-[10px] font-black text-white">
                                        DISKON 80% + 50rb
                                    </span>
                                </div>
                                <p
                                    className="mb-1 text-[30px] font-[900] text-[#D70808] sm:text-3xl sm:font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Rp 325.000
                                </p>
                                <p
                                    className="text-[11px] font-[600] text-[#D70808] sm:font-semibold"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Hemat Rp 1.550.000 dari harga normal!
                                </p>
                            </div>

                            <FeatureList
                                features={bundlingFeatures}
                                isBundling={true}
                            />

                            {/* Guarantees inside Bundling */}
                            <div className="mb-5 flex flex-col gap-3">
                                {guarantees.map(({ Icon, title, desc }) => (
                                    <div
                                        key={title}
                                        className="flex items-start gap-3 rounded-2xl border border-[#f3f4f6] bg-[#F9FAFB] p-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7]">
                                            <Icon
                                                size={18}
                                                color="#D97706"
                                                fill="#D97706"
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className="mb-1 text-[13px] leading-[1.2] font-[900] text-[#151515] sm:leading-tight sm:font-black"
                                                style={{
                                                    fontFamily:
                                                        "'Nunito', sans-serif",
                                                }}
                                            >
                                                {title}
                                            </p>
                                            <p
                                                className="text-[11px] leading-[1.6] text-[#6B7280] sm:leading-relaxed"
                                                style={{
                                                    fontFamily:
                                                        "'Nunito', sans-serif",
                                                }}
                                            >
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <PayButton
                                href={PG_BUNDLING}
                                label="Apply Sekarang →"
                                onClick={() =>
                                    handlePayClick('Bundling', PG_BUNDLING)
                                }
                                green
                            />
                            <p
                                className="mt-2 text-center text-[10px] font-[600] text-[#D70808]"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                * Centang opsi Bundle saat checkout
                            </p>
                            <OrDivider />
                            <WaButton
                                onClick={() =>
                                    handleWaClick('Bundling', WA_BUNDLING)
                                }
                                label="Tanya via WhatsApp"
                            />
                            <div className="mt-4 flex justify-center">
                                <SocialProofMicro variant="badges" />
                            </div>
                        </div>

                        {/* ── Intermediate ── */}
                        <div className="flex flex-col rounded-3xl border-2 border-gray-200 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] md:p-7">
                            <div className="mb-1 flex items-start justify-between">
                                <div>
                                    <p
                                        className="mb-1 text-[10px] font-[700] tracking-widest text-[#9ca3af] uppercase sm:font-bold"
                                        style={{
                                            fontFamily: "'Nunito', sans-serif",
                                        }}
                                    >
                                        Paket
                                    </p>
                                    <h3
                                        className="text-[24px] font-[900] text-[#151515] sm:text-2xl sm:font-black"
                                        style={{
                                            fontFamily: "'Nunito', sans-serif",
                                        }}
                                    >
                                        Intermediate
                                    </h3>
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[10px] font-semibold text-[#16a34a]">
                                    <StarRow />{' '}
                                    <span className="ml-1">5.0</span>
                                </span>
                            </div>
                            <p
                                className="mb-4 text-[14px] font-[600] text-[#9ca3af] sm:text-sm sm:font-semibold"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                Target Skor:{' '}
                                <span className="font-black text-[#16a34a]">
                                    500+
                                </span>
                                {' - '}
                                <span className="font-black text-[#151515]">
                                    15 Hari
                                </span>
                                {' - Min. 430'}
                            </p>
                            <div className="mb-5 rounded-2xl border-[1.5px] border-[#ffb3b3] bg-[#FFF0F0] p-4">
                                <div className="mb-1 flex items-center gap-2">
                                    <span
                                        className="text-[14px] font-[600] text-[#9ca3af] line-through sm:text-sm sm:font-semibold"
                                        style={{
                                            fontFamily: "'Nunito', sans-serif",
                                        }}
                                    >
                                        Rp 1.400.000
                                    </span>
                                    <span className="rounded-full bg-[#D70808] px-3 py-1 text-[10px] font-black text-white">
                                        DISKON 80%
                                    </span>
                                </div>
                                <p
                                    className="text-[30px] font-[900] text-[#D70808] sm:text-3xl sm:font-black"
                                    style={{
                                        fontFamily: "'Nunito', sans-serif",
                                    }}
                                >
                                    Rp 280.000
                                </p>
                            </div>

                            <FeatureList features={intermediateFeatures} />

                            <PayButton
                                href={PG_INTER}
                                label="Apply Sekarang →"
                                onClick={() =>
                                    handlePayClick('Intermediate', PG_INTER)
                                }
                            />
                            <OrDivider />
                            <WaButton
                                onClick={() =>
                                    handleWaClick('Intermediate', WA_INTER)
                                }
                                label="Tanya via WhatsApp"
                            />
                            <div className="mt-4 flex justify-center">
                                <SocialProofMicro variant="badges" />
                            </div>
                        </div>
                    </div>

                    {/* Legalitas (Hanya terlihat di Tutor Mode) */}
                    <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-[#e5e7eb] bg-[#F3F3F3] px-6 py-4">
                        <p
                            className="mb-3 text-[12px] font-[900] tracking-widest text-[#9ca3af] uppercase sm:text-xs sm:font-black"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            Legalitas Resmi
                        </p>
                        <div className="flex flex-col gap-1.5">
                            <span
                                className="text-[12px] font-[600] text-[#151515] sm:text-xs sm:font-semibold"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                ✓ SK Kemenkumham RI Nomor AHU-0055720-AH.0114
                                Tahun 2020
                            </span>
                            <span
                                className="text-[12px] font-[600] text-[#151515] sm:text-xs sm:font-semibold"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                ✓ SK Izin Operasional LKP
                                503/20177/LKP/DPM-PTSP/8/2024
                            </span>
                            <span
                                className="text-[12px] font-[600] text-[#151515] sm:text-xs sm:font-semibold"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                ✓ NPSN Nomor K9998700
                            </span>
                            <span
                                className="text-[12px] font-[600] text-[#151515] sm:text-xs sm:font-semibold"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                ✓ Bekerja sama dengan IIEF Jakarta
                            </span>
                        </div>
                        <a
                            href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/K9998700"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-[12px] font-[600] text-[#D70808] hover:underline sm:text-xs sm:font-semibold"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        ></a>
                    </div>
                </>
            )}

            {/* === SELF STUDY MODE (1 CARD + TESTIMONIAL ONLY) === */}
            {mode === 'self' && (
                <div className="mx-auto mb-14 w-full max-w-[500px]">
                    <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#F5B700] bg-[linear-gradient(165deg,#ffffff_0%,#fffbf0_100%)] p-6 shadow-[0_16px_56px_rgba(245,183,0,0.15),0_0_0_1px_rgba(245,183,0,0.08)] md:p-7">
                        <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#F5B700] px-4 py-2 font-['var(--font-heading)'] text-[10px] font-black text-white">
                            🔥 POPULAR
                        </div>

                        <div className="mt-4 mb-1 flex items-start justify-between">
                            <div>
                                <p
                                    className="mb-1 text-[10px] font-[700] tracking-widest text-[#9ca3af] uppercase sm:font-bold"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    E-Course
                                </p>
                                <h3
                                    className="text-[24px] font-[900] text-[#151515] sm:text-2xl sm:font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Self-Study LMS
                                </h3>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-[#FFF0F0] px-3 py-1 text-[10px] font-semibold text-[#D70808]">
                                📚 Mandiri
                            </span>
                        </div>

                        <p
                            className="mb-4 text-[14px] font-[600] text-[#9ca3af] sm:text-sm sm:font-semibold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Target Skor:{' '}
                            <span className="font-black text-[#16a34a]">
                                500+
                            </span>
                            {' - '}
                            <span className="font-black text-[#151515]">
                                Belajar Kapan Saja
                            </span>
                        </p>

                        <div className="mb-5 rounded-2xl border-[1.5px] border-[#ffb3b3] bg-[#FFF0F0] p-4">
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="text-[14px] font-[600] text-[#9ca3af] line-through sm:text-sm sm:font-semibold"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Rp 250.000
                                </span>
                                <span className="rounded-full bg-[#D70808] px-2 py-0.5 text-[10px] font-black text-white">
                                    HEMAT 68%
                                </span>
                            </div>
                            <p
                                className="text-[30px] font-[900] text-[#D70808] sm:text-3xl sm:font-black"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Rp 81.000
                            </p>
                        </div>

                        <FeatureList features={selfFeatures} />

                        <PayButton
                            href={PG_SELF}
                            label="Mulai Belajar Mandiri →"
                            onClick={() => handlePayClick('Self', PG_SELF)}
                        />
                        <OrDivider />
                        <WaButton
                            onClick={() => handleWaClick('Self', WA_SELF)}
                            label="Tanya via WhatsApp"
                        />
                        <div className="mt-4 flex justify-center">
                            <SocialProofMicro variant="badges" />
                        </div>
                    </div>

                    {/* Testimonial Section added right below the card */}
                    <div className="mt-8">
                        <p
                            className="mb-4 text-center text-[10px] font-[900] tracking-widest text-[#9ca3af] uppercase"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Kata Mereka yang Belajar Mandiri
                        </p>
                        <div className="rounded-2xl border border-[#ececec] bg-[#F9F9F9] p-5">
                            <p className="mb-2 text-[12px] text-[#F59E0B]">
                                ⭐⭐⭐⭐⭐
                            </p>
                            <p
                                className="mb-4 text-[13px] leading-[1.5] font-[600] text-[#3d3d3d] sm:text-[14px]"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                "Trm kasih Full Bright Indonesia yg sudah
                                memberikan kesempatan belajar Bhs Inggris,
                                belajar disini bisa menjadi alternatif bagi
                                individu yg ingin belajar sambil bekerja, LMS
                                bisa diakses kapan pun!"
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src="/people/nina.webp"
                                    alt="Nina Hernawati"
                                    className="h-8 w-8 rounded-full bg-gray-200 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://ui-avatars.com/api/?name=Nina+Hernawati&background=random';
                                    }}
                                />
                                <p
                                    className="text-[12px] font-[800] text-[#151515] sm:text-[13px]"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    Nina Hernawati
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SectionWrapper>
    );
}
