import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';

import {
  CONVERSATION_ID,
  CUSTOMER_ID,
  SESSION_USER,
  cookieStore,
  asDb,
  dbConversationRow,
  dbMessageRow,
  installTransactionMock,
  makeRequest,
  prismaError,
  routeContext,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import {
  GET as listConversations,
  POST as createConversation,
} from '../conversations/route';
import {
  GET as getConversation,
  PATCH as updateConversation,
  DELETE as deleteConversation,
} from '../conversations/[id]/route';
import { POST as sendMessage } from '../conversations/[id]/messages/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('conversations routes', () => {
  let db: DbMocks;

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
    await setSession(SESSION_USER);
  });

  describe('GET /api/conversations', () => {
    it('returns the serialized conversation list', async () => {
      db.conversation.findMany.mockResolvedValue([dbConversationRow()]);

      const response = await listConversations();

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(1);
      expect(body[0]).toMatchObject({
        id: CONVERSATION_ID,
        customer: 'Acme Inc',
        unread: 0,
        lastMessage: 'I cannot log in',
        messages: [{ id: 'msg-1', sender: 'customer', text: 'I cannot log in' }],
      });
      expect(body[0]).not.toHaveProperty('deletedAt');
      expect(db.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { deletedAt: null } }),
      );
    });

    it('requires an authenticated session', async () => {
      cookieStore.clear();

      const response = await listConversations();

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/conversations', () => {
    it('creates a conversation with defaults', async () => {
      db.conversation.create.mockResolvedValue(dbConversationRow());

      const response = await createConversation(
        makeRequest('http://localhost/api/conversations', {
          method: 'POST',
          body: { customerId: CUSTOMER_ID },
        }),
      );

      expect(response.status).toBe(201);

      const body = await response.json();

      expect(body).toMatchObject({ id: CONVERSATION_ID, customer: 'Acme Inc' });

      expect(db.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            customerId: CUSTOMER_ID,
            avatar: '',
            online: false,
            unread: 0,
            lastMessage: '',
          },
        }),
      );
    });

    it('creates a conversation with nested messages', async () => {
      db.conversation.create.mockResolvedValue(dbConversationRow());

      await createConversation(
        makeRequest('http://localhost/api/conversations', {
          method: 'POST',
          body: {
            customerId: CUSTOMER_ID,
            online: true,
            unread: 2,
            messages: [{ sender: 'CUSTOMER', text: 'Hello' }],
          },
        }),
      );

      expect(db.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            messages: { create: [{ sender: 'CUSTOMER', text: 'Hello' }] },
          }),
        }),
      );
    });

    it('rejects a payload without a customer', async () => {
      const response = await createConversation(
        makeRequest('http://localhost/api/conversations', {
          method: 'POST',
          body: {},
        }),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid JSON body', async () => {
      const response = await createConversation(
        makeRequest('http://localhost/api/conversations', {
          method: 'POST',
          body: '{invalid',
        }),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/conversations/[id]', () => {
    it('returns the conversation detail with the full customer', async () => {
      db.conversation.findUnique.mockResolvedValue(dbConversationRow());

      const response = await getConversation(
        new Request('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444'),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toMatchObject({
        id: CONVERSATION_ID,
        customer: {
          id: CUSTOMER_ID,
          name: 'Acme Inc',
          email: 'hello@acme.com',
          company: 'Acme Corp',
          status: 'Active',
        },
      });
      expect(db.conversation.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: CONVERSATION_ID, deletedAt: null } }),
      );
    });

    it('returns 404 for an invalid UUID', async () => {
      const response = await getConversation(
        new Request('http://localhost/api/conversations/not-a-uuid'),
        routeContext('not-a-uuid'),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Conversation not found.',
      });
    });

    it('returns 404 when the conversation is not found', async () => {
      db.conversation.findUnique.mockResolvedValue(null);

      const response = await getConversation(
        new Request('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444'),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/conversations/[id]', () => {
    it('updates conversation fields', async () => {
      db.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      db.conversation.update.mockResolvedValue(
        dbConversationRow({ unread: 3, lastMessage: 'Updated' }),
      );

      const response = await updateConversation(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444', {
          method: 'PATCH',
          body: { unread: 3, lastMessage: 'Updated' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ unread: 3 });

      expect(db.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: CONVERSATION_ID },
          data: { unread: 3, lastMessage: 'Updated' },
        }),
      );
    });

    it('returns 404 when the conversation is not found', async () => {
      db.conversation.findUnique.mockResolvedValue(null);

      const response = await updateConversation(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444', {
          method: 'PATCH',
          body: { unread: 1 },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
    });

    it('rejects an invalid JSON body', async () => {
      db.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });

      const response = await updateConversation(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444', {
          method: 'PATCH',
          body: '{invalid',
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/conversations/[id]', () => {
    it('soft deletes the conversation', async () => {
      db.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });

      const response = await deleteConversation(
        new Request('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444', {
          method: 'DELETE',
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
      expect(db.conversation.update).toHaveBeenCalledWith({
        where: { id: CONVERSATION_ID },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('returns 404 when the conversation is not found', async () => {
      db.conversation.findUnique.mockResolvedValue(null);

      const response = await deleteConversation(
        new Request('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444', {
          method: 'DELETE',
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/conversations/[id]/messages', () => {
    it('sends an agent message without incrementing unread', async () => {
      db.tx.message.create.mockResolvedValue(
        dbMessageRow({ sender: 'AGENT', text: 'Thanks' }),
      );

      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444/messages', {
          method: 'POST',
          body: { text: 'Thanks', sender: 'agent' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ sender: 'agent', text: 'Thanks' });

      expect(db.tx.conversation.update).toHaveBeenCalledWith({
        where: { id: CONVERSATION_ID, deletedAt: null },
        data: { lastMessage: 'Thanks' },
      });

      expect(db.tx.message.create).toHaveBeenCalledWith({
        data: {
          conversationId: CONVERSATION_ID,
          sender: 'AGENT',
          text: 'Thanks',
        },
      });
    });

    it('sends a customer message and increments unread', async () => {
      db.tx.message.create.mockResolvedValue(dbMessageRow({ text: 'Hi there' }));

      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444/messages', {
          method: 'POST',
          body: { text: 'Hi there', sender: 'customer' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(201);

      expect(db.tx.conversation.update).toHaveBeenCalledWith({
        where: { id: CONVERSATION_ID, deletedAt: null },
        data: { lastMessage: 'Hi there', unread: { increment: 1 } },
      });

      expect(db.tx.message.create).toHaveBeenCalledWith({
        data: {
          conversationId: CONVERSATION_ID,
          sender: 'CUSTOMER',
          text: 'Hi there',
        },
      });
    });

    it('rejects an empty message', async () => {
      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444/messages', {
          method: 'POST',
          body: { text: '   ', sender: 'agent' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid sender', async () => {
      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444/messages', {
          method: 'POST',
          body: { text: 'Hello', sender: 'robot' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(400);
    });

    it('returns 404 for an invalid UUID', async () => {
      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/not-a-uuid/messages', {
          method: 'POST',
          body: { text: 'Hello', sender: 'agent' },
        }),
        routeContext('not-a-uuid'),
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 when the conversation does not exist (P2025)', async () => {
      db.tx.conversation.update.mockRejectedValue(prismaError('P2025', 'Record not found'));

      const response = await sendMessage(
        makeRequest('http://localhost/api/conversations/44444444-4444-4444-8444-444444444444/messages', {
          method: 'POST',
          body: { text: 'Hello', sender: 'agent' },
        }),
        routeContext(CONVERSATION_ID),
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Conversation not found.',
      });
    });
  });
});
