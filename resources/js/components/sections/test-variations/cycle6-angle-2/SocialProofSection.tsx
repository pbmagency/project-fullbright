import {
    Star,
    MessageCircle,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import { useAnalytics } from '@/hooks/use-analytics';


const statsBar = [
    { value: '45.000+', label: 'Alumni Sukses' },
    { value: '4.9/5', label: 'Rating Rata-rata' },
    { value: '13+', label: 'Tahun Pengalaman' },
    { value: '95%', label: 'Skor Naik Signifikan' },
];

interface WaScreenshot {
    src: string;
    score: string;
    name?: string;
    label?: string;
}

const waScreenshots: WaScreenshot[] = [
    { src: '/image/toefl1.webp', score: '547' },
    { src: '/image/toefl9.webp', score: '560' },
    { src: '/image/toefl3.webp', score: '563' },
    { src: '/image/toefl4.webp', score: '560' },
    { src: '/image/toefl5.webp', score: '507' },
    { src: '/image/toefl6.webp', score: '513' },
    { src: '/image/toefl7.webp', score: '537' },
    { src: '/image/toefl2.webp', score: '543' },
];

const carouselItems = [
    { name: 'Kak Rani', score: 547 },
    { name: 'Kak Ayu', score: 543 },
    { name: 'Mbak Widya', score: 563 },
    { name: 'Pak Yohanes', score: 560 },
    { name: 'Kak Uly Sinaga', score: 507 },
    { name: 'Kak Nadia Ayu', score: 513 },
];

const internationalTestimonials = [
    {
        title: 'Sangat Terjangkau Untuk Mahasiswa',
        name: 'Andi Manggala Putra',
        role: 'Accounting and Finance',
        university: 'University of Nottingham, UK',
        text: 'Full Bright ini tempat yang paling "pas" buat teman-teman Mahasiswa menaklukkan Tes TOEFL & IELTS',
        avatar: '/people/People 3.webp',
    },
    {
        title: 'A Good Place to Learn TOEFL & IELTS',
        name: 'Hajrah',
        role: 'Student Water Resources Engineering and Management',
        university: 'Stuttgart University, Germany',
        text: 'Fullbright growing together with their students. This place is good place to learn TOEFL & IELTS. Thank you for the teacher and friendly staff. Now I can see the world',
        avatar: '/people/People 4.webp',
    },
];

function Stars() {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
            ))}
        </div>
    );
}

function avatarBg(i: number) {
    return i % 2 === 0 ? '#151515' : '#D70808';
}

function PhotoLightbox({
    photos,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    photos: typeof waScreenshots;
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const photo = photos[index];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 transition hover:text-white"
                aria-label="Tutup"
            >
                <X size={28} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute left-4 p-2 text-white/70 transition hover:text-white"
                aria-label="Sebelumnya"
            >
                <ChevronLeft size={36} />
            </button>
            <div
                className="flex flex-col items-center gap-4 px-16"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={photo.src}
                    alt={photo.name ?? `Bukti skor TOEFL ${photo.score}`}
                    width={340}
                    height={604}
                    className="max-h-[80vh] w-full max-w-[340px] rounded-2xl object-contain"
                    style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                />
                <div className="text-center">
                    {photo.name && (
                        <p
                            className="text-base font-black text-white"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {photo.name}
                        </p>
                    )}
                    <p className="text-sm text-white/60">
                        {photo.score ? `Skor ${photo.score}` : ''}
                        {photo.label ? ` · ${photo.label}` : ''}
                    </p>
                </div>
                <p className="text-xs text-white/40">
                    {index + 1} / {photos.length}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute right-4 p-2 text-white/70 transition hover:text-white"
                aria-label="Berikutnya"
            >
                <ChevronRight size={36} />
            </button>
        </div>
    );
}

// We correctly have 19 reviews here as requested
const reviewPhotos = Array.from(
    { length: 19 },
    (_, i) => `/review/Riview (${i + 1}).webp`,
);

