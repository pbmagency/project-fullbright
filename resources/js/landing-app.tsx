import { createRoot } from 'react-dom/client';
import LandingPage from '@/pages/cycle12/LandingPage';

// Cycle 12 does not consume the Inertia router or page context. Rendering the
// component directly avoids shipping the SPA runtime on this public page.
const root = document.getElementById('app');

if (root) {
    createRoot(root).render(<LandingPage />);
}
