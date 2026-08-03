import { api } from './api';
import type { DashboardData } from './dashboard.types';

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/dashboard');

  return data;
}
