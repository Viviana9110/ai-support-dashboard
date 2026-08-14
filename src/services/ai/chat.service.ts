import type {
  AiConversationSummary,
  Conversation,
} from './ai.types';

import type { AiMessage } from '@/lib/serializers';

export interface SendMessageResponse {
  userMessage: AiMessage;
  assistantMessage: AiMessage;
}

export async function sendMessage(payload: {
  conversationId: string;
  message: string;
}): Promise<SendMessageResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',

    headers: {
      'Content-Type':
        'application/json',
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      'Unable to send message.',
    );
  }

  return response.json();
}

export async function createConversation(
  payload: string | { title: string; customerId?: string | null },
): Promise<AiConversationSummary> {
  const response = await fetch(
    '/api/ai/conversations',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(
        typeof payload === 'string' ? { title: payload } : payload,
      ),
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to create conversation.',
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

export async function renameConversation(
  id: string,
  title: string,
  customerId?: string | null,
): Promise<AiConversationSummary> {
  const response = await fetch(
    `/api/ai/conversations/${id}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({ title, ...(customerId !== undefined ? { customerId } : {}) }),
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to rename conversation.',
    );
  }

  return response.json();
}

export async function deleteConversation(
  id: string,
): Promise<{ success: boolean }> {
  const response = await fetch(
    `/api/ai/conversations/${id}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to delete conversation.',
    );
  }

  return response.json();
}

export async function clearConversation(
  id: string,
): Promise<{ success: boolean; deletedMessages: number }> {
  const response = await fetch(
    `/api/ai/conversations/${id}/messages`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw new Error('Unable to clear conversation.');
  }

  return response.json();
}
