import { useCallback, useEffect, useRef, useState   } from 'react';
import type {CSSProperties, MouseEvent, MouseEvent as ReactMouseEvent} from 'react';
import { generateEventId, useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useSectionTracking } from '@/hooks/use-section-tracking';

/* ============================================================
   Full Bright Indonesia — landing page TOEFL ITP (Pricing Varian B)
   Vite + Inertia + React, Tailwind CSS v4.
   Semua asset ada di public/assets-c12/ dan dirujuk sebagai /assets-c12/*
   ============================================================ */

interface ProofPart { text: string; bold?: boolean }
interface ProofToast { parts: ProofPart[]; time: string }

/* Chrome 121+ menunda unduhan poster <video> yang masih jauh dari viewport
 * lewat `loading=lazy`, tetapi tipe React belum punya properti itu untuk
 * elemen video. */
const LAZY_POSTER: { loading: 'lazy' } = { loading: 'lazy' };

const WA_NUMBER = '6285255499299';
const waUrl = (text: string): string => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

const FLASH_WINDOW_MS = 12 * 60 * 60 * 1000;
function flashDeadline(): number {
  let start = Number(localStorage.getItem('fb_flash_start') || 0);

  if (!start) {
    start = Date.now();

    try {
 localStorage.setItem('fb_flash_start', String(start)); 
} catch { /* storage disabled */ }
  }

  return start + FLASH_WINDOW_MS;
}
const flashRemainingMs = (): number => (typeof window === 'undefined' ? FLASH_WINDOW_MS : Math.max(0, flashDeadline() - Date.now()));
function formatCountdown(ms: number): string {
  const t = Math.floor(ms / 1000);
  const h = String(Math.floor(t / 3600)).padStart(2, '0');
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const s = String(t % 60).padStart(2, '0');

  return `${h}:${m}:${s}`;
}

const WA_SCREENSHOTS: { src: string; score: string }[] = [
  { src: '/assets-c12/toefl1.webp', score: '547' },
  { src: '/assets-c12/toefl2.webp', score: '543' },
  { src: '/assets-c12/toefl3.webp', score: '563' },
  { src: '/assets-c12/toefl4.webp', score: '560' },
  { src: '/assets-c12/toefl5.webp', score: '507' },
  { src: '/assets-c12/toefl6.webp', score: '513' },
  { src: '/assets-c12/toefl7.webp', score: '537' },
  { src: '/assets-c12/toefl9.webp', score: '560' },
];

const REVIEW_COUNT = 19;
const reviewSrc = (i: number): string => `/assets-c12/Riview (${i + 1}).webp`;
const TRACKED_HASH_DESTINATIONS = new Set(['#pricing', '#testimonials']);

function analyticsLocation(anchor: HTMLAnchorElement, destination: string): string {
  if (anchor.dataset.analyticsLocation) {
    return anchor.dataset.analyticsLocation;
  }

  if (anchor.id) {
    return anchor.id.replaceAll('-', '_');
  }

  const sectionId = anchor.closest<HTMLElement>('section[id]')?.id;

  if (sectionId) {
    return `${sectionId}_${destination.startsWith('#') ? destination.slice(1) : 'link'}`;
  }

  if (anchor.closest('header')) {
    return 'navbar';
  }

  if (anchor.closest('footer')) {
    return 'footer_whatsapp';
  }

  return destination.includes('wa.me/') ? 'floating_whatsapp' : 'unlabeled_cta';
}

const RETURN_OPTIONS: string[] = [
  'Harganya masih terlalu mahal buatku',
  'Belum yakin bisa mencapai target TOEFL-ku',
  'Belum yakin program ini cocok untuk kebutuhanku',
  'Masih membandingkan dengan program lain',
];

const RETURN_CTA_LOCATIONS = [
  'return_popup_harga_terlalu_mahal',
  'return_popup_ragu_target_toefl',
  'return_popup_ragu_program_cocok',
  'return_popup_membandingkan_program',
];

const RETURN_WA_MSGS: string[] = [
  'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal paket dan harga sebelum daftar.',
  'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal metode belajar dan hasil yang bisa dicapai sebelum daftar.',
  'Halo Admin Full Bright Indonesia. Saya mau konsultasi apakah program ini cocok dengan kebutuhan saya sebelum daftar.',
  'Halo Admin Full Bright Indonesia. Saya masih membandingkan dengan program lain, mau tanya-tanya dulu.',
];

const RETURN_SUBTEXTS: string[] = [
  'Ada yang ingin ditanyakan soal harga atau paket?',
  'Mau tahu apakah program ini cocok untuk target skor kamu?',
  'Konsultasikan dulu apakah program ini cocok untukmu.',
  'Masih membandingkan? Tanya tim kami tentang programnya.',
];

const FAQ_CATEGORIES: string[] = [
  "Belajar Mandiri (LMS)",
  "Metode & Efektivitas",
  "Dibimbing Tutor",
  "Sertifikat & Legalitas",
  "Pendaftaran & Pembayaran",
  "Jaminan & Garansi"
];

const FAQ_ITEM_CATEGORIES: string[] = [
  "Belajar Mandiri (LMS)",
  "Belajar Mandiri (LMS)",
  "Belajar Mandiri (LMS)",
  "Belajar Mandiri (LMS)",
  "Belajar Mandiri (LMS)",
  "Metode & Efektivitas",
  "Metode & Efektivitas",
  "Metode & Efektivitas",
  "Metode & Efektivitas",
  "Metode & Efektivitas",
  "Dibimbing Tutor",
  "Dibimbing Tutor",
  "Dibimbing Tutor",
  "Sertifikat & Legalitas",
  "Sertifikat & Legalitas",
  "Pendaftaran & Pembayaran",
  "Jaminan & Garansi"
];

const PROOF_CITIES: string[] = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang', 'Malang', 'Palembang', 'Denpasar', 'Bogor', 'Balikpapan'];
const PROOF_GOALS: string[] = ['syarat Beasiswa LPDP', 'syarat skripsi & kelulusan S1', 'syarat pendaftaran S2 dalam negeri', 'syarat rekrutmen BUMN', 'syarat CPNS', 'syarat kenaikan jabatan kantor', 'kejar target skor 500+'];
const PROOF_TIMES: string[] = ['Baru saja', '1 menit lalu', '2 menit lalu', '4 menit lalu'];

function makeProof(): ProofToast {
  const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
  const city = pick(PROOF_CITIES);
  const time = pick(PROOF_TIMES);

  return Math.random() > 0.5
    ? { parts: [{ text: 'Seseorang di ' }, { text: city, bold: true }, { text: ' daftar kelas TOEFL.' }], time }
    : { parts: [{ text: 'Peserta dari ' }, { text: city, bold: true }, { text: ' daftar untuk ' }, { text: pick(PROOF_GOALS), bold: true }, { text: '.' }], time };
}

/** Mengubah string deklarasi CSS menjadi objek style React (khusus nilai yang berubah saat runtime). */
function css(decl: string): CSSProperties {
  const out: Record<string, string> = {};
  decl.split(';').forEach((part) => {
    const chunk = part.trim();

    if (!chunk) {
return;
}

    const at = chunk.indexOf(':');

    if (at < 0) {
return;
}

    const prop = chunk.slice(0, at).trim();
    const value = chunk.slice(at + 1).trim();
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    out[key] = value;
  });

  return out as CSSProperties;
}

const navStyle = (scrolled: boolean, bannerH: number): string =>
  `position:fixed;top:${bannerH}px;left:0;right:0;z-index:50;transition:all 0.3s;border-bottom:1px solid #f3f4f6;` +
  (scrolled
    ? 'background:rgba(255,255,255,0.95);box-shadow:0 4px 12px rgba(0,0,0,0.08);backdrop-filter:blur(8px);'
    : 'background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.05);');

const cmpHeaderStyle = (bannerH: number): string =>
  `position:sticky;top:${bannerH + 64}px;background-clip:padding-box;z-index:20;display:grid;grid-template-columns:1.5fr 0.85fr 0.85fr 0.9fr;background:#F9F9F9;border-bottom:1px solid #ececec;border-radius:20px 20px 0 0;align-items:stretch;overflow:hidden;`;

const catBtnStyle = (active: boolean): string =>
  `cursor:pointer;font-size:12px;font-weight:700;padding:8px 16px;border-radius:9999px;border:1.5px solid #D70808;background:${active ? '#D70808' : '#fff'};color:${active ? '#fff' : '#D70808'};`;

const faqItemStyle = (activeCat: string | null, i: number): string =>
  `border-bottom:1px solid #f3f4f6;display:${activeCat === null || activeCat === FAQ_ITEM_CATEGORIES[i] ? 'block' : 'none'};`;

const faqQStyle = (open: boolean): string =>
  `font-size:14px;font-weight:700;line-height:1.4;font-family:'Nunito',sans-serif;color:${open ? '#D70808' : '#151515'};`;

const faqChevStyle = (open: boolean): string =>
  `flex-shrink:0;margin-top:2px;font-size:14px;color:${open ? '#D70808' : '#151515'};transform:${open ? 'rotate(180deg)' : 'rotate(0deg)'};display:inline-block;`;

const surveyMsgStyle = (answered: boolean): string =>
  `margin:8px 0 0;min-height:16px;font-size:12px;font-weight:600;color:#6b7280;opacity:${answered ? 1 : 0};transition:opacity 0.25s ease;`;

const lbImgStyle = (i: number | null): string =>
  `height:80vh;width:340px;max-width:80vw;border-radius:16px;background-image:url('${WA_SCREENSHOTS[i ?? 0].src}');background-size:contain;background-repeat:no-repeat;background-position:center;box-shadow:0 24px 80px rgba(0,0,0,0.6);`;

const rvImgStyle = (i: number | null): string =>
  `height:85vh;width:400px;max-width:90vw;border-radius:16px;background-image:url('${reviewSrc(i ?? 0)}');background-size:contain;background-repeat:no-repeat;background-position:center;box-shadow:0 24px 80px rgba(0,0,0,0.6);`;

const gSideStyle = (side: 'prev' | 'next', gIdx: number): string => {
  const idx = side === 'prev' ? (gIdx - 1 + REVIEW_COUNT) % REVIEW_COUNT : (gIdx + 1) % REVIEW_COUNT;
  const left = side === 'prev' ? 'calc(50% - 260px)' : 'calc(50% + 100px)';

  return `position:absolute;transition:all 0.6s ease;cursor:pointer;overflow:hidden;border-radius:16px;background-image:url('${reviewSrc(idx)}');background-size:cover;background-position:center;left:${left};width:160px;height:210px;opacity:0.5;z-index:1;box-shadow:0 8px 28px rgba(0,0,0,0.18);`;
};

/* Hanya untuk hal yang tidak bisa jadi utility class: @keyframes + reset font. */
const GLOBAL_CSS = `
  body { margin: 0; font-family: 'Nunito', system-ui, sans-serif; }
  h1, h2, h3, h4, h5, h6, p, span, div, li, a, button, input, select, textarea, ul, ol, dl, dt, dd, strong, b, em, i, font, label { font-family: 'Nunito', system-ui, sans-serif; }
  a:not([class]) { color: #D70808; }
  a:not([class]):hover { color: #b30606; }
  @keyframes infiniteScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fbFadeInUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fbSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes heroBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
`;

type LandingPageProps = {
  renderCriticalSections?: boolean;
};

