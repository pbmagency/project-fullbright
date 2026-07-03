'use client';

import { lazy, Suspense } from 'react';

const AgitationSection1 = lazy(() => import('@/components/sections/cycle2-test-problem/AgitationSection1'));
const AgitationSection2 = lazy(() => import('@/components/sections/cycle2-test-problem/AgitationSection2'));
const AgitationSection3 = lazy(() => import('@/components/sections/cycle2-test-problem/AgitationSection3'));

// Change this to 1, 2, or 3 to switch versions
const CURRENT_VERSION = 3;

const versionMap = {
    1: AgitationSection1,
    2: AgitationSection2,
    3: AgitationSection3,
};

const SelectedComponent = versionMap[CURRENT_VERSION as keyof typeof versionMap] || AgitationSection1;

export default function AgitationSectionWrapper() {
    return (
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <SelectedComponent />
        </Suspense>
    );
}
