'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getConversation,
  getConversations,
  sendMessage,
} from "@/services/ai/chat.service";

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

export function useAiSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      content,
      role,
    }: {
      id: string;
      content: string;
      role: "user" | "assistant";
    }) => sendMessage(id, { content, role }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations", variables.id],
      });
    },
  });
}
