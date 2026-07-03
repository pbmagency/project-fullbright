import { ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

// Variant ID: c3-problem-1
// Cycle: 3 | Role: Challenger

const beforeItems = [
    '"Belajar beberapa hari pasti cukup."',
    '"Nonton YouTube aja bisa."',
    '"Kerjakan soal sebanyak mungkin."',
];

const afterItems = [
    'Materinya jauh lebih banyak dari perkiraan.',
    'Sudah belajar berminggu-minggu, skor masih tidak bergerak.',
    'Tidak tahu harus fokus ke mana.',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-14 md:py-20">
            <div className="mx-auto max-w-2xl">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>😅</span> Awalnya Kirain TOEFL Gampang...
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-3 text-2xl leading-tight font-black sm:text-3xl md:mb-4 md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Banyak Orang Baru Sadar Sulitnya TOEFL{' '}
                        <span style={{ color: '#D70808' }}>
                            Setelah Mulai Belajar.
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="mx-auto max-w-xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Yang awalnya dikira mudah, ternyata membutuhkan
                        persiapan yang jauh lebih matang.
                    </p>
                </div>

                {/* Before / After Block */}
                <div
                    className="mb-10 overflow-hidden rounded-2xl md:mb-12"
                    style={{ border: '1px solid #e0e0e0' }}
                >
                    {/* "Before" Column */}
                    <div
                        style={{ backgroundColor: '#ffffff' }}
                        className="p-5 md:p-7"
                    >
                        <p
                            className="mb-4 text-xs font-bold tracking-widest uppercase"
                            style={{ color: '#9a9a9a' }}
                        >
                            Mungkin Awalnya berpikir...
                        </p>
                        <ul className="space-y-3">
                            {beforeItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
                                        style={{
                                            backgroundColor: '#FFF0F0',
                                            color: '#D70808',
                                        }}
                                    >
                                        ✗
                                    </span>
                                    <p
                                        className="text-sm leading-snug font-medium sm:text-base"
                                        style={{ color: '#3d3d3d' }}
                                    >
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Divider */}
                    <div
                        className="flex items-center gap-3 px-5 py-3 md:px-7"
                        style={{
                            backgroundColor: '#F7F7F7',
                            borderTop: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: '#e0e0e0' }}
                        />
                        <span
                            className="flex-shrink-0 text-xs font-bold tracking-widest uppercase"
                            style={{ color: '#9a9a9a' }}
                        >
                            Setelah dijalani...
                        </span>
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: '#e0e0e0' }}
                        />
                    </div>

                    {/* "After" Column */}
                    <div
                        style={{ backgroundColor: '#FFFAFA' }}
                        className="p-5 md:p-7"
                    >
                        <ul className="space-y-3">
                            {afterItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
                                        style={{
                                            backgroundColor: '#FFE0E0',
                                            color: '#D70808',
                                        }}
                                    >
                                        !
                                    </span>
                                    <p
                                        className="text-sm leading-snug font-medium sm:text-base"
                                        style={{ color: '#3d3d3d' }}
                                    >
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-3 text-center">
                    <p
                        className="text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Kabar baiknya, masih ada kesempatan kamu mencapai target
                        skor.
                    </p>
                    <p
                        className="text-base leading-relaxed font-semibold"
                        style={{ color: '#151515' }}
                    >
                        Selama kamu mulai sekarang dengan metode yang tepat
                    </p>

                    <div className="flex justify-center pt-2">
                        <ArrowDown size={22} style={{ color: '#D70808' }} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
