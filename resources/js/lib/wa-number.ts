const CS_LIST = [
    { name: 'Mr. Choiri', number: '6288744875322', weight: 40 },
    { name: 'Ms. Fini', number: '6285255499299', weight: 30 },
    { name: 'Ms. Aini', number: '6281959486507', weight: 30 },
];

export function pickNumber(): string {
    const rand = Math.random() * 100;
    let cumulative = 0;

    for (const cs of CS_LIST) {
        cumulative += cs.weight;

        if (rand < cumulative) {
            return cs.number;
        }
    }

    return CS_LIST[0].number;
}

// Default untuk halaman lama: dipilih sekali saat halaman dimuat.
export const WA_NUMBER = pickNumber();

export function waUrl(text: string): string {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export { CS_LIST };