export default function LandingPage({ renderCriticalSections = true }: LandingPageProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [bannerH, setBannerH] = useState<number>(38);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [reviewIdx, setReviewIdx] = useState<number | null>(null);
  const [gIdx, setGIdx] = useState<number>(0);
  const [surveySelected, setSurveySelected] = useState<number | null>(null);
  const [rpOpen, setRpOpen] = useState<boolean>(false);
  const [rpSelected, setRpSelected] = useState<number | null>(null);
  const [waBubbleOpen, setWaBubbleOpen] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [showOverlay2, setShowOverlay2] = useState<boolean>(true);
  const [showLmsOverlay, setShowLmsOverlay] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<string>('12:00:00');
  const [flashVisible, setFlashVisible] = useState<boolean>(true);
  const [proofToasts, setProofToasts] = useState<ProofToast[]>([]);
  const [proofDismissed, setProofDismissed] = useState<boolean>(false);
  const [lmsDetailOpen, setLmsDetailOpen] = useState<boolean>(false);
  const [bundlingDetailOpen, setBundlingDetailOpen] = useState<boolean>(false);
  const [tutorPanelOpen, setTutorPanelOpen] = useState<boolean>(false);
  const [starterDetailOpen, setStarterDetailOpen] = useState<boolean>(false);
  const [interDetailOpen, setInterDetailOpen] = useState<boolean>(false);

  const bannerRef = useRef<HTMLAnchorElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const lmsVideoRef = useRef<HTMLVideoElement | null>(null);
  const proofShown = useRef<number>(0);
  const proofMax = useRef<number>(3);
  const proofNext = useRef<number | undefined>(undefined);
  const proofHide = useRef<number | undefined>(undefined);
  const { trackVisit, trackCTA, trackInitiateCheckout, trackConversion, trackInteraction, trackVideoPlay } = useAnalytics();

  useScrollTracking();
  useDwellTime();
  useSectionTracking();

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  const handleTrackedClick = useCallback((event: ReactMouseEvent<HTMLDivElement>): void => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>('a[href]');

    if (!anchor || !event.currentTarget.contains(anchor)) {
      return;
    }

    const destination = anchor.getAttribute('href') ?? '';
    const isWhatsApp = destination.includes('wa.me/');
    const isCheckout = destination.includes('member.fullbrightindonesia.com/');

    if (!isWhatsApp && !isCheckout && !TRACKED_HASH_DESTINATIONS.has(destination) && !anchor.dataset.analyticsLocation) {
      return;
    }

    const location = analyticsLocation(anchor, destination);
    const label = (anchor.getAttribute('aria-label') || anchor.textContent || 'CTA')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 255);
    const packageName = anchor.dataset.analyticsPackage;
    const parsedPrice = Number(anchor.dataset.analyticsPrice);
    const price = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : undefined;

    trackCTA(location, label, destination);

    if (isCheckout) {
      trackInitiateCheckout(
        location,
        { level: packageName, package: packageName, price, payment_url: destination },
        generateEventId(),
      );
    } else if (isWhatsApp) {
      trackConversion(anchor.dataset.analyticsConversion || 'wa_inquiry', {
        location,
        package: packageName,
        price,
        destination,
      });
    }
  }, [trackCTA, trackConversion, trackInitiateCheckout]);

  const selectSurvey = useCallback((index: number, answer: string): void => {
    setSurveySelected(index);
    trackInteraction('difficulty_survey', answer);
    trackCTA([
      'difficulty_survey_bingung_mulai_belajar',
      'difficulty_survey_skor_masih_stuck',
      'difficulty_survey_ragu_ikut_kursus',
      'difficulty_survey_lainnya',
    ][index], answer, 'difficulty_survey');
  }, [trackCTA, trackInteraction]);

  const selectReturnSurvey = useCallback((index: number): void => {
    const answer = RETURN_OPTIONS[index];
    const location = RETURN_CTA_LOCATIONS[index];

    if (!answer || !location) {
      return;
    }

    setRpSelected(index);
    trackInteraction('return_popup_survey', answer);
    trackCTA(location, answer, 'return_popup_survey');
  }, [trackCTA, trackInteraction]);

  /* countdown flash sale, per pengunjung, disimpan di localStorage */
  useEffect(() => {
    const tick = (): void => {
      const left = flashRemainingMs();
      setCountdown(formatCountdown(left));
      setFlashVisible(left > 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, []);

  /* shadow navbar saat scroll */
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* offset sticky diukur dari tinggi banner (jadi 0 saat banner hilang) */
  useEffect(() => {
    const measure = (): void => setBannerH(bannerRef.current ? Math.round(bannerRef.current.getBoundingClientRect().height) : 0);
    measure();
    window.addEventListener('resize', measure);
    const poll = window.setInterval(measure, 500);

    return () => {
 window.removeEventListener('resize', measure); window.clearInterval(poll); 
};
  }, [flashVisible]);

  /* autoplay carousel Google review */
  useEffect(() => {
    const id = window.setInterval(() => setGIdx((i) => (i + 1) % REVIEW_COUNT), 3000);

    return () => window.clearInterval(id);
  }, [gIdx]);

  /* bubble WhatsApp: muncul 10 detik setelah halaman dibuka, sekali per sesi */
  useEffect(() => {
    let dismissed = false;

    try {
 dismissed = sessionStorage.getItem('fb_wa_bubble_v3') === '1'; 
} catch { /* storage disabled */ }

    if (dismissed) {
return;
}

    const timer = window.setTimeout(() => setWaBubbleOpen(true), 10000);

    return () => window.clearTimeout(timer);
  }, []);

  /* notifikasi social proof: jeda acak 10–20 detik, maksimal 3–4 kali per sesi */
  useEffect(() => {
    const queue = (delay: number): void => {
      proofNext.current = window.setTimeout(() => {
        if (proofShown.current >= proofMax.current) {
return;
}

        const burst = proofShown.current > 0 && proofShown.current + 2 <= proofMax.current && Math.random() < 0.3;
        const batch = burst ? [makeProof(), makeProof()] : [makeProof()];
        proofShown.current += batch.length;
        setProofToasts(batch);
        proofHide.current = window.setTimeout(() => {
          setProofToasts([]);

          if (proofShown.current < proofMax.current) {
queue(10000 + Math.random() * 10000);
}
        }, 5500);
      }, delay);
    };
    queue(6000);

    return () => {
 window.clearTimeout(proofNext.current); window.clearTimeout(proofHide.current); 
};
  }, []);

  /* survey exit-checkout: muncul saat pengunjung kembali ke tab ini */
  useEffect(() => {
    const onVisible = (): void => {
      if (document.visibilityState !== 'visible') {
return;
}

      try {
        const clickedAt = Number(localStorage.getItem('fb_checkout_clicked_at') || 0);
        const shown = localStorage.getItem('fb_return_popup_shown');

        if (clickedAt && !shown && Date.now() - clickedAt < 86400000) {
          setRpOpen(true);
          localStorage.setItem('fb_return_popup_shown', '1');
        }
      } catch { /* storage disabled */ }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const closeLightbox = useCallback((): void => setLightboxIdx(null), []);
  const prevPhoto = useCallback((): void => setLightboxIdx((i) => ((i ?? 0) - 1 + WA_SCREENSHOTS.length) % WA_SCREENSHOTS.length), []);
  const nextPhoto = useCallback((): void => setLightboxIdx((i) => ((i ?? 0) + 1) % WA_SCREENSHOTS.length), []);
  const closeReview = useCallback((): void => setReviewIdx(null), []);
  const prevReview = useCallback((): void => setReviewIdx((i) => ((i ?? 0) - 1 + REVIEW_COUNT) % REVIEW_COUNT), []);
  const nextReview = useCallback((): void => setReviewIdx((i) => ((i ?? 0) + 1) % REVIEW_COUNT), []);
  const prevGoogle = useCallback((): void => setGIdx((i) => (i - 1 + REVIEW_COUNT) % REVIEW_COUNT), []);
  const nextGoogle = useCallback((): void => setGIdx((i) => (i + 1) % REVIEW_COUNT), []);
  const closeReturnPopup = useCallback((): void => setRpOpen(false), []);
  const toggleCat = useCallback((i: number): void => setActiveCat((cur) => (cur === FAQ_CATEGORIES[i] ? null : FAQ_CATEGORIES[i])), []);
  const playVideo = useCallback((): void => {
 if (videoRef.current?.paused) {
void videoRef.current.play();
} 
}, []);
  const playVideo2 = useCallback((): void => {
 if (videoRef2.current?.paused) {
void videoRef2.current.play();
} 
}, []);
  const handleTestimonialVideoPlay = useCallback((): void => {
    setShowOverlay(false);
    trackVideoPlay('alumni_testimonial_video');
  }, [trackVideoPlay]);
  const handleSecondTestimonialVideoPlay = useCallback((): void => {
    setShowOverlay2(false);
    trackVideoPlay('alumni_testimonial_video_2');
  }, [trackVideoPlay]);
  const playLmsVideo = useCallback((): void => {
    const video = lmsVideoRef.current;

    if (!video) {
      return;
    }

    /* Poster menggantikan frame pratinjau, sehingga video CDN hanya
     * diunduh ketika pengunjung benar-benar memutarnya. */
    if (!video.getAttribute('src')) {
      video.src = 'https://demo-fullbright.b-cdn.net/NEW.mp4';
    }

    video.currentTime = 0;
    void video.play();
  }, []);
  const handleLmsVideoPlay = useCallback((): void => {
    setShowLmsOverlay(false);
    trackVideoPlay('lms_showcase_video');
  }, [trackVideoPlay]);
  const toggleLmsDetail = useCallback((): void => setLmsDetailOpen((v) => !v), []);
  const toggleBundlingDetail = useCallback((): void => setBundlingDetailOpen((v) => !v), []);
  const toggleTutorPanel = useCallback((): void => setTutorPanelOpen((v) => !v), []);
  const toggleStarterDetail = useCallback((): void => setStarterDetailOpen((v) => !v), []);
  const toggleInterDetail = useCallback((): void => setInterDetailOpen((v) => !v), []);
  const dismissWaBubble = useCallback((e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setWaBubbleOpen(false);

    try {
 sessionStorage.setItem('fb_wa_bubble_v3', '1'); 
} catch { /* storage disabled */ }
  }, []);
  const dismissProofToast = useCallback((): void => {
    window.clearTimeout(proofNext.current);
    window.clearTimeout(proofHide.current);
    setProofToasts([]);
    setProofDismissed(true);
  }, []);
  const markCheckoutClicked = useCallback((): void => {
    try {
      localStorage.setItem('fb_checkout_clicked_at', String(Date.now()));
      localStorage.removeItem('fb_return_popup_shown');
    } catch { /* storage disabled */ }
  }, []);

  /* navigasi keyboard untuk kedua lightbox */
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (lightboxIdx !== null) {
        if (e.key === 'Escape') {
closeLightbox();
} else if (e.key === 'ArrowLeft') {
prevPhoto();
} else if (e.key === 'ArrowRight') {
nextPhoto();
}
      } else if (reviewIdx !== null) {
        if (e.key === 'Escape') {
closeReview();
} else if (e.key === 'ArrowLeft') {
prevReview();
} else if (e.key === 'ArrowRight') {
nextReview();
}
      } else if (rpOpen && e.key === 'Escape') {
        closeReturnPopup();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, reviewIdx, rpOpen, closeLightbox, prevPhoto, nextPhoto, closeReview, prevReview, nextReview, closeReturnPopup]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      
      
      <div role="main" onClickCapture={handleTrackedClick} className="[min-height:100vh] [background:#fff] [font-family:Nunito,system-ui,sans-serif]">
      
        {renderCriticalSections ? (<>
        {/* Urgency Banner */}
        {flashVisible ? (<>
          <a ref={bannerRef} id="urgency-banner" href="#pricing" className="[position:fixed] [top:0] [left:0] [right:0] [z-index:51] [display:flex] [align-items:center] [justify-content:center] [flex-wrap:nowrap] [gap:8px] [background:#C10707] [padding:8px_12px] [text-align:center] [text-decoration:none] [white-space:nowrap] [overflow:hidden] max-[500px]:[padding:10px_12px]">
            <span id="banner-full" className="[font-size:13px] [font-weight:800] [letter-spacing:0.02em] [text-transform:uppercase] [color:#fff] [line-height:1.4] max-[500px]:[display:none]">🔥 FLASH SALE SEPTEMBER · DISKON 60%</span>
            <span id="banner-short" className="[display:none] [font-size:11px] [font-weight:800] [letter-spacing:0.01em] [text-transform:uppercase] [color:#fff] [line-height:1.4] max-[500px]:[display:inline] max-[500px]:[font-size:12.5px]">🔥 FLASH SALE SEPTEMBER · 60%</span>
            <span className="[display:inline-flex] [align-items:center] [gap:5px] [flex-shrink:0] [background:#fff] [color:#C10707] [border-radius:9999px] [padding:3px_10px] [line-height:1.2]">
              <span id="banner-timer-label" className="[font-size:11px] [font-weight:800] [letter-spacing:0.04em] [text-transform:uppercase] max-[500px]:[display:none]">⏱ Berakhir</span>
              <span className="[font-size:13px] [font-weight:900] [font-variant-numeric:tabular-nums] max-[500px]:[font-size:14px] [letter-spacing:0.04em]">{countdown}</span>
            </span>
          </a>
        </>) : null}
      
        {/* Navbar */}
        <div style={css(`height:${bannerH + 64}px;`)}></div>
        <header style={css(navStyle(scrolled, bannerH))}>
          <div className="[max-width:1152px] [margin:0_auto] [height:64px] [display:flex] [align-items:center] [justify-content:space-between] [padding:0_24px] [overflow:hidden]">
            <a href="#" className="[display:flex] [align-items:center] [text-decoration:none]">
              <img loading="eager" decoding="async" fetchPriority="high" src="/logo/Logo-Fullbright.webp" width="400" height="400" alt="Full Bright Indonesia" className="[height:150px] [width:auto] [object-fit:contain] [display:block] [margin:-43px_0]" />
            </a>
              <a href="#pricing" data-analytics-location="navbar_pricing" className="[display:flex] [flex-direction:column] [justify-content:center] [gap:1px] [border-radius:9999px] [background:#D70808] [box-shadow:0_6px_16px_rgba(215,8,8,0.35)] [text-decoration:none] [padding:7px_16px]">
              <span className="[font-size:13px] [font-weight:800] [color:#fff] [white-space:nowrap] [line-height:1.2]">🎓 Amankan Seat</span>
              <span className="[display:flex] [align-items:center] [gap:5px]">
                <span className="[font-size:11px] [text-decoration:line-through] [color:rgba(255,255,255,0.55)] [white-space:nowrap]">Rp250rb</span>
                <span className="[font-size:14px] [font-weight:900] [color:#fff] [white-space:nowrap]">Rp99rb</span>
                <span className="[background:#F59E0B] [color:#151515] [font-size:10px] [font-weight:900] [padding:2px_7px] [border-radius:9999px] [white-space:nowrap]">-60%</span>
              </span>
            </a>
          </div>
        </header>
      
        {/* Hero */}
        <section className="[position:relative] [overflow:hidden] [background:linear-gradient(160deg,#fff_55%,#FFF5F5_100%)]">
          <div className="[pointer-events:none] [position:absolute] [top:-96px] [right:-96px] [height:384px] [width:384px] [border-radius:9999px] [background:#D70808] [filter:blur(120px)] [opacity:0.07]"></div>
          <div className="[pointer-events:none] [position:absolute] [bottom:-96px] [left:-96px] [height:288px] [width:288px] [border-radius:9999px] [background:#151515] [filter:blur(100px)] [opacity:0.05]"></div>
      
          <div id="hero-section-inner" className="[position:relative] [max-width:1152px] [margin:0_auto] [padding:40px_24px_16px] [display:grid] [grid-template-columns:1fr] [gap:40px] max-[500px]:[padding-top:24px] max-[500px]:[padding-bottom:8px] max-[500px]:[gap:24px]">
            <div className="[display:grid] [grid-template-columns:1.05fr_0.95fr] [gap:40px] [align-items:center] max-[899px]:[position:relative] max-[899px]:[grid-template-columns:1fr] max-[899px]:[gap:12px]">
              <div className="[display:flex] [flex-direction:column] [gap:16px] [grid-column:1] [position:relative] [z-index:1]">
                <div id="hero-rating-badge" className="[display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.05em] [color:#374151] [border:1.5px_solid_#151515] [width:fit-content] max-[500px]:[font-size:clamp(9px,2.6vw,12px)] max-[500px]:[padding:clamp(4px,1.2vw,6px)_clamp(10px,3vw,16px)]">
                  <span className="[display:flex] [gap:2px] [color:#F59E0B]">★★★★★</span>
                  <span className="[letter-spacing:0.08em] [text-transform:uppercase]">45.000+ ALUMNI</span>
                  <div className="[margin-left:8px] [display:flex]">
                    <img loading="lazy" decoding="async" src="/assets-c12/People%201.webp" width="80" height="80" alt="alumni" className="[height:20px] [width:20px] [border-radius:9999px] [border:2px_solid_#fff] [object-fit:cover] [margin-left:-8px] max-[500px]:[height:clamp(14px,4vw,20px)] max-[500px]:[width:clamp(14px,4vw,20px)]" />
                    <img loading="lazy" decoding="async" src="/assets-c12/People%202.webp" width="79" height="80" alt="alumni" className="[height:20px] [width:20px] [border-radius:9999px] [border:2px_solid_#fff] [object-fit:cover] [margin-left:-8px] max-[500px]:[height:clamp(14px,4vw,20px)] max-[500px]:[width:clamp(14px,4vw,20px)]" />
                    <img loading="lazy" decoding="async" src="/assets-c12/People%203.webp" width="80" height="79" alt="alumni" className="[height:20px] [width:20px] [border-radius:9999px] [border:2px_solid_#fff] [object-fit:cover] [margin-left:-8px] max-[500px]:[height:clamp(14px,4vw,20px)] max-[500px]:[width:clamp(14px,4vw,20px)]" />
                  </div>
                </div>
      
                <h1 id="hero-headline" className="[margin:0] [font-size:clamp(30px,4vw,44px)] [line-height:1.15] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515] max-[500px]:[font-size:clamp(24px,7vw,30px)]">
                  Serius Soal Beasiswa &amp; CPNS?<br />Capai <span className="[background-image:linear-gradient(rgb(245,_183,_0),_rgb(245,_183,_0))] [background-repeat:no-repeat] [background-size:100%_12px] [background-position:0px_100%] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] [padding:0px_2px]">TOEFL 500+ dalam 15 Hari Saja</span></h1>
      
                <p id="hero-subheadline" className="[margin:0] [font-size:16px] [line-height:1.6] [color:#3d3d3d] max-[500px]:[font-size:clamp(12px,3.4vw,14px)]"><b>Persiapkan dari</b><strong className="[color:rgb(21,_21,_21)]">&nbsp;sekarang</strong>&nbsp;dengan strategi <strong className="[color:rgb(21,_21,_21)]">belajar 1 jam sehari</strong> yang telah membantu <strong className="[color:rgb(21,_21,_21)]">45.000+ alumni</strong> meraih <b>beasiswa impian</b> mereka.
                </p>
      
                <div id="hero-trust-badges" className="[display:flex] [flex-wrap:wrap] [gap:8px] max-[500px]:[display:none]">
                  
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:6px_12px] [font-size:12px] [font-weight:600] [background:#F3F4F6] [color:#374151] [border:1px_solid_#e5e7eb]">✓ Lembaga Resmi ITP &amp; IIEF</span>
                  
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:6px_12px] [font-size:12px] [font-weight:600] [background:#F3F4F6] [color:#374151] [border:1px_solid_#e5e7eb]">✓ 13+ Tahun Pengalaman</span>
                  
                </div>
      
                <div id="hero-cta-row" className="[display:flex] [flex-direction:column] [gap:12px]">
                  <div id="hero-cta-buttons" className="[display:flex] [flex-wrap:wrap] [gap:12px] max-[500px]:[flex-direction:column]">
                    <a href="#pricing" data-analytics-location="hero_pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none] max-[500px]:[font-size:clamp(12px,3.6vw,16px)] max-[500px]:[padding:clamp(10px,3vw,14px)_clamp(16px,5vw,28px)] max-[500px]:[width:100%] max-[500px]:[box-sizing:border-box]">Mulai Persiapan TOEFL →</a>
                    <a href="#testimonials" data-analytics-location="hero_testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none] max-[500px]:[font-size:clamp(12px,3.6vw,16px)] max-[500px]:[padding:clamp(10px,3vw,14px)_clamp(16px,5vw,28px)] max-[500px]:[width:100%] max-[500px]:[box-sizing:border-box]">Lihat Bukti Alumni →</a>
                  </div>
                  
                  <div id="hero-rating-line" className="[display:flex] [align-items:center] [justify-content:flex-start] [flex-wrap:wrap] [gap:8px_12px]">
                    <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">★★★★★ <span className="[margin-left:4px] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">4.9/5 Google Review</span></span>
                    <span className="[font-size:12px] [color:#6b7280] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">•</span>
                    <span className="[font-size:12px] [font-weight:600] [color:#6b7280] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">45.000+ Alumni Sukses</span>
                    <span className="[font-size:12px] [color:#6b7280] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">•</span>
                    <span className="[font-size:12px] [font-weight:600] [color:#6b7280] max-[500px]:[font-size:clamp(9px,2.6vw,12px)]">🛡 Garansi 100%</span>
                  </div>
                </div>
              </div>
      
              <div className="[display:flex] [justify-content:center] [align-items:flex-end] [grid-column:2] max-[899px]:[grid-column:1] max-[899px]:[margin-top:-4px]">
                <div className="[width:100%] [max-width:560px] [position:relative] [align-self:stretch] [display:flex] [align-items:flex-end] [justify-content:center] max-[899px]:[max-width:250px] max-[899px]:[align-self:initial]">
                  <img loading="eager" decoding="async" fetchPriority="high" src="/assets-c12/hero-consultant.webp" width="660" height="805" alt="Konsultan Full Bright Indonesia siap membantu persiapan TOEFL kamu" className="[display:block] [width:100%] [height:auto] [max-height:min(72vh,660px)] [object-fit:contain] [object-position:bottom_center] [filter:drop-shadow(0_18px_40px_rgba(0,0,0,0.16))] [mask-image:linear-gradient(to_bottom,#000_0%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)] max-[899px]:[max-height:min(28vh,215px)] max-[899px]:[filter:drop-shadow(0_12px_28px_rgba(0,0,0,0.14))]" />
                  <div className="hidden min-[900px]:contents">
                    <div className="[position:absolute] [bottom:18px] [left:0] [display:flex] [max-width:216px] [align-items:center] [gap:10px] [border-radius:16px] [background:#fff] [padding:11px_14px] [box-shadow:0_8px_32px_rgba(0,0,0,0.14)]">
                      <span className="[font-size:22px]">🎓</span>
                      <p className="[margin:0] [font-size:12px] [line-height:1.35] [font-weight:900] [color:#151515] [font-family:Nunito,sans-serif]">Alumni kami tersebar di seluruh dunia</p>
                    </div>
                    <div className="[position:absolute] [top:12px] [right:0] [display:flex] [align-items:center] [gap:6px] [border-radius:16px] [background:#fff] [padding:8px_12px] [box-shadow:0_8px_32px_rgba(0,0,0,0.12)]">
                      <span className="[color:#F59E0B]">★★★★★</span>
                      <span className="[margin-left:4px] [font-size:12px] [font-weight:900] [color:#151515]">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
          <div id="hero-scroll-cue" className="[position:relative] [display:flex] [justify-content:center] [padding-bottom:4px] max-[899px]:[margin-top:-78px] max-[899px]:[padding-bottom:10px]">
            <div className="[display:flex] [height:52px] [width:52px] [align-items:center] [justify-content:center] [border-radius:9999px] [background:#F3F4F6] [border:1px_solid_#e5e7eb] [color:#374151] [animation:heroBounce_2s_ease-in-out_infinite]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v14M5 12l7 7 7-7"></path></svg>
            </div>
          </div>
      
          <div className="[line-height:0] [margin-bottom:-1px]">
            <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="[display:block] [width:100%] [height:56px]">
              <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#F3F3F3"></path>
            </svg>
          </div>
        </section>
        </>) : null}
      
        {/* Social Proof Strip: Alumni Abroad */}
        <div className="[background:#F3F3F3] [padding:32px_0] [overflow:hidden]">
          <p className="[margin:0_0_18px] [text-align:center] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Alumni Kami Sekarang Kuliah Di</p>
          <div className="[overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="[display:flex] [width:max-content] [animation:infiniteScroll_30s_linear_infinite]">
              
                <div role="img" aria-label="Universitas Indonesia" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ui.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Institut Teknologi Bandung" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-itb.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Gadjah Mada" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ugm.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="IPB University" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ipb.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Airlangga" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-unair.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Institut Teknologi Sepuluh Nopember" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-its.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Diponegoro" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-undip.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="University of Nottingham" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-nottingham.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universität Stuttgart" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-stuttgart.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Indonesia" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ui.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Institut Teknologi Bandung" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-itb.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Gadjah Mada" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ugm.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="IPB University" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-ipb.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Airlangga" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-unair.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Institut Teknologi Sepuluh Nopember" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-its.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universitas Diponegoro" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-undip.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="University of Nottingham" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-nottingham.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
                <div role="img" aria-label="Universität Stuttgart" className="[width:110px] [height:64px] [margin:0_20px] [flex-shrink:0] [background-image:url(/assets-c12/logo-stuttgart.webp)] [background-size:contain] [background-repeat:no-repeat] [background-position:center]"></div>
              
            </div>
          </div>
        </div>
      
        {/* Problem / Agitation Section */}
        <section id="agitation" className="[background:#F3F3F3] [padding:56px_24px]">
          <div className="[max-width:672px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:36px]">
              <div className="[display:inline-block] [border-radius:9999px] [padding:10px_24px] [font-size:13px] [font-weight:800] [letter-spacing:0.02em] [text-transform:uppercase] [background:#fff] [color:#D70808] [box-shadow:0_4px_16px_rgba(0,0,0,0.06)] [margin-bottom:20px]">Kamu Sudah Mencoba</div>
              <h2 className="[margin:0_0_16px] [font-size:clamp(24px,6.4vw,36px)] [line-height:1.2] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Sudah Banyak Belajar,<br /><span className="[color:#D70808]">Tapi Kenapa Skor Masih Stuck?</span></h2>
              <p className="[margin:0] [font-size:16px] [max-width:520px] [margin-left:auto] [margin-right:auto] [line-height:1.6] [color:#6b6b6b]">Bukan karena kamu kurang berusaha. Hanya saja, <b className="[color:#151515]">belum ada arah yang jelas mau mulai dari mana.</b></p>
            </div>
      
            <div className="[border-radius:20px] [background:#fff] [box-shadow:0_4px_24px_rgba(0,0,0,0.07)] [overflow:hidden] [margin-bottom:32px]">
              <div className="max-[559px]:[grid-template-columns:1fr] max-[559px]:[display:none] [display:grid] [grid-template-columns:1.05fr_1fr] [border-bottom:1px_solid_#ececec]">
                <div className="[padding:14px_18px]">
                  <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.06em] [color:#151515] [font-family:Nunito,sans-serif]">Yang sudah kamu lakukan</p>
                </div>
                <div className="[padding:14px_18px] [background:#FFF7F7] [border-left:1px_solid_#ececec]">
                  <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.06em] [color:#D70808] [font-family:Nunito,sans-serif]">Yang kamu alami</p>
                </div>
              </div>
                <div className="max-[559px]:[grid-template-columns:1fr] [display:grid] [grid-template-columns:1.05fr_1fr] [border-bottom:1px_solid_#f1f1f1]">
                  <div className="max-[559px]:[padding:14px_16px_6px] [display:flex] [align-items:flex-start] [gap:12px] [padding:16px_18px]">
                    <span className="[flex-shrink:0] [margin-top:2px] [font-size:11px] [font-weight:900] [color:#c9c9c9] [font-family:Nunito,sans-serif]">01</span>
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#151515]">Sudah download banyak PDF materi</p>
                  </div>
                  <div className="max-[559px]:[padding:0_16px_14px_41px] max-[559px]:[background:transparent] max-[559px]:[border-left:0] [display:flex] [align-items:center] [padding:16px_18px] [background:#FFF7F7] [border-left:1px_solid_#f1f1f1]">
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#D70808]">Tapi bingung mulai dari mana</p>
                  </div>
                </div>
                <div className="max-[559px]:[grid-template-columns:1fr] [display:grid] [grid-template-columns:1.05fr_1fr] [border-bottom:1px_solid_#f1f1f1]">
                  <div className="max-[559px]:[padding:14px_16px_6px] [display:flex] [align-items:flex-start] [gap:12px] [padding:16px_18px]">
                    <span className="[flex-shrink:0] [margin-top:2px] [font-size:11px] [font-weight:900] [color:#c9c9c9] [font-family:Nunito,sans-serif]">02</span>
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#151515]">Sudah nonton banyak video TOEFL</p>
                  </div>
                  <div className="max-[559px]:[padding:0_16px_14px_41px] max-[559px]:[background:transparent] max-[559px]:[border-left:0] [display:flex] [align-items:center] [padding:16px_18px] [background:#FFF7F7] [border-left:1px_solid_#f1f1f1]">
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#D70808]">Tapi besoknya lupa lagi materinya</p>
                  </div>
                </div>
                <div className="max-[559px]:[grid-template-columns:1fr] [display:grid] [grid-template-columns:1.05fr_1fr] [border-bottom:1px_solid_#f1f1f1]">
                  <div className="max-[559px]:[padding:14px_16px_6px] [display:flex] [align-items:flex-start] [gap:12px] [padding:16px_18px]">
                    <span className="[flex-shrink:0] [margin-top:2px] [font-size:11px] [font-weight:900] [color:#c9c9c9] [font-family:Nunito,sans-serif]">03</span>
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#151515]">Sudah mengerjakan banyak latihan soal</p>
                  </div>
                  <div className="max-[559px]:[padding:0_16px_14px_41px] max-[559px]:[background:transparent] max-[559px]:[border-left:0] [display:flex] [align-items:center] [padding:16px_18px] [background:#FFF7F7] [border-left:1px_solid_#f1f1f1]">
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#D70808]">Tapi kesalahan yang sama terus terulang</p>
                  </div>
                </div>
                <div className="max-[559px]:[grid-template-columns:1fr] [display:grid] [grid-template-columns:1.05fr_1fr] [border-bottom:1px_solid_#f1f1f1]">
                  <div className="max-[559px]:[padding:14px_16px_6px] [display:flex] [align-items:flex-start] [gap:12px] [padding:16px_18px]">
                    <span className="[flex-shrink:0] [margin-top:2px] [font-size:11px] [font-weight:900] [color:#c9c9c9] [font-family:Nunito,sans-serif]">04</span>
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#151515]">Sudah ikut kursus bahasa Inggris</p>
                  </div>
                  <div className="max-[559px]:[padding:0_16px_14px_41px] max-[559px]:[background:transparent] max-[559px]:[border-left:0] [display:flex] [align-items:center] [padding:16px_18px] [background:#FFF7F7] [border-left:1px_solid_#f1f1f1]">
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#D70808]">Tapi materinya terlalu umum, bukan pola TOEFL</p>
                  </div>
                </div>
                <div className="max-[559px]:[grid-template-columns:1fr] [display:grid] [grid-template-columns:1.05fr_1fr]">
                  <div className="max-[559px]:[padding:14px_16px_6px] [display:flex] [align-items:flex-start] [gap:12px] [padding:16px_18px]">
                    <span className="[flex-shrink:0] [margin-top:2px] [font-size:11px] [font-weight:900] [color:#c9c9c9] [font-family:Nunito,sans-serif]">05</span>
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#151515]">Sudah berusaha ikut semua jadwal kelas</p>
                  </div>
                  <div className="max-[559px]:[padding:0_16px_14px_41px] max-[559px]:[background:transparent] max-[559px]:[border-left:0] [display:flex] [align-items:center] [padding:16px_18px] [background:#FFF7F7] [border-left:1px_solid_#f1f1f1]">
                    <p className="[margin:0] [font-size:15px] [line-height:1.45] [font-weight:700] [color:#D70808]">Tapi sekali jadwal bentrok, materi jadi tertinggal</p>
                  </div>
                </div>
            </div>
      
            <div className="[border-radius:20px] [background:#fff] [box-shadow:0_4px_24px_rgba(0,0,0,0.07)] [padding:28px_24px] [margin-bottom:32px]">
              <p className="[margin:0_0_24px] [text-align:center] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#D70808]">Kalau kamu belajar sendiri</p>
              <div className="[display:flex] [align-items:flex-end] [justify-content:center] [gap:36px] [margin-bottom:20px]">
                <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:10px]">
                  <p className="[margin:0] [font-size:11px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#151515]">Effort kamu</p>
                  <div className="[display:flex] [align-items:flex-end] [justify-content:center] [width:92px] [height:132px] [border-radius:10px] [background:#151515] [padding-bottom:12px]">
                    <span className="[font-size:11px] [font-weight:800] [line-height:1.3] [text-align:center] [color:#fff]">Waktu &amp;<br />tenaga</span>
                  </div>
                </div>
                <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:10px]">
                  <p className="[margin:0] [font-size:11px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#D70808]">Kenaikan skor</p>
                  <div className="[width:92px] [height:26px] [border-radius:10px] [background:#D70808]"></div>
                </div>
              </div>
              <div className="[height:1px] [background:#ececec] [margin-bottom:18px]"></div>
              <p className="[margin:0] [text-align:center] [font-size:clamp(17px,2.4vw,20px)] [line-height:1.4] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Effort yang kamu keluarkan <span className="[color:#D70808]">jauh lebih besar daripada kenaikan skormu.</span></p>
            </div>
      
            <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:8px]">
              <p className="[margin:0] [text-align:center] [font-size:16px] [line-height:1.5] [font-weight:600] [color:#9a9a9a]">Kamu tidak membutuhkan lebih banyak materi.</p>
              <p className="[margin:0] [text-align:center] [font-size:19px] [line-height:1.45] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Kamu butuh cara belajar yang <span className="[color:#D70808]">terstruktur dan fokus ke pola soal TOEFL.</span></p>
              <div className="[display:flex] [height:36px] [width:36px] [align-items:center] [justify-content:center] [border-radius:9999px] [background:#F3F4F6] [color:#374151] [font-size:18px] [margin-top:10px]">↓</div>
            </div>
          </div>
          </section></div>
        
      
        {/* Value Section: comparison + pillars */}
        <div className="[line-height:0] [margin-top:-1px] [background:#F3F3F3]">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="[display:block] [width:100%] [height:56px]">
            <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,0 L0,0 Z" fill="#ffffff"></path>
          </svg>
        </div>
      
        <section id="value" className="[background:#fff] [padding:80px_24px]">
          <div className="[max-width:1152px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:56px]">
              <div className="[display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [font-weight:700] [text-transform:uppercase] [letter-spacing:0.08em] [padding:6px_16px] [border-radius:9999px] [margin-bottom:20px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">💡 Metode Eksklusif Full Bright</div>
              <h2 className="[margin:0_0_20px] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Ini <span className="[color:rgb(215,_8,_8)]">Strategi Belajar TOEFL</span> Yang Tepat Untuk Kamu</h2>
              <p className="[margin:0] [font-size:16px] [max-width:576px] [margin:0_auto] [line-height:1.6] [color:#3d3d3d]">Ini cara Full Bright membantu <strong className="[color:rgb(21,_21,_21)]">45.000+ orang</strong> mengubah submission yang tadinya ditolak jadi diterima di kampus &amp; perusahaan impian mereka.</p>
            </div>
      
            <div className="[max-width:760px] [margin:0_auto_56px] [border-radius:20px] [border:1px_solid_#ececec] [background:#fff] [box-shadow:0_4px_24px_rgba(0,0,0,0.05)]">
              <div style={css(cmpHeaderStyle(bannerH))}>
                <div className="[padding:16px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#6b7280]">Kriteria</div>
                <div className="[padding:16px_8px] [text-align:center] [font-size:13px] [line-height:1.25] [font-weight:800] [font-family:Nunito,sans-serif] [color:#6b7280]">Belajar Otodidak</div>
                <div className="[padding:16px_8px] [text-align:center] [font-size:13px] [line-height:1.25] [font-weight:800] [font-family:Nunito,sans-serif] [color:#6b7280]">Kursus Lain</div>
                <div className="[padding:16px_8px] [text-align:center] [font-size:13px] [line-height:1.25] [font-weight:900] [font-family:Nunito,sans-serif] [color:#fff] [background:#D70808]">Full Bright</div>
              </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Biaya terjangkau</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#9ca3af] [color:#fff]">✓</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Jadwal bisa kamu atur sendiri</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#9ca3af] [color:#fff]">✓</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Materi tersusun urut, tidak bingung</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#9ca3af] [color:#fff]">✓</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Materi khusus pola soal TOEFL</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Ada yang bisa ditanya kalau bingung</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#9ca3af] [color:#fff]">✓</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Materi bisa diulang kapan pun</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#9ca3af] [color:#fff]">✓</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
                <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [border-bottom:1px_solid_#f4f4f4] [align-items:center]">
                  <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">Skor naik signifikan dalam 15 hari</div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#efefef] [color:#b4b4b4]">✕</span></div>
                  <div className="[padding:16px_8px] [display:flex] [justify-content:center] [align-self:stretch] [align-items:center] [background:#FFF7F7]"><span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [border-radius:9999px] [font-size:13px] [font-weight:900] [flex-shrink:0] [background:#D70808] [color:#fff]">✓</span></div>
                </div>
              
            </div>
      
            <div className="[max-width:560px] [margin:0_auto_18px]">
              <div className="[border-radius:16px] [overflow:hidden] [border:1px_solid_#ececec] [background:#fff] [box-shadow:0_3px_16px_rgba(0,0,0,0.05)] [line-height:0]">
                <img loading="lazy" decoding="async" src="/assets-c12/instructor-class.webp" width="1000" height="607" alt="Instruktur Full Bright menjelaskan pola soal TOEFL di kelas" className="[display:block] [width:100%] [height:auto]" />
              </div>
            </div>
            <p className="[margin:0_auto_28px] [max-width:820px] [text-align:center] [font-size:19px] [line-height:1.6] [font-weight:800] [color:#151515]">3 Metode Belajar yang Membuat Alumni Full Bright Naik Skor dalam 15 Hari:</p>
      
            <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] [gap:16px] [margin-bottom:40px]">
              
                <div className="[border-radius:16px] [padding:28px] [display:flex] [flex-direction:column] [gap:16px] [background:#fff] [border:1px_solid_#f3f4f6] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [border-left:4px_solid_#D70808]">
                  <div className="[width:48px] [height:48px] [border-radius:16px] [display:flex] [align-items:center] [justify-content:center] [font-size:22px] [flex-shrink:0] [background:#FFF0F0]">🎯</div>
                  <h3 className="[margin:0] [font-weight:900] [font-size:16px] [line-height:1.3] [font-family:Nunito,sans-serif] [color:#151515]">TOEFL Pattern Recognition Method™</h3>
                  <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">Belajar pola soal yang paling sering muncul agar target skor lebih cepat tercapai, tanpa menghabiskan waktu mempelajari semua materi.</p>
                </div>
              
                <div className="[border-radius:16px] [padding:28px] [display:flex] [flex-direction:column] [gap:16px] [background:#fff] [border:1px_solid_#f3f4f6] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [border-left:4px_solid_#151515]">
                  <div className="[width:48px] [height:48px] [border-radius:16px] [display:flex] [align-items:center] [justify-content:center] [font-size:22px] [flex-shrink:0] [background:#F3F3F3]">⚡</div>
                  <h3 className="[margin:0] [font-weight:900] [font-size:16px] [line-height:1.3] [font-family:Nunito,sans-serif] [color:#151515]">Shortcut Structure Framework™</h3>
                  <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">Roadmap belajar disesuaikan dengan target skor, sehingga kamu fokus pada materi yang paling berdampak untuk mencapai skor.</p>
                </div>
              
                <div className="[border-radius:16px] [padding:28px] [display:flex] [flex-direction:column] [gap:16px] [background:#fff] [border:1px_solid_#f3f4f6] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [border-left:4px_solid_#D70808]">
                  <div className="[width:48px] [height:48px] [border-radius:16px] [display:flex] [align-items:center] [justify-content:center] [font-size:22px] [flex-shrink:0] [background:#FFF0F0]">📈</div>
                  <h3 className="[margin:0] [font-weight:900] [font-size:16px] [line-height:1.3] [font-family:Nunito,sans-serif] [color:#151515]">Score-Focused Learning System™</h3>
                  <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">Setiap sesi belajar difokuskan pada target skor yang dibutuhkan, sehingga progresmu selalu mengarah ke tujuan yang jelas.</p>
                </div>
              
            </div>
      
            <div className="[text-align:center]">
              <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [justify-content:center]">
                <a href="#pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none]">Mulai Persiapan TOEFL →</a>
                <a href="#testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]">Lihat Bukti Alumni →</a>
              </div>
              <div className="[margin-top:12px] [display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:8px_12px]">
                <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">★★★★★<span className="[margin-left:4px]">4.9/5 Google Review</span></span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">45.000+ Alumni Sukses</span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">🛡 Garansi 100%</span>
              </div>
            </div>
          </div>
        </section>
      
        {/* Social Proof: WA screenshots */}
        <section id="proof" className="[background:#fff] [padding:72px_24px]">
          <div className="[max-width:672px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:36px]">
              <div className="[display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [font-weight:700] [text-transform:uppercase] [letter-spacing:0.08em] [padding:6px_16px] [border-radius:9999px] [margin-bottom:20px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">📱 Bukti Nyata dari Alumni</div>
              <h2 className="[margin:0_0_14px] [font-size:clamp(24px,3vw,36px)] [line-height:1.25] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Metode Kami Berhasil Membuat<br /><span className="[color:#D70808]">Ribuan Alumni Kami Capai TOEFL 500+&nbsp;</span></h2>
              
              <p className="[margin:0] [font-size:14px] [color:#9ca3af]">Klik foto untuk memperbesar</p>
            </div>
      
            <div className="[margin:0_auto_32px] [max-width:420px] [display:flex] [flex-direction:column]">
              
                <div className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]" onClick={() => setLightboxIdx(0)}>
                  <p className="[margin:0] [font-size:18px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">547</span></p>
                  <div className="[border-radius:14px] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)] [aspect-ratio:1/1] [width:100%] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl1-thumb.webp" alt="" width="260" height="343" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                </div>
              
                <div className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]" onClick={() => setLightboxIdx(1)}>
                  <p className="[margin:0] [font-size:18px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">543</span></p>
                  <div className="[border-radius:14px] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)] [aspect-ratio:1/1] [width:100%] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl2-thumb.webp" alt="" width="260" height="296" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                </div>
              
                <div className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]" onClick={() => setLightboxIdx(2)}>
                  <p className="[margin:0] [font-size:18px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">563</span></p>
                  <div className="[border-radius:14px] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)] [aspect-ratio:1/1] [width:100%] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl3-thumb.webp" alt="" width="260" height="273" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                </div>
              
            </div>
      
            <div className="[text-align:center]">
              <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [justify-content:center]">
                <a href="#pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none]">Mulai Persiapan TOEFL →</a>
                <a href="#testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]">Lihat Lebih Banyak Bukti →</a>
              </div>
              <div className="[margin-top:12px] [display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:8px_12px]">
                <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">★★★★★<span className="[margin-left:4px]">4.9/5 Google Review</span></span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">45.000+ Alumni Sukses</span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">🛡 Garansi 100%</span>
              </div>
            </div>
          </div>
        </section>
      
        {/* LMS Preview */}
        <section id="lms" className="[background:#fff] [padding:80px_24px]">
          <div className="[max-width:1152px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:48px]">
              <div className="[display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [font-weight:700] [text-transform:uppercase] [letter-spacing:0.08em] [padding:6px_16px] [border-radius:9999px] [margin-bottom:20px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">💻 Tampilan LMS</div>
              <h2 className="[margin:0_0_16px] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Nggak Punya Banyak Waktu?<br /><span className="[color:#D70808]">Materi Sudah Urut, Tinggal Ikuti</span></h2>
              <p className="[margin:0] [font-size:16px] [max-width:560px] [margin-left:auto] [margin-right:auto] [line-height:1.6] [color:#3d3d3d]">Semua yang kamu butuhkan untuk mengetahui kelemahan, belajar, berlatih, dan menghadapi ujian.</p>
            </div>
      
            <div className="[max-width:840px] [margin:0_auto_44px]">
              <div className="[position:relative] [max-width:1040px] [margin:0_auto] [overflow:hidden] [border-radius:18px] [background:#151515] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [line-height:0]">
                <video
                  ref={lmsVideoRef}
                  controls
                  preload="none"
                  playsInline
                  {...LAZY_POSTER}
                  poster="/assets/lms-showcase-poster.webp"
                  onPlay={handleLmsVideoPlay}
                  className="[display:block] [width:100%] [aspect-ratio:16/9] [object-fit:cover] [background:#151515]"
                >
                  Browser kamu tidak mendukung pemutaran video.
                </video>
                {showLmsOverlay ? (
                  <button
                    type="button"
                    onClick={playLmsVideo}
                    aria-label="Putar showcase LMS"
                    className="[position:absolute] [inset:0] [display:flex] [align-items:center] [justify-content:center] [border:0] [background:rgba(21,21,21,0.22)] [cursor:pointer] [transition:background_0.2s_ease] hover:[background:rgba(21,21,21,0.32)]"
                  >
                    <div className="[position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:14px] [background:rgba(21,21,21,0.35)]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:76px] [height:76px] [border-radius:9999px] [background:#D70808] [box-shadow:0_8px_28px_rgba(215,8,8,0.5)]">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13l11-6.5z"></path></svg>
                      </span>
                      <span className="[font-size:13px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#fff] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">Putar showcase LMS</span>
                    </div>
                  </button>
                ) : null}
              </div>
              
            </div>
      
            <div className="[display:flex] [flex-direction:column] [gap:20px] [max-width:1040px] [margin:0_auto_40px]">
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] max-[899px]:[order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/diagnostic.webp" width="960" height="600" alt="Tidak Lagi Bingung Harus Mulai dari Mana" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] max-[899px]:[order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">01</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Diagnostic Test</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 120.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Tidak Lagi Bingung Harus Mulai dari Mana</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Kerjakan Diagnostic Test lebih dulu untuk mengetahui baseline skor TOEFL ITP kamu. Hasilnya menentukan materi mana yang perlu diprioritaskan.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Baseline skor per section
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Materi prioritas otomatis
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] [order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/materi.webp" width="960" height="600" alt="Materi Sudah Urut, Kamu Tinggal Mengikuti" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">02</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Materi &amp; Roadmap</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 300.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Materi Sudah Urut, Kamu Tinggal Mengikuti</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Materi Structure, Listening, dan Reading tersusun rapi dari Hari 1 sampai Hari 15, jadi kamu tidak perlu menyusun sendiri urutan belajarnya.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>60 video full skills
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Urut Hari 1–15
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] max-[899px]:[order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/video-ai.webp" width="960" height="602" alt="Kalau Bingung, Ada yang Langsung Menjawab" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] max-[899px]:[order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">03</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">AI Assistant</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 100.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Kalau Bingung, Ada yang Langsung Menjawab</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Setiap video dilengkapi rangkuman materi dan AI Assistant yang siap menjelaskan ulang topik yang belum kamu pahami, tanpa perlu menunggu jadwal.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Rangkuman tiap video
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Tanya AI 24/7
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] [order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/latihan.webp" width="960" height="600" alt="Tahu Persis Bagian yang Belum Kamu Kuasai" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">04</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Latihan Soal</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 150.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Tahu Persis Bagian yang Belum Kamu Kuasai</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Setiap topik punya latihan soal dengan navigasi antar nomor dan progress tracker, jadi kamu tahu persis bagian mana yang belum dikuasai.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Latihan per topik
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Progress tracker
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] max-[899px]:[order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/drill.webp" width="960" height="600" alt="Kesalahan yang Sama Tidak Terulang Lagi" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] max-[899px]:[order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">05</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Drill Soal</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 100.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Kesalahan yang Sama Tidak Terulang Lagi</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Asah kemampuan spesifik lewat drill per skill — Listening, Structure, dan Reading — dengan paket soal yang bisa diulang sampai benar-benar paham.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>84 paket drill
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Bisa diulang tanpa batas
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] [order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/simulasi.webp" width="960" height="600" alt="Supaya Nanti Saat Tes TOEFL Asli Tidak Kaget" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">06</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Simulasi &amp; Ujian</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 150.000</span>
                      
                        <span className="[font-size:10px] [font-weight:800] [padding:4px_9px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">Khusus Dibimbing Tutor</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Supaya Nanti Saat Tes TOEFL Asli Tidak Kaget</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Mode Simulasi tanpa timer dengan feedback instan untuk latihan, dan Mode Final dengan timer serta kondisi seperti ujian TOEFL ITP sebenarnya.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Mode latihan + feedback
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Mode Final bertimer
                        </span>
                      
                    </div>
                  </div>
                </div>
              
                <div className="[border-radius:22px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [overflow:hidden] [display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] max-[899px]:[grid-template-columns:1fr]">
                  <div className="[padding:22px] [background:#FAFAFA] [display:flex] [flex-direction:column] [justify-content:center] max-[899px]:[order:2]">
                    <div className="[border-radius:12px] [overflow:hidden] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [line-height:0]">
                      <img loading="lazy" decoding="async" src="/assets-c12/beranda.webp" width="960" height="600" alt="Progresmu Terlihat, Bukan Cuma Terasa Sibuk" className="[width:100%] [height:auto] [display:block]" />
                    </div>
                  </div>
                  <div className="[padding:24px_26px] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] max-[899px]:[order:1]">
                    <div className="[display:flex] [align-items:center] [gap:10px] [flex-wrap:wrap]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:28px] [height:28px] [flex-shrink:0] [border-radius:9px] [background:#D70808] [color:#fff] [font-size:12px] [font-weight:900] [font-family:Nunito,sans-serif]">07</span>
                      <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Dashboard Progress</span>
                      <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [padding:6px_13px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [border:1.5px_solid_#ffb3b3] [white-space:nowrap]"><span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#c96b6b]">Senilai</span>Rp 85.000</span>
                      
                    </div>
                    <h3 className="[margin:0] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Progresmu Terlihat, Bukan Cuma Terasa Sibuk</h3>
                    <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">Soal dikerjakan, akurasi, waktu belajar, streak harian, hingga tren skor per section terekam otomatis, jadi progresmu selalu terlihat jelas.</p>
                    <div className="[display:flex] [flex-wrap:wrap] [gap:7px] [margin-top:2px]">
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Akurasi &amp; streak harian
                        </span>
                      
                        <span className="[display:inline-flex] [flex-shrink:0] [white-space:nowrap] [align-items:center] [gap:6px] [font-size:13px] [font-weight:700] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec] [border-radius:9999px] [padding:6px_12px]">
                          <span className="[color:#D70808] [font-weight:900]">✓</span>Tren skor per section
                        </span>
                      
                    </div>
                  </div>
                </div>
              
            </div>
      
            <div className="[max-width:560px] [margin:0_auto_44px] [border-radius:22px] [background:#fff] [border:1.5px_solid_#ffd6d6] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [padding:26px_24px] [text-align:center]">
              <p className="[margin:0_0_8px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Total nilai semua fitur di atas</p>
              <p className="[margin:0_0_12px] [font-size:clamp(30px,5vw,40px)] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#9ca3af] [text-decoration:line-through] [text-decoration-color:#D70808] [text-decoration-thickness:3px]">Rp 1.005.000</p>
              <p className="[margin:0_0_6px] [font-size:12px] [font-weight:900] [letter-spacing:0.06em] [text-transform:uppercase] [color:#D70808]">MULAI DARI HANYA</p>
              <p className="[margin:0_0_8px] [font-size:clamp(32px,5.4vw,44px)] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#D70808]">Rp 99.000</p>
              
            </div>
      
            <div className="[text-align:center]">
              <p className="[margin:0_0_20px] [max-width:520px] [margin-left:auto] [margin-right:auto] [font-size:18px] [line-height:1.5] [font-weight:700] [font-family:Nunito,sans-serif] [color:#151515]">Semua fitur ini bisa kamu akses <span className="[color:#D70808]">begitu kamu bergabung</span>.</p>
              <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [justify-content:center]">
                <a href="#pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none]">Mulai Persiapan TOEFL →</a>
                <a href="#testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]">Lihat Bukti Alumni →</a>
              </div>
              <div className="[margin-top:12px] [display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:8px_12px]">
                <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">★★★★★<span className="[margin-left:4px]">4.9/5 Google Review</span></span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">45.000+ Alumni Sukses</span>
                <span className="[font-size:12px] [color:#6b7280]">•</span><span className="[font-size:12px] [font-weight:600] [color:#6b7280]">🛡 Garansi 100%</span>
              </div>
            </div>
          </div>
        </section>
      
        {/* Why Full Bright */}
        <section className="[background:#F3F3F3] [padding:80px_24px]">
          <div className="[max-width:1152px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:48px]">
              <div className="[display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [font-weight:700] [text-transform:uppercase] [letter-spacing:0.08em] [padding:6px_16px] [border-radius:9999px] [margin-bottom:20px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">🏅 Mengapa Full Bright?</div>
              <h2 className="[margin:0] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Mengapa <span className="[color:#D70808]">45.000+</span> Orang Memilih Full Bright?</h2>
            </div>
            <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] [gap:16px] [max-width:768px] [margin:0_auto_40px]">
              
                <div className="[display:flex] [align-items:flex-start] [gap:16px] [background:#fff] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)]">
                  <div className="[width:36px] [height:36px] [border-radius:12px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:#D70808] [color:#fff]">📖</div>
                  <div className="[display:flex] [flex-direction:column] [gap:4px]">
                    <p className="[margin:0] [font-size:14px] [font-weight:700] [line-height:1.4] [color:#151515]">Lembaga Resmi ITP &amp; IIEF Jakarta</p>
                    <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">Sertifikat terjamin sah dan diakui langsung sebagai syarat submission beasiswa luar negeri.</p>
                  </div>
                </div>
              
                <div className="[display:flex] [align-items:flex-start] [gap:16px] [background:#fff] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)]">
                  <div className="[width:36px] [height:36px] [border-radius:12px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:#D70808] [color:#fff]">📈</div>
                  <div className="[display:flex] [flex-direction:column] [gap:4px]">
                    <p className="[margin:0] [font-size:14px] [font-weight:700] [line-height:1.4] [color:#151515]">Alumni Lulus Beasiswa ke Luar Negeri</p>
                    <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">UK, Jerman, Australia: bukti nyata metode belajar bertahap ini bekerja, bukan sekadar janji.</p>
                  </div>
                </div>
              
                <div className="[display:flex] [align-items:flex-start] [gap:16px] [background:#fff] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)]">
                  <div className="[width:36px] [height:36px] [border-radius:12px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:#D70808] [color:#fff]">👥</div>
                  <div className="[display:flex] [flex-direction:column] [gap:4px]">
                    <p className="[margin:0] [font-size:14px] [font-weight:700] [line-height:1.4] [color:#151515]">Pengajar Praktisi Skor 600+</p>
                    <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">Belajar dari yang sudah membuktikan sendiri skornya, bukan yang cuma tahu teori.</p>
                  </div>
                </div>
              
                <div className="[display:flex] [align-items:flex-start] [gap:16px] [background:#fff] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)]">
                  <div className="[width:36px] [height:36px] [border-radius:12px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:#D70808] [color:#fff]">⏱</div>
                  <div className="[display:flex] [flex-direction:column] [gap:4px]">
                    <p className="[margin:0] [font-size:14px] [font-weight:700] [line-height:1.4] [color:#151515]">Cukup 1 Jam Sehari, Mulai dari Sekarang</p>
                    <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">Tidak perlu menunggu waktu luang besar. 1 jam sehari dari sekarang jauh lebih ringan daripada belajar maraton menjelang deadline.</p>
                  </div>
                </div>
              
            </div>
            <div className="[max-width:440px] [margin:0_auto_36px] [border-radius:18px] [background:#fff] [border:1px_solid_#ececec] [box-shadow:0_3px_16px_rgba(0,0,0,0.05)] [overflow:hidden]">
              <div className="[line-height:0]">
                <img loading="lazy" decoding="async" src="/assets-c12/foto-bareng.webp" width="1000" height="705" alt="Tim instruktur Full Bright Indonesia" className="[display:block] [width:100%] [height:auto]" />
              </div>
              <p className="[margin:0] [padding:14px_18px] [text-align:center] [font-size:13px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Tim instruktur Full Bright, pengalaman 10+ tahun mengajar TOEFL ITP</p>
            </div>
      
            <div className="[text-align:center]">
              <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [justify-content:center]">
                <a href="#pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none]">Mulai Persiapan TOEFL →</a>
                <a href="#testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]">Lihat Bukti Alumni →</a>
              </div>
            </div>
          </div>
        </section>
      
        {/* Social Proof */}
        <section id="testimonials">
          <div className="[background:#151515] [padding:40px_24px]">
            <div className="[max-width:1152px] [margin:0_auto] [display:grid] [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] [gap:32px] [text-align:center] [color:#fff]">
              
                <div>
                  <p className="[margin:0] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em] [font-family:Nunito,sans-serif]">45.000+</p>
                  <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">Alumni Sukses</p>
                </div>
              
                <div>
                  <p className="[margin:0] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em] [font-family:Nunito,sans-serif]">4.9/5</p>
                  <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">Rating Rata-rata</p>
                </div>
              
                <div>
                  <p className="[margin:0] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em] [font-family:Nunito,sans-serif]">13+</p>
                  <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">Tahun Pengalaman</p>
                </div>
              
                <div>
                  <p className="[margin:0] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em] [font-family:Nunito,sans-serif]">95%</p>
                  <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">Skor Naik Signifikan</p>
                </div>
              
            </div>
          </div>
          <div className="[background:#fff] [padding:80px_24px]">
            <div className="[max-width:1152px] [margin:0_auto]">
              <div className="[margin-bottom:48px] [text-align:center]">
                <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">💬 Testimoni Alumni Kami</div>
                <h2 className="[margin:0_0_16px] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Lihat Bagaimana Strategi Kami Membantu Alumni<br /><span className="[color:rgb(215,_8,_8)]">Meraih Target Skor Untuk Beasiswa &amp; CPNS</span></h2>
                <p className="[margin:0] [font-size:14px] [color:#9ca3af]">Klik foto untuk memperbesar</p>
              </div>
      
      
              <div className="[margin-bottom:56px] [overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                <div className="[display:flex] [width:max-content] [animation:infiniteScroll_35s_linear_infinite]">
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">547</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl1-thumb.webp" alt="" width="260" height="343" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">543</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl2-thumb.webp" alt="" width="260" height="296" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">563</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl3-thumb.webp" alt="" width="260" height="273" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">560</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl4-thumb.webp" alt="" width="260" height="273" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">507</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl5-thumb.webp" alt="" width="260" height="425" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">513</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl6-thumb.webp" alt="" width="260" height="386" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">537</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl7-thumb.webp" alt="" width="260" height="303" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">560</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl9-thumb.webp" alt="" width="260" height="578" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">547</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl1-thumb.webp" alt="" width="260" height="343" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">543</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl2-thumb.webp" alt="" width="260" height="296" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">563</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl3-thumb.webp" alt="" width="260" height="273" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">560</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl4-thumb.webp" alt="" width="260" height="273" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">507</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl5-thumb.webp" alt="" width="260" height="425" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">513</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl6-thumb.webp" alt="" width="260" height="386" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">537</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl7-thumb.webp" alt="" width="260" height="303" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                    <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                      <p className="[margin:0] [font-size:16px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Skor <span className="[color:#D70808]">560</span></p>
                      <div className="[width:130px] [border-radius:12px] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)] [aspect-ratio:9/16] [overflow:hidden] [contain:layout_paint]"><img loading="lazy" decoding="async" src="/assets-c12/toefl9-thumb.webp" alt="" width="260" height="578" className="[width:100%] [height:100%] [object-fit:cover]" /></div>
                    </div>
                  
                </div>
              </div>
      
              <div className="[margin:0_auto_56px] [width:100%] [max-width:896px]">
                <p className="[margin:0_0_24px] [text-align:center] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Testimoni Alumni yang Sukses Masuk Universitas Luar Negeri</p>
                <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] [gap:16px]">
                  
                    <div className="[display:flex] [min-width:0] [flex-direction:column] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [padding:20px] [background:#F9F9F9] [box-shadow:0_2px_16px_rgba(0,0,0,0.05)]">
                      <span className="[align-self:flex-start] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [background:#FFF0F0] [color:#D70808]">University of Nottingham, UK</span>
                      <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#D70808]">Sangat Terjangkau Untuk Mahasiswa</p>
                      <p className="[margin:0] [flex:1] [font-size:14px] [line-height:1.6] [color:#3d3d3d]">"Full Bright ini tempat yang paling "pas" buat teman-teman Mahasiswa menaklukkan Tes TOEFL &amp; IELTS"</p>
                      <div className="[display:flex] [align-items:center] [gap:12px] [border-top:1px_solid_#f3f4f6] [padding-top:8px]">
                        <div role="img" aria-label="Andi Manggala Putra" className="[height:40px] [width:40px] [flex-shrink:0] [border-radius:9999px] [background-image:url(/assets-c12/People%201.webp)] [background-size:cover] [background-position:center]"></div>
                        <div className="[min-width:0] [flex:1]">
                          <p className="[margin:0] [font-size:14px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Andi Manggala Putra</p>
                          <p className="[margin:0] [font-size:12px] [color:#6b7280] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Accounting and Finance</p>
                        </div>
                        <span className="[color:#F59E0B] [font-size:12px] [flex-shrink:0]">★★★★★</span>
                      </div>
                    </div>
                  
                    <div className="[display:flex] [min-width:0] [flex-direction:column] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [padding:20px] [background:#F9F9F9] [box-shadow:0_2px_16px_rgba(0,0,0,0.05)]">
                      <span className="[align-self:flex-start] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [background:#FFF0F0] [color:#D70808]">Stuttgart University, Germany</span>
                      <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#D70808]">A Good Place to Learn TOEFL &amp; IELTS</p>
                      <p className="[margin:0] [flex:1] [font-size:14px] [line-height:1.6] [color:#3d3d3d]">"Fullbright growing together with their students. This place is good place to learn TOEFL &amp; IELTS. Thank you for the teacher and friendly staff. Now I can see the world"</p>
                      <div className="[display:flex] [align-items:center] [gap:12px] [border-top:1px_solid_#f3f4f6] [padding-top:8px]">
                        <div role="img" aria-label="Hajrah" className="[height:40px] [width:40px] [flex-shrink:0] [border-radius:9999px] [background-image:url(/assets-c12/People%202.webp)] [background-size:cover] [background-position:center]"></div>
                        <div className="[min-width:0] [flex:1]">
                          <p className="[margin:0] [font-size:14px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Hajrah</p>
                          <p className="[margin:0] [font-size:12px] [color:#6b7280] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Student Water Resources Engineering and Management</p>
                        </div>
                        <span className="[color:#F59E0B] [font-size:12px] [flex-shrink:0]">★★★★★</span>
                      </div>
                    </div>
                  
                </div>
              </div>
      
              <div className="[margin-top:40px] [overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="[display:flex] [width:max-content] [animation:infiniteScroll_40s_linear_infinite]">
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-rani.webp" width="72" height="72" alt="Kak Rani" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Rani</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">547</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-ayu.webp" width="72" height="72" alt="Kak Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">543</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-widya.webp" width="72" height="72" alt="Mbak Widya" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Mbak Widya</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">563</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-yohanes.webp" width="72" height="72" alt="Pak Yohanes" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Pak Yohanes</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">560</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-uly.webp" width="72" height="72" alt="Kak Uly Sinaga" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Uly Sinaga</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">507</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-nadia.webp" width="72" height="72" alt="Kak Nadia Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Nadia Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">513</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-rani.webp" width="72" height="72" alt="Kak Rani" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Rani</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">547</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-ayu.webp" width="72" height="72" alt="Kak Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">543</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-widya.webp" width="72" height="72" alt="Mbak Widya" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Mbak Widya</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">563</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-yohanes.webp" width="72" height="72" alt="Pak Yohanes" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Pak Yohanes</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">560</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-uly.webp" width="72" height="72" alt="Kak Uly Sinaga" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Uly Sinaga</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">507</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-nadia.webp" width="72" height="72" alt="Kak Nadia Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Nadia Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">513</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-rani.webp" width="72" height="72" alt="Kak Rani" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Rani</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">547</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-ayu.webp" width="72" height="72" alt="Kak Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">543</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-widya.webp" width="72" height="72" alt="Mbak Widya" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Mbak Widya</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">563</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-yohanes.webp" width="72" height="72" alt="Pak Yohanes" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Pak Yohanes</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">560</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-uly.webp" width="72" height="72" alt="Kak Uly Sinaga" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Uly Sinaga</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">507</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-nadia.webp" width="72" height="72" alt="Kak Nadia Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Nadia Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">513</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-rani.webp" width="72" height="72" alt="Kak Rani" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Rani</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">547</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-ayu.webp" width="72" height="72" alt="Kak Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">543</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-widya.webp" width="72" height="72" alt="Mbak Widya" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Mbak Widya</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">563</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-yohanes.webp" width="72" height="72" alt="Pak Yohanes" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Pak Yohanes</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">560</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-uly.webp" width="72" height="72" alt="Kak Uly Sinaga" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Uly Sinaga</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">507</p>
                    </div>
                  
                    <div className="[margin:0_12px] [display:flex] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [border:1px_solid_#f3f4f6] [background:#fff] [padding:16px_20px] [width:220px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)]">
                      <img loading="lazy" decoding="async" src="/assets-c12/avatar-nadia.webp" width="72" height="72" alt="Kak Nadia Ayu" className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]" />
                      <div className="[min-width:0] [flex:1]">
                        <p className="[margin:0] [font-size:12px] [font-weight:900] [color:#151515] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">Kak Nadia Ayu</p>
                      </div>
                      <p className="[margin:0] [flex-shrink:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">513</p>
                    </div>
                  
                </div>
              </div>
      
              <div className="[margin-top:48px]">
                <div className="[display:flex] [align-items:center] [justify-content:center] [gap:8px] [margin-bottom:24px]">
                  <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"></path><path fill="#FF3D00" d="M6.3 14.7l5.8 4.3C13.9 15.4 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 16.4 4 9.8 8.5 6.3 14.7z"></path><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.6-3.4-11.3-8l-6 4.6C9.6 39.5 16.2 44 24 44z"></path><path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1 3-3.1 5.5-5.9 7.1l6.2 5.2C39.4 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"></path></svg>
                  <span className="[font-size:14px] [font-weight:800] [color:#151515]">4.9</span>
                  <span className="[color:#FBBF24] [font-size:16px]">★★★★★</span>
                  <span className="[font-size:14px] [font-weight:400] [color:#6b7280]"><b>3.620</b> Google Reviews</span>
                </div>
                <div className="[position:relative] [display:flex] [align-items:center] [justify-content:center] [height:220px] [overflow:hidden]">
                  <button onClick={prevGoogle} aria-label="Sebelumnya" className="[position:absolute] [left:0] [z-index:3] [display:flex] [height:36px] [width:36px] [align-items:center] [justify-content:center] [border-radius:9999px] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_12px_rgba(0,0,0,0.12)] [color:#151515] [font-size:16px] [cursor:pointer]">‹</button>
                  <div style={css(gSideStyle('prev', gIdx))} onClick={() => setReviewIdx((gIdx - 1 + REVIEW_COUNT) % REVIEW_COUNT)}></div>
                  <img loading="lazy" decoding="async" src={reviewSrc(gIdx)} alt="Review peserta Full Bright" onClick={() => setReviewIdx(gIdx)} className="[position:absolute] [left:50%] [transform:translateX(-50%)] [transition:all_0.3s_ease] [cursor:pointer] [height:210px] [width:auto] [max-width:340px] [border-radius:16px] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [z-index:2] [object-fit:contain]" />
                  <div style={css(gSideStyle('next', gIdx))} onClick={() => setReviewIdx((gIdx + 1) % REVIEW_COUNT)}></div>
                  <button onClick={nextGoogle} aria-label="Selanjutnya" className="[position:absolute] [right:0] [z-index:3] [display:flex] [height:36px] [width:36px] [align-items:center] [justify-content:center] [border-radius:9999px] [border:1px_solid_#e5e7eb] [background:#fff] [box-shadow:0_4px_12px_rgba(0,0,0,0.12)] [color:#151515] [font-size:16px] [cursor:pointer]">›</button>
                </div>
              </div>
      
              <div className="[margin-top:44px] [text-align:center]">
                <a href="#pricing" data-analytics-location="testimonials_pricing" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [text-decoration:none]">Mulai Persiapan TOEFL →</a>
              </div>
      
              <div className="[margin-top:48px] [max-width:1080px] [margin-left:auto] [margin-right:auto]">
                <p className="[margin:0_0_6px] [text-align:center] [font-size:11px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#9ca3af]">Cerita Alumni</p>
                <h3 className="[margin:0_0_20px] [text-align:center] [font-size:clamp(19px,2.4vw,24px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Dengar Langsung dari <span className="[color:#D70808]">Alumni Kami</span></h3>
                <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(260px,340px))] [gap:20px] [justify-content:center] [max-width:1080px] [margin:0_auto] [align-items:start]">
                <div className="[display:flex] [flex-direction:column]">
                  <div className="[padding:16px_18px] [background:#fff] [border:1px_solid_#ececec] [border-bottom:0] [border-radius:18px_18px_0_0]">
                    <p className="[margin:0_0_2px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Nurul Masyiah Rani</p>
                    <p className="[margin:0_0_8px] [font-size:12.5px] [font-weight:700] [color:#9ca3af]">Alumni Full Bright · Universitas Hasanuddin</p>
                    <p className="[margin:0] [font-size:14px] [line-height:1.55] [color:#3d3d3d]">"Pengajarnya profesional dan handal, dan banyak latihan soalnya."</p>
                  </div>
                <div className="[position:relative] [border-radius:0_0_18px_18px] [overflow:hidden] [background:#151515] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [line-height:0] [cursor:pointer]" onClick={playVideo}>
                  <video ref={videoRef} src="https://demo-fullbright.b-cdn.net/testimoni%20iyha.mp4#t=0.001" poster="/assets-c12/testimoni-iyha-poster.webp" controls playsInline preload="none" onPlay={handleTestimonialVideoPlay} className="[display:block] [width:100%] [aspect-ratio:9/16] [max-height:560px] [object-fit:cover] [background:#151515]"></video>
                  {showOverlay ? (<>
                    <div className="[position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:14px] [background:rgba(21,21,21,0.35)]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:76px] [height:76px] [border-radius:9999px] [background:#D70808] [box-shadow:0_8px_28px_rgba(215,8,8,0.5)]">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13l11-6.5z"></path></svg>
                      </span>
                      <span className="[font-size:13px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#fff] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">Putar video testimoni</span>
                    </div>
                  </>) : null}
                </div>
                </div>
      
                <div className="[display:flex] [flex-direction:column]">
                  <div className="[padding:16px_18px] [background:#fff] [border:1px_solid_#ececec] [border-bottom:0] [border-radius:18px_18px_0_0]">
                    <p className="[margin:0_0_2px] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Celinetia &amp; Aqila Afifah</p>
                    <p className="[margin:0_0_8px] [font-size:12.5px] [font-weight:700] [color:#9ca3af]">Alumni Full Bright · Mahasiswi UMY &amp; UNSRI</p>
                    <p className="[margin:0] [font-size:14px] [line-height:1.55] [color:#3d3d3d]">"Metode belajarnya mudah dipahami dan pengajarnya lulusan luar negeri"</p>
                  </div>
                <div className="[position:relative] [border-radius:0_0_18px_18px] [overflow:hidden] [background:#151515] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [line-height:0] [cursor:pointer]" onClick={playVideo2}>
                  <video ref={videoRef2} src="https://demo-fullbright.b-cdn.net/Testimoni%20Siswa%20TOEFLIni%20kata%20mereka%20yang%20mengambil%20kelas%20TOEFL%20di%20Full%20Bright.Saatnya%20Anda%20yang.mp4#t=0.001" poster="/assets-c12/testimoni-siswa-poster.webp" controls playsInline preload="none" onPlay={handleSecondTestimonialVideoPlay} className="[display:block] [width:100%] [aspect-ratio:9/16] [max-height:560px] [object-fit:cover] [background:#151515]"></video>
                  {showOverlay2 ? (<>
                    <div className="[position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:14px] [background:rgba(21,21,21,0.35)]">
                      <span className="[display:flex] [align-items:center] [justify-content:center] [width:76px] [height:76px] [border-radius:9999px] [background:#D70808] [box-shadow:0_8px_28px_rgba(215,8,8,0.5)]">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13l11-6.5z"></path></svg>
                      </span>
                      <span className="[font-size:13px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#fff] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">Putar video testimoni</span>
                    </div>
                  </>) : null}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div></section>
      
        {/* Photo Lightbox */}
        {lightboxIdx !== null ? (<>
          <div className="[position:fixed] [inset:0] [z-index:50] [display:flex] [align-items:center] [justify-content:center] [background:rgba(0,0,0,0.92)]" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="[position:absolute] [top:16px] [right:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:28px] [cursor:pointer]">✕</button>
            <button onClick={prevPhoto} className="[position:absolute] [left:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:36px] [cursor:pointer] [padding:8px]">‹</button>
            <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:16px] [padding:0_64px]" onClick={(e) => e.stopPropagation()}>
              <div role="img" aria-label="Score" style={css(lbImgStyle(lightboxIdx))}></div>
              <p className="[margin:0] [font-size:14px] [color:rgba(255,255,255,0.6)]">Skor {WA_SCREENSHOTS[lightboxIdx ?? 0].score}</p>
              <p className="[margin:0] [font-size:12px] [color:rgba(255,255,255,0.4)]">{(lightboxIdx ?? 0) + 1} / {WA_SCREENSHOTS.length}</p>
            </div>
            <button onClick={nextPhoto} className="[position:absolute] [right:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:36px] [cursor:pointer] [padding:8px]">›</button>
          </div>
        </>) : null}
      
        {/* Review Lightbox */}
        {reviewIdx !== null ? (<>
          <div className="[position:fixed] [inset:0] [z-index:50] [display:flex] [align-items:center] [justify-content:center] [background:rgba(0,0,0,0.92)]" onClick={closeReview}>
            <button onClick={closeReview} className="[position:absolute] [top:16px] [right:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:28px] [cursor:pointer]">✕</button>
            <button onClick={prevReview} className="[position:absolute] [left:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:36px] [cursor:pointer] [padding:8px]">‹</button>
            <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:16px] [padding:0_64px]" onClick={(e) => e.stopPropagation()}>
              <div role="img" aria-label="Review" style={css(rvImgStyle(reviewIdx))}></div>
              <p className="[margin:0] [font-size:12px] [color:rgba(255,255,255,0.4)]">{(reviewIdx ?? 0) + 1} / {REVIEW_COUNT}</p>
            </div>
            <button onClick={nextReview} className="[position:absolute] [right:16px] [background:none] [border:none] [color:rgba(255,255,255,0.7)] [font-size:36px] [cursor:pointer] [padding:8px]">›</button>
          </div>
        </>) : null}
      
        {/* Pricing — VARIAN B (single primary offer + secondary tutor panel) */}
        <section id="pricing" className="max-[559px]:[padding:48px_16px_40px] [background:#fff] [padding:72px_24px_56px]">
          <div className="[max-width:1080px] [margin:0_auto]">
      
            <div className="[text-align:center] [margin-bottom:32px]">
              <p className="[margin:0_0_12px] [font-size:12px] [font-weight:900] [letter-spacing:0.09em] [text-transform:uppercase] [color:#D70808]">Belajar TOEFL Secara Terstruktur</p>
              <h2 className="[margin:0_0_14px] [font-size:clamp(26px,3.4vw,40px)] [line-height:1.2] [font-weight:900] [font-family:Nunito,sans-serif] [color:#171717]">Mulai Belajar TOEFL dengan Alur yang Jelas</h2>
              <p className="[margin:0] [max-width:560px] [margin-left:auto] [margin-right:auto] [font-size:16px] [line-height:1.6] [color:#525252]">Ikuti roadmap di LMS sesuai waktu luangmu. Jika membutuhkan kelas live, pilihan belajar bersama tutor juga tersedia.</p>
            </div>
      
            {/* A. Kartu utama: paket mandiri */}
            <div className="[max-width:600px] [margin:0_auto]">
              <div className="[position:relative] [overflow:hidden] [border-radius:24px] [background:#fff] [border:2px_solid_#D70808] [box-shadow:0_12px_44px_rgba(215,8,8,0.16)] [padding:30px] max-[559px]:[padding:20px] max-[559px]:[border-radius:18px]">
                <div className="[position:absolute] [top:0] [right:0] [font-size:11.5px] [font-weight:900] [letter-spacing:0.04em] [padding:8px_16px] [border-bottom-left-radius:16px] [color:#fff] [background:#D70808] [font-family:Nunito,sans-serif]">🔥 PALING BANYAK DIPILIH</div>
                <p className="[margin:24px_0_6px] [font-size:11.5px] [font-weight:900] [letter-spacing:0.09em] [text-transform:uppercase] [color:#9ca3af]">Paket Belajar Mandiri</p>
                <h3 className="[margin:0_0_10px] [font-size:clamp(26px,2.9vw,32px)] [line-height:1.15] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Self-Study LMS</h3>
                <p className="[margin:0_0_22px] [font-size:16px] [line-height:1.6] [color:#525252]">Belajar melalui video dan latihan di LMS, mengikuti urutan materi yang sudah disiapkan.</p>
      
                <div className="[border-radius:16px] [padding:18px] [margin-bottom:22px] [background:#FFF0F0] [border:1px_solid_#ffd4d4]">
                  <div className="[display:flex] [align-items:center] [flex-wrap:wrap] [gap:8px] [margin-bottom:6px]">
                    <span className="[font-size:14px] [text-decoration:line-through] [font-weight:600] [color:#9ca3af]">Rp250.000</span>
                    <span className="[font-size:12px] [font-weight:900] [padding:2px_9px] [border-radius:9999px] [color:#fff] [background:#D70808]">HEMAT 60%</span>
                  </div>
                  <p className="[margin:0] [font-size:clamp(34px,4.4vw,42px)] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#D70808]">Rp99.000</p>
                </div>
      
                <ul className="[list-style:none] [margin:0_0_20px] [padding:0] [display:flex] [flex-direction:column] [gap:14px]">
                    <li className="[display:flex] [align-items:flex-start] [gap:11px]">
                      <span aria-hidden="true" className="[flex-shrink:0] [display:flex] [align-items:center] [justify-content:center] [width:22px] [height:22px] [margin-top:1px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [font-size:11px] [font-weight:900]">✓</span>
                      <span className="[display:block]">
                        <span className="[display:block] [font-size:16px] [line-height:1.4] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Roadmap materi 15 hari</span>
                        <span className="[display:block] [margin-top:2px] [font-size:14px] [line-height:1.5] [color:#525252]">Urutan materi sudah disiapkan agar kamu tahu mulai dari mana.</span>
                      </span>
                    </li>
                    <li className="[display:flex] [align-items:flex-start] [gap:11px]">
                      <span aria-hidden="true" className="[flex-shrink:0] [display:flex] [align-items:center] [justify-content:center] [width:22px] [height:22px] [margin-top:1px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [font-size:11px] [font-weight:900]">✓</span>
                      <span className="[display:block]">
                        <span className="[display:block] [font-size:16px] [line-height:1.4] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">60+ video pembelajaran</span>
                        <span className="[display:block] [margin-top:2px] [font-size:14px] [line-height:1.5] [color:#525252]">Pelajari materi sesuai waktu luangmu.</span>
                      </span>
                    </li>
                    <li className="[display:flex] [align-items:flex-start] [gap:11px]">
                      <span aria-hidden="true" className="[flex-shrink:0] [display:flex] [align-items:center] [justify-content:center] [width:22px] [height:22px] [margin-top:1px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [font-size:11px] [font-weight:900]">✓</span>
                      <span className="[display:block]">
                        <span className="[display:block] [font-size:16px] [line-height:1.4] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">1.000+ nomor latihan soal</span>
                        <span className="[display:block] [margin-top:2px] [font-size:14px] [line-height:1.5] [color:#525252]">Latihan untuk menerapkan materi yang dipelajari.</span>
                      </span>
                    </li>
                    <li className="[display:flex] [align-items:flex-start] [gap:11px]">
                      <span aria-hidden="true" className="[flex-shrink:0] [display:flex] [align-items:center] [justify-content:center] [width:22px] [height:22px] [margin-top:1px] [border-radius:9999px] [background:#FFF0F0] [color:#D70808] [font-size:11px] [font-weight:900]">✓</span>
                      <span className="[display:block]">
                        <span className="[display:block] [font-size:16px] [line-height:1.4] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Diagnostic test dan simulasi</span>
                        <span className="[display:block] [margin-top:2px] [font-size:14px] [line-height:1.5] [color:#525252]">Kenali kemampuan awal dan ukur hasil belajarmu.</span>
                      </span>
                    </li>
                </ul>
      
                <p className="[margin:0_0_20px] [padding:11px_14px] [border-radius:10px] [background:#F5F5F5] [border-left:3px_solid_#c9c9c9] [font-size:13px] [line-height:1.5] [font-style:italic] [font-weight:600] [color:#525252] [text-align:center]">Tidak termasuk kelas live Zoom dan sertifikat TOEFL.</p>
      
                <div className="[display:flex] [flex-direction:column] [gap:6px]">
                  <a href="https://member.fullbrightindonesia.com/paket-gold-e-course-toefl?utm_source=c12-price&utm_content=self-study" target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_self_checkout" data-analytics-package="Self-Study LMS" data-analytics-price="99000" onClick={markCheckoutClicked} className="[display:inline-flex] [width:100%] [min-height:52px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:900] [border-radius:14px] [padding:15px_22px] [font-size:17px] [color:#fff] [background:#D70808] [box-shadow:0_6px_24px_rgba(215,8,8,0.4)] [text-decoration:none] [box-sizing:border-box]">Mulai Belajar Mandiri →</a>
                  <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [font-size:12px] [text-align:center] [color:#9ca3af]">🔒 Pembayaran aman &amp; terenkripsi</p>
                </div>
      
                <button onClick={toggleLmsDetail} aria-expanded={lmsDetailOpen} aria-controls="vb-lms-detail" className="[display:flex] [align-items:center] [justify-content:center] [gap:7px] [width:100%] [min-height:44px] [margin-top:12px] [background:none] [border:none] [cursor:pointer] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:800] [color:#525252] [text-decoration:underline] [text-underline-offset:3px]">{lmsDetailOpen ? 'Tutup detail fasilitas' : 'Lihat seluruh fasilitas paket mandiri'}<span aria-hidden="true" className="[display:inline-block]" style={css(lmsDetailOpen ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)')}>▾</span></button>
                {lmsDetailOpen ? (<>
                  <div id="vb-lms-detail" className="[margin-top:12px] [padding-top:16px] [border-top:1px_solid_#e5e7eb]">
                    <p className="[margin:0_0_10px] [font-size:12px] [font-weight:900] [letter-spacing:0.07em] [text-transform:uppercase] [color:#9ca3af]">Termasuk dalam paket</p>
                    <ul className="[list-style:none] [margin:0_0_14px] [padding:0] [display:flex] [flex-direction:column] [gap:8px]">
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>60+ Video Materi Pembelajaran</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Materi Hari ke-1 s/d ke-15 (Roadmap Lengkap)</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Lebih dari 1.000+ Nomor Latihan Soal</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Grup WA Diskusi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Diagnostic Test</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Simulasi dan Post Test (Full Skills)</li>
                      
                    </ul>
                    <p className="[margin:0_0_10px] [font-size:12px] [font-weight:900] [letter-spacing:0.07em] [text-transform:uppercase] [color:#9ca3af]">Belum termasuk</p>
                    <ul className="[list-style:none] [margin:0_0_14px] [padding:0] [display:flex] [flex-direction:column] [gap:8px]">
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#9ca3af]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#d1d5db]">✕</span>LIVE ZOOM 15 Hari</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#9ca3af]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#d1d5db]">✕</span>Sertifikat TOEFL</li>
                      
                    </ul>
                    
                  </div>
                </>) : null}
                  <div className="[display:flex] [align-items:center] [gap:12px] [margin:14px_0]">
                    <div className="[flex:1] [height:1px] [background:#e5e7eb]"></div><span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">atau</span><div className="[flex:1] [height:1px] [background:#e5e7eb]"></div>
                  </div>
                  <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20E-Course%20Self-Study%20LMS." target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_self_whatsapp" data-analytics-conversion="wa_registration" data-analytics-package="Self-Study LMS" data-analytics-price="99000" className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:14px] [padding:12px_20px] [font-size:14px] [color:#16a34a] [background:#fff] [border:1.5px_solid_#25D366] [box-shadow:0_2px_8px_rgba(37,211,102,0.14)] [text-decoration:none] [box-sizing:border-box]"><img loading="lazy" decoding="async" src="/assets-c12/admin-avatar.webp" width="96" height="96" alt="Admin Full Bright" className="[width:26px] [height:26px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366] [flex-shrink:0]" />💬 Tanya via WhatsApp</a>
                  <div className="[display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:6px] [margin-top:14px]">
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#FEF3C7] [color:#B45309]">★ 4.9/5</span>
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#F0FDF4] [color:#15803d]">45.000+ Alumni</span>
                  </div>
              </div>
            </div>
      
            {/* B. Pengantar kelas tutor + paket Bundling */}
            <div className="[max-width:600px] [margin:26px_auto_0]">
              <div className="max-[559px]:[text-align:center] [display:flex] [flex-direction:column] [gap:12px]">
                <div className="[display:flex] [align-items:center] [gap:20px]">
                  <div className="[flex:1] [min-width:0]">
                    <span className="[display:inline-flex] [align-items:center] [border-radius:9999px] [background:#FFF0F0] [border:1px_solid_#ffd4d4] [color:#D70808] [font-size:11.5px] [font-weight:900] [letter-spacing:0.07em] [text-transform:uppercase] [padding:6px_14px] [margin-bottom:12px]">Pilihan Lain</span>
                    <h3 className="[margin:0_0_7px] [font-size:clamp(19px,2.4vw,24px)] [line-height:1.3] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Ingin Materi Dijelaskan Langsung dan Bisa Tanya Tutor?</h3>
                    <p className="[margin:0] [font-size:14.5px] [line-height:1.6] [color:#525252]">Ikuti kelas Zoom terjadwal dengan evaluasi progres dan rekaman jika kamu berhalangan hadir.</p>
                  </div>
                  <img loading="lazy" decoding="async" src="/assets-c12/hero-consultant.webp" width="660" height="805" alt="Tim Full Bright Indonesia siap membantu persiapan TOEFL kamu" className="max-[559px]:[display:none] [display:block] [width:170px] [height:170px] [flex-shrink:0] [object-fit:contain] [object-position:bottom_center] [mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.35)_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.35)_88%,transparent_100%)]" />
                </div>
                <span aria-hidden="true" className="[display:flex] [height:52px] [width:52px] [align-self:center] [align-items:center] [justify-content:center] [border-radius:9999px] [background:#FFF0F0] [border:1px_solid_#ffd4d4] [color:#D70808]"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v14M5 12l7 7 7-7"></path></svg></span>
              </div>
      
              <div className="max-[559px]:[padding:20px] max-[559px]:[border-radius:18px] [border-radius:22px] [padding:26px] [display:flex] [flex-direction:column] [position:relative] [overflow:hidden] [border:2px_solid_#16a34a] [box-shadow:0_6px_26px_rgba(22,163,74,0.14)] [background:#fff]">
                  <div className="[position:absolute] [top:0] [right:0] [font-size:11.5px] [font-weight:900] [letter-spacing:0.04em] [padding:7px_14px] [border-bottom-left-radius:16px] [color:#fff] [background:#16a34a] [font-family:Nunito,sans-serif]">⭐ PALING HEMAT</div>
                  <p className="[margin:26px_0_4px] [font-size:11.5px] [font-weight:800] [text-transform:uppercase] [letter-spacing:0.09em] [color:#9ca3af]">Paket</p>
                  <h4 className="[margin:0_0_8px] [font-size:25px] [line-height:1.2] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Bundling</h4>
                  <p className="[margin:0_0_16px] [font-size:15px] [line-height:1.55] [color:#525252] [font-style:italic] [text-decoration-line:none]">Ikuti Starter dan Intermediate dalam satu program.</p>
                  <dl className="[margin:0_0_18px] [display:flex] [flex-direction:column] [gap:9px]">
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Target belajar:</dt>
                      <dd className="[margin:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">500+</dd>
                    </div>
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Durasi:</dt>
                      <dd className="[margin:0] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">25 hari kelas live</dd>
                    </div>
                    
                  </dl>
                  <div className="max-[559px]:[padding:12px_14px] [border-radius:14px] [padding:14px_16px] [margin-bottom:18px] [background:#FFF0F0] [border:1px_solid_#ffd4d4]">
                    <div className="[display:flex] [align-items:center] [flex-wrap:wrap] [gap:8px] [margin-bottom:4px]">
                      <span className="[font-size:17.5px] [text-decoration:line-through] [font-weight:600] [color:#9ca3af]">Rp1.875.000</span>
                      <span className="[font-size:12.5px] [font-weight:900] [padding:2px_8px] [border-radius:9999px] [color:#fff] [background:#D70808]">DISKON 80% + Rp50rb</span>
                    </div>
                    <p className="[margin:0_0_4px] [font-size:34px] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#D70808]">Rp325.000</p>
                    <p className="[margin:0] [font-size:12.5px] [font-weight:700] [color:#D70808]">Hemat Rp 1.550.000 dari harga normal!</p>
                  </div>
                  <ul className="[list-style:none] [margin:0_0_22px] [padding:0] [display:flex] [flex-direction:column] [gap:10px]">
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>Live Zoom 25 hari</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>1.370+ soal latihan di LMS</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>Progress test dan post-test, total 3 kali</li>
                  </ul>
                  <div className="[display:grid] [grid-template-columns:1fr] [gap:12px] [margin:0_0_16px]">
                    <div className="[border-radius:16px] [padding:16px] [background:#F3F3F3]">
                      <div className="[display:flex] [align-items:center] [gap:10px] [margin-bottom:8px]">
                        <div className="[width:32px] [height:32px] [flex-shrink:0] [border-radius:10px] [background:#FEF3C7] [display:flex] [align-items:center] [justify-content:center]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path></svg>
                        </div>
                        <p className="[margin:0] [font-size:13px] [font-weight:900] [line-height:1.3] [font-family:Nunito,sans-serif] [color:#151515]">Garansi Sampai Skor Tercapai</p>
                      </div>
                      <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">Ikut program secara penuh dan konsisten, tapi skor belum tercapai, gratis ulang kelas di batch berikutnya.</p>
                    </div>
                    <div className="[border-radius:16px] [padding:16px] [background:#F3F3F3]">
                      <div className="[display:flex] [align-items:center] [gap:10px] [margin-bottom:8px]">
                        <div className="[width:32px] [height:32px] [flex-shrink:0] [border-radius:10px] [background:#FEF3C7] [display:flex] [align-items:center] [justify-content:center]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path></svg>
                        </div>
                        <p className="[margin:0] [font-size:13px] [font-weight:900] [line-height:1.3] [font-family:Nunito,sans-serif] [color:#151515]">Post Test Ulang 3× Gratis</p>
                      </div>
                      <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">Belum puas hasilnya? Ulang ujian akhir hingga 3 kali, gratis.</p>
                    </div>
                  </div>
                  
                  <div className="[display:flex] [flex-direction:column] [gap:6px] [margin-top:auto]">
                    <a href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale?utm_source=c12-price&utm_content=bundling" target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_bundling_checkout" data-analytics-package="Bundling" data-analytics-price="325000" onClick={markCheckoutClicked} className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:900] [border-radius:14px] [padding:14px_20px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_6px_22px_rgba(215,8,8,0.35)] [text-decoration:none] [box-sizing:border-box]">Pilih Bundling →</a>
                    <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [font-size:12px] [text-align:center] [color:#9ca3af]">🔒 Pembayaran aman &amp; terenkripsi</p>
                  </div>
                  <button onClick={toggleBundlingDetail} aria-expanded={bundlingDetailOpen} aria-controls="vb-bundling-detail" className="[display:flex] [align-items:center] [justify-content:center] [gap:6px] [width:100%] [min-height:44px] [margin-top:10px] [background:none] [border:none] [cursor:pointer] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:800] [color:#525252] [text-decoration:underline] [text-underline-offset:3px]">{bundlingDetailOpen ? 'Tutup detail fasilitas' : 'Lihat detail fasilitas'}<span aria-hidden="true" className="[display:inline-block]" style={css(bundlingDetailOpen ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)')}>▾</span></button>
                  {bundlingDetailOpen ? (<>
                    <div id="vb-bundling-detail" className="[margin:12px_0_0] [padding:14px_0_0] [border-top:1px_solid_#e5e7eb]">
                      <ul className="[list-style:none] [margin:0_0_14px] [padding:0] [display:flex] [flex-direction:column] [gap:8px]">
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>LIVE ZOOM 25 Hari</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Akses Latihan Soal di LMS (Total 1.370+ Soal)</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Progress Test &amp; Post Test (Full Test) 3x</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Evaluasi Progress Mingguan</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Strategi Submit Sesuai Jurusan &amp; Rencana Kontribusi</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Rekaman ZOOM jika tidak hadir</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>90+ Video Materi Pembelajaran</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Structure (500+ Soal)</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Listening dan Reading</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Grup WA Diskusi</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Placement Test / Pre-Test</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>25 Link Soal Tambahan saat LIVE ZOOM</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Free mengulang 1 bulan jika belum capai skor 500+</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Tutor Tanya AI 24 Jam di setiap materi</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Pembahasan setiap soal di LMS</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Webinar Beasiswa Luar Negeri</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#D70808]"></span>Bonus Spesial</li>
                        
                          <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Sertifikat TOEFL</li>
                        
                      </ul>
                    </div>
                  </>) : null}
                  <div className="[display:flex] [align-items:center] [gap:12px] [margin:14px_0]">
                    <div className="[flex:1] [height:1px] [background:#e5e7eb]"></div><span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">atau</span><div className="[flex:1] [height:1px] [background:#e5e7eb]"></div>
                  </div>
                  <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20paket%20HEMAT%20TOEFL%20Level%20Starter%20%2B%20Intermediate." target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_bundling_whatsapp" data-analytics-conversion="wa_registration" data-analytics-package="Bundling" data-analytics-price="325000" className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:14px] [padding:12px_20px] [font-size:14px] [color:#16a34a] [background:#fff] [border:1.5px_solid_#25D366] [box-shadow:0_2px_8px_rgba(37,211,102,0.14)] [text-decoration:none] [box-sizing:border-box]"><img loading="lazy" decoding="async" src="/assets-c12/admin-avatar.webp" width="96" height="96" alt="Admin Full Bright" className="[width:26px] [height:26px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366] [flex-shrink:0]" />💬 Tanya via WhatsApp</a>
                  <div className="[display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:6px] [margin-top:14px]">
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#FEF3C7] [color:#B45309]">★ 4.9/5</span>
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#F0FDF4] [color:#15803d]">45.000+ Alumni</span>
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#EFF6FF] [color:#1d4ed8]">🛡 Garansi mengulang kelas</span>
                  </div>
                </div>
      
            </div>
      
            {/* C. Alternatif durasi lebih singkat: Starter & Intermediate */}
            <div className="[max-width:600px] [margin:20px_auto_0] [border-radius:16px] [background:#F7F7F7] [border:1px_solid_#e5e7eb] [padding:18px_20px]">
              <p className="[margin:0_0_4px] [font-size:15px] [line-height:1.5] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Cari kelas dengan durasi lebih singkat?</p>
              <p className="[margin:0_0_14px] [font-size:14px] [line-height:1.5] [color:#525252]">Lihat Starter &amp; Intermediate, mulai <span className="[font-weight:900] [color:#151515]">Rp200.000</span></p>
              <button onClick={toggleTutorPanel} aria-expanded={tutorPanelOpen} aria-controls="vb-tutor-options" className="[display:flex] [align-items:center] [justify-content:center] [gap:8px] [width:100%] [min-height:48px] [padding:12px_20px] [border-radius:12px] [background:#fff] [border:1.5px_solid_#cfcfcf] [cursor:pointer] [font-family:Nunito,sans-serif] [font-size:14.5px] [font-weight:800] [color:#151515] [box-sizing:border-box]">{tutorPanelOpen ? 'Tutup Starter & Intermediate' : 'Lihat Starter & Intermediate'}<span aria-hidden="true" className="[display:inline-block]" style={css(tutorPanelOpen ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)')}>▾</span></button>
            </div>
      
            {tutorPanelOpen ? (<>
              <div id="vb-tutor-options" className="[margin-top:22px] [animation:fbFadeInUp_0.25s_ease_both]">
                <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] [gap:22px] [align-items:stretch] [max-width:900px] [margin:0_auto]">
      
                <div className="max-[559px]:[padding:20px] max-[559px]:[border-radius:18px] [border-radius:22px] [padding:26px] [display:flex] [flex-direction:column] [position:relative] [overflow:hidden] [border:1.5px_solid_#e5e7eb] [box-shadow:0_4px_20px_rgba(0,0,0,0.05)] [background:#fff]">
                  
                  <p className="[margin:0_0_4px] [font-size:11.5px] [font-weight:800] [text-transform:uppercase] [letter-spacing:0.09em] [color:#9ca3af]">Paket</p>
                  <h4 className="[margin:0_0_8px] [font-size:25px] [line-height:1.2] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Starter</h4>
                  
                  <p className="[margin:0_0_16px] [font-size:15px] [line-height:1.55] [color:#525252] [font-style:italic]">Program kelas live selama 10 hari.</p><dl className="[margin:0_0_18px] [display:flex] [flex-direction:column] [gap:9px]">
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Target belajar:</dt>
                      <dd className="[margin:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">450+</dd>
                    </div>
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Durasi:</dt>
                      <dd className="[margin:0] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">10 hari kelas live</dd>
                    </div>
                    
                  </dl>
                  <div className="max-[559px]:[padding:12px_14px] [border-radius:14px] [padding:14px_16px] [margin-bottom:18px] [background:#FFF0F0] [border:1px_solid_#ffd4d4]">
                    <div className="[display:flex] [align-items:center] [flex-wrap:wrap] [gap:8px] [margin-bottom:4px]">
                      <span className="[font-size:17.5px] [text-decoration:line-through] [font-weight:600] [color:#9ca3af]">Rp1.000.000</span>
                      <span className="[font-size:12.5px] [font-weight:900] [padding:2px_8px] [border-radius:9999px] [color:#fff] [background:#D70808]">HEMAT 80%</span>
                    </div>
                    <p className="[margin:0] [font-size:34px] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#D70808]">Rp200.000</p>
                  </div>
                  <ul className="[list-style:none] [margin:0_0_22px] [padding:0] [display:flex] [flex-direction:column] [gap:10px]">
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>Live Zoom 10 hari</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>370+ soal latihan di LMS</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>1 kali post-test</li>
                  </ul>
                  
                  <div className="[display:flex] [flex-direction:column] [gap:6px] [margin-top:auto]">
                    <a href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale?utm_source=c12-price&utm_content=starter" target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_starter_checkout" data-analytics-package="Starter" data-analytics-price="200000" onClick={markCheckoutClicked} className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:900] [border-radius:14px] [padding:14px_20px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_6px_22px_rgba(215,8,8,0.35)] [text-decoration:none] [box-sizing:border-box]">Pilih Starter →</a>
                    <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [font-size:12px] [text-align:center] [color:#9ca3af]">🔒 Pembayaran aman &amp; terenkripsi</p>
                  </div>
                  <button onClick={toggleStarterDetail} aria-expanded={starterDetailOpen} aria-controls="vb-starter-detail" className="[display:flex] [align-items:center] [justify-content:center] [gap:6px] [width:100%] [min-height:44px] [margin-top:10px] [background:none] [border:none] [cursor:pointer] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:800] [color:#525252] [text-decoration:underline] [text-underline-offset:3px]">{starterDetailOpen ? 'Tutup detail fasilitas' : 'Lihat detail fasilitas'}<span aria-hidden="true" className="[display:inline-block]" style={css(starterDetailOpen ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)')}>▾</span></button>
                  {starterDetailOpen ? (<>
                    <ul id="vb-starter-detail" className="[list-style:none] [margin:12px_0_0] [padding:14px_0_0] [border-top:1px_solid_#e5e7eb] [display:flex] [flex-direction:column] [gap:8px]">
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>LIVE ZOOM 10 Hari</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Akses Latihan Soal di LMS (Total 370+ Soal)</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Post Test (Full Test) 1x</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Evaluasi Progress Mingguan</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Strategi Submit Sesuai Jurusan &amp; Rencana Kontribusi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Rekaman ZOOM jika tidak hadir</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>30+ Video Materi Pembelajaran</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Structure</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Listening dan Reading</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Grup WA Diskusi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Placement Test / Pre-Test</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>10+ Link Soal Tambahan saat LIVE ZOOM</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Tutor Tanya AI 24 Jam di setiap materi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Pembahasan setiap soal di LMS</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Webinar Beasiswa Luar Negeri</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#D70808]"></span>Bonus Spesial</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Sertifikat TOEFL</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#d1d5db]">✕</span>Tidak termasuk garansi mengulang 1 bulan</li>
                      
                    </ul>
                  </>) : null}
                  <div className="[display:flex] [align-items:center] [gap:12px] [margin:14px_0]">
                    <div className="[flex:1] [height:1px] [background:#e5e7eb]"></div><span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">atau</span><div className="[flex:1] [height:1px] [background:#e5e7eb]"></div>
                  </div>
                  <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL%20Level%20Starter" target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_starter_whatsapp" data-analytics-conversion="wa_registration" data-analytics-package="Starter" data-analytics-price="200000" className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:14px] [padding:12px_20px] [font-size:14px] [color:#16a34a] [background:#fff] [border:1.5px_solid_#25D366] [box-shadow:0_2px_8px_rgba(37,211,102,0.14)] [text-decoration:none] [box-sizing:border-box]"><img loading="lazy" decoding="async" src="/assets-c12/admin-avatar.webp" width="96" height="96" alt="Admin Full Bright" className="[width:26px] [height:26px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366] [flex-shrink:0]" />💬 Tanya via WhatsApp</a>
                  <div className="[display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:6px] [margin-top:14px]">
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#FEF3C7] [color:#B45309]">★ 4.9/5</span>
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#F0FDF4] [color:#15803d]">45.000+ Alumni</span>
                  </div>
                </div>
      
      
                <div className="max-[559px]:[padding:20px] max-[559px]:[border-radius:18px] [border-radius:22px] [padding:26px] [display:flex] [flex-direction:column] [position:relative] [overflow:hidden] [border:1.5px_solid_#e5e7eb] [box-shadow:0_4px_20px_rgba(0,0,0,0.05)] [background:#fff]">
                  
                  <p className="[margin:0_0_4px] [font-size:11.5px] [font-weight:800] [text-transform:uppercase] [letter-spacing:0.09em] [color:#9ca3af]">Paket</p>
                  <h4 className="[margin:0_0_8px] [font-size:25px] [line-height:1.2] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Intermediate</h4>
                  <p className="[margin:0_0_16px] [font-size:15px] [line-height:1.55] [color:#525252] [font-style:italic]">Untuk kamu yang sudah memiliki skor awal minimal 430.</p>
                  <dl className="[margin:0_0_18px] [display:flex] [flex-direction:column] [gap:9px]">
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Target belajar:</dt>
                      <dd className="[margin:0] [font-size:20px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#16a34a]">500+</dd>
                    </div>
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Durasi:</dt>
                      <dd className="[margin:0] [font-size:15px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">15 hari kelas live</dd>
                    </div>
                    <div className="[display:flex] [align-items:baseline] [gap:8px] [font-size:15px] [line-height:1.4]">
                      <dt className="[margin:0] [flex-shrink:0] [color:#525252]">Syarat:</dt>
                      <dd className="[margin:0] [font-size:15px] [font-weight:900] [color:#D70808]">Minimal skor awal 430</dd>
                    </div>
                  </dl>
                  <div className="max-[559px]:[padding:12px_14px] [border-radius:14px] [padding:14px_16px] [margin-bottom:18px] [background:#FFF0F0] [border:1px_solid_#ffd4d4]">
                    <div className="[display:flex] [align-items:center] [flex-wrap:wrap] [gap:8px] [margin-bottom:4px]">
                      <span className="[font-size:17.5px] [text-decoration:line-through] [font-weight:600] [color:#9ca3af]">Rp1.400.000</span>
                      <span className="[font-size:12.5px] [font-weight:900] [padding:2px_8px] [border-radius:9999px] [color:#fff] [background:#D70808]">HEMAT 80%</span>
                    </div>
                    <p className="[margin:0] [font-size:34px] [line-height:1] [font-weight:900] [font-family:Nunito,sans-serif] [color:#D70808]">Rp280.000</p>
                  </div>
                  <ul className="[list-style:none] [margin:0_0_22px] [padding:0] [display:flex] [flex-direction:column] [gap:10px]">
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>Live Zoom 15 hari</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>1.000+ soal latihan di LMS</li>
                    <li className="[display:flex] [align-items:flex-start] [gap:9px] [font-size:15px] [line-height:1.5] [font-weight:700] [color:#151515]"><span aria-hidden="true" className="[flex-shrink:0] [color:#D70808] [font-weight:900]">✓</span>Progress test dan post-test, total 2 kali</li>
                  </ul>
                  
                  <div className="[display:flex] [flex-direction:column] [gap:6px] [margin-top:auto]">
                    <a href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-intermediate-live-zoom-intensif-flash-sale?utm_source=c12-price&utm_content=intermediate" target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_intermediate_checkout" data-analytics-package="Intermediate" data-analytics-price="280000" onClick={markCheckoutClicked} className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:900] [border-radius:14px] [padding:14px_20px] [font-size:16px] [color:#fff] [background:#D70808] [box-shadow:0_6px_22px_rgba(215,8,8,0.35)] [text-decoration:none] [box-sizing:border-box]">Pilih Intermediate →</a>
                    <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [font-size:12px] [text-align:center] [color:#9ca3af]">🔒 Pembayaran aman &amp; terenkripsi</p>
                  </div>
                  <button onClick={toggleInterDetail} aria-expanded={interDetailOpen} aria-controls="vb-inter-detail" className="[display:flex] [align-items:center] [justify-content:center] [gap:6px] [width:100%] [min-height:44px] [margin-top:10px] [background:none] [border:none] [cursor:pointer] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:800] [color:#525252] [text-decoration:underline] [text-underline-offset:3px]">{interDetailOpen ? 'Tutup detail fasilitas' : 'Lihat detail fasilitas'}<span aria-hidden="true" className="[display:inline-block]" style={css(interDetailOpen ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)')}>▾</span></button>
                  {interDetailOpen ? (<>
                    <ul id="vb-inter-detail" className="[list-style:none] [margin:12px_0_0] [padding:14px_0_0] [border-top:1px_solid_#e5e7eb] [display:flex] [flex-direction:column] [gap:8px]">
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>LIVE ZOOM 15 Hari</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Akses Latihan Soal di LMS (Total 1000+ Soal)</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:800]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Progress Test &amp; Post Test (Full Test) 2x</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Evaluasi Progress Mingguan</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Strategi Submit Sesuai Jurusan &amp; Rencana Kontribusi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Rekaman ZOOM jika tidak hadir</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>60+ Video Materi Pembelajaran</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Structure</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>E-Book Listening dan Reading</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Grup WA Diskusi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Placement Test / Pre-Test</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>15 Link Soal Tambahan saat LIVE ZOOM</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Tutor Tanya AI 24 Jam di setiap materi</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Pembahasan setiap soal di LMS</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Webinar Beasiswa Luar Negeri</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#3b82f6]">🌐</span>Konsultasi Kampus Luar Negeri, urus LoA, Visa, dll.</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#D70808]"></span>Bonus Spesial</li>
                      
                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [line-height:1.5] [color:#3d3d3d] [font-weight:500]"><span aria-hidden="true" className="[flex-shrink:0] [margin-top:1px] [color:#16a34a]">✓</span>Sertifikat TOEFL</li>
                      
                    </ul>
                  </>) : null}
                  <div className="[display:flex] [align-items:center] [gap:12px] [margin:14px_0]">
                    <div className="[flex:1] [height:1px] [background:#e5e7eb]"></div><span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">atau</span><div className="[flex:1] [height:1px] [background:#e5e7eb]"></div>
                  </div>
                  <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL%20Level%20Intermediate." target="_blank" rel="noopener noreferrer" data-analytics-location="pricing_intermediate_whatsapp" data-analytics-conversion="wa_registration" data-analytics-package="Intermediate" data-analytics-price="280000" className="[display:inline-flex] [width:100%] [min-height:48px] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:14px] [padding:12px_20px] [font-size:14px] [color:#16a34a] [background:#fff] [border:1.5px_solid_#25D366] [box-shadow:0_2px_8px_rgba(37,211,102,0.14)] [text-decoration:none] [box-sizing:border-box]"><img loading="lazy" decoding="async" src="/assets-c12/admin-avatar.webp" width="96" height="96" alt="Admin Full Bright" className="[width:26px] [height:26px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366] [flex-shrink:0]" />💬 Tanya via WhatsApp</a>
                  <div className="[display:flex] [align-items:center] [justify-content:center] [flex-wrap:wrap] [gap:6px] [margin-top:14px]">
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#FEF3C7] [color:#B45309]">★ 4.9/5</span>
                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_10px] [border-radius:9999px] [font-size:12px] [font-weight:600] [background:#F0FDF4] [color:#15803d]">45.000+ Alumni</span>
                  </div>
                </div>
      
                </div>
              </div>
            </>) : null}
      
            {/* D. Bantuan WhatsApp untuk seluruh section */}
            <div className="[max-width:600px] [margin:26px_auto_0] [text-align:center]">
              <p className="[margin:0_0_10px] [font-size:15px] [font-weight:700] [color:#151515]">Belum tahu skor awalmu atau masih bingung memilih program?</p>
              <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL.%20Saya%20mau%20tanya-tanya%20dulu." target="_blank" rel="noopener noreferrer" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [min-height:44px] [padding:11px_22px] [border-radius:12px] [border:1.5px_solid_#25D366] [background:#fff] [font-size:14px] [font-weight:800] [font-family:Nunito,sans-serif] [color:#16a34a] [text-decoration:none]"><svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg>Tanya lewat WhatsApp</a>
            </div>
      
          </div>
        </section>
      
        {/* FAQ */}
        <section id="faq" className="[background:#F3F3F3] [padding:80px_24px_48px]">
          <div className="[max-width:1152px] [margin:0_auto]">
            <div className="[text-align:center] [margin-bottom:56px]">
              <div className="[display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [font-weight:700] [text-transform:uppercase] [letter-spacing:0.08em] [padding:6px_16px] [border-radius:9999px] [margin-bottom:20px] [background:#FFF0F0] [color:#D70808] [border:1px_solid_#ffb3b3]">❓ Masih Ragu?</div>
              <h2 className="[margin:0] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515]">Apakah Kamu Benar-Benar <span className="[color:#D70808]">Butuh Ini Sekarang?</span></h2>
            </div>
      
            <div className="[display:flex] [flex-wrap:wrap] [gap:8px] [justify-content:center] [margin-bottom:32px]">
              <button onClick={() => setActiveCat(null)} style={css(catBtnStyle(activeCat === null))}>Semua</button>
              
                <button onClick={() => toggleCat(0)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[0]))}>Belajar Mandiri (LMS)</button>
              
                <button onClick={() => toggleCat(1)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[1]))}>Metode &amp; Efektivitas</button>
              
                <button onClick={() => toggleCat(2)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[2]))}>Dibimbing Tutor</button>
              
                <button onClick={() => toggleCat(3)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[3]))}>Sertifikat &amp; Legalitas</button>
              
                <button onClick={() => toggleCat(4)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[4]))}>Pendaftaran &amp; Pembayaran</button>
              
                <button onClick={() => toggleCat(5)} style={css(catBtnStyle(activeCat === FAQ_CATEGORIES[5]))}>Jaminan &amp; Garansi</button>
              
            </div>
      
            <div className="[max-width:768px] [margin:0_auto_48px] [background:#fff] [border-radius:24px] [padding:0_28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)]">
              
                <div style={css(faqItemStyle(activeCat, 0))}>
                  <button onClick={() => setOpenFaq(openFaq === 0 ? null : 0)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 0))}>Kalau ambil paket Self-Study LMS, apa saja yang saya dapat?</span>
                    <span style={css(faqChevStyle(openFaq === 0))}>▾</span>
                  </button>
                  {openFaq === 0 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Kamu dapat akses penuh ke LMS Full Bright: 60+ video materi Full Skills (Listening, Structure, Reading), materi terstruktur hari ke-1 sampai ke-15, 1.000+ nomor latihan soal beserta pembahasan, diagnostic test, simulasi dan post test full skills, serta grup WA diskusi. Semua bisa diakses kapan saja tanpa terikat jadwal kelas.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 1))}>
                  <button onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 1))}>Bagaimana cara akses LMS setelah saya bayar?</span>
                    <span style={css(faqChevStyle(openFaq === 1))}>▾</span>
                  </button>
                  {openFaq === 1 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Setelah pembayaran berhasil, kamu langsung menerima email berisi link dan akun untuk masuk ke platform LMS Full Bright. Akses berlaku 2 tahun dan bisa dibuka dari HP maupun laptop, kapan pun kamu punya waktu.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 2))}>
                  <button onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 2))}>Saya belajar sendiri di LMS. Kalau bingung, bisa tanya ke siapa?</span>
                    <span style={css(faqChevStyle(openFaq === 2))}>▾</span>
                  </button>
                  {openFaq === 2 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Kamu tetap tidak belajar sendirian. Setiap peserta LMS masuk ke grup WA diskusi, jadi kalau ada soal atau materi yang bikin bingung, kamu bisa langsung bertanya dan dibantu. Ini bedanya dengan belajar otodidak dari YouTube — di sana tidak ada yang menjawab kalau kamu stuck.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 3))}>
                  <button onClick={() => setOpenFaq(openFaq === 3 ? null : 3)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 3))}>Apakah bisa dicoba dulu sebelum bayar?</span>
                    <span style={css(faqChevStyle(openFaq === 3))}>▾</span>
                  </button>
                  {openFaq === 3 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Bisa. Tersedia free trial LMS dengan akses 1 modul agar kamu bisa merasakan sendiri kualitas video materi dan latihan soalnya sebelum memutuskan. Kalau cocok, tinggal lanjut ambil paketnya.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 4))}>
                  <button onClick={() => setOpenFaq(openFaq === 4 ? null : 4)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 4))}>Apakah bisa belajar tanpa terikat jadwal karena saya sibuk?</span>
                    <span style={css(faqChevStyle(openFaq === 4))}>▾</span>
                  </button>
                  {openFaq === 4 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Justru itu kelebihan paket belajar mandiri: tidak ada jam kelas yang harus dikejar. Semua materi tersedia di LMS 24/7 dan bisa diulang berapa kali pun. Banyak alumni kami karyawan, PNS aktif, dan mahasiswa tingkat akhir yang belajar di sela-sela kesibukan.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 5))}>
                  <button onClick={() => setOpenFaq(openFaq === 5 ? null : 5)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 5))}>Apakah metode ini cocok untuk pemula yang grammar-nya sangat lemah?</span>
                    <span style={css(faqChevStyle(openFaq === 5))}>▾</span>
                  </button>
                  {openFaq === 5 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Sangat cocok. Materi disusun dari level dasar dan berurutan hari ke-1 sampai ke-15, jadi kamu tidak perlu grammar sempurna untuk memulai. Fokusnya bukan menguasai semua tata bahasa Inggris, tapi mengenali pola soal yang benar-benar keluar di TOEFL ITP.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 6))}>
                  <button onClick={() => setOpenFaq(openFaq === 6 ? null : 6)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 6))}>Kenapa belajar di sini beda dengan belajar sendiri dari buku dan YouTube?</span>
                    <span style={css(faqChevStyle(openFaq === 6))}>▾</span>
                  </button>
                  {openFaq === 6 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Dua hal yang paling sering bikin belajar otodidak gagal: materinya tidak terstruktur dan tidak ada yang bisa ditanya kalau salah. Di Full Bright, materi sudah berurutan dan fokus ke pola soal TOEFL, setiap latihan ada pembahasannya, dan ada grup diskusi untuk bertanya.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 7))}>
                  <button onClick={() => setOpenFaq(openFaq === 7 ? null : 7)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 7))}>Berapa kenaikan skor yang bisa saya harapkan?</span>
                    <span style={css(faqChevStyle(openFaq === 7))}>▾</span>
                  </button>
                  {openFaq === 7 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Berdasarkan data alumni, peserta yang mengikuti materi secara konsisten dan mengerjakan semua bank soal rata-rata naik 80–100 poin. Yang paling banyak dirasakan alumni adalah jadi paham pola soal TOEFL, dan dari situ skornya ikut naik.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 8))}>
                  <button onClick={() => setOpenFaq(openFaq === 8 ? null : 8)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 8))}>Apakah dijamin bisa mencapai skor 500?</span>
                    <span style={css(faqChevStyle(openFaq === 8))}>▾</span>
                  </button>
                  {openFaq === 8 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Kami tidak menjanjikan skor 500 secara mutlak karena hasil tergantung konsistensi masing-masing peserta. Yang bisa kami jamin: metode yang sudah terbukti pada 45.000+ alumni, materi yang fokus dan terstruktur, serta pendampingan selama program.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 9))}>
                  <button onClick={() => setOpenFaq(openFaq === 9 ? null : 9)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 9))}>Apakah ada batasan usia untuk mengikuti program ini?</span>
                    <span style={css(faqChevStyle(openFaq === 9))}>▾</span>
                  </button>
                  {openFaq === 9 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Program terbuka untuk usia 17 hingga 45 tahun. Cocok untuk pelajar, mahasiswa, fresh graduate, maupun karyawan yang butuh skor TOEFL untuk studi, karir, atau beasiswa.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 10))}>
                  <button onClick={() => setOpenFaq(openFaq === 10 ? null : 10)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 10))}>Apa bedanya paket Dibimbing Tutor dengan Self-Study LMS?</span>
                    <span style={css(faqChevStyle(openFaq === 10))}>▾</span>
                  </button>
                  {openFaq === 10 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Semua materi LMS tetap kamu dapat. Tambahannya khusus di paket Dibimbing Tutor: LIVE ZOOM 15 hari bersama instruktur, rekaman ZOOM, dan sertifikat TOEFL Prediction. Cocok kalau kamu merasa lebih terbantu dengan penjelasan langsung dan tempo belajar yang dipandu.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 11))}>
                  <button onClick={() => setOpenFaq(openFaq === 11 ? null : 11)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 11))}>Kapan jadwal LIVE ZOOM-nya dan apakah bisa dipilih?</span>
                    <span style={css(faqChevStyle(openFaq === 11))}>▾</span>
                  </button>
                  {openFaq === 11 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Khusus paket Dibimbing Tutor. Tersedia 5 pilihan sesi harian:
      
      • Pagi (09.00 – 10.00 WIB)
      • Siang (13.00 – 14.00 WIB)
      • Sore (16.00 – 17.00 WIB)
      • Malam (19.00 – 20.00 WIB)
      • Malam (20.15 – 21.15 WIB)
      
      Catatan: Jika berhalangan hadir LIVE ZOOM, jangan khawatir — materi bisa diakses di rekaman ZOOM.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 12))}>
                  <button onClick={() => setOpenFaq(openFaq === 12 ? null : 12)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 12))}>Kalau saya tidak bisa hadir LIVE ZOOM, bagaimana?</span>
                    <span style={css(faqChevStyle(openFaq === 12))}>▾</span>
                  </button>
                  {openFaq === 12 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Khusus paket Dibimbing Tutor. Setiap sesi direkam dan rekamannya bisa diakses seumur hidup, jadi kamu tetap bisa mengejar materi kalau berhalangan hadir. Kelas hanya 60 menit per hari agar tetap muat di jadwal yang padat.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 13))}>
                  <button onClick={() => setOpenFaq(openFaq === 13 ? null : 13)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 13))}>Apakah saya dapat sertifikat TOEFL?</span>
                    <span style={css(faqChevStyle(openFaq === 13))}>▾</span>
                  </button>
                  {openFaq === 13 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Sertifikat TOEFL Prediction diberikan khusus untuk paket Dibimbing Tutor setelah mengikuti post test. Paket Self-Study LMS fokus pada materi dan latihan, tanpa sertifikat.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 14))}>
                  <button onClick={() => setOpenFaq(openFaq === 14 ? null : 14)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 14))}>Apakah lembaganya resmi dan sertifikatnya valid?</span>
                    <span style={css(faqChevStyle(openFaq === 14))}>▾</span>
                  </button>
                  {openFaq === 14 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Full Bright Indonesia adalah lembaga resmi dengan legalitas lengkap: SK Kemenkumham RI Nomor AHU-0055720-AH.0114 Tahun 2020, SK Izin Operasional LKP 503/20177/LKP/DPM-PTSP/8/2024, NPSN Nomor K9998700, dan bekerja sama dengan IIEF Jakarta. Sertifikat dapat digunakan untuk daftar kuliah S1/S2/S3, lamar kerja, seleksi CPNS, rekrutmen BUMN, ujian skripsi, kenaikan pangkat, dan pendaftaran beasiswa.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 15))}>
                  <button onClick={() => setOpenFaq(openFaq === 15 ? null : 15)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 15))}>Bagaimana cara mendaftar dan metode pembayaran apa saja?</span>
                    <span style={css(faqChevStyle(openFaq === 15))}>▾</span>
                  </button>
                  {openFaq === 15 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Klik tombol daftar, pilih paket yang sesuai, lalu selesaikan pembayaran. Setelah itu kamu langsung menerima email konfirmasi beserta akses LMS dan grup WhatsApp. Pembayaran bisa via transfer bank, GoPay, OVO, DANA, dan QRIS.</p>
                    </div>
                  </>) : null}
                </div>
              
                <div style={css(faqItemStyle(activeCat, 16))}>
                  <button onClick={() => setOpenFaq(openFaq === 16 ? null : 16)} className="[cursor:pointer] [width:100%] [background:none] [border:none] [display:flex] [align-items:flex-start] [justify-content:space-between] [text-align:left] [padding:20px_0] [gap:16px]">
                    <span style={css(faqQStyle(openFaq === 16))}>Apakah ada garansi kalau skor saya belum mencapai target?</span>
                    <span style={css(faqChevStyle(openFaq === 16))}>▾</span>
                  </button>
                  {openFaq === 16 ? (<>
                    <div className="[padding:0_32px_24px_0]">
                      <p className="[margin:0] [font-size:14px] [line-height:1.6] [color:#3d3d3d] [white-space:pre-line]">Garansi mengulang sampai skor target tercapai berlaku khusus untuk Paket Bundling (Dibimbing Tutor). Jika sudah mengikuti program secara penuh dan konsisten tapi skor belum tercapai, kamu bisa claim garansi dan mengulang kelas di batch berikutnya.</p>
                    </div>
                  </>) : null}
                </div>
              
            </div>
      
            <div className="[max-width:512px] [margin:0_auto] [text-align:center]">
              <p className="[margin:0_0_24px] [font-size:14px] [font-weight:600] [color:#3d3d3d]">Masih ada pertanyaan lain? Hubungi kami sekarang.</p>
              <div className="[display:flex] [flex-wrap:wrap] [gap:12px] [justify-content:center]">
              <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL.%20Saya%20mau%20tanya-tanya%20dulu." target="_blank" rel="noopener noreferrer" data-analytics-location="faq_whatsapp" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#fff] [background:#25D366] [box-shadow:0_4px_20px_rgba(37,211,102,0.35)] [text-decoration:none]">Chat Via WA →</a>
                <a href="#testimonials" className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-weight:700] [border-radius:16px] [padding:14px_28px] [font-size:16px] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]">Lihat Bukti Alumni →</a>
              </div>
            </div>
          </div>
        </section>
      
        {/* Closing CTA */}
        
      
        {/* Survey */}
        <section id="survey" className="[background:#fff] [padding:28px_24px]">
          <div className="[max-width:460px] [margin:0_auto] [background:#FAFAFA] [border:1px_solid_#ececec] [border-radius:16px] [padding:20px_20px_16px]">
            <div className="[margin-bottom:16px]">
              <p className="[margin:0_0_6px] [font-size:11px] [font-weight:700] [letter-spacing:0.06em] [text-transform:uppercase] [color:#6b6b6b]">BOLEH TAHU KESULITANMU?</p>
              <h2 className="[margin:0] [font-size:clamp(20px,3.6vw,23px)] [line-height:1.25] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Apa Tantangan Terbesarmu <span className="[color:#D70808]">Soal TOEFL Sekarang?</span></h2>
            </div>
      
            <div className="[display:flex] [flex-direction:column] [gap:6px]">
              
                <button onClick={() => selectSurvey(0, 'Bingung mulai belajar dari mana')} data-idx="0" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:48px] [text-align:left] [padding:10px_12px] [border-radius:9px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit]">
                  <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">Bingung mulai belajar dari mana</span>
                  {surveySelected === 0 ? (<>
                    <span className="[display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:16px] [height:16px] [border-radius:9999px] [font-size:9px] [font-weight:800] [background:#D70808] [color:#fff]">✓</span>
                  </>) : null}
                </button>
              
                <button onClick={() => selectSurvey(1, 'Sudah belajar tapi skor masih stuck')} data-idx="1" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:48px] [text-align:left] [padding:10px_12px] [border-radius:9px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit]">
                  <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">Sudah belajar tapi skor masih stuck</span>
                  {surveySelected === 1 ? (<>
                    <span className="[display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:16px] [height:16px] [border-radius:9999px] [font-size:9px] [font-weight:800] [background:#D70808] [color:#fff]">✓</span>
                  </>) : null}
                </button>
              
                <button onClick={() => selectSurvey(2, 'Masih ragu apakah perlu ikut kursus')} data-idx="2" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:48px] [text-align:left] [padding:10px_12px] [border-radius:9px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit]">
                  <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">Masih ragu apakah perlu ikut kursus</span>
                  {surveySelected === 2 ? (<>
                    <span className="[display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:16px] [height:16px] [border-radius:9999px] [font-size:9px] [font-weight:800] [background:#D70808] [color:#fff]">✓</span>
                  </>) : null}
                </button>
              
                <button onClick={() => selectSurvey(3, 'Lainnya')} data-idx="3" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:48px] [text-align:left] [padding:10px_12px] [border-radius:9px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit]">
                  <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">Lainnya</span>
                  {surveySelected === 3 ? (<>
                    <span className="[display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:16px] [height:16px] [border-radius:9999px] [font-size:9px] [font-weight:800] [background:#D70808] [color:#fff]">✓</span>
                  </>) : null}
                </button>
              
            </div>
      
            <p style={css(surveyMsgStyle(surveySelected !== null))}>✓ Makasih! Jawabanmu sudah tercatat.</p>
          </div>
        </section>
      
        {/* Footer */}
        <footer className="[background:#151515] [padding:56px_16px_32px]">
          <div className="[max-width:1152px] [margin:0_auto]">
            <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] [gap:40px] [margin-bottom:40px]">
              <div>
                <div className="[margin-bottom:16px]">
                  <img loading="eager" decoding="async" fetchPriority="high" src="/logo/Logo-Fullbright.webp" width="400" height="400" alt="Full Bright Indonesia" className="[width:160px] [height:auto] [object-fit:contain] [filter:brightness(0)_invert(1)]" />
                </div>
                <p className="[margin:0_0_16px] [font-size:12px] [line-height:1.6] [color:#9ca3af]">SK Kemenkumham RI No. AHU-0055720-AH.0114 Tahun 2020<br />SK LKP No. 503/20177/LKP/DPM-PTSP/8/2024<br />NPSN K9998700 · Kerjasama dengan IIEF Jakarta</p>
                <div className="[display:flex] [gap:12px]">
                  <a href="https://www.instagram.com/fulbrightindonesia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="[width:36px] [height:36px] [border-radius:12px] [display:flex] [align-items:center] [justify-content:center] [background:rgba(255,255,255,0.08)] [color:#9ca3af] [text-decoration:none]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                </div>
              </div>
      
              <div>
                <p className="[margin:0_0_20px] [font-size:12px] [font-weight:900] [text-transform:uppercase] [letter-spacing:0.08em] [color:#6b7280]">Navigasi</p>
                <ul className="[list-style:none] [margin:0] [padding:0] [display:flex] [flex-direction:column] [gap:12px]">
                  <li><a href="#value" className="[font-size:14px] [color:#9ca3af] [text-decoration:none]">Keunggulan</a></li>
                  <li><a href="#testimonials" className="[font-size:14px] [color:#9ca3af] [text-decoration:none]">Testimoni</a></li>
                  <li><a href="#pricing" className="[font-size:14px] [color:#9ca3af] [text-decoration:none]">Harga</a></li>
                  <li><a href="#faq" className="[font-size:14px] [color:#9ca3af] [text-decoration:none]">FAQ</a></li>
                </ul>
              </div>
      
              <div>
                <p className="[margin:0_0_20px] [font-size:12px] [font-weight:900] [text-transform:uppercase] [letter-spacing:0.08em] [color:#6b7280]">Hubungi Kami</p>
                <ul className="[list-style:none] [margin:0] [padding:0] [display:flex] [flex-direction:column] [gap:16px]">
                  
                    <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                      <div className="[width:32px] [height:32px] [border-radius:8px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:rgba(255,255,255,0.08)] [color:#9ca3af]">💬</div>
                      <div>
                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">Ms. Aini</p>
                        <a href="https://wa.me/6281959486507" className="[font-size:12px] [color:#9ca3af] [text-decoration:none]">+62 819-5948-6507</a>
                      </div>
                    </li>
                  
                    <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                      <div className="[width:32px] [height:32px] [border-radius:8px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:rgba(255,255,255,0.08)] [color:#9ca3af]">💬</div>
                      <div>
                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">Mr. Choiri</p>
                        <a href="https://wa.me/6288744875322" className="[font-size:12px] [color:#9ca3af] [text-decoration:none]">+62 887-4487-5322</a>
                      </div>
                    </li>
                  
                    <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                      <div className="[width:32px] [height:32px] [border-radius:8px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:rgba(255,255,255,0.08)] [color:#9ca3af]">💬</div>
                      <div>
                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">Ms. Fini</p>
                        <a href="https://wa.me/6285255499299" className="[font-size:12px] [color:#9ca3af] [text-decoration:none]">+62 852-5549-9299</a>
                      </div>
                    </li>
                  
                  <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                    <div className="[width:32px] [height:32px] [border-radius:8px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:rgba(255,255,255,0.08)] [color:#9ca3af]">✉</div>
                    <div>
                      <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">Email</p>
                      <a href="mailto:info@fullbrightindonesia.org" className="[font-size:12px] [color:#9ca3af] [text-decoration:none]">info@fullbrightindonesia.org</a>
                    </div>
                  </li>
                  <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                    <div className="[width:32px] [height:32px] [border-radius:8px] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] [background:rgba(255,255,255,0.08)] [color:#9ca3af]">📍</div>
                    <div>
                      <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">Alamat</p>
                      <p className="[margin:0] [font-size:12px] [color:#9ca3af]">Gedung Yotta Signature Perintis, Jl. Perintis Kemerdekaan No.97 Lantai 3, Tamalanrea Jaya, Kec. Tamalanrea, Kota Makassar, Sulawesi Selatan 90245</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
      
            <div className="[border-top:1px_solid_rgba(255,255,255,0.08)] [padding-top:24px] [display:flex] [justify-content:center] [font-size:12px] [color:#6b7280]">
              <p className="[margin:0]">© 2026 Full Bright Indonesia. Lembaga Resmi TOEFL ITP bekerjasama dengan IIEF Jakarta.</p>
            </div>
          </div>
        </footer>
      
        {/* Return-to-checkout survey bottom sheet */}
        {rpOpen ? (<>
          <div className="[position:fixed] [inset:0] [z-index:100] [display:flex] [align-items:flex-end] [justify-content:center] [background:rgba(21,21,21,0.45)] [animation:fbFadeInUp_0.2s_ease]" onClick={closeReturnPopup}>
            <div className="[position:relative] [width:100%] [max-width:480px] [max-height:60vh] [overflow-y:auto] [background:#fff] [border-radius:24px_24px_0_0] [padding:22px_22px_28px] [box-shadow:0_-12px_40px_rgba(0,0,0,0.18)] [animation:fbSheetUp_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
              <button onClick={closeReturnPopup} aria-label="Tutup" className="[position:absolute] [top:16px] [right:16px] [display:flex] [height:30px] [width:30px] [align-items:center] [justify-content:center] [border-radius:9999px] [background:#F3F4F6] [border:none] [color:#6b7280] [font-size:16px] [cursor:pointer]">✕</button>
              <p className="[margin:0_0_6px] [font-size:11px] [font-weight:700] [letter-spacing:0.06em] [text-transform:uppercase] [color:#6b6b6b]">Sebelum Kamu Pergi</p>
              <h3 className="[margin:0_0_18px] [padding-right:30px] [font-size:clamp(22px,5vw,26px)] [line-height:1.25] [font-weight:800] [font-family:Nunito,sans-serif] [color:#151515]">Apa yang <span className="[color:#D70808]">Masih Bikin Kamu Ragu Daftar?</span></h3>
              {rpSelected !== null ? (<>
                <a href={waUrl(RETURN_WA_MSGS[rpSelected ?? 0])} target="_blank" rel="noopener noreferrer" data-analytics-location="return_popup_whatsapp" className="[display:flex] [align-items:center] [justify-content:center] [gap:8px] [width:100%] [font-size:14px] [font-weight:700] [color:#fff] [background:#16a34a] [border-radius:12px] [padding:13px_16px] [text-decoration:none] [box-sizing:border-box] [margin-bottom:14px]">💬 Konsultasi via WhatsApp →</a>
                <p className="[margin:0_0_2px] [font-size:13px] [font-weight:700] [color:#151515]">{RETURN_SUBTEXTS[rpSelected ?? 0]}</p>
                <p className="[margin:0_0_12px] [font-size:12px] [font-weight:500] [color:#6b7280]">Tim kami siap bantu jawab langsung lewat WhatsApp.</p>
                <div className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:54px] [padding:12px_14px] [border-radius:12px] [background:rgba(215,8,8,0.05)] [border:1px_solid_#D70808] [box-sizing:border-box]">
                  <span className="[display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:18px] [height:18px] [border-radius:9999px] [font-size:10px] [font-weight:800] [background:#D70808] [color:#fff]">✓</span>
                  <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">{RETURN_OPTIONS[rpSelected ?? 0]}</span>
                </div>
              </>) : null}
              {rpSelected === null ? (<>
                <div className="[display:flex] [flex-direction:column] [gap:8px]">
                  
                    <button onClick={() => selectReturnSurvey(0)} data-idx="0" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:54px] [text-align:left] [padding:12px_14px] [border-radius:12px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit] [box-sizing:border-box]">
                      <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">Harganya masih terlalu mahal buatku</span>
                    </button>
                  
                    <button onClick={() => selectReturnSurvey(1)} data-idx="1" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:54px] [text-align:left] [padding:12px_14px] [border-radius:12px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit] [box-sizing:border-box]">
                      <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">Belum yakin bisa mencapai target TOEFL-ku</span>
                    </button>
                  
                    <button onClick={() => selectReturnSurvey(2)} data-idx="2" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:54px] [text-align:left] [padding:12px_14px] [border-radius:12px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit] [box-sizing:border-box]">
                      <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">Belum yakin program ini cocok untuk kebutuhanku</span>
                    </button>
                  
                    <button onClick={() => selectReturnSurvey(3)} data-idx="3" className="[display:flex] [align-items:center] [gap:10px] [width:100%] [min-height:54px] [text-align:left] [padding:12px_14px] [border-radius:12px] [cursor:pointer] [background:#fff] [border:1px_solid_#e5e5e5] [transition:all_0.15s_ease] [font-family:inherit] [box-sizing:border-box]">
                      <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">Masih membandingkan dengan program lain</span>
                    </button>
                  
                </div>
              </>) : null}
            </div>
          </div>
        </>) : null}
      
        {/* Social proof toast */}
        {proofToasts.length > 0 && !proofDismissed && !waBubbleOpen ? (
          <div className="[position:fixed] [left:20px] [bottom:20px] [z-index:51] [display:flex] [flex-direction:column] [gap:8px] max-[899px]:[left:12px] max-[899px]:[bottom:12px]">
            {proofToasts.map((toast: ProofToast, ti: number) => (
              <div key={ti} className="[position:relative] [width:250px] [max-width:calc(100vw_-_104px)] [border-radius:14px] [background:#fff] [border:1px_solid_#e5e5e5] [box-shadow:0_14px_40px_rgba(0,0,0,0.16)] [overflow:hidden] [animation:fbFadeInUp_0.4s_ease_both] max-[559px]:[width:214px] max-[559px]:[max-width:calc(100vw_-_92px)]">
                <div className="[display:flex] [align-items:center] [gap:6px] [background:#FFE666] [border-bottom:1px_solid_#F2D34D] [padding:5px_11px] max-[559px]:[padding:4px_9px]">
                  <span className="[display:block] [width:6px] [height:6px] [border-radius:9999px] [background:#151515]"></span>
                  <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.08em] [text-transform:uppercase] [color:#151515] max-[559px]:[font-size:9px]">Pendaftaran Terbaru</span>
                </div>
                <div className="[display:flex] [align-items:center] [gap:10px] [padding:10px_12px] max-[559px]:[padding:8px_10px] max-[559px]:[gap:8px]">
                  <span className="[position:relative] [display:flex] [flex-shrink:0] [align-items:center] [justify-content:center] [width:36px] [height:36px] [border-radius:9999px] [background:#FFF0F0] [border:2px_solid_#FFD9D9] [font-size:17px] max-[559px]:[width:30px] max-[559px]:[height:30px] max-[559px]:[font-size:14px]">🎓
                    <span className="[position:absolute] [right:-2px] [bottom:-2px] [display:flex] [align-items:center] [justify-content:center] [width:15px] [height:15px] [border-radius:9999px] [background:#16a34a] [border:2px_solid_#fff] [font-size:8px] [font-weight:900] [color:#fff]">✓</span>
                  </span>
                  <div className="[flex:1] [min-width:0]">
                    <p className="[margin:0_0_3px] [font-size:13px] [line-height:1.35] [font-weight:600] [color:#3d3d3d] max-[559px]:[font-size:16px] max-[559px]:[line-height:1.3]">
                      {toast.parts.map((part: ProofPart, pi: number) => (
                        <span key={pi} className={part.bold ? '[font-weight:900] [color:#151515]' : undefined}>{part.text}</span>
                      ))}
                    </p>
                    <p className="[margin:0] [display:flex] [align-items:center] [gap:5px] [font-size:10.5px] [font-weight:800] [color:#16a34a] max-[559px]:[font-size:10px]">
                      <span className="[display:block] [width:5px] [height:5px] [border-radius:9999px] [background:#16a34a]"></span>{toast.time} · Terverifikasi
                    </p>
                  </div>
                  <button onClick={dismissProofToast} aria-label="Tutup" className="[flex-shrink:0] [align-self:flex-start] [background:none] [border:none] [cursor:pointer] [padding:0] [font-size:13px] [line-height:1] [color:#c4c4c4] [font-family:inherit]">✕</button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      
        {/* Floating WhatsApp */}
        <div className="[position:fixed] [right:20px] [bottom:20px] [z-index:52]">
          {waBubbleOpen ? (<>
            <div className="max-[559px]:[width:196px] max-[559px]:[right:4px] max-[559px]:[bottom:26px] max-[559px]:[padding:9px_11px_9px_10px] max-[559px]:[border-radius:13px_13px_5px_13px] [position:absolute] [right:6px] [bottom:30px] [width:270px] [border-radius:18px_18px_6px_18px] [background:#fff] [border:1px_solid_#e5e7eb] [box-shadow:0_10px_34px_rgba(0,0,0,0.18)] [padding:14px_16px_14px_14px]">
              <button onClick={dismissWaBubble} aria-label="Tutup" className="[position:absolute] [top:-9px] [right:-9px] [display:flex] [align-items:center] [justify-content:center] [width:24px] [height:24px] [border-radius:9999px] [background:#151515] [color:#fff] [border:2px_solid_#fff] [font-size:12px] [font-weight:900] [cursor:pointer] [line-height:1] [padding:0]">✕</button>
              <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20tertarik%20daftar%20kelas%20TOEFL%20Online." target="_blank" rel="noopener noreferrer" data-analytics-location="whatsapp_bubble" className="[display:flex] [align-items:flex-start] [gap:11px] [text-decoration:none]">
                <img loading="lazy" decoding="async" src="/assets-c12/admin-avatar.webp" width="96" height="96" alt="Ms. Fini - Admin Full Bright" className="max-[559px]:[width:26px] max-[559px]:[height:26px] [width:43px] [height:45px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366]" />
                <span className="[display:block]">
                  <span className="max-[559px]:[font-size:10px] max-[559px]:[margin-bottom:1px] [display:block] [font-size:14px] [font-weight:900] [font-family:Nunito,sans-serif] [color:#151515] [margin-bottom:3px]">Ms. Fini - Admin Full Bright</span>
                  <span className="[display:block] [font-size:15px] [line-height:1.5] [font-weight:600] [color:#3d3d3d]">Masih bingung atau ragu? Tanya langsung ke saya ☕</span>
                  <span className="[display:inline-block] [margin-top:8px] [font-size:12px] [font-weight:900] [color:#16a34a]">Balas sekarang →</span>
                </span>
              </a>
            </div>
          </>) : null}
          <a href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20tertarik%20daftar%20kelas%20TOEFL%20Online." target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp" data-analytics-location="floating_whatsapp" className="[position:relative] [display:flex] [height:58px] [width:58px] [align-items:center] [justify-content:center] [border-radius:9999px] [box-shadow:0_6px_22px_rgba(37,211,102,0.5)] [background:#25D366] [overflow:visible]">
            <span className="[display:flex] [align-items:center] [justify-content:center]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg>
            </span>
          </a>
        </div>
      
      
    </>
  );
}
