import { ChatConversation } from "./ai.types";

export const conversations: ChatConversation[] = [
  {
    id: crypto.randomUUID(),
    title: "New Chat",
    createdAt: new Date(),
    messages: [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hello 👋 I'm your AI Assistant. How can I help you today?",
        createdAt: new Date(),
      },
    ],
  },
];