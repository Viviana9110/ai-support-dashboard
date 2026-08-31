import { describe, expect, it } from 'vitest';

import {
  buildKnowledgeContext,
  selectRelevantKnowledgeArticles,
} from '../knowledge-context';

const refundArticle = {
  title: 'Política de reembolsos',
  category: 'Billing',
  content:
    'Los reembolsos tardan 37 días hábiles en completarse y se acreditan a la tarjeta original.',
};

describe('Knowledge Base relevance with Spanish accents', () => {
  it('matches "días" with "dias" after Unicode normalization', () => {
    const article = {
      title: 'Reembolso',
      category: 'Billing',
      content: 'El reembolso se procesa en 37 días.',
    };

    const relevant = selectRelevantKnowledgeArticles(
      [article],
      '¿En cuántos días se procesa?',
    );

    expect(relevant).toEqual([article]);
  });

  it('finds the refund article for the query "37 días para mi reembolso"', () => {
    const relevant = selectRelevantKnowledgeArticles(
      [refundArticle],
      'tengo que esperar 37 días para mi reembolso',
    );

    expect(relevant).toEqual([refundArticle]);
    expect(buildKnowledgeContext(relevant)).toContain(
      'Los reembolsos tardan 37 días hábiles',
    );
  });

  it('still matches accented terms when the article and query use different accents', () => {
    const article = {
      title: 'Información de cuenta',
      category: 'Accounts',
      content: 'Actualiza tu información de facturación desde la configuración.',
    };

    const relevant = selectRelevantKnowledgeArticles(
      [article],
      'como actualizo la información de mi cuenta',
    );

    expect(relevant).toEqual([article]);
  });
});