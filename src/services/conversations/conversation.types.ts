export interface Message {
  id: number;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  customer: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  unread: number;
  messages: Message[];
}
