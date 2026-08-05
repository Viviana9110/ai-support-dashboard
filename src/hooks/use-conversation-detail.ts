'use client';

import { useQuery } from '@tanstack/react-query';

import { getConversationDetail } from '@/services/conversations/conversation.service';

export function useConversationDetail(id: string) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversationDetail(id),
  });
}
