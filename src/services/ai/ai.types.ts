export type MessageRole =
  | "user"
  | "assistant"
  | "system";

export interface AiConversationSummary {
  id: string;
  title: string;
  customerId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  lastMessageRole: MessageRole | null;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  customerId: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatConversation {
  id: string;
  title: string;

  createdAt: string;

  messages: ChatMessage[];

  messageCount?: number;

  lastMessage?: string | null;

  lastMessageRole?: MessageRole | null;

  pinned?: boolean;

  favorite?: boolean;
}
