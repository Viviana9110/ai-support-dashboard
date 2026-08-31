import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';

import {
  SESSION_USER,
  cookieStore,
  asDb,
  dbArticleRow,
  installTransactionMock,
  makeRequest,
  routeContext,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import { GET as listArticles, POST as createArticle } from '../knowledge/route';
import {
  GET as getArticle,
  PATCH as updateArticle,
  DELETE as deleteArticle,
} from '../knowledge/[id]/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('knowledge routes', () => {
  let db: DbMocks;

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
    await setSession(SESSION_USER);
  });

  describe('GET /api/knowledge', () => {
    it('returns the serialized article list', async () => {
      db.knowledgeArticle.findMany.mockResolvedValue([dbArticleRow()]);

      const response = await listArticles();

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(1);
      expect(body[0]).toEqual({
        id: 'article-1',
        title: 'How to reset your password',
        slug: 'how-to-reset-your-password',
        category: 'Accounts',
        summary: null,
        content: null,
        status: 'draft',
        author: 'Viviana',
        updatedAt: expect.any(String),
        views: 0,
      });
      expect(db.knowledgeArticle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { deletedAt: null } }),
      );
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await listArticles();

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/knowledge', () => {
    it('creates an article as DRAFT with a slugified slug', async () => {
      db.knowledgeArticle.create.mockResolvedValue(dbArticleRow());

      const response = await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: { title: 'How to Reset Password!', category: 'Accounts' },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ status: 'draft' });

      expect(db.knowledgeArticle.create).toHaveBeenCalledWith({
        data: {
          title: 'How to Reset Password!',
          slug: 'how-to-reset-password',
          category: 'Accounts',
          summary: null,
          status: 'DRAFT',
          content: '',
          views: 0,
          authorId: SESSION_USER.sub,
          publishedAt: null,
        },
        include: { author: true },
      });
    });

    it('sets a publishedAt date when the status is published', async () => {
      db.knowledgeArticle.create.mockResolvedValue(
        dbArticleRow({ status: 'PUBLISHED' }),
      );

      await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: {
            title: 'How to reset your password',
            category: 'Accounts',
            status: 'published',
          },
        }),
      );

      const createCall = db.knowledgeArticle.create.mock.calls[0]?.[0] as {
        data: { status: string; publishedAt: Date | null };
      };

      expect(createCall.data.status).toBe('PUBLISHED');
      expect(createCall.data.publishedAt).toBeInstanceOf(Date);
    });

    it('normalizes an unknown status to DRAFT', async () => {
      db.knowledgeArticle.create.mockResolvedValue(dbArticleRow());

      await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: {
            title: 'How to reset your password',
            category: 'Accounts',
            status: 'bogus',
          },
        }),
      );

      const createCall = db.knowledgeArticle.create.mock.calls[0]?.[0] as {
        data: { status: string; publishedAt: Date | null };
      };

      expect(createCall.data.status).toBe('DRAFT');
      expect(createCall.data.publishedAt).toBeNull();
    });

    it('uses an explicit slug when provided', async () => {
      db.knowledgeArticle.create.mockResolvedValue(dbArticleRow());

      await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: {
            title: 'How to reset your password',
            slug: 'custom-slug',
            category: 'Accounts',
          },
        }),
      );

      expect(db.knowledgeArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ slug: 'custom-slug' }) }),
      );
    });

    it('persists the summary when provided', async () => {
      db.knowledgeArticle.create.mockResolvedValue(
        dbArticleRow({ summary: 'A short summary of the article.' }),
      );

      const response = await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: {
            title: 'How to reset your password',
            category: 'Accounts',
            summary: 'A short summary of the article.',
          },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({
        summary: 'A short summary of the article.',
      });

      expect(db.knowledgeArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ summary: 'A short summary of the article.' }),
        }),
      );
    });

    it('persists the content when provided', async () => {
      db.knowledgeArticle.create.mockResolvedValue(
        dbArticleRow({ content: 'Full article body content.' }),
      );

      const response = await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: {
            title: 'How to reset your password',
            category: 'Accounts',
            content: 'Full article body content.',
          },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({
        content: 'Full article body content.',
      });

      expect(db.knowledgeArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ content: 'Full article body content.' }),
        }),
      );
    });

    it('rejects a payload without a title', async () => {
      const response = await createArticle(
        makeRequest('http://localhost/api/knowledge', {
          method: 'POST',
          body: { category: 'Accounts' },
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid article data.' });
    });
  });

  describe('GET /api/knowledge/[id]', () => {
    it('returns the article detail', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue(
        dbArticleRow({ content: 'Full article body content.' }),
      );

      const response = await getArticle(
        new Request('http://localhost/api/knowledge/article-1'),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        id: 'article-1',
        content: 'Full article body content.',
      });
      expect(db.knowledgeArticle.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'article-1', deletedAt: null } }),
      );
    });

    it('returns 404 when the article is not found', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue(null);

      const response = await getArticle(
        new Request('http://localhost/api/knowledge/article-1'),
        routeContext('article-1'),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Article not found.' });
    });
  });

  describe('PATCH /api/knowledge/[id]', () => {
    it('updates the title', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });
      db.knowledgeArticle.update.mockResolvedValue(
        dbArticleRow({ title: 'Updated title' }),
      );

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { title: 'Updated title' },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ title: 'Updated title' });

      expect(db.knowledgeArticle.update).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        data: { title: 'Updated title' },
        include: { author: true },
      });
    });

    it('updates the summary', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });
      db.knowledgeArticle.update.mockResolvedValue(
        dbArticleRow({ summary: 'Updated summary text.' }),
      );

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { summary: 'Updated summary text.' },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        summary: 'Updated summary text.',
      });

      expect(db.knowledgeArticle.update).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        data: { summary: 'Updated summary text.' },
        include: { author: true },
      });
    });

    it('updates the content', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });
      db.knowledgeArticle.update.mockResolvedValue(
        dbArticleRow({ content: 'Updated article body content.' }),
      );

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { content: 'Updated article body content.' },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        content: 'Updated article body content.',
      });

      expect(db.knowledgeArticle.update).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        data: { content: 'Updated article body content.' },
        include: { author: true },
      });
    });

    it('sets status and publishedAt when publishing', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });
      db.knowledgeArticle.update.mockResolvedValue(
        dbArticleRow({ status: 'PUBLISHED' }),
      );

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { status: 'published' },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);

      const updateCall = db.knowledgeArticle.update.mock.calls[0]?.[0] as {
        data: { status: string; publishedAt: Date | null };
      };

      expect(updateCall.data.status).toBe('PUBLISHED');
      expect(updateCall.data.publishedAt).toBeInstanceOf(Date);
    });

    it('returns 404 when the article is not found', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue(null);

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { title: 'Updated title' },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(404);
    });

    it('rejects an invalid payload', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });

      const response = await updateArticle(
        makeRequest('http://localhost/api/knowledge/article-1', {
          method: 'PATCH',
          body: { views: -1 },
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/knowledge/[id]', () => {
    it('soft deletes the article', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue({ id: 'article-1' });

      const response = await deleteArticle(
        new Request('http://localhost/api/knowledge/article-1', {
          method: 'DELETE',
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
      expect(db.knowledgeArticle.update).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('returns 404 when the article is not found', async () => {
      db.knowledgeArticle.findUnique.mockResolvedValue(null);

      const response = await deleteArticle(
        new Request('http://localhost/api/knowledge/article-1', {
          method: 'DELETE',
        }),
        routeContext('article-1'),
      );

      expect(response.status).toBe(404);
    });
  });
});
