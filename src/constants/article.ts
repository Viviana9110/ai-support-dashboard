import { ArticleFormData } from '@/lib/schemas/article.schema';

export const defaultArticle: ArticleFormData = {
  title: '',
  slug: '',
  category: '',
  status: 'draft',
  summary: '',
  content: '',
  tags: [],
};