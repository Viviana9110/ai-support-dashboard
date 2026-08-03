import { api } from '../api';
import type { Conversation, Message } from './conversation.types';

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/conversations');

  return data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const { data } = await api.get<Conversation>(`/conversations/${id}`);

  return data;
}

export async function sendMessage(
  conversationId: string,
  message: Pick<Message, 'sender' | 'text'>,
): Promise<Message> {
  const { data } = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    message,
  );

  return data;
}
