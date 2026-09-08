import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function RichAppProviders({ children }: { children: ReactNode }) {
    return (
        <TooltipProvider delayDuration={0}>
            {children}
            <Toaster />
        </TooltipProvider>
    );
}
