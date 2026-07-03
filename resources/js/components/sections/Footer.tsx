import { Mail, MapPin } from 'lucide-react';
import { CS_LIST } from '@/lib/wa-number';

function InstagramIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>; }
function WhatsAppIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>; }

const socialLinks = [
    { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/fullbright_indonesia/' },
];

const navLinks = [
    { label: 'Keunggulan', href: '#value' },
    { label: 'Testimoni',  href: '#testimonials' },
    { label: 'Harga',      href: '#pricing' },
    { label: 'FAQ',        href: '#faq' },
];


export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#151515' }} className="pt-14 pb-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10 mb-10">
                    <div>
                        <div className="mb-4">
                            <img src="/logo/Primary Logo.webp" alt="Full Bright Indonesia" loading="lazy" decoding="async" className="w-40 h-auto object-contain brightness-0 invert" />
                        </div>
                        <p className="text-xs leading-relaxed mb-4" style={{ color: '#9ca3af' }}>
                            SK Kemenkumham RI No. AHU-0055720-AH.0114 Tahun 2020<br />
                            SK LKP No. 503/20177/LKP/DPM-PTSP/8/2024<br />
                            NPSN K9998700 · Kerjasama dengan IIEF Jakarta
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ Icon, label, href }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:brightness-125" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }} aria-label={label}>
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#6b7280' }}>Navigasi</p>
                        <ul className="flex flex-col gap-3">
                            {navLinks.map((l) => (
                                <li key={l.href}><a href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: '#9ca3af' }}>{l.label}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#6b7280' }}>Hubungi Kami</p>
                        <ul className="flex flex-col gap-4">
                            {CS_LIST.map((cs) => (
                                <li key={cs.number} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}><WhatsAppIcon /></div>
                                    <div>
                                        <p className="text-xs font-semibold text-white mb-0.5">{cs.name}</p>
                                        <a href={`https://wa.me/${cs.number}`} className="text-xs hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                            +{cs.number.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}
                                        </a>
                                    </div>
                                </li>
                            ))}
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}><Mail size={15} /></div>
                                <div>
                                    <p className="text-xs font-semibold text-white mb-0.5">Email</p>
                                    <a href="mailto:info@fullbrightindonesia.org" className="text-xs hover:text-white transition-colors" style={{ color: '#9ca3af' }}>info@fullbrightindonesia.org</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}><MapPin size={15} color="#9ca3af" /></div>
                                <div>
                                    <p className="text-xs font-semibold text-white mb-0.5">Alamat</p>
                                    <p className="text-xs" style={{ color: '#9ca3af' }}>Gedung Yotta Signature Perintis, Jl. Perintis Kemerdekaan No.97 Lantai 3, Tamalanrea Jaya, Kec. Tamalanrea, Kota Makassar, Sulawesi Selatan 90245</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-6 flex justify-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
                    <p>© {new Date().getFullYear()} Full Bright Indonesia. Lembaga Resmi TOEFL ITP bekerjasama dengan IIEF Jakarta.</p>
                </div>
            </div>
        </footer>
    );
}
