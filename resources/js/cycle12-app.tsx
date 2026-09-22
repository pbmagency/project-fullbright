import { createRoot } from 'react-dom/client';
import LandingPage from '@/pages/cycle12/LandingPage';

export function mountCycle12App(): void {
    const root = document.getElementById('app');

    if (root) {
        createRoot(root).render(<LandingPage renderCriticalSections={false} />);
    }
}
