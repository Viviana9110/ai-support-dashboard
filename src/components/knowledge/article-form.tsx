'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  articleSchema,
  ArticleFormData,
} from '@/lib/schemas/article.schema';

import { defaultArticle } from '@/constants/article';

import { KnowledgeArticle } from '@/services/knowledge/knowledge.types';

interface Props {
  article?: KnowledgeArticle;

  isSubmitting?: boolean;

  onSubmit: (
    data: ArticleFormData,
  ) => void;
}

export function ArticleForm({
  article,
  isSubmitting = false,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultArticle,
  });

  useEffect(() => {
    if (!article) {
      reset(defaultArticle);
      return;
    }

    reset({
      title: article.title,
      slug: article.slug,
      category: article.category,
      status: article.status,
      summary: article.summary ?? '',
      content: article.content ?? '',
      tags: [],
    });
  }, [article, reset]);

  const title = watch('title');

  useEffect(() => {
    if (!article) {
      setValue(
        'slug',
        title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
      );
    }
  }, [title, article, setValue]);

  return (
    <form
  onSubmit={handleSubmit(
    (data) => {
      onSubmit(data);
    },
  )}
  className="space-y-6"
>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <Input {...register('title')} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Slug
        </label>

        <Input {...register('slug')} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <Input
            {...register('category')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            {...register('status')}
            className="border-border bg-background h-10 w-full rounded-lg border px-3"
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>

            <option value="archived">
              Archived
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Summary
        </label>

        <textarea
          {...register('summary')}
          rows={4}
          className="border-border bg-background w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Content
        </label>

        <textarea
          {...register('content')}
          rows={8}
          className="border-border bg-background w-full rounded-lg border p-3"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Save Article
        </Button>
      </div>
    </form>
  );
}