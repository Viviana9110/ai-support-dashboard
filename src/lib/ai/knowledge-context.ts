type KnowledgeContextArticle = {
  title: string;
  category: string;
  content: string;
};

function normalizeTerms(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 3);
}

export function selectRelevantKnowledgeArticles(
  articles: KnowledgeContextArticle[],
  query: string,
): KnowledgeContextArticle[] {
  const terms = normalizeTerms(query);

  if (terms.length === 0) return [];

  return articles.filter((article) => {
    const searchable = normalizeTerms(
      `${article.title} ${article.category} ${article.content}`,
    );

    return terms.some((term) => searchable.includes(term));
  });
}

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
