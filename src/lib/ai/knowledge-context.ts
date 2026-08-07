type KnowledgeContextArticle = {
  title: string;
  category: string;
  content: string;
};

export function buildKnowledgeContext(
  articles: KnowledgeContextArticle[],
): string {
  const blocks = articles.map(
    (article) =>
      [
        'Article',
        `Title: ${article.title}`,
        `Category: ${article.category}`,
        `Content: ${article.content}`,
      ].join('\n'),
  );

  return ['Knowledge Base', ...blocks].join('\n\n');
}
