import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),

  slug: z
    .string()
    .min(3)
    .max(200, 'Slug must be 200 characters or less'),

  category: z
    .string()
    .min(1)
    .max(100, 'Category must be 100 characters or less'),

  status: z.enum([
    'draft',
    'published',
    'archived',
  ]),

  summary: z
    .string()
    .min(10)
    .max(500, 'Summary must be 500 characters or less'),

  content: z
    .string()
    .min(10, 'Content is required')
    .max(20_000, 'Content must be 20,000 characters or less'),

  tags: z
    .array(z.string().max(50, 'Tags must be 50 characters or less'))
    .max(20, 'Too many tags'),
});

export type ArticleFormData =
  z.infer<typeof articleSchema>;

export const knowledgeArticleCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),

  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .optional(),

  category: z
    .string()
    .trim()
    .min(1, 'Category is required')
    .max(100, 'Category must be 100 characters or less'),

  summary: z
    .string()
    .trim()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary must be 500 characters or less')
    .optional(),

  status: z
    .string()
    .trim()
    .max(20, 'Invalid status')
    .optional(),

  content: z
    .string()
    .max(20_000, 'Content must be 20,000 characters or less')
    .optional(),

  views: z
    .number()
    .int('Views must be a whole number')
    .min(0, 'Views must be a non-negative integer')
    .optional(),

  authorId: z.uuid('Invalid author').optional(),
});

export type KnowledgeArticleCreatePayload = z.infer<
  typeof knowledgeArticleCreateSchema
>;

export const knowledgeArticleUpdateSchema =
  knowledgeArticleCreateSchema.partial();

export type KnowledgeArticleUpdatePayload = z.infer<
  typeof knowledgeArticleUpdateSchema
>;