'use client';

import { useEffect, useMemo, useState } from 'react';

import { BookOpen } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

import { useToast } from '@/hooks/use-toast';
import { useKnowledge } from '@/hooks/use-knowledge';

import { KnowledgeToolbar } from './knowledge-toolbar';
import { KnowledgeStats } from './knowledge-stats';
import { ArticlesTable } from './articles-table';
import { ArticleForm } from './article-form';

import { KnowledgeArticle } from '@/services/knowledge/knowledge.types';
import { ArticleFormData } from '@/lib/schemas/article.schema';

export function KnowledgeClient() {
  const { data = [], isLoading } = useKnowledge();

  const toast = useToast();

  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const [editingArticle, setEditingArticle] =
    useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    setArticles(data);
  }, [data]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.title
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [articles, search]);

  const published = filteredArticles.filter(
    (a) => a.status === 'published',
  ).length;

  const drafts = filteredArticles.filter(
    (a) => a.status === 'draft',
  ).length;

  const categories = new Set(
    filteredArticles.map((a) => a.category),
  ).size;

  function handleCreate(data: ArticleFormData) {
    const article: KnowledgeArticle = {
      id: Date.now(),
      ...data,
      author: 'Viviana',
      updatedAt: new Date().toLocaleDateString(),
      views: 0,
    };

    setArticles((previous) => [
      article,
      ...previous,
    ]);

    toast.success(
      'Article created',
      'The article has been created.',
    );

    setOpen(false);
  }

  function handleEdit(data: ArticleFormData) {
    if (!editingArticle) return;

    setArticles((previous) =>
      previous.map((article) =>
        article.id === editingArticle.id
          ? {
              ...article,
              ...data,
            }
          : article,
      ),
    );

    toast.info(
      'Article updated',
      'Changes have been saved.',
    );

    setEditingArticle(null);
    setOpen(false);
  }

  function handleDelete(id: number) {
    setArticles((previous) =>
      previous.filter(
        (article) => article.id !== id,
      ),
    );

    toast.warning(
      'Article deleted',
      'The article has been removed.',
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Manage articles used by your AI assistant."
      />

      <KnowledgeToolbar
        search={search}
        onSearchChange={setSearch}
        onNewArticle={() => {
          setEditingArticle(null);
          setOpen(true);
        }}
      />

      <KnowledgeStats
        total={published}
        drafts={drafts}
        categories={categories}
      />

      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles"
          description="Create your first knowledge article."
          action={
            <Button
              onClick={() => {
                setEditingArticle(null);
                setOpen(true);
              }}
            >
              New Article
            </Button>
          }
        />
      ) : (
        <ArticlesTable
          articles={filteredArticles}
          onEdit={(article) => {
            setEditingArticle(article);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        open={open}
        title={
          editingArticle
            ? 'Edit Article'
            : 'New Article'
        }
        onClose={() => {
          setEditingArticle(null);
          setOpen(false);
        }}
      >
        <ArticleForm
          article={editingArticle ?? undefined}
          onSubmit={(data) => {
            if (editingArticle) {
              handleEdit(data);
            } else {
              handleCreate(data);
            }
          }}
        />
      </Modal>
    </div>
  );
}