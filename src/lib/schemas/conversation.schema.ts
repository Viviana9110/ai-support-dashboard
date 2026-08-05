import { z } from 'zod';

export const messageSchema = z.object({
  text: z.string().trim().min(1, 'Message text is required'),

  sender: z.enum(['customer', 'agent']),
});

export type SendMessagePayload = z.infer<typeof messageSchema>;
