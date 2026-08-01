import { useState } from "react";

import { conversations as initial } from "@/services/ai/conversations.mock";
import { ChatConversation } from "@/services/ai/ai.types";

export function useConversations() {
  const [conversations, setConversations] =
    useState<ChatConversation[]>(initial);

  function createConversation() {
    const conversation: ChatConversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
    };

    setConversations((previous) => [
      conversation,
      ...previous,
    ]);

    return conversation.id;
  }

  function renameConversation(
  id: string,
  title: string,
) {
  setConversations(previous =>
    previous.map(conversation =>
      conversation.id === id
        ? {
            ...conversation,
            title,
          }
        : conversation,
    ),
  );
}

function deleteConversation(id: string) {
  setConversations(previous =>
    previous.filter(
      conversation =>
        conversation.id !== id,
    ),
  );
}

function toggleFavorite(id: string) {
  setConversations(previous =>
    previous.map(conversation =>
      conversation.id === id
        ? {
            ...conversation,
            favorite:
              !conversation.favorite,
          }
        : conversation,
    ),
  );
}

function togglePinned(id: string) {
  setConversations(previous =>
    previous.map(conversation =>
      conversation.id === id
        ? {
            ...conversation,
            pinned:
              !conversation.pinned,
          }
        : conversation,
    ),
  );
}

function duplicateConversation(
  id: string,
) {
  const original =
    conversations.find(
      conversation =>
        conversation.id === id,
    );

  if (!original) return;

  const copy = {
    ...original,
    id: crypto.randomUUID(),
    title: `${original.title} Copy`,
    createdAt: new Date(),
  };

  setConversations(previous => [
    copy,
    ...previous,
  ]);
}



  return {
    conversations,
    setConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    toggleFavorite,
    togglePinned,
    duplicateConversation,
  };
}