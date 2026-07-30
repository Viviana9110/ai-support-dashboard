import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required'),

  slug: z
    .string()
    .min(3),

  category: z
    .string()
    .min(1),

  status: z.enum([
    'draft',
    'published',
    'archived',
  ]),

  summary: z
    .string()
    .min(10),

  tags: z.array(z.string()),
});

export type ArticleFormData =
  z.infer<typeof articleSchema>;