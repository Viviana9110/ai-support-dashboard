'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createConversation,
  clearConversation,
  deleteConversation,
  getConversation,
  getConversations,
  renameConversation,
  sendMessage,
} from "@/services/ai/chat.service";

import type { AiConversationSummary, Conversation } from "@/services/ai/ai.types";

export function useAiConversations() {
  return useQuery({
    queryKey: ["ai-conversations"],
    queryFn: getConversations,
  });
}

export function useAiConversation(id: string) {
  return useQuery({
    queryKey: ["ai-conversations", id],
    queryFn: () => getConversation(id),
    enabled: id.length > 0,
  });
}

export function useCreateAiConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: string | { title: string; customerId?: string | null }) =>
      createConversation(payload),

    onSuccess: (created) => {
      queryClient.setQueryData<AiConversationSummary[]>(
        ["ai-conversations"],
        (previous = []) => [created, ...previous.filter((item) => item.id !== created.id)],
      );
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations"],
      });
    },
  });
}

export function useAiSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      content,
    }: {
      id: string;
      content: string;
      role: "user" | "assistant";
    }) => sendMessage({ conversationId: id, message: content }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations", variables.id],
      });
    },
  });
}

export function useRenameAiConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      customerId,
    }: {
      id: string;
      title: string;
      customerId?: string | null;
    }) => renameConversation(id, title, customerId),

    onSuccess: (updated) => {
      queryClient.setQueryData<AiConversationSummary[]>(
        ["ai-conversations"],
        (previous = []) => previous.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
      queryClient.setQueryData<Conversation>(
        ["ai-conversations", updated.id],
        (previous) => previous ? { ...previous, ...updated } : previous,
      );
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations"],
      });
    },
  });
}

export function useDeleteAiConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteConversation(id),

    onSuccess: (_result, id) => {
      queryClient.setQueryData<AiConversationSummary[]>(
        ["ai-conversations"],
        (previous = []) => previous.filter((item) => item.id !== id),
      );
      queryClient.removeQueries({
        queryKey: ["ai-conversations", id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations"],
      });
    },
  });
}

export function useClearAiConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clearConversation(id),

    onSuccess: (_result, id) => {
      queryClient.setQueryData<Conversation>(
        ["ai-conversations", id],
        (previous) => previous
          ? {
              ...previous,
              messages: [],
              messageCount: 0,
              lastMessage: null,
              lastMessageRole: null,
            }
          : previous,
      );
      queryClient.setQueryData<AiConversationSummary[]>(
        ["ai-conversations"],
        (previous = []) => previous.map((item) =>
          item.id === id
            ? {
                ...item,
                messageCount: 0,
                lastMessage: null,
                lastMessageRole: null,
              }
            : item,
        ),
      );
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations"],
      });
    },
  });
}
