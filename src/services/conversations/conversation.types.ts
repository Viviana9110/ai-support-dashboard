import type { Customer } from '@/services/customers/customers.types';

export interface Message {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  customer: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  unread: number;
  updatedAt: string;
  messages: Message[];
}

export type ConversationMessage = Message;

export interface ConversationDetail
  extends Omit<Conversation, 'customer' | 'messages'> {
  customer: Customer;
  messages: ConversationMessage[];
}
