'use client';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { AnalyticsOverview } from './analytics-overview';
import { AnalyticsCharts } from './analytics-charts';
import { AnalyticsFilters } from './analytics-filters';
import { AnalyticsPeriod } from '@/services/analytics/analytics.types';
import { AnalyticsSkeleton } from './analytics-skeleton';
import { AnalyticsLoadingIndicator } from './analytics-loading-indicator';

export function AnalyticsClient() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');

  const { data, isLoading, isFetching, error } = useAnalytics(period);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !data) {
    return <p>Unable to load analytics.</p>;
  }

  return (
    <div className="space-y-8">
      <AnalyticsOverview data={data} />
      <AnalyticsFilters period={period} onPeriodChange={setPeriod} />
      {isFetching && <AnalyticsLoadingIndicator />}
      <AnalyticsCharts data={data} />
    </div>
  );
}
