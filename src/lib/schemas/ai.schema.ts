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

export const renameConversationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
});

export type RenameConversationPayload = z.infer<
  typeof renameConversationSchema
>;
