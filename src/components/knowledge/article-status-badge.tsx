'use client';

import { Badge } from '@/components/ui/badge';

import { ArticleStatus } from '@/services/knowledge/knowledge.types';

interface Props {
  status: ArticleStatus;
}

export function ArticleStatusBadge({ status }: Props) {
  switch (status) {
    case 'published':
      return (
        <Badge className="bg-green-500 hover:bg-green-500">
          Published
        </Badge>
      );

    case 'draft':
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      );

    case 'archived':
      return (
        <Badge variant="destructive">
          Archived
        </Badge>
      );

    default:
      return null;
  }
}