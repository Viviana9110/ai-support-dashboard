import { KnowledgeArticle } from './knowledge.types';

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 1,
    title: 'Getting Started',
    slug: 'getting-started',
    category: 'General',
    status: 'published',
    author: 'Viviana',
    updatedAt: '2026-07-20',
    views: 842,
  },
  {
    id: 2,
    title: 'Reset Password',
    slug: 'reset-password',
    category: 'Authentication',
    status: 'draft',
    author: 'Viviana',
    updatedAt: '2026-07-21',
    views: 215,
  },
  {
    id: 3,
    title: 'Manage Tickets',
    slug: 'manage-tickets',
    category: 'Support',
    status: 'published',
    author: 'Viviana',
    updatedAt: '2026-07-22',
    views: 1360,
  },
];