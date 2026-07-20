'use client';

import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@/services/conversations/conversation.service';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
}
