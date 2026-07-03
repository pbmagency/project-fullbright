import { useState, useEffect } from 'react';
import { Star, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';

const statsBar = [
    { value: '45.000+', label: 'Alumni Sukses' },
    { value: '4.9/5',   label: 'Rating Rata-rata' },
    { value: '13+',     label: 'Tahun Pengalaman' },
    { value: '95%',     label: 'Skor Naik Signifikan', micro: 'Berdasarkan data alumni batch 2024–2025' },
];


const waScreenshots = [
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
    { name: 'Kak Rani',      score: 547 },
    { name: 'Kak Ayu',       score: 543 },
    { name: 'Mbak Widya',    score: 563 },
    { name: 'Pak Yohanes',   score: 560 },
    { name: 'Kak Uly Sinaga',score: 507 },
    { name: 'Kak Nadia Ayu', score: 513 },
];

const internationalTestimonials = [
    { title: 'Sangat Terjangkau Untuk Mahasiswa', name: 'Andi Manggala Putra', role: 'Accounting and Finance', university: 'University of Nottingham, UK', text: 'Full Bright ini tempat yang paling "pas" buat teman-teman Mahasiswa menaklukkan Tes TOEFL & IELTS', avatar: '/people/People 1.webp' },
    { title: 'A Good Place to Learn TOEFL & IELTS', name: 'Hajrah', role: 'Student Water Resources Engineering and Management', university: 'Stuttgart University, Germany', text: 'Fullbright growing together with their students. This place is good place to learn TOEFL & IELTS. Thank you for the teacher and friendly staff. Now I can see the world', avatar: '/people/People 2.webp' },
];

function Stars() {
    return <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}</div>;
}

function avatarBg(i: number) { return i % 2 === 0 ? '#151515' : '#D70808'; }


function PhotoLightbox({ photos, index, onClose, onPrev, onNext }: {
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
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition" aria-label="Tutup">
                <X size={28} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 text-white/70 hover:text-white transition p-2"
                aria-label="Sebelumnya"
            >
                <ChevronLeft size={36} />
            </button>
            <div className="flex flex-col items-center gap-4 px-16" onClick={(e) => e.stopPropagation()}>
                <img
                    src={photo.src}
                    alt={photo.name}
                    width={340}
                    height={604}
                    className="max-h-[80vh] max-w-[340px] w-full object-contain rounded-2xl"
                    style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                />
                <div className="text-center">
                    <p className="text-white font-black text-base" style={{ fontFamily: 'var(--font-heading)' }}>{photo.name}</p>
                    <p className="text-white/60 text-sm">{photo.score ? `Skor ${photo.score} · ` : ''}{photo.label}</p>
                </div>
                <p className="text-white/40 text-xs">{index + 1} / {photos.length}</p>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 text-white/70 hover:text-white transition p-2"
                aria-label="Berikutnya"
            >
                <ChevronRight size={36} />
            </button>
        </div>
    );
}

const reviewPhotos = Array.from({ length: 19 }, (_, i) => `/review/Riview (${i + 1}).webp`);

