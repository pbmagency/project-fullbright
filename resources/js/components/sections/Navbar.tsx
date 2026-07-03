import { useEffect, useState, memo } from 'react';
import LpButton from '@/components/ui/lp-button';

const FullBrightLogo = memo(() => {
    return (
        <img
            src="/logo/Primary Logo.webp"
            alt="Full Bright Indonesia"
            width={160}
            height={48}
            className="h-auto w-40 object-contain"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
        />
    );
});

const Navbar = memo(() => {
    const [scrolled, setScrolled] = useState(false);

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
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
                {/* Logo */}
                <a href="#" className="flex shrink-0 items-center select-none">
                    <FullBrightLogo />
                </a>

                <a
                    href="#pricing"
                    className="group flex items-center gap-0 overflow-hidden rounded-full bg-gradient-to-r from-red-700 to-red-800 shadow-lg transition-all duration-200 hover:from-red-800 hover:to-red-900 hover:shadow-xl"
                >
                    {/* Bagian kiri: info produk */}
                    <div className="flex flex-col justify-center px-3 py-1.5 leading-tight sm:px-4 sm:py-2">
                        {/* Baris atas: ikon + nama produk */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-base leading-none sm:text-lg">
                                🎓
                            </span>
                            <span className="max-w-[90px] truncate text-[11px] font-semibold text-white sm:max-w-[140px] sm:text-xs md:max-w-none md:text-sm">
                                Amankan Seat
                            </span>
                        </div>
                        {/* Baris bawah: harga */}
                        <div className="mt-0.5 flex items-center gap-1">
                            <span className="text-[10px] font-medium text-white/90 sm:text-[11px]">
                                Rp250rb
                            </span>
                            <span className="text-[10px] text-white/60">•</span>
                            <span className="text-[10px] text-white/80 sm:text-[11px]">
                                Hemat Rp750rb
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-0 w-px self-stretch bg-white/25" />

                    {/* Bagian kanan: tombol Beli */}
                    <div className="hidden shrink-0 items-center justify-center px-2 py-1.5 transition-colors duration-200 sm:flex sm:px-3 sm:py-2">
                        <span className="text-[11px] font-bold whitespace-nowrap text-white transition-transform group-hover:translate-x-0.5 sm:text-sm">
                            Ambil →
                        </span>
                    </div>
                </a>
            </div>
        </header>
    );
});

export default Navbar;
