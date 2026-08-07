import { z } from 'zod';

export const aiMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']),
});

export type AiMessagePayload = z.infer<typeof aiMessageSchema>;

export const aiChatSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  message: z.string().trim().min(1, 'Message is required'),
});

export type AiChatPayload = z.infer<typeof aiChatSchema>;
