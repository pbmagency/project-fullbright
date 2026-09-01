'use client'; 

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export default function UrgencyBanner() {
    const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });
    const [mounted, setMounted] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    
    // Initialize analytics
    const { trackCTA } = useAnalytics();

    useEffect(() => {
        setMounted(true);
        // REVERTED BACK TO 12 HOURS
        const DURATION = 12 * 60 * 60 * 1000; 
        const STORAGE_KEY = 'urgency_banner_expiry';

        function updateTimer() {
            let expiry = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
            const now = Date.now();

            if (!expiry) {
                expiry = now + DURATION;
                localStorage.setItem(STORAGE_KEY, expiry.toString());
            }

            const diff = expiry - now;

            if (diff <= 0) {
                setIsExpired(true);
                return; 
            }

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours: h, minutes: m, seconds: s });
        }

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    if (isExpired) return null;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                trackCTA('urgency_banner', 'Click Promo Banner', '#pricing');
                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="sticky top-0 z-[100] flex w-full cursor-pointer items-center justify-center bg-[#D70808] border-none px-4 py-2 transition-colors hover:bg-[#b30606]"
            style={{ fontFamily: 'var(--font-heading)' }}
        >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-[12px] font-[800] tracking-wide text-white sm:gap-x-4 sm:text-[13px]">
                <span className="flex items-center gap-1.5 uppercase">
                    <span>🔥</span>  DISKON KEMERDEKAAN 68% to FLASH SALE SEPTEMBER
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-[2px] text-[#D70808] shadow-sm transition-opacity ${
                        mounted ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <span className="text-gray-400">⏱</span>
                    <span className="font-[900]">
                        BERAKHIR {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                    </span>
                </span>
            </div>
        </button>
    );
}