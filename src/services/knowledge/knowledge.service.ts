import { knowledgeArticles } from './knowledge.mock';

export async function getKnowledgeArticles() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return knowledgeArticles;
}