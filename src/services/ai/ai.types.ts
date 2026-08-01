export type MessageRole =
  | "user"
  | "assistant";

export interface ChatMessage {
 id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;  
  messages: ChatMessage[];
}

export interface ChatConversation {
  id: string;
  title: string;

  createdAt: Date;

  messages: ChatMessage[];

  pinned?: boolean;

  favorite?: boolean;
}