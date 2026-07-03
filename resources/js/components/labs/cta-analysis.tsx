import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercent, toSafeArray } from '@/lib/safe-data';
import type { CtaAnalysisProps, CtaLocation } from '@/types/analytics';
import { MousePointerClick, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function CtaAnalysis({ data }: CtaAnalysisProps) {
    const safeData = toSafeArray(data);

    // Sort data: LP level by total leads, CTA level by leads
    const sortedData = useMemo(() => {
        return [...safeData]
            .map((lp) => {
                const locations = toSafeArray<CtaLocation>(lp.cta_locations);
                return {
                    ...lp,
                    cta_locations: [...locations].sort((a, b) => (b.leads ?? 0) - (a.leads ?? 0)),
                    total_leads: locations.reduce((sum, cta) => sum + (cta.leads ?? 0), 0),
                    total_clicks: locations.reduce((sum, cta) => sum + (cta.click_count ?? 0), 0),
                };
            })
            .sort((a, b) => b.total_leads - a.total_leads);
    }, [safeData]);

    if (safeData.length === 0) {
        return (
            <Card className="py-12 text-center">
                <CardContent>
                    <MousePointerClick className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
                    <p className="text-muted-foreground">No CTA performance data available</p>
                </CardContent>
            </Card>
        );
    }

    const formatLocation = (location: string) => {
        return location
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <MousePointerClick className="text-primary h-5 w-5" />
                <div>
                    <h2 className="text-foreground text-xl font-semibold">CTA Performance</h2>
                    <p className="text-muted-foreground text-sm">Button placement attribution sorted by leads</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Micro-Conversion Attribution</CardTitle>
                    <CardDescription>Which button placements generate the most leads?</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground p-4 text-left font-medium">Landing Page</th>
                                    <th className="text-muted-foreground p-4 text-left font-medium">Button Location</th>
                                    <th className="text-muted-foreground p-4 text-right font-medium">Clicks</th>
                                    <th className="text-muted-foreground p-4 text-right font-medium">Leads</th>
                                    <th className="text-muted-foreground p-4 text-right font-medium">Lead Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((lp) =>
                                    lp.cta_locations.map((cta, ctaIndex) => {
                                        const isTopCta = ctaIndex === 0 && (cta.leads ?? 0) > 0;
                                        const showLpName = ctaIndex === 0;

                                        return (
                                            <tr
                                                key={`${lp.landing_source}-${cta.location}`}
                                                className="border-border hover:bg-muted/50 border-b transition"
                                            >
                                                <td className="p-4">
                                                    {showLpName ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-foreground font-mono font-medium">
                                                                {lp.landing_source}
                                                            </span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {lp.cta_locations.length} CTAs
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">↳</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={isTopCta ? 'text-primary font-semibold' : 'text-foreground'}>
                                                            {formatLocation(cta.location)}
                                                        </span>
                                                        {isTopCta && (
                                                            <Badge variant="default" className="bg-chart-4 text-foreground gap-1 text-xs">
                                                                <TrendingUp className="h-3 w-3" /> Top
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-foreground p-4 text-right">
                                                    {(cta.click_count ?? 0).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={isTopCta ? 'text-chart-4 font-bold' : 'text-foreground'}>
                                                        {(cta.leads ?? 0).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Badge variant={(cta.lead_rate ?? 0) > 5 ? 'default' : 'outline'}>
                                                        {formatPercent(cta.lead_rate, 2)}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    }),
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 lg:hidden">
                        {sortedData.map((lp) => (
                            <div key={lp.landing_source} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground font-mono font-medium">{lp.landing_source}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {lp.total_leads} leads
                                    </Badge>
                                </div>
                                <div className="bg-muted/50 space-y-2 rounded-lg p-3">
                                    {lp.cta_locations.map((cta, index) => {
                                        const isTop = index === 0 && (cta.leads ?? 0) > 0;
                                        return (
                                            <div
                                                key={cta.location}
                                                className={`flex items-center justify-between rounded-md p-2 ${isTop ? 'bg-chart-4/20' : ''}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isTop && <TrendingUp className="text-chart-4 h-3 w-3" />}
                                                    <span className={isTop ? 'text-foreground font-medium' : 'text-muted-foreground text-sm'}>
                                                        {formatLocation(cta.location)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-muted-foreground">{cta.click_count ?? 0} clicks</span>
                                                    <span className={isTop ? 'text-chart-4 font-bold' : 'text-foreground'}>
                                                        {cta.leads ?? 0} leads
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
