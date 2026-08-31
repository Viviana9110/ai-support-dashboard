import { api } from '../api';
import type { KnowledgeArticle } from './knowledge.types';

export type CreateArticlePayload = Pick<
  KnowledgeArticle,
  'title' | 'slug' | 'category' | 'status' | 'summary' | 'content'
>;

export type UpdateArticlePayload = Partial<CreateArticlePayload>;

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const { data } = await api.get<KnowledgeArticle[]>('/knowledge');

  return data;
}

export async function createArticle(
  payload: CreateArticlePayload,
): Promise<KnowledgeArticle> {
  const { data } = await api.post<KnowledgeArticle>('/knowledge', payload);

  return data;
}

export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload,
): Promise<KnowledgeArticle> {
  const { data } = await api.patch<KnowledgeArticle>(`/knowledge/${id}`, payload);

  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/knowledge/${id}`);
}
