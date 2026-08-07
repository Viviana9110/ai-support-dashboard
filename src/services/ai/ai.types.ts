export type MessageRole =
  | "user"
  | "assistant"
  | "system";

export interface AiConversationSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage: string | null;
  lastMessageRole: MessageRole | null;
}

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

  messageCount?: number;

  lastMessage?: string | null;

  lastMessageRole?: MessageRole | null;

  pinned?: boolean;

  favorite?: boolean;
}