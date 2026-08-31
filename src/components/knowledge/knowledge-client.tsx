'use client';

import { useMemo, useState } from 'react';

import { BookOpen } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

import { useToast } from '@/hooks/use-toast';
import {
  useCreateArticle,
  useDeleteArticle,
  useKnowledge,
  useUpdateArticle,
} from '@/hooks/use-knowledge';

import { KnowledgeToolbar } from './knowledge-toolbar';
import { KnowledgeStats } from './knowledge-stats';
import { ArticlesTable } from './articles-table';
import { ArticleForm } from './article-form';

import { KnowledgeArticle } from '@/services/knowledge/knowledge.types';
import { ArticleFormData } from '@/lib/schemas/article.schema';

export function KnowledgeClient() {
  const { data: articles = [], isLoading, isError } = useKnowledge();

  const toast = useToast();

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const [editingArticle, setEditingArticle] =
    useState<KnowledgeArticle | null>(null);

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

  const isPending =
    createArticle.isPending ||
    updateArticle.isPending ||
    deleteArticle.isPending;

  function handleClose() {
    if (isPending) return;

    setEditingArticle(null);
    setOpen(false);
  }

  async function handleCreate(data: ArticleFormData) {
    try {
      await createArticle.mutateAsync({
        title: data.title,
        slug: data.slug,
        category: data.category,
        status: data.status,
        summary: data.summary,
      });

      toast.success(
        'Article created',
        'The article has been created.',
      );

      setOpen(false);
    } catch {
      toast.error(
        'Failed to create article',
        'Something went wrong while creating the article.',
      );
    }
  }

  async function handleEdit(data: ArticleFormData) {
    if (!editingArticle) return;

    try {
      await updateArticle.mutateAsync({
        id: editingArticle.id,
        payload: {
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          summary: data.summary,
        },
      });

      toast.info(
        'Article updated',
        'Changes have been saved.',
      );

      setEditingArticle(null);
      setOpen(false);
    } catch {
      toast.error(
        'Failed to update article',
        'Something went wrong while updating the article.',
      );
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteArticle.mutateAsync(id);

      toast.warning(
        'Article deleted',
        'The article has been removed.',
      );
    } catch {
      toast.error(
        'Failed to delete article',
        'Something went wrong while deleting the article.',
      );
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Something went wrong"
        description="We could not load the knowledge base. Please try again."
      />
    );
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
        onClose={handleClose}
      >
        <ArticleForm
          article={editingArticle ?? undefined}
          isSubmitting={isPending}
          onSubmit={(data) => {
            if (editingArticle) {
              void handleEdit(data);
            } else {
              void handleCreate(data);
            }
          }}
        />
      </Modal>
    </div>
  );
}
