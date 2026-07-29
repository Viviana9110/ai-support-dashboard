import { useQuery } from '@tanstack/react-query';

import { getKnowledgeArticles } from '@/services/knowledge/knowledge.service';

export function useKnowledge() {
  return useQuery({
    queryKey: ['knowledge'],
    queryFn: getKnowledgeArticles,
  });
}