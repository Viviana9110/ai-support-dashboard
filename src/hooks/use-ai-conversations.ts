'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  renameConversation,
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

export function useCreateAiConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createConversation(title),

    onSuccess: () => {
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
    }: {
      id: string;
      title: string;
    }) => renameConversation(id, title),

    onSuccess: () => {
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ai-conversations"],
      });
    },
  });
}