export default function SocialProofSection() {
    const { trackCTA } = useAnalytics();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [reviewIndex, setReviewIndex] = useState<number | null>(null);
    const [reviewReady, setReviewReady] = useState(false);

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () =>
        setLightboxIndex((i) =>
            i !== null
                ? (i - 1 + waScreenshots.length) % waScreenshots.length
                : null,
        );
    const nextPhoto = () =>
        setLightboxIndex((i) =>
            i !== null ? (i + 1) % waScreenshots.length : null,
        );

    useEffect(() => {
        const idleWindow = window as unknown as {
            requestIdleCallback?: (
                callback: () => void,
                options?: { timeout: number },
            ) => number;
            cancelIdleCallback?: (id: number) => void;
        };
        const id = idleWindow.requestIdleCallback
            ? idleWindow.requestIdleCallback(() => setReviewReady(true), {
                  timeout: 2000,
              })
            : (setTimeout(
                  () => setReviewReady(true),
                  1500,
              ) as unknown as number);

        return () => {
            if (idleWindow.cancelIdleCallback) {
                idleWindow.cancelIdleCallback(id);
            } else {
                clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
            }
        };
    }, []);

    const openReview = (i: number) => setReviewIndex(i % 19);
    const closeReview = () => setReviewIndex(null);
    const prevReview = () =>
        setReviewIndex((i) => (i !== null ? (i - 1 + 19) % 19 : null));
    const nextReview = () =>
        setReviewIndex((i) => (i !== null ? (i + 1) % 19 : null));

    return (
        <section id="testimonials">
            {/* Stats bar */}
            <div style={{ backgroundColor: '#151515' }} className="py-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 text-center text-white md:grid-cols-4">
                        {statsBar.map((s) => (
                            <div key={s.label}>
                                <p
                                    className="text-4xl font-black tracking-tight md:text-5xl"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    {s.value}
                                </p>
                                <p className="mt-1.5 text-xs font-medium tracking-wide opacity-75">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <SectionWrapper bg="white" className="py-20 md:py-24">
                <div className="mb-12 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <MessageCircle size={13} /> Testimoni Alumni Kami
                    </div>
                    <h2
                        className="mb-4 text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Lihat Bagaimana Alumni Kami,{' '}
                        <span style={{ color: '#D70808' }}>
                            Meraih Target Skor Untuk Beasiswa
                        </span>
                    </h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                        Klik foto untuk memperbesar
                    </p>
                </div>

                {/* Top 3 photos — grid with captions, clickable lightbox */}
                <div className="mx-auto mb-6 grid max-w-3xl grid-cols-3 gap-3">
                    {waScreenshots.slice(0, 3).map((img, i) => (
                        <div
                            key={img.src}
                            className="flex cursor-pointer flex-col items-center gap-2"
                            onClick={() => openLightbox(i)}
                        >
                            <div
                                className="group relative w-full overflow-hidden"
                                style={{
                                    borderRadius: '14px',
                                    boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                                    aspectRatio: '9/16',
                                }}
                            >
                                <img
                                    src={img.src}
                                    alt={`Score Report Alumni Skor ${img.score}`}
                                    width={260}
                                    height={463}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.25)',
                                    }}
                                >
                                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white">
                                        Perbesar
                                    </span>
                                </div>
                            </div>
                            {img.score && (
                                <p
                                    className="text-center text-xs font-bold"
                                    style={{ color: '#151515' }}
                                >
                                    Skor {img.score}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Photo infinite carousel */}
                <div
                    className="mb-14 overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                    }}
                >
                    <div
                        className="infinite-track"
                        style={{ animationDuration: '35s' }}
                    >
                        {Array.from({ length: 4 }, () => waScreenshots)
                            .flat()
                            .map((img, i) => (
                                <div
                                    key={i}
                                    className="mx-2 flex shrink-0 cursor-pointer flex-col items-center gap-1.5"
                                    onClick={() =>
                                        openLightbox(i % waScreenshots.length)
                                    }
                                >
                                    <div
                                        className="relative overflow-hidden"
                                        style={{
                                            width: '130px',
                                            borderRadius: '12px',
                                            boxShadow:
                                                '0 4px 16px rgba(0,0,0,0.15)',
                                            aspectRatio: '9/16',
                                        }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={`Score Report Alumni Skor ${img.score}`}
                                            width={130}
                                            height={231}
                                            className="h-full w-full object-cover"
                                            // FIXED: Removed loading="lazy" to prevent blank boxes in infinite scroll
                                        />
                                    </div>
                                    {img.score && (
                                        <p
                                            className="text-center text-[10px] font-bold"
                                            style={{ color: '#151515' }}
                                        >
                                            Skor {img.score}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* International testimonials */}
                <div className="mx-auto mb-14 w-full max-w-4xl">
                    <p
                        className="mb-6 text-center text-xs font-bold tracking-widest uppercase"
                        style={{ color: '#9ca3af' }}
                    >
                        Testimoni Alumni yang Sukses Masuk Universitas Luar
                        Negeri
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {internationalTestimonials.map((t, i) => (
                            <div
                                key={t.name}
                                className="flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-100 p-5"
                                style={{
                                    backgroundColor: '#F9F9F9',
                                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                                }}
                            >
                                <span
                                    className="self-start rounded-full px-2.5 py-1 text-xs font-semibold"
                                    style={{
                                        backgroundColor: '#FFF0F0',
                                        color: '#D70808',
                                    }}
                                >
                                    {t.university}
                                </span>
                                <p
                                    className="text-xs font-black tracking-widest uppercase"
                                    style={{ color: '#D70808' }}
                                >
                                    {t.title}
                                </p>
                                <p
                                    className="flex-1 text-sm leading-relaxed"
                                    style={{ color: '#3d3d3d' }}
                                >
                                    "{t.text}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-2">
                                    {t.avatar ? (
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                                            style={{
                                                backgroundColor: avatarBg(i),
                                                fontFamily:
                                                    'var(--font-heading)',
                                            }}
                                        >
                                            {t.name[0]}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="truncate text-sm font-black"
                                            style={{
                                                fontFamily:
                                                    'var(--font-heading)',
                                                color: '#151515',
                                            }}
                                        >
                                            {t.name}
                                        </p>
                                        <p
                                            className="truncate text-xs"
                                            style={{ color: '#6b7280' }}
                                        >
                                            {t.role}
                                        </p>
                                    </div>
                                    <Stars />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score carousel — name only, no source */}
                <div
                    className="mt-10 overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                    }}
                >
                    <div
                        className="infinite-track"
                        style={{ animationDuration: '40s' }}
                    >
                        {Array.from({ length: 4 }, () => carouselItems)
                            .flat()
                            .map((item, i) => (
                                <div
                                    key={i}
                                    className="mx-3 flex shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4"
                                    style={{
                                        width: '220px',
                                        boxShadow:
                                            '0 2px 12px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                                        style={{
                                            backgroundColor: avatarBg(i),
                                            fontFamily: 'var(--font-heading)',
                                        }}
                                    >
                                        {item.name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="truncate text-xs font-black"
                                            style={{ color: '#151515' }}
                                        >
                                            {item.name}
                                        </p>
                                    </div>
                                    <p
                                        className="shrink-0 text-xl font-black"
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            color: '#16a34a',
                                        }}
                                    >
                                        {item.score}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Review alumni carousel — deferred until idle */}
                {reviewReady && (
                    <div className="mt-12 mb-2">
                        <p
                            className="mb-6 text-center text-xs font-black tracking-widest uppercase"
                            style={{ color: '#9ca3af' }}
                        >
                            Review Alumni di Google & Media Sosial
                        </p>
                        <div
                            className="overflow-hidden py-4"
                            style={{
                                maskImage:
                                    'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                                WebkitMaskImage:
                                    'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                            }}
                        >
                            <div
                                className="infinite-track"
                                style={{
                                    animationDuration: '60s',
                                    alignItems: 'center',
                                }}
                            >
                                {Array.from({ length: 4 }, () => reviewPhotos)
                                    .flat()
                                    .map((src, i) => (
                                        <div
                                            key={i}
                                            className="group mx-3 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white"
                                            style={{
                                                width: '280px',
                                                aspectRatio: '1/1',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            }}
                                            onClick={() => openReview(i)}
                                        >
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={src}
                                                    alt={`Review Alumni Full Bright ${(i % 19) + 1}`}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    // FIXED: Removed loading="lazy" to prevent blank boxes in infinite scroll
                                                />
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                                    style={{
                                                        backgroundColor: 'rgba(0,0,0,0.25)',
                                                    }}
                                                >
                                                    <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold tracking-wide text-white">
                                                        Perbesar
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10 mb-6 text-center">
                    <LpButton
                        href="#pricing"
                        size="lg"
                        onClick={() => trackCTA('social_proof_primary', 'Gabung Sekarang →', '#pricing')}
                    >
                        Gabung Sekarang →
                    </LpButton>
                </div>
            </SectionWrapper>

            {/* Lightbox score */}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={waScreenshots}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                />
            )}

            {/* Lightbox review */}
            {reviewIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
                    onClick={closeReview}
                >
                    <button
                        onClick={closeReview}
                        className="absolute top-4 right-4 text-white/70 transition hover:text-white"
                        aria-label="Tutup"
                    >
                        <X size={28} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevReview();
                        }}
                        className="absolute left-4 p-2 text-white/70 transition hover:text-white"
                        aria-label="Sebelumnya"
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <div
                        className="flex flex-col items-center gap-4 px-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={reviewPhotos[reviewIndex]}
                            alt={`Review Alumni ${reviewIndex + 1}`}
                            className="max-h-[85vh] w-auto max-w-[90vw] rounded-2xl object-contain"
                            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                        />
                        <p className="text-xs font-medium tracking-widest text-white/50">
                            {reviewIndex + 1} / 19
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextReview();
                        }}
                        className="absolute right-4 p-2 text-white/70 transition hover:text-white"
                        aria-label="Berikutnya"
                    >
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}
        </section>
    );
}