'use client';

import {
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { KnowledgeArticle } from '@/services/knowledge/knowledge.types';

import { ArticleStatusBadge } from './article-status-badge';

interface Props {
  articles: KnowledgeArticle[];

  onEdit: (article: KnowledgeArticle) => void;

  onDelete: (id: number) => void;
}

export function ArticlesTable({
  articles,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr className="text-left">
            <th className="p-4">Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Views</th>
            <th>Updated</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              className="border-t"
            >
              <td className="p-4">
                <div>
                  <p className="font-medium">
                    {article.title}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    /{article.slug}
                  </p>
                </div>
              </td>

              <td>{article.category}</td>

              <td>
                <ArticleStatusBadge
                  status={article.status}
                />
              </td>

              <td>
                <div className="flex items-center gap-2">
                  <Eye size={16} />

                  {article.views}
                </div>
              </td>

              <td>{article.updatedAt}</td>

              <td>
                <div className="flex justify-end gap-2 pr-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(article)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(article.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}