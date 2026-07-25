'use client';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { AnalyticsOverview } from './analytics-overview';
import { AnalyticsCharts } from './analytics-charts';
import { AnalyticsFilters } from './analytics-filters';
import { AnalyticsPeriod } from '@/services/analytics/analytics.types';

export function AnalyticsClient() {
  const { data, isLoading, error } = useAnalytics();

  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  if (error || !data) {
    return <p>Unable to load analytics.</p>;
  }

  return (
    <div className="space-y-8">
      <AnalyticsOverview data={data} />
      <AnalyticsFilters
  period={period}
  onPeriodChange={setPeriod}
/>
      <AnalyticsCharts data={data} />
    </div>
  );
}
