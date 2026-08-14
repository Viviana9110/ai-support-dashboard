import { z } from 'zod';

import {
  AI_ASSISTANTS,
  AI_STREAM_MODELS,
  DEFAULT_AI_ASSISTANT,
  DEFAULT_AI_TEMPERATURE,
} from '@/lib/ai/model-config';

export const aiMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(4000, 'Message must be 4000 characters or less'),
  role: z.literal('user'),
});

export type AiMessagePayload = z.infer<typeof aiMessageSchema>;

export const aiChatSchema = z.object({
  conversationId: z
    .uuid('Conversation ID must be a valid UUID'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(4000, 'Message must be 4000 characters or less'),
  assistant: z.enum(AI_ASSISTANTS).default(DEFAULT_AI_ASSISTANT),
  model: z.enum(AI_STREAM_MODELS).optional(),
  temperature: z
    .number({ error: 'Temperature must be a number' })
    .min(0, 'Temperature must be between 0 and 2')
    .max(2, 'Temperature must be between 0 and 2')
    .default(DEFAULT_AI_TEMPERATURE),
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
  assistant: z.enum(AI_ASSISTANTS, {
    error: 'Invalid assistant.',
  }).default(DEFAULT_AI_ASSISTANT),
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
    .default(DEFAULT_AI_TEMPERATURE),
});

export type AiStreamChatPayload = z.infer<
  typeof aiStreamChatSchema
>;
