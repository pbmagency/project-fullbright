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

const PG_STARTER =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';
const PG_INTER =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-intermediate-live-zoom-intensif-flash-sale';
const PG_BUNDLING =
    'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';

type FeatureItem =
    | { type: 'check'; text: string }
    | { type: 'globe'; text: string }
    | { type: 'label'; text: string }
    | { type: 'cross'; text: string };

const starterFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 10 Hari' },
    { type: 'check', text: 'Akses Latihan Soal di LMS (Total 1000+ Soal)' },
    { type: 'check', text: 'Post Test (Full Test) 1x' },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    { type: 'check', text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi' },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '30+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure' },
    { type: 'check', text: 'E-Book Listening dan Reading' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '10+ Link Soal Tambahan saat LIVE ZOOM' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    { type: 'globe', text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.' },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL Prediction' },
    { type: 'cross', text: 'Tidak termasuk garansi mengulang 1 bulan' },
];

const intermediateFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 15 Hari' },
    { type: 'check', text: 'Akses Latihan Soal di LMS (Total 210 Soal)' },
    { type: 'check', text: 'Progress Test & Post Test (Full Test) 2x' },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    { type: 'check', text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi' },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '60+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure (300+ Soal)' },
    { type: 'check', text: 'E-Book Listening dan Reading (300+ Soal)' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '15 Link Soal Tambahan saat LIVE ZOOM' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    { type: 'globe', text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.' },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL Prediction' },
    { type: 'cross', text: 'Tidak termasuk garansi mengulang 1 bulan' },
];

const bundlingFeatures: FeatureItem[] = [
    { type: 'check', text: 'LIVE ZOOM 25 Hari' },
    { type: 'check', text: 'Akses Latihan Soal di LMS (Total 380 Soal)' },
    { type: 'check', text: 'Progress Test & Post Test (Full Test) 3x' },
    { type: 'check', text: 'Evaluasi Progress Mingguan' },
    { type: 'check', text: 'Strategi Submit Sesuai Jurusan & Rencana Kontribusi' },
    { type: 'check', text: 'Rekaman ZOOM jika tidak hadir' },
    { type: 'check', text: '90+ Video Materi Pembelajaran' },
    { type: 'check', text: 'E-Book Structure (500+ Soal)' },
    { type: 'check', text: 'E-Book Listening dan Reading (500+ Soal)' },
    { type: 'check', text: 'Grup WA Diskusi' },
    { type: 'check', text: 'Placement Test / Pre-Test' },
    { type: 'check', text: '25 Link Soal Tambahan saat LIVE ZOOM' },
    { type: 'check', text: 'Free mengulang 1 bulan jika belum capai skor 500+' },
    { type: 'globe', text: 'Webinar Beasiswa Luar Negeri' },
    { type: 'globe', text: 'Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.' },
    { type: 'label', text: 'Bonus Spesial' },
    { type: 'check', text: 'Sertifikat TOEFL Prediction' },
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
    const bg = green ? '#16a34a' : '#D70808';
    const shadow = green
        ? '0 6px 24px rgba(22,163,74,0.4)'
        : '0 6px 24px rgba(215,8,8,0.4)';
    const hover = green
        ? 'hover:shadow-[0_12px_32px_rgba(22,163,74,0.5)]'
        : 'hover:shadow-[0_12px_32px_rgba(215,8,8,0.5)]';

    return (
        <div className="flex flex-col gap-1.5 mt-auto">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:text-base ${hover} active:translate-y-0 active:shadow-none`}
                style={{ backgroundColor: bg, boxShadow: shadow }}
            >
                {label}
            </a>
            <p
                className="flex items-center justify-center gap-1 text-center text-[11px]"
                style={{ color: '#9ca3af' }}
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
            <div
                className="h-px flex-1"
                style={{ backgroundColor: '#e5e7eb' }}
            />
            <span
                className="text-xs font-semibold"
                style={{ color: '#9ca3af' }}
            >
                atau
            </span>
            <div
                className="h-px flex-1"
                style={{ backgroundColor: '#e5e7eb' }}
            />
        </div>
    );
}

function WaButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
                backgroundColor: 'transparent',
                border: '1.5px solid #25D366',
                color: '#16a34a',
            }}
        >
            <WhatsAppIcon size={15} color="#25D366" /> {label}
        </button>
    );
}

// Collapsible feature list component
function FeatureList({
    features,
    collapseOnDesktop,
    isBundling,
}: {
    features: FeatureItem[];
    collapseOnDesktop: boolean;
    isBundling?: boolean;
}) {
    const [expanded, setExpanded] = useState(false);

    // On side cards, hiddenClass will hide items on mobile, but show on desktop (md:flex).
    // On middle card, hiddenClass will hide items on all screens.
    const hiddenClass = collapseOnDesktop ? 'hidden' : 'hidden md:flex';
    const buttonHiddenClass = collapseOnDesktop ? 'flex' : 'flex md:hidden';

    // Set color to Green for Bundling, Red for the others
    const buttonColor = isBundling ? '#16a34a' : '#D70808';

    return (
        // REMOVED `flex-1` here so it doesn't create a huge gap below the button!
        <div className="mb-3 flex flex-col">
            <ul className="flex flex-col gap-2">
                {features.map((f, i) => {
                    const isHidden = !expanded && i >= 3;

                    let finalClass = '';
                    if (isHidden) {
                        finalClass = collapseOnDesktop
                            ? 'hidden'
                            : f.type === 'label'
                              ? 'hidden md:block'
                              : 'hidden md:flex';
                    } else {
                        finalClass = f.type === 'label' ? 'block' : 'flex';
                    }

                    if (f.type === 'label') {
                        return (
                            <li
                                key={i}
                                className={`mt-2 text-[10px] font-black tracking-widest uppercase ${finalClass}`}
                                style={{ color: isBundling ? '#16a34a' : '#D70808' }}
                            >
                                {f.text}
                            </li>
                        );
                    }

                    if (f.type === 'globe') {
                        return (
                            <li
                                key={i}
                                className={`items-start gap-2 text-xs md:text-sm ${finalClass}`}
                                style={{ color: '#3d3d3d' }}
                            >
                                <Globe size={14} className="mt-0.5 shrink-0" color="#3b82f6" />
                                <span>{f.text}</span>
                            </li>
                        );
                    }

                    if (f.type === 'cross') {
                        return (
                            <li
                                key={i}
                                className={`mt-2 items-start gap-2 border-t border-gray-100 pt-3 text-xs md:text-sm ${finalClass}`}
                                style={{ color: '#9ca3af' }}
                            >
                                <XCircle size={14} className="mt-0.5 shrink-0" color="#d1d5db" />
                                <span>{f.text}</span>
                            </li>
                        );
                    }

                    return (
                        <li
                            key={i}
                            className={`items-start gap-2 text-xs md:text-sm ${finalClass}`}
                            style={{ color: '#3d3d3d' }}
                        >
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" color="#16a34a" />
                            <span>{f.text}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Show "Lihat semua fitur" if NOT expanded */}
            {!expanded && features.length > 3 && (
                <button
                    onClick={() => setExpanded(true)}
                    className={`mt-2 items-center gap-1 text-left text-xs font-bold hover:underline ${buttonHiddenClass}`}
                    style={{ color: buttonColor }}
                >
                    Lihat semua fitur ({features.length - 3}+) ↓
                </button>
            )}

            {/* Show "Sembunyikan fitur" if EXPANDED */}
            {expanded && features.length > 3 && (
                <button
                    onClick={() => setExpanded(false)}
                    className={`mt-2 items-center gap-1 text-left text-xs font-bold hover:underline ${buttonHiddenClass}`}
                    style={{ color: buttonColor }}
                >
                    Sembunyikan fitur ↑
                </button>
            )}
        </div>
    );
}

export default function PricingSection() {
    const { trackCTA, trackInitiateCheckout, trackConversion } = useAnalytics();

    const handlePayClick = (
        level: 'Starter' | 'Intermediate' | 'Bundling',
        pgUrl: string,
    ) => {
        const eventId = generateEventId();
        const price =
            level === 'Starter'
                ? 220000
                : level === 'Intermediate'
                  ? 294000
                  : 375000;

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
        level: 'Starter' | 'Intermediate' | 'Bundling',
        waUrl: string,
    ) => {
        const eventId = generateEventId();
        const price =
            level === 'Starter'
                ? 220000
                : level === 'Intermediate'
                  ? 294000
                  : 375000;

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
        <>
            <SectionWrapper
                id="pricing"
                bg="white"
                className="pt-20 pb-12 md:pt-28 md:pb-16"
            >
                {/* ── Updated Header ── */}
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>⏳</span> Mulai dari Sekarang, Bukan Nanti
                    </div>
                    <h2
                        className="mb-4 text-3xl font-black md:text-4xl lg:text-5xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Persiapkan Sekarang,{' '}
                        <span style={{ color: '#D70808' }}>Jangan Ditunda</span>
                    </h2>
                    <p
                        className="mx-auto max-w-2xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Semakin cepat kamu mulai, semakin besar peluang kamu diterima
                        beasiswa karena skor 500+ tercapai sebelum deadline submission.
                    </p>
                </div>

                <div className="mx-auto mb-14 grid max-w-6xl gap-6 md:grid-cols-3">
                    {/* ── Starter ── */}
                    <div
                        className="flex flex-col rounded-3xl border-2 border-gray-200 p-6 md:p-7 transition-all duration-300 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
                        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                    >
                        <div className="mb-1 flex items-start justify-between">
                            <div>
                                <p
                                    className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                    style={{ color: '#9ca3af' }}
                                >
                                    Paket
                                </p>
                                <h3
                                    className="text-2xl font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: '#151515',
                                    }}
                                >
                                    Starter
                                </h3>
                            </div>
                            <span
                                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                style={{
                                    backgroundColor: '#F0FDF4',
                                    color: '#16a34a',
                                }}
                            >
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        {/* CHANGED: text-xs -> text-sm */}
                        <p
                            className="mb-4 text-sm font-semibold"
                            style={{ color: '#9ca3af' }}
                        >
                            Target Skor:{' '}
                            <span
                                className="font-black"
                                style={{ color: '#16a34a' }}
                            >
                                450+
                            </span>
                            {' · '}
                            <span
                                className="font-black"
                                style={{ color: '#151515' }}
                            >
                                10 Hari (2 Minggu)
                            </span>
                        </p>
                        <div
                            className="mb-5 rounded-2xl p-4"
                            style={{
                                backgroundColor: '#FFF0F0',
                                border: '1.5px solid #ffb3b3',
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="text-sm font-semibold line-through"
                                    style={{ color: '#9ca3af' }}
                                >
                                    Rp 1.000.000
                                </span>
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                                    style={{ backgroundColor: '#D70808' }}
                                >
                                    HEMAT 78%
                                </span>
                            </div>
                            <p
                                className="text-3xl font-black"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    color: '#D70808',
                                }}
                            >
                                Rp 220.000
                            </p>
                        </div>

                        <FeatureList features={starterFeatures} collapseOnDesktop={false} />

                        <PayButton
                            href={PG_STARTER}
                            label="Apply Sekarang →"
                            onClick={() =>
                                handlePayClick('Starter', PG_STARTER)
                            }
                        />
                        <OrDivider />
                        <WaButton
                            onClick={() => handleWaClick('Starter', WA_STARTER)}
                            label="Tanya via WhatsApp"
                        />
                        <div className="mt-4 flex justify-center">
                            <SocialProofMicro variant="badges" />
                        </div>
                    </div>

                    {/* ── Bundling ── HIGHLIGHTED */}
                    <div
                        className="relative flex flex-col overflow-hidden rounded-3xl p-6 md:p-7"
                        style={{
                            border: '2px solid #16a34a',
                            boxShadow:
                                '0 16px 56px rgba(22,163,74,0.2), 0 0 0 1px rgba(22,163,74,0.08)',
                            background:
                                'linear-gradient(165deg, #ffffff 0%, #f0fdf4 100%)',
                        }}
                    >
                        <div
                            className="absolute top-0 right-0 rounded-bl-2xl px-4 py-2 text-[10px] font-black text-white"
                            style={{
                                backgroundColor: '#16a34a',
                                fontFamily: 'var(--font-heading)',
                            }}
                        >
                            ⭐ PALING HEMAT
                        </div>
                        <div className="mt-4 mb-1 flex items-start justify-between">
                            <div>
                                <p
                                    className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                    style={{ color: '#D70808' }}
                                >
                                    Paket
                                </p>
                                <h3
                                    className="text-2xl font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: '#151515',
                                    }}
                                >
                                    Bundling
                                </h3>
                                <p
                                    className="mt-0.5 text-[11px] font-semibold"
                                    style={{ color: '#D70808' }}
                                >
                                    Starter + Intermediate
                                </p>
                            </div>
                            <span
                                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                style={{
                                    backgroundColor: '#FFF0F0',
                                    color: '#D70808',
                                }}
                            >
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        {/* CHANGED: text-xs -> text-sm */}
                        <p
                            className="mb-4 text-sm font-semibold"
                            style={{ color: '#9ca3af' }}
                        >
                            Target Skor:{' '}
                            <span
                                className="font-black"
                                style={{ color: '#D70808' }}
                            >
                                500+
                            </span>
                            {' · '}
                            <span
                                className="font-black"
                                style={{ color: '#151515' }}
                            >
                                25 Hari Total
                            </span>
                        </p>
                        <div
                            className="mb-5 rounded-2xl p-4"
                            style={{
                                backgroundColor: '#FFF0F0',
                                border: '1.5px solid #ffb3b3',
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="text-sm font-semibold line-through"
                                    style={{ color: '#9ca3af' }}
                                >
                                    Rp 1.875.000
                                </span>
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                                    style={{ backgroundColor: '#D70808' }}
                                >
                                    DISKON 80%
                                </span>
                            </div>
                            <p
                                className="mb-1 text-3xl font-black"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    color: '#D70808',
                                }}
                            >
                                Rp 375.000
                            </p>
                            <p
                                className="text-[11px] font-semibold"
                                style={{ color: '#D70808' }}
                            >
                                Hemat Rp 1.500.000 dari harga normal!
                            </p>
                        </div>

                        <FeatureList features={bundlingFeatures} collapseOnDesktop={true} isBundling={true} />

                        {/* Guarantees inside Bundling */}
                        <div className="mb-5 flex flex-col gap-3">
                            {guarantees.map(({ Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex items-start gap-3 rounded-2xl p-4"
                                    style={{
                                        backgroundColor: '#F9FAFB',
                                        border: '1px solid #f3f4f6',
                                    }}
                                >
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: '#FEF3C7' }}
                                    >
                                        <Icon size={18} color="#D97706" fill="#D97706" />
                                    </div>
                                    <div>
                                        <p
                                            className="mb-1 text-[13px] font-black leading-tight"
                                            style={{
                                                fontFamily: 'var(--font-heading)',
                                                color: '#151515',
                                            }}
                                        >
                                            {title}
                                        </p>
                                        <p
                                            className="text-[11px] leading-relaxed"
                                            style={{ color: '#6B7280' }}
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
                            className="mt-2 text-center text-[10px]"
                            style={{ color: '#D70808', fontWeight: 600 }}
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
                    <div
                        className="flex flex-col rounded-3xl border-2 border-gray-200 p-6 md:p-7 transition-all duration-300 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
                        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                    >
                        <div className="mb-1 flex items-start justify-between">
                            <div>
                                <p
                                    className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                                    style={{ color: '#9ca3af' }}
                                >
                                    Paket
                                </p>
                                <h3
                                    className="text-2xl font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: '#151515',
                                    }}
                                >
                                    Intermediate
                                </h3>
                            </div>
                            <span
                                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                style={{
                                    backgroundColor: '#F0FDF4',
                                    color: '#16a34a',
                                }}
                            >
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        {/* CHANGED: text-xs -> text-sm */}
                        <p
                            className="mb-4 text-sm font-semibold"
                            style={{ color: '#9ca3af' }}
                        >
                            Target Skor:{' '}
                            <span
                                className="font-black"
                                style={{ color: '#16a34a' }}
                            >
                                500+
                            </span>
                            {' · '}
                            <span
                                className="font-black"
                                style={{ color: '#151515' }}
                            >
                                15 Hari
                            </span>
                            {' · Min. 430'}
                        </p>
                        <div
                            className="mb-5 rounded-2xl p-4"
                            style={{
                                backgroundColor: '#FFF0F0',
                                border: '1.5px solid #ffb3b3',
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="text-sm font-semibold line-through"
                                    style={{ color: '#9ca3af' }}
                                >
                                    Rp 1.400.000
                                </span>
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                                    style={{ backgroundColor: '#D70808' }}
                                >
                                    DISKON 79%
                                </span>
                            </div>
                            <p
                                className="text-3xl font-black"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    color: '#D70808',
                                }}
                            >
                                Rp 294.000
                            </p>
                        </div>

                        <FeatureList features={intermediateFeatures} collapseOnDesktop={false} />

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

                {/* Legalitas */}
                <div
                    className="mx-auto mb-8 max-w-2xl rounded-2xl px-6 py-4"
                    style={{
                        backgroundColor: '#F3F3F3',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <p
                        className="mb-3 text-xs font-black tracking-widest uppercase"
                        style={{ color: '#9ca3af' }}
                    >
                        Legalitas Resmi
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <span
                            className="text-xs font-semibold"
                            style={{ color: '#151515' }}
                        >
                            ✓ SK Kemenkumham RI Nomor AHU-0055720-AH.0114 Tahun
                            2020
                        </span>
                        <span
                            className="text-xs font-semibold"
                            style={{ color: '#151515' }}
                        >
                            ✓ SK Izin Operasional LKP
                            503/20177/LKP/DPM-PTSP/8/2024
                        </span>
                        <span
                            className="text-xs font-semibold"
                            style={{ color: '#151515' }}
                        >
                            ✓ NPSN Nomor K9998700
                        </span>
                        <span
                            className="text-xs font-semibold"
                            style={{ color: '#151515' }}
                        >
                            ✓ Bekerja sama dengan IIEF Jakarta
                        </span>
                    </div>
                    <a
                        href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/K9998700"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold hover:underline"
                        style={{ color: '#D70808' }}
                    >
                        Info Detail Legalitas →
                    </a>
                </div>
            </SectionWrapper>
        </>
    );
}