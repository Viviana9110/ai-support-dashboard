import { ChatMessage, Conversation } from "./ai.types";

export const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello 👋 I'm your AI Assistant. How can I help you today?",
    createdAt: new Date(),
  },
];

export const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "Welcome",
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: initialMessages,
  },
];