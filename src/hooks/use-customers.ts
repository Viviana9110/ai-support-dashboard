'use client';

import { useQuery } from '@tanstack/react-query';

import { getCustomers } from '@/services/customers/customers.service';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
}
