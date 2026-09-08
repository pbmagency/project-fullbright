import { lazy, Suspense, type ReactNode } from 'react';

const RichAppProviders = lazy(() => import('@/components/rich-app-providers'));

export default function AppProviders({
    children,
    lean = false,
}: {
    children: ReactNode;
    lean?: boolean;
}) {
    if (lean) {
        return children;
    }

    return (
        <Suspense fallback={children}>
            <RichAppProviders>{children}</RichAppProviders>
        </Suspense>
    );
}
