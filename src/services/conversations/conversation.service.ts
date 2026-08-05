import { api } from '../api';
import type { Conversation, ConversationDetail, Message } from './conversation.types';
import type { SendMessagePayload } from '@/lib/schemas/conversation.schema';

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/conversations');

  return data;
}

export async function getConversationDetail(id: string): Promise<ConversationDetail> {
  const { data } = await api.get<ConversationDetail>(`/conversations/${id}`);

  return data;
}

export async function sendMessage(
  conversationId: string,
  message: SendMessagePayload,
): Promise<Message> {
  const { data } = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    message,
  );

  return data;
}