export default function SocialProofSection() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [reviewIndex, setReviewIndex] = useState<number | null>(null);
    const [reviewReady, setReviewReady] = useState(false);

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () => setLightboxIndex((i) => i !== null ? (i - 1 + waScreenshots.length) % waScreenshots.length : null);
    const nextPhoto = () => setLightboxIndex((i) => i !== null ? (i + 1) % waScreenshots.length : null);

    useEffect(() => {
        const id = window.requestIdleCallback
            ? window.requestIdleCallback(() => setReviewReady(true), { timeout: 2000 })
            : setTimeout(() => setReviewReady(true), 1500) as unknown as number;
        return () => {
            if (window.requestIdleCallback) {
                window.cancelIdleCallback(id);
            } else {
                clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
            }
        };
    }, []);

    const openReview = (i: number) => setReviewIndex(i % 19);
    const closeReview = () => setReviewIndex(null);
    const prevReview = () => setReviewIndex((i) => i !== null ? (i - 1 + 19) % 19 : null);
    const nextReview = () => setReviewIndex((i) => i !== null ? (i + 1) % 19 : null);

    return (
        <div id="testimonials">
            {/* Stats bar */}
            <div style={{ backgroundColor: '#151515' }} className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {statsBar.map((s) => (
                            <div key={s.label}>
                                <p className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                                <p className="text-xs mt-1.5 opacity-75 font-medium tracking-wide">{s.label}</p>
                                {s.micro && <p className="text-[10px] mt-1 opacity-50 italic">{s.micro}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* <SectionWrapper bg="cultured" className="py-20 md:py-24">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>🏆 Skor Resmi — Terkonfirmasi dari Score Report ETS</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Lihat Sendiri Skor yang <span style={{ color: '#D70808' }}>Berhasil Diraih Alumni</span>
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {scoreResults.map((r) => <ScoreCard key={r.name} {...r} />)}
                </div>
                <div className="text-center">
                    <LpButton href="#pricing" size="lg">Raih Skorku Sekarang →</LpButton>
                    <SocialProofMicro />
                </div>
            </SectionWrapper> */}

            <SectionWrapper bg="white" className="py-20 md:py-24">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <MessageCircle size={13} /> Testimoni Alumni Kami
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Hasil Skor TOEFL dari <span style={{ color: '#D70808' }}>Alumni Kami</span>
                    </h2>
                    <p className="text-sm" style={{ color: '#9ca3af' }}>Klik foto untuk memperbesar</p>
                </div>

                {/* Top 3 photos — grid with captions, clickable lightbox */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
                    {waScreenshots.slice(0, 3).map((img, i) => (
                        <div key={img.src} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => openLightbox(i)}>
                            <div className="relative group overflow-hidden w-full" style={{ borderRadius: '14px', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', aspectRatio: '9/16' }}>
                                <img src={img.src} alt={`Score Report Alumni Skor ${img.score}`} width={260} height={463} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                                    <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Perbesar</span>
                                </div>
                            </div>
                            {img.score && <p className="text-xs font-bold text-center" style={{ color: '#151515' }}>Skor {img.score}</p>}
                        </div>
                    ))}
                </div>

                {/* Photo infinite carousel */}
                <div className="overflow-hidden mb-14" style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}>
                    <div className="infinite-track" style={{ animationDuration: '35s' }}>
                        {Array.from({ length: 2 }, () => waScreenshots).flat().map((img, i) => (
                            <div key={i} className="shrink-0 mx-2 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => openLightbox(i % waScreenshots.length)}>
                                <div className="relative overflow-hidden" style={{ width: '130px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', aspectRatio: '9/16' }}>
                                    <img src={img.src} alt={`Score Report Alumni Skor ${img.score}`} width={130} height={231} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                </div>
                                {img.score && <p className="text-[10px] font-bold text-center" style={{ color: '#151515' }}>Skor {img.score}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* International testimonials */}
                <div className="w-full max-w-4xl mx-auto mb-14">
                    <p className="text-xs font-bold uppercase tracking-widest text-center mb-6" style={{ color: '#9ca3af' }}>Testimoni Alumni yang Sukses Masuk Universitas Luar Negeri</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {internationalTestimonials.map((t, i) => (
                            <div key={t.name} className="rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 min-w-0" style={{ backgroundColor: '#F9F9F9', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full self-start" style={{ backgroundColor: '#FFF0F0', color: '#D70808' }}>{t.university}</span>
                                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D70808' }}>{t.title}</p>
                                <p className="text-sm leading-relaxed flex-1" style={{ color: '#3d3d3d' }}>"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0" style={{ backgroundColor: avatarBg(i), fontFamily: 'var(--font-heading)' }}>{t.name[0]}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black truncate" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>{t.name}</p>
                                        <p className="text-xs truncate" style={{ color: '#6b7280' }}>{t.role}</p>
                                    </div>
                                    <Stars />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score carousel — name only, no source */}
                <div className="overflow-hidden mt-10" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                    <div className="infinite-track" style={{ animationDuration: '40s' }}>
                        {Array.from({ length: 4 }, () => carouselItems).flat().map((item, i) => (
                            <div key={i} className="shrink-0 mx-3 bg-white rounded-2xl px-5 py-4 flex items-center gap-3 border border-gray-100" style={{ width: '220px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0" style={{ backgroundColor: avatarBg(i), fontFamily: 'var(--font-heading)' }}>{item.name[0]}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black truncate" style={{ color: '#151515' }}>{item.name}</p>
                                </div>
                                <p className="text-xl font-black shrink-0" style={{ fontFamily: 'var(--font-heading)', color: '#16a34a' }}>{item.score}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review alumni carousel — deferred until idle */}
                {reviewReady && <div className="mt-12 mb-2">
                    <p className="text-xs font-black uppercase tracking-widest text-center mb-5" style={{ color: '#9ca3af' }}>Review Alumni di Google & Media Sosial</p>
                    <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}>
                        <div className="infinite-track" style={{ animationDuration: '60s', alignItems: 'flex-start' }}>
                            {Array.from({ length: 2 }, () => reviewPhotos).flat().map((src, i) => (
                                <div key={i} className="shrink-0 mx-2 overflow-hidden rounded-2xl cursor-pointer group" style={{ maxWidth: '200px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} onClick={() => openReview(i)}>
                                    <div className="relative">
                                        <img
                                            src={src}
                                            alt={`Review Alumni Full Bright ${(i % 19) + 1}`}
                                            width={200}
                                            height={300}
                                            className="h-auto w-full group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                                            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Perbesar</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}

                <div className="text-center mt-10">
                    <LpButton href="#pricing" size="md">Mulai Belajar Sekarang →</LpButton>
                    <SocialProofMicro />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.92)' }} onClick={closeReview}>
                    <button onClick={closeReview} className="absolute top-4 right-4 text-white/70 hover:text-white transition" aria-label="Tutup"><X size={28} /></button>
                    <button onClick={(e) => { e.stopPropagation(); prevReview(); }} className="absolute left-4 text-white/70 hover:text-white transition p-2" aria-label="Sebelumnya"><ChevronLeft size={36} /></button>
                    <div className="px-16 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={reviewPhotos[reviewIndex]}
                            alt={`Review Alumni ${reviewIndex + 1}`}
                            className="max-h-[85vh] max-w-[90vw] w-auto object-contain rounded-2xl"
                            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                        />
                        <p className="text-white/40 text-xs">{reviewIndex + 1} / 19</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); nextReview(); }} className="absolute right-4 text-white/70 hover:text-white transition p-2" aria-label="Berikutnya"><ChevronRight size={36} /></button>
                </div>
            )}
        </div>
    );
}
