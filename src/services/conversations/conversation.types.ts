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
  messages: Message[];
}
