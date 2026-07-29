export type ArticleStatus =
  | 'draft'
  | 'published'
  | 'archived';

export interface KnowledgeArticle {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: ArticleStatus;
  author: string;
  updatedAt: string;
  views: number;
}