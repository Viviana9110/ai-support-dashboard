import { z } from 'zod';

export const aiMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(4000, 'Message must be 4000 characters or less'),
  role: z.enum(['user', 'assistant']),
});

export type AiMessagePayload = z.infer<typeof aiMessageSchema>;

export const aiChatSchema = z.object({
  conversationId: z
    .string()
    .min(1, 'Conversation ID is required')
    .max(100, 'Conversation ID is invalid'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(4000, 'Message must be 4000 characters or less'),
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

export const AI_STREAM_MODELS = [
  'GPT-5',
  'GPT-5 Mini',
  'Claude Sonnet',
  'Gemini 2.5 Pro',
] as const;

export const aiStreamChatSchema = z.object({
  conversationId: z.uuid(
    'Conversation ID must be a valid UUID',
  ),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(
      4000,
      'Message must be 4000 characters or less',
    ),
  assistant: z
    .enum(
      [
        'Customer Support AI',
        'Sales Assistant',
        'Technical Support',
      ],
      { error: 'Invalid assistant.' },
    )
    .default('Customer Support AI'),
  model: z
    .enum(AI_STREAM_MODELS, {
      error: 'Invalid model.',
    })
    .optional(),
  temperature: z
    .number({
      error: 'Temperature must be a number',
    })
    .min(
      0,
      'Temperature must be between 0 and 2',
    )
    .max(
      2,
      'Temperature must be between 0 and 2',
    )
    .default(0.7),
});

export type AiStreamChatPayload = z.infer<
  typeof aiStreamChatSchema
>;
