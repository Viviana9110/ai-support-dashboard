'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSession, logout } from '@/services/auth.service';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 60_000,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return async function signOut() {
    await logout();

    queryClient.setQueryData(['session'], null);

    await queryClient.invalidateQueries({ queryKey: ['session'] });
  };
}
