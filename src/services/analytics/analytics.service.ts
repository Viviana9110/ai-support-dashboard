import { api } from '../api';
import type { AnalyticsData, AnalyticsPeriod } from './analytics.types';

export async function getAnalytics(
  period: AnalyticsPeriod,
): Promise<AnalyticsData> {
  const { data } = await api.get<AnalyticsData>('/analytics', {
    params: { period },
  });

  return data;
}
