import { Head } from '@inertiajs/react';
import { lazy, Suspense, useEffect } from 'react';

// Above-the-fold — load immediately (critical rendering path)
import HeroSection from '@/components/sections/cycle8/angle-1/HeroSection';
import Navbar from '@/components/sections/cycle8/angle-1/Navbar';
import UrgencyBanner from '@/components/sections/cycle8/angle-1/UrgencyBanner';
import ReturnModal from '@/components/sections/cycle7/angle-1/ReturnSection';
import AgitationSection2 from '@/components/sections/c1/AgitationSection2';

// Below-the-fold — lazy load to reduce initial bundle size
const AgitationSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/AgitationSection'),
);
const LmsSection = lazy(
    () =>
        import('@/components/sections/cycle7/angle-1/LmsSection'),
);
const WhySection = lazy(
    () =>
        import('@/components/sections/cycle7/angle-1/WhySection'),
);
const SurveySection = lazy(
    () =>
        import('@/components/sections/cycle7/angle-1/SurveySection'),
);
const ValueSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/ValueSection'),
);
const SocialProofSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/SocialProofSection'),
);
const PricingSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/PricingSection'),
);
const BuktiNyataSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/BuktiNyataSection'),
);
const DeliverablesSection = lazy(
    () =>
        import('@/components/sections/cycle8/angle-1/DeliverablesSection'),
);

const FAQSection = lazy(
    () =>
        import('@/components/sections/cycle7/angle-3/FAQSection'),
);
const FreeTrialSection = lazy(
    () =>
        import('@/components/sections/test-variations/cycle6-angle-2/FreeTrialSection'),
);
const LogoBar = lazy(
    () =>
        import('@/components/sections/test-variations/cycle6-angle-2/LogoBar'),
);
const Footer = lazy(() => import('@/components/sections/Footer'));

import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useSectionTracking } from '@/hooks/use-section-tracking';
import { waUrl } from '@/lib/wa-number';

// Minimal non-visible skeleton — prevents layout shift while sections load
function SectionSkeleton() {
    return <div aria-hidden="true" style={{ minHeight: '1px' }} />;
}

export default function C1LandingPage() {
    const { trackVisit } = useAnalytics();

    useEffect(() => {
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');

        return () => {
            if (wasDark) {
                html.classList.add('dark');
            }
        };
    }, []);

    useScrollTracking();
    useDwellTime();
    useSectionTracking();

    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    return (
        <>
            <Head>
                <title>
                    Raih TOEFL Skor 500+ Cukup 15 Hari (LMS + Tutor AI)
                </title>
                <meta
                    name="description"
                    content="Persiapkan skor TOEFL 500+ untuk submission beasiswa luar negeri dengan strategi belajar terarah dan evaluasi progress mingguan."
                />
                <meta
                    name="keywords"
                    content="belajar TOEFL online, kursus TOEFL ITP, TOEFL beasiswa luar negeri, submission beasiswa, skor TOEFL 500, Full Bright Indonesia"
                />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Above-the-fold: rendered immediately */}
                <UrgencyBanner />
                <Navbar />
                <HeroSection />

                {/* NEW: Agitation section inserted directly below Hero */}
                <AgitationSection2 />

                {/* Below-the-fold: lazy loaded after hydration */}
                <Suspense fallback={<SectionSkeleton />}>
                    <LogoBar />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <AgitationSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <ValueSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <BuktiNyataSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <LmsSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <SocialProofSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <PricingSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <FreeTrialSection />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <FAQSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <SurveySection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <Footer />
                </Suspense>

                {/* Return Modal (Exit Intent) */}
                <ReturnModal />

                {/* Floating WhatsApp Button */}
                <a
                    href={waUrl(
                        'Halo Admin Full Bright Indonesia. Saya tertarik daftar kelas TOEFL Online.',
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        try {
                            (
                                window as {
                                    fbq?: (
                                        e: string,
                                        n: string,
                                        p?: object,
                                    ) => void;
                                }
                            ).fbq?.('track', 'Search', {
                                search_string:
                                    'TOEFL Full Bright - WhatsApp Inquiry',
                            });
                        } catch {
                            /* fbq not loaded */
                        }
                    }}
                    className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
                    style={{
                        backgroundColor: '#25D366',
                        boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
                    }}
                    aria-label="Chat WhatsApp"
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="white"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                </a>
            </div>
        </>
    );
}
