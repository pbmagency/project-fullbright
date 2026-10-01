import { useEffect, useState, memo } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

const FullBrightLogo = memo(() => {
    return (
        <span className="relative block h-12 w-36 overflow-hidden">
            <img
                src="/logo/Logo-Fullbright.webp"
                alt="Full Bright Indonesia"
                width={1080}
                height={1080}
                className="absolute max-w-none object-contain"
                style={{
                    width: 210,
                    height: 210,
                    left: -33,
                    top: -80,
                }}
                fetchPriority="high"
                loading="eager"
                decoding="sync"
            />
        </span>
    );
});

const Navbar = memo(() => {
    const [scrolled, setScrolled] = useState(false);
    const { trackCTA } = useAnalytics();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-gray-100 bg-white/95 shadow-md backdrop-blur-md'
                    : 'border-b border-gray-100 bg-white shadow-sm'
            }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <a href="#" className="flex shrink-0 items-center select-none">
                    <FullBrightLogo />
                </a>

                <a
                    href="#pricing"
                    onClick={() => trackCTA('navbar', 'Amankan Seat', '#pricing')}
                    className="group flex flex-col justify-center gap-px rounded-full bg-[#D70808] px-4 py-[7px] shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
                >
                     <span className="text-[13px] leading-[1.2] font-extrabold whitespace-nowrap text-white">
                        🎓 Amankan Seat
                    </span>

                    <span className="text-[11px] leading-[1.2] font-bold whitespace-nowrap text-white">
                        Kelas Live Zoom (-80%)
                    </span>
                    {/* <span className="flex items-center gap-[5px]">
                        <span className="text-[11px] whitespace-nowrap text-white/55 line-through">
                            Rp1jt
                        </span>
                        <span className="text-sm font-black whitespace-nowrap text-white">
                            Rp190rb
                        </span>
                        <span className="rounded-full bg-amber-500 px-[7px] py-0.5 text-[10px] font-black whitespace-nowrap text-[#151515]">
                            -81%
                        </span>
                    </span> */}
                </a>
            </div>
        </header>
    );
});

export default Navbar;
