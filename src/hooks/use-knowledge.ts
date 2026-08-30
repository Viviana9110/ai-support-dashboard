import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createArticle,
  deleteArticle,
  getKnowledgeArticles,
  updateArticle,
  type CreateArticlePayload,
  type UpdateArticlePayload,
} from '@/services/knowledge/knowledge.service';

export function useKnowledge() {
  return useQuery({
    queryKey: ['knowledge'],
    queryFn: getKnowledgeArticles,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateArticlePayload) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateArticlePayload;
    }) => updateArticle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });
}
