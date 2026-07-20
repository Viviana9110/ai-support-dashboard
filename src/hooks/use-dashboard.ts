'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/dashboard.service';

export function useDashboard() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
