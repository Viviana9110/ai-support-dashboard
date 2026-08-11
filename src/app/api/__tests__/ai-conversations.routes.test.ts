import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';

import {
  AI_CONVERSATION_ID,
  OTHER_SESSION_USER,
  SESSION_USER,
  cookieStore,
  asDb,
  dbAiConversationRow,
  installTransactionMock,
  makeRequest,
  routeContext,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import {
  GET as listConversations,
  POST as createConversation,
} from '../ai/conversations/route';
import {
  GET as getConversation,
  PATCH as updateConversation,
  DELETE as deleteConversation,
} from '../ai/conversations/[id]/route';
import { POST as sendMessage } from '../ai/conversations/[id]/messages/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('ai conversation routes (per-user authorization)', () => {
  let db: DbMocks;

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
    await setSession(SESSION_USER);
  });

  describe('GET /api/ai/conversations', () => {
    it('only returns the current user conversations', async () => {
      db.aiConversation.findMany.mockResolvedValue([dbAiConversationRow()]);

      const response = await listConversations();

      expect(response.status).toBe(200);
      expect(await response.json()).toHaveLength(1);
      expect(db.aiConversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, userId: SESSION_USER.sub },
        }),
      );
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await listConversations();

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/ai/conversations', () => {
    it('creates the conversation owned by the current user', async () => {
      db.aiConversation.create.mockResolvedValue(dbAiConversationRow());

      const response = await createConversation(
        makeRequest('http://localhost/api/ai/conversations', {
          method: 'POST',
          body: { title: 'Help with login' },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ id: AI_CONVERSATION_ID });

      expect(db.aiConversation.create).toHaveBeenCalledWith({
        data: { title: 'Help with login', userId: SESSION_USER.sub },
      });
    });

    it('rejects an empty title', async () => {
      const response = await createConversation(
        makeRequest('http://localhost/api/ai/conversations', {
          method: 'POST',
          body: { title: '   ' },
        }),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/ai/conversations/[id]', () => {
    it('returns a conversation owned by the current user', async () => {
      db.aiConversation.findUnique.mockResolvedValue(dbAiConversationRow());

      const response = await getConversation(
        new Request('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555'),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        id: AI_CONVERSATION_ID,
        title: 'Help with login',
      });
      expect(db.aiConversation.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: AI_CONVERSATION_ID, deletedAt: null, userId: SESSION_USER.sub },
        }),
      );
    });

    it('does not expose another user conversation', async () => {
      await setSession(OTHER_SESSION_USER);
      db.aiConversation.findUnique.mockResolvedValue(null);

      const response = await getConversation(
        new Request('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555'),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Conversation not found.',
      });
      expect(db.aiConversation.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: OTHER_SESSION_USER.sub }) }),
      );
    });
  });

  describe('PATCH /api/ai/conversations/[id]', () => {
    it('renames a conversation owned by the current user', async () => {
      db.aiConversation.findUnique.mockResolvedValue({ id: AI_CONVERSATION_ID });
      db.aiConversation.update.mockResolvedValue(
        dbAiConversationRow({ title: 'New title' }),
      );

      const response = await updateConversation(
        makeRequest('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555', {
          method: 'PATCH',
          body: { title: 'New title' },
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ title: 'New title' });

      expect(db.aiConversation.update).toHaveBeenCalledWith({
        where: { id: AI_CONVERSATION_ID, userId: SESSION_USER.sub, deletedAt: null },
        data: { title: 'New title' },
      });
    });

    it('does not rename another user conversation', async () => {
      await setSession(OTHER_SESSION_USER);
      db.aiConversation.findUnique.mockResolvedValue(null);

      const response = await updateConversation(
        makeRequest('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555', {
          method: 'PATCH',
          body: { title: 'Hijacked' },
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
      expect(db.aiConversation.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/ai/conversations/[id]', () => {
    it('deletes a conversation owned by the current user', async () => {
      db.aiConversation.findUnique.mockResolvedValue({ id: AI_CONVERSATION_ID });
      db.aiConversation.update.mockResolvedValue({ id: AI_CONVERSATION_ID });

      const response = await deleteConversation(
        new Request('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555', {
          method: 'DELETE',
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
      expect(db.aiConversation.update).toHaveBeenCalledWith({
        where: { id: AI_CONVERSATION_ID, userId: SESSION_USER.sub, deletedAt: null },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('does not delete another user conversation', async () => {
      await setSession(OTHER_SESSION_USER);
      db.aiConversation.findUnique.mockResolvedValue(null);

      const response = await deleteConversation(
        new Request('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555', {
          method: 'DELETE',
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
      expect(db.aiConversation.update).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/ai/conversations/[id]/messages', () => {
    it('adds a message to a conversation owned by the current user', async () => {
      db.tx.aiConversation.findUnique.mockResolvedValue({ id: AI_CONVERSATION_ID });
      db.tx.aiMessage.create.mockResolvedValue({
        id: 'ai-msg-1',
        role: 'USER',
        content: 'Hello',
        createdAt: new Date(),
      });

      const response = await sendMessage(
        makeRequest('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555/messages', {
          method: 'POST',
          body: { content: 'Hello', role: 'user' },
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ role: 'user', content: 'Hello' });

      expect(db.tx.aiConversation.findUnique).toHaveBeenCalledWith({
        where: { id: AI_CONVERSATION_ID, deletedAt: null, userId: SESSION_USER.sub },
        select: { id: true },
      });

      expect(db.tx.aiMessage.create).toHaveBeenCalledWith({
        data: {
          role: 'USER',
          content: 'Hello',
          aiConversationId: AI_CONVERSATION_ID,
        },
      });

      expect(db.tx.aiConversation.update).toHaveBeenCalledWith({
        where: { id: AI_CONVERSATION_ID, userId: SESSION_USER.sub, deletedAt: null },
        data: { updatedAt: expect.any(Date) },
      });
    });

    it('does not add a message to another user conversation', async () => {
      await setSession(OTHER_SESSION_USER);
      db.tx.aiConversation.findUnique.mockResolvedValue(null);

      const response = await sendMessage(
        makeRequest('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555/messages', {
          method: 'POST',
          body: { content: 'Sneak', role: 'user' },
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Conversation not found.',
      });
      expect(db.tx.aiMessage.create).not.toHaveBeenCalled();
      expect(db.tx.aiConversation.update).not.toHaveBeenCalled();
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await sendMessage(
        makeRequest('http://localhost/api/ai/conversations/55555555-5555-4555-8555-555555555555/messages', {
          method: 'POST',
          body: { content: 'Hello', role: 'user' },
        }),
        routeContext(AI_CONVERSATION_ID),
      );

      expect(response.status).toBe(401);
    });
  });
});
