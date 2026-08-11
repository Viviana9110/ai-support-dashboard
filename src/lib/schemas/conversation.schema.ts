import { z } from 'zod';

export const messageSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Message text is required')
    .max(4000, 'Message must be 4000 characters or less'),

  sender: z.enum(['customer', 'agent']),
});

export type SendMessagePayload = z.infer<typeof messageSchema>;

const dbMessageSchema = z.object({
  sender: z.enum(['CUSTOMER', 'AGENT', 'SYSTEM']),

  text: z
    .string()
    .trim()
    .min(1, 'Message text is required')
    .max(4000, 'Message must be 4000 characters or less'),
});

export const conversationCreateSchema = z.object({
  customerId: z.uuid('A valid customer is required'),

  avatar: z
    .string()
    .max(500, 'Avatar must be 500 characters or less')
    .optional(),

  online: z.boolean().optional(),

  unread: z.number().int().min(0).max(99999).optional(),

  lastMessage: z
    .string()
    .max(500, 'Last message must be 500 characters or less')
    .optional(),

  messages: z
    .array(dbMessageSchema)
    .max(200, 'Too many messages')
    .optional(),
});

export type ConversationCreatePayload = z.infer<
  typeof conversationCreateSchema
>;
