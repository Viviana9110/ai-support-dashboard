import type {
  AiConversationSummary,
  Conversation,
} from "./ai.types";

import type { AiMessage } from "@/lib/serializers";
import type { AiMessagePayload } from "@/lib/schemas/ai.schema";

export async function sendMessage(
  conversationId: string,
  message: AiMessagePayload,
): Promise<AiMessage> {
  const response = await fetch(
    `/api/ai/conversations/${conversationId}/messages`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(message),
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to send message.',
    );
  }

  return response.json();
}

export async function getConversations(): Promise<AiConversationSummary[]> {
  const response = await fetch(
    '/api/ai/conversations',
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load conversations.',
    );
  }

  return response.json();
}

export async function getConversation(
  id: string,
): Promise<Conversation> {
  const response = await fetch(
    `/api/ai/conversations/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load conversation.',
    );
  }

  return response.json();
}