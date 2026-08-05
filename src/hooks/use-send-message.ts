'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sendMessage } from '@/services/conversations/conversation.service';
import { formatRelativeTime } from '@/lib/relative-time';

import type {
  Conversation,
  ConversationDetail,
  Message,
} from '@/services/conversations/conversation.types';

interface SendMessageInput {
  conversationId: string;
  sender: Message['sender'];
  text: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, sender, text }: SendMessageInput) =>
      sendMessage(conversationId, { sender, text }),

    onMutate: async ({ conversationId, sender, text }) => {
      const queryKey = ['conversations', conversationId];

      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      const previous = queryClient.getQueryData<ConversationDetail>(queryKey);
      const previousList = queryClient.getQueryData<Conversation[]>([
        'conversations',
      ]);

      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        sender,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      queryClient.setQueryData<ConversationDetail>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          lastMessage: text,
          messages: [...old.messages, optimisticMessage],
        };
      });

      queryClient.setQueryData<Conversation[]>(['conversations'], (old) => {
        if (!old) return old;

        const index = old.findIndex(
          (conversation) => conversation.id === conversationId,
        );

        if (index === -1) return old;

        const updated: Conversation = {
          ...old[index],
          lastMessage: text,
          updatedAt: formatRelativeTime(new Date()),
          ...(sender === 'customer' && { unread: old[index].unread + 1 }),
          messages: [...old[index].messages, optimisticMessage],
        };

        const next = [...old];
        next.splice(index, 1);

        return [updated, ...next];
      });

      return { queryKey, previous, previousList };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }

      if (context?.previousList) {
        queryClient.setQueryData(['conversations'], context.previousList);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.conversationId],
      });
    },
  });
}
