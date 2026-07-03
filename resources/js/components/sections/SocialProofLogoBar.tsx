const logos = [
    { src: '/logo/Kompas-Com.webp', alt: 'Kompas TV' },
    { src: '/logo/liputan6.webp', alt: 'Liputan6' },
    { src: '/logo/detikcom.webp', alt: 'Detik.com' },
    { src: '/logo/TribunJakartaLogo.webp', alt: 'Tribun Jakarta', scale: 1.4 },
    { src: '/logo/Poskota.webp', alt: 'Poskota', scale: 1.5 },
    { src: '/logo/BeritaSatu2.webp', alt: 'Berita Satu' },
];

export default function SocialProofLogoBar() {
    return (
        <div
            className="w-full px-4 py-8"
            style={{
                backgroundColor: '#F9F9F9',
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            <p
                className="mb-6 text-center text-xs font-bold tracking-widest uppercase"
                style={{ color: '#9ca3af' }}
            >
                Dipercaya & Diliput Media Nasional
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
                {logos.map((logo) => (
                    <div
                        key={logo.alt}
                        className="flex items-center justify-center"
                        style={{ width: '110px', height: '36px' }}
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            loading="lazy"
                            className="h-auto max-h-full w-auto max-w-full object-contain select-none"
                            loading="lazy"
                            decoding="async"
                            style={{
                                filter: 'grayscale(100%)',
                                opacity: 0.6,
                                transform: logo.scale
                                    ? `scale(${logo.scale})`
                                    : undefined,
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
