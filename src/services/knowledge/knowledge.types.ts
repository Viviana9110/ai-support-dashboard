export type ArticleStatus =
  | 'draft'
  | 'published'
  | 'archived';

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: ArticleStatus;
  author: string;
  updatedAt: string;
  views: number;
}