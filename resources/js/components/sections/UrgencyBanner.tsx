import { useFlashSaleTitle } from '@/lib/flash-sale-title';

export default function UrgencyBanner() {
    const flashSaleTitle = useFlashSaleTitle();

    return (
        <div className="w-full py-2 px-4 text-center text-sm font-bold tracking-wide" style={{ backgroundColor: '#D70808', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            ⏳ {flashSaleTitle}
        </div>
    );
}
