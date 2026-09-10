import { memo } from 'react';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';
import { waUrl } from '@/lib/wa-number';

const WA_MESSAGE = 'Halo Admin Full Bright Indonesia. Saya tertarik daftar kelas TOEFL Online.';

export default memo(function AgitationSection2() {
    const { trackCTA } = useAnalytics();

    return (
        <section
            id="agitation"
            style={{ backgroundColor: '#F3F3F3' }}
            className="px-4 py-12 sm:py-16"
        >
            <div className="mx-auto max-w-4xl">
                {/* Eyebrow */}
                <p
                    className="mb-3 text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ color: '#6b7280' }}
                >
                    Tahukah Kamu?
                </p>

                {/* Headline */}
                <h2
                    className="mb-3 text-[clamp(26px,5vw,42px)] font-black leading-[1.15]"
                    style={{ color: '#151515', fontFamily: 'var(--font-heading)' }}
                >
                    Banyak belajar TOEFL, skor<br />
                    tetap di tempat.
                </h2>

                {/* Sub-copy */}
                <p className="mb-8 max-w-xl text-base leading-relaxed" style={{ color: '#4b5563' }}>
                    Banyak yang sudah beli buku, ikut les, bahkan belajar bertahun-tahun — tapi
                    skor TOEFL-nya tidak bergerak karena tidak tahu{' '}
                    <strong style={{ color: '#151515' }}>strategi yang tepat.</strong>
                </p>

                {/* Two-column comparison cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    {/* Left card — "Kalau belajar sendiri" */}
                    <div
                        className="rounded-2xl border p-6"
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e5e7eb',
                        }}
                    >
                        <p
                            className="mb-4 text-sm font-semibold"
                            style={{ color: '#6b7280' }}
                        >
                            Kalau belajar sendiri
                        </p>
                        <ol className="space-y-3">
                            {[
                                'Beli buku dan belajar dari YouTube.',
                                'Tebak-tebak strategi sendiri.',
                                'Tes, tapi skornya stagnan.',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                        style={{
                                            backgroundColor: '#f3f4f6',
                                            color: '#9ca3af',
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-6 border-t pt-4" style={{ borderColor: '#f3f4f6' }}>
                            <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                                Capek belajar, skor tidak naik-naik.
                            </p>
                        </div>
                    </div>

                    {/* Right card — "Kalau pakai Full Bright" */}
                    <div
                        className="rounded-2xl p-6"
                        style={{ backgroundColor: '#151515' }}
                    >
                        <p
                            className="mb-4 text-sm font-semibold"
                            style={{ color: 'rgba(255,255,255,0.65)' }}
                        >
                            Kalau pakai Full Bright
                        </p>
                        <ol className="space-y-3">
                            {[
                                'Cerita target skor dan timeline-mu ke tutor.',
                                'Dapat roadmap belajar 15 hari yang personal.',
                                'Tes, dan skor naik sesuai target.',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.12)',
                                            color: '#F5B700',
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span
                                        className="text-sm leading-relaxed"
                                        style={{ color: 'rgba(255,255,255,0.88)' }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <div
                            className="mt-6 border-t pt-4"
                            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            <p className="text-sm font-bold" style={{ color: '#ffffff' }}>
                                Dipandu tutor berpengalaman, bukan tebak-tebak sendiri.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <LpButton
                        href={waUrl(WA_MESSAGE)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="whatsapp"
                        size="md"
                        fullWidth
                        className="rounded-[16px] py-4 text-[16px]"
                        onClick={() =>
                            trackCTA(
                                'agitation_primary',
                                'Konsultasi Gratis',
                                waUrl(WA_MESSAGE),
                            )
                        }
                    >
                        {/* WhatsApp icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        </svg>
                        <strong>Konsultasi Gratis →</strong>
                    </LpButton>

                    <LpButton
                        href="#pricing"
                        variant="ghost"
                        size="md"
                        fullWidth
                        className="rounded-[16px] py-4 text-[16px]"
                        onClick={() =>
                            trackCTA('agitation_secondary', 'Lihat Program', '#pricing')
                        }
                    >
                        Lihat Program →
                    </LpButton>
                </div>

                {/* Social proof micro strip */}
                <SocialProofMicro />
            </div>
        </section>
    );
});
