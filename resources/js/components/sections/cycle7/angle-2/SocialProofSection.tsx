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
    { name: 'Kak Rani', score: 547, photo: '/people/People 1.webp' },
    { name: 'Kak Ayu', score: 543, photo: '/people/People 2.webp' },
    { name: 'Mbak Widya', score: 563, photo: '/people/People 3.webp' },
    { name: 'Pak Yohanes', score: 560, photo: '/people/People 1.webp' },
    { name: 'Kak Uly Sinaga', score: 507, photo: '/people/People 2.webp' },
    { name: 'Kak Nadia Ayu', score: 513, photo: '/people/People 3.webp' },
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

const reviewPhotos = Array.from(
    { length: 19 },
    (_, i) => `/review/Riview (${i + 1}).webp`,
);

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
                <div
                    role="img"
                    aria-label="Score"
                    style={{
                        height: '80vh',
                        width: '340px',
                        maxWidth: '80vw',
                        borderRadius: '16px',
                        backgroundImage: `url('${photo.src}')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                    }}
                />
                <p className="m-0 text-[14px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Nunito', sans-serif" }}>
                    Skor {photo.score}
                </p>
                <p className="m-0 text-[12px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Nunito', sans-serif" }}>
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

export default function SocialProofSection() {
    const { trackCTA } = useAnalytics();
    
    // Lightbox for Score Photos
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
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

    // Lightbox for Review Photos
    const [reviewIndex, setReviewIndex] = useState<number | null>(null);
    const openReview = (i: number) => setReviewIndex(i % 19);
    const closeReview = () => setReviewIndex(null);
    const prevReview = () =>
        setReviewIndex((i) => (i !== null ? (i - 1 + 19) % 19 : null));
    const nextReview = () =>
        setReviewIndex((i) => (i !== null ? (i + 1) % 19 : null));

    // Google Carousel specific state
    const [googleIndex, setGoogleIndex] = useState(0);
    const prevGoogleCarousel = () => setGoogleIndex((i) => (i - 1 + 19) % 19);
    const nextGoogleCarousel = () => setGoogleIndex((i) => (i + 1) % 19);

    useEffect(() => {
        // Pause auto-sliding if the user is currently viewing a review in the lightbox
        if (reviewIndex !== null) return;

        // Auto slide every 3 seconds (3000 ms)
        const interval = setInterval(() => {
            setGoogleIndex((i) => (i + 1) % 19);
        }, 3000);

        return () => clearInterval(interval);
    }, [reviewIndex]);

    const prevIdx = (googleIndex - 1 + 19) % 19;
    const centerIdx = googleIndex;
    const nextIdx = (googleIndex + 1) % 19;

    const [reviewReady, setReviewReady] = useState(false);
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

    return (
        <section id="testimonials">
            {/* Stats bar */}
            <div style={{ backgroundColor: '#151515' }} className="px-6 py-10">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center text-white md:grid-cols-4">
                    {statsBar.map((s) => (
                        <div key={s.label}>
                            <p
                                className="text-[40px] font-[900] tracking-[-0.02em] md:text-5xl"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {s.value}
                            </p>
                            <p
                                className="mt-1.5 text-[13px] font-[600] tracking-wide opacity-75 sm:text-[14px]"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <SectionWrapper bg="white" className="py-[80px] px-6 md:py-24">
                <div className="mb-12 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em] text-[#D70808]"
                        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                    >
                        💬 Testimoni Alumni Kami
                    </div>
                    <h2
                        className="mb-4 text-[clamp(24px,3vw,36px)] font-[900] leading-[1.3] text-[#151515] sm:text-3xl sm:font-black md:text-[2.5rem]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Lihat Bagaimana Mindset yang Benar{' '}
                        <br className="hidden sm:block" />
                        <span className="text-[#D70808]">
                            Berhasil Membuat Alumni Meraih Target Skor
                        </span>
                    </h2>
                    <p
                        className="text-[14px] font-[600] text-[#9ca3af] sm:text-[15px]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Klik foto untuk memperbesar
                    </p>
                </div>

                {/* Top 3 photos (Vertical List) */}
                <div className="mx-auto mb-6 flex max-w-[420px] flex-col">
                    {waScreenshots.slice(0, 3).map((img, i) => (
                        <div
                            key={i}
                            className="flex cursor-pointer flex-col items-center gap-2.5 border-b border-gray-200 py-5"
                            onClick={() => openLightbox(i)}
                        >
                            <p
                                className="m-0 text-[18px] font-[900] text-[#151515] sm:text-[20px]"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                Skor <span className="text-[#D70808]">{img.score}</span>
                            </p>
                            <div
                                className="w-full overflow-hidden rounded-[14px]"
                                style={{
                                    boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                                    aspectRatio: '1/1',
                                    backgroundImage: `url('${img.src}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
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
                        className="infinite-track flex w-max"
                        style={{ animationDuration: '35s' }}
                    >
                        {Array.from({ length: 4 }, () => waScreenshots)
                            .flat()
                            .map((img, i) => (
                                <div
                                    key={i}
                                    className="mx-2 flex shrink-0 cursor-pointer flex-col items-center gap-2"
                                    onClick={() => openLightbox(i % waScreenshots.length)}
                                >
                                    <p
                                        className="m-0 text-[16px] font-[900] text-[#151515] sm:text-[17px]"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}
                                    >
                                        Skor <span className="text-[#D70808]">{img.score}</span>
                                    </p>
                                    <div
                                        className="w-[130px] overflow-hidden rounded-xl"
                                        style={{
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                            aspectRatio: '9/16',
                                            backgroundImage: `url('${img.src}')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                {/* International testimonials */}
                <div className="mx-auto mb-14 w-full max-w-4xl">
                    <p
                        className="mb-6 text-center text-[12px] font-[800] uppercase tracking-[0.1em] text-[#9ca3af]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Testimoni Alumni yang Sukses Masuk Universitas Luar Negeri
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {internationalTestimonials.map((t) => (
                            <div
                                key={t.name}
                                className="flex min-w-0 flex-col gap-3 rounded-[16px] border border-gray-100 p-6"
                                style={{
                                    backgroundColor: '#F9F9F9',
                                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                                }}
                            >
                                <span
                                    className="self-start rounded-full bg-[#FFF0F0] px-3 py-1.5 text-[12px] font-[700] text-[#D70808]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {t.university}
                                </span>
                                <p
                                    className="text-[13px] font-[900] uppercase tracking-widest text-[#D70808] sm:text-[14px]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {t.title}
                                </p>
                                <p
                                    className="flex-1 text-[14px] leading-[1.7] text-[#3d3d3d] sm:text-[15px]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    "{t.text}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <div
                                        role="img"
                                        aria-label={t.name}
                                        className="h-10 w-10 shrink-0 rounded-full"
                                        style={{
                                            backgroundImage: `url('${t.avatar}')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="truncate text-[15px] font-[900] text-[#151515]"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}
                                        >
                                            {t.name}
                                        </p>
                                        <p
                                            className="truncate text-[13px] text-[#6b7280]"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}
                                        >
                                            {t.role}
                                        </p>
                                    </div>
                                    <span className="text-[12px] text-[#F59E0B]">★★★★★</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score carousel */}
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
                        className="infinite-track flex w-max"
                        style={{ animationDuration: '40s' }}
                    >
                        {Array.from({ length: 4 }, () => carouselItems)
                            .flat()
                            .map((item, i) => (
                                <div
                                    key={i}
                                    className="mx-3 flex shrink-0 items-center gap-3 rounded-[16px] border border-gray-100 bg-white px-5 py-4"
                                    style={{
                                        width: '220px',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <img 
                                        src={item.photo} 
                                        alt={item.name} 
                                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="truncate text-[13px] font-[900] text-[#151515] sm:text-[14px]"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}
                                        >
                                            {item.name}
                                        </p>
                                    </div>
                                    <p
                                        className="shrink-0 text-[20px] font-[900] text-[#16a34a] sm:text-[22px]"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}
                                    >
                                        {item.score}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Review Google Manual Carousel — deferred until idle */}
                {reviewReady && (
                    <div className="mt-12 mb-2">
                        <div className="mb-6 flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"></path>
                                <path fill="#FF3D00" d="M6.3 14.7l5.8 4.3C13.9 15.4 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 16.4 4 9.8 8.5 6.3 14.7z"></path>
                                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.6-3.4-11.3-8l-6 4.6C9.6 39.5 16.2 44 24 44z"></path>
                                <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1 3-3.1 5.5-5.9 7.1l6.2 5.2C39.4 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"></path>
                            </svg>
                            <span className="text-[14px] font-[900] text-[#151515]" style={{ fontFamily: "'Nunito', sans-serif" }}>4.9</span>
                            <span className="text-[16px] text-[#FBBF24]">★★★★★</span>
                            <span className="text-[14px] font-[600] text-gray-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                <b className="font-[900]">3.620</b> Google Reviews
                            </span>
                        </div>
                        
                        <div className="relative mx-auto flex h-[220px] max-w-3xl items-center justify-center overflow-hidden">
                            <button
                                onClick={prevGoogleCarousel}
                                aria-label="Sebelumnya"
                                className="absolute left-0 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-base shadow-sm hover:bg-gray-50"
                                style={{ color: '#151515' }}
                            >
                                ‹
                            </button>
                            
                            {/* Previous Slide */}
                            <div
                                onClick={() => openReview(prevIdx)}
                                className="absolute cursor-pointer overflow-hidden rounded-2xl opacity-50 shadow-lg transition-all duration-500"
                                style={{
                                    left: 'calc(50% - 260px)',
                                    width: '160px',
                                    height: '210px',
                                    zIndex: 1,
                                    backgroundImage: `url('${reviewPhotos[prevIdx]}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                            
                            {/* Center Slide */}
                            <img
                                src={reviewPhotos[centerIdx]}
                                onClick={() => openReview(centerIdx)}
                                alt="Google Review Center"
                                className="absolute cursor-pointer rounded-2xl object-contain shadow-xl transition-all duration-300"
                                style={{
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    height: '210px',
                                    width: 'auto',
                                    maxWidth: '340px',
                                    zIndex: 2,
                                }}
                            />

                            {/* Next Slide */}
                            <div
                                onClick={() => openReview(nextIdx)}
                                className="absolute cursor-pointer overflow-hidden rounded-2xl opacity-50 shadow-lg transition-all duration-500"
                                style={{
                                    left: 'calc(50% + 100px)',
                                    width: '160px',
                                    height: '210px',
                                    zIndex: 1,
                                    backgroundImage: `url('${reviewPhotos[nextIdx]}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />

                            <button
                                onClick={nextGoogleCarousel}
                                aria-label="Selanjutnya"
                                className="absolute right-0 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-base shadow-sm hover:bg-gray-50"
                                style={{ color: '#151515' }}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-10 mb-6 text-center">
                    <p
                        className="mx-auto mb-5 max-w-[520px] text-[18px] font-[800] leading-[1.6] text-[#151515]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Keberhasilan alumni selama ini bukan karena mereka pintar, tapi karena mereka <span className="text-[#D70808]">punya mindset yang tepat</span>.
                    </p>
                    <LpButton
                        href="#pricing"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D70808] px-7 py-3.5 text-[16px] font-[700] text-white shadow-[0_4px_20px_rgba(215,8,8,0.35)] transition-all hover:bg-[#b30606] sm:text-[17px] sm:font-bold"
                        onClick={() => trackCTA('social_proof_primary', 'Gabung Sekarang →', '#pricing')}
                    >
                        Gabung Sekarang →
                    </LpButton>
                </div>
            </SectionWrapper>

            {/* Lightbox for Score Photos */}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={waScreenshots}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                />
            )}

            {/* Lightbox for Google Reviews */}
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
                        <div
                            role="img"
                            aria-label="Review"
                            style={{
                                height: '85vh',
                                width: '400px',
                                maxWidth: '90vw',
                                borderRadius: '16px',
                                backgroundImage: `url('${reviewPhotos[reviewIndex]}')`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                            }}
                        />
                        <p className="m-0 text-[12px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Nunito', sans-serif" }}>
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