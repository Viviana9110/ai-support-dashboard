import { z } from 'zod';

export const aiMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']),
});

export type AiMessagePayload = z.infer<typeof aiMessageSchema>;
