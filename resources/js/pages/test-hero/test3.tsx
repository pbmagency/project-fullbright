import { Head } from '@inertiajs/react';
import { lazy, Suspense, useEffect } from 'react';

// Above-the-fold — load immediately
import UrgencyBanner      from '@/components/sections/UrgencyBanner';
import Navbar             from '@/components/sections/Navbar';
import HeroSection        from '@/components/sections/test-hero/HeroSection3';
import SocialProofLogoBar from '@/components/sections/SocialProofLogoBar';

// Below-the-fold — lazy load
const AgitationSection   = lazy(() => import('@/components/sections/cycle2-test-problem/AgitationSection2'));
const ValueSection       = lazy(() => import('@/components/sections/ValueSection'));
const SocialProofSection = lazy(() => import('@/components/sections/SocialProofSection'));
const PricingSection     = lazy(() => import('@/components/sections/PricingSection'));
const FAQSection         = lazy(() => import('@/components/sections/FAQSection'));
const Footer             = lazy(() => import('@/components/sections/Footer'));

import { useAnalytics }      from '@/hooks/use-analytics';
import { waUrl }             from '@/lib/wa-number';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useDwellTime }      from '@/hooks/use-dwell-time';

function SectionSkeleton() {
    return <div aria-hidden="true" style={{ minHeight: '1px' }} />;
}

export default function Landing() {
    const { trackVisit } = useAnalytics();

    useEffect(() => {
        const html    = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        return () => { if (wasDark) html.classList.add('dark'); };
    }, []);

    useScrollTracking();
    useDwellTime();

    useEffect(() => { trackVisit(); }, [trackVisit]);

    return (
        <>
            <Head>
                <title>Full Bright Indonesia – Spesialis TOEFL &amp; IELTS Sejak 2013 | 45.000+ Alumni</title>
                <meta name="description" content="Full Bright Indonesia – Spesialis TOEFL & IELTS Sejak 2013. Metode 30 Jam, 1 Jam 1 Hari. 45.000+ alumni sukses raih skor TOEFL ITP dalam 10–15 hari. Lembaga resmi ITP & IIEF Jakarta." />
                <meta name="keywords" content="belajar TOEFL online, kursus TOEFL ITP, TOEFL LPDP, TOEFL CPNS, TOEFL BUMN, Full Bright Indonesia" />
            </Head>

            <div className="min-h-screen bg-white">
                <UrgencyBanner />
                <Navbar />
                <HeroSection />
                <SocialProofLogoBar />

                <Suspense fallback={<SectionSkeleton />}>
                    <AgitationSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <ValueSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <SocialProofSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <PricingSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <FAQSection />
                </Suspense>
                <Suspense fallback={<SectionSkeleton />}>
                    <Footer />
                </Suspense>

                {/* Floating WhatsApp Button */}
                <a
                    href={waUrl('Halo Admin Full Bright Indonesia. Saya lihat iklan. Saya minat mau daftar kelas TOEFL.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        try {
                            (window as { fbq?: (e: string, n: string, p?: object) => void }).fbq?.(
                                'track', 'Search',
                                { search_string: 'TOEFL Full Bright - WhatsApp Inquiry' },
                            );
                        } catch { /* fbq not loaded */ }
                    }}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
                    style={{ backgroundColor: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.5)' }}
                    aria-label="Chat WhatsApp"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                </a>
            </div>
        </>
    );
}
