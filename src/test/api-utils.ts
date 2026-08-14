import { vi } from 'vitest';

import { signSessionToken } from '@/lib/jwt';

import type { SessionPayload } from '@/lib/jwt';

export type Mock = ReturnType<typeof vi.fn>;

export interface TxMocks {
  ticket: {
    create: Mock;
    update: Mock;
  };
  customer: {
    create: Mock;
    update: Mock;
    findUnique: Mock;
    findFirst: Mock;
  };
  user: {
    findUnique: Mock;
  };
  auditLog: {
    create: Mock;
  };
  conversation: {
    update: Mock;
  };
  message: {
    create: Mock;
  };
  aiConversation: {
    findUnique: Mock;
    update: Mock;
  };
  aiMessage: {
    create: Mock;
    deleteMany: Mock;
  };
}

export interface DbMocks extends TxMocks {
  user: {
    findUnique: Mock;
    findFirst: Mock;
    create: Mock;
  };
  ticket: {
    findMany: Mock;
    findUnique: Mock;
    create: Mock;
    update: Mock;
  };
  auditLog: {
    create: Mock;
    findMany: Mock;
  };
  customer: {
    findMany: Mock;
    findUnique: Mock;
    findFirst: Mock;
    create: Mock;
    update: Mock;
  };
  conversation: {
    findMany: Mock;
    findUnique: Mock;
    create: Mock;
    update: Mock;
  };
  message: {
    create: Mock;
  };
  knowledgeArticle: {
    findMany: Mock;
    findUnique: Mock;
    create: Mock;
    update: Mock;
  };
  aiConversation: {
    findMany: Mock;
    findUnique: Mock;
    create: Mock;
    update: Mock;
  };
  aiMessage: {
    create: Mock;
    deleteMany: Mock;
  };
  $transaction: Mock;
  tx: TxMocks;
}

export function createTxMocks(): TxMocks {
  return {
    ticket: { create: vi.fn(), update: vi.fn() },
    customer: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    user: { findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
    conversation: { update: vi.fn() },
    message: { create: vi.fn() },
    aiConversation: { findUnique: vi.fn(), update: vi.fn() },
    aiMessage: { create: vi.fn(), deleteMany: vi.fn() },
  };
}

export function createPrismaMock(): DbMocks {
  const tx = createTxMocks();

  return {
    user: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    ticket: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: { create: vi.fn(), findMany: vi.fn() },
    customer: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    conversation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    message: { create: vi.fn() },
    knowledgeArticle: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    aiConversation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    aiMessage: { create: vi.fn(), deleteMany: vi.fn() },
    $transaction: vi.fn(),
    tx,
  };
}

export function asDb(db: unknown): DbMocks {
  return db as DbMocks;
}

export function installTransactionMock(db: DbMocks): void {
  db.$transaction.mockImplementation(
    (callback: (tx: TxMocks) => unknown) => callback(db.tx),
  );
}

class MockCookieStoreImpl {
  private static instance: MockCookieStoreImpl;

  private cookies = new Map<string, string>();

  static getInstance(): MockCookieStoreImpl {
    if (!MockCookieStoreImpl.instance) {
      MockCookieStoreImpl.instance = new MockCookieStoreImpl();
    }

    return MockCookieStoreImpl.instance;
  }

  get(name: string): { name: string; value: string } | undefined {
    const value = this.cookies.get(name);

    if (value === undefined) return undefined;

    return { name, value };
  }

  set(name: string, value: string): void {
    this.cookies.set(name, value);
  }

  delete(name: string): void {
    this.cookies.delete(name);
  }

  clear(): void {
    this.cookies.clear();
  }
}

export const cookieStore = MockCookieStoreImpl.getInstance();

export async function setSession(payload: SessionPayload): Promise<void> {
  const token = await signSessionToken(payload);
  cookieStore.set('session', token);
}

let requestCounter = 0;

export function makeRequest(
  url = 'http://localhost/api',
  init: {
    method?: string;
    body?: unknown;
    headers?: HeadersInit;
    ip?: string;
  } = {},
): Request {
  requestCounter += 1;

  const headers = new Headers(init.headers);

  if (init.ip) {
    headers.set('x-forwarded-for', init.ip);
  } else if (!headers.has('x-forwarded-for')) {
    headers.set('x-forwarded-for', `127.0.0.${(requestCounter % 254) + 1}`);
  }

  let body: string | undefined;

  if (init.body !== undefined) {
    body = typeof init.body === 'string' ? init.body : JSON.stringify(init.body);
  }

  return new Request(url, {
    method: init.method ?? 'GET',
    headers,
    body,
  });
}

export function routeContext(id: string): {
  params: Promise<{ id: string }>;
} {
  return { params: Promise.resolve({ id }) };
}

export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

export const CUSTOMER_ID = '11111111-1111-4111-8111-111111111111';
export const AGENT_ID = '22222222-2222-4222-8222-222222222222';
export const OTHER_USER_ID = '66666666-6666-4666-8666-666666666666';
export const NEW_CUSTOMER_ID = '33333333-3333-4333-8333-333333333333';
export const CONVERSATION_ID = '44444444-4444-4444-8444-444444444444';
export const AI_CONVERSATION_ID = '55555555-5555-4555-8555-555555555555';

export const OTHER_SESSION_USER: SessionPayload = {
  sub: OTHER_USER_ID,
  email: 'ada@example.com',
  name: 'Ada',
  role: 'AGENT',
};

export const SESSION_USER: SessionPayload = {
  sub: AGENT_ID,
  email: 'viviana@example.com',
  name: 'Viviana',
  role: 'AGENT',
};

export function dbTicketRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ticket-1',
    subject: 'Cannot log in',
    status: 'OPEN',
    priority: 'HIGH',
    customerId: CUSTOMER_ID,
    customer: { id: CUSTOMER_ID, name: 'Acme Inc' },
    agent: { id: AGENT_ID, name: 'Viviana' },
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(5),
    ...overrides,
  };
}

export function dbCustomerRow(overrides: Record<string, unknown> = {}) {
  return {
    id: CUSTOMER_ID,
    name: 'Acme Inc',
    email: 'hello@acme.com',
    company: 'Acme Corp',
    status: 'ACTIVE',
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(5),
    ...overrides,
  };
}

export function dbActivityRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'log-1',
    action: 'created',
    metadata: { subject: 'Cannot log in' },
    createdAt: minutesAgo(10),
    user: { name: 'Viviana' },
    ...overrides,
  };
}

export function dbMessageRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'msg-1',
    sender: 'CUSTOMER',
    text: 'I cannot log in',
    createdAt: minutesAgo(5),
    ...overrides,
  };
}

export function dbConversationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: CONVERSATION_ID,
    customer: {
      id: CUSTOMER_ID,
      name: 'Acme Inc',
      email: 'hello@acme.com',
      company: 'Acme Corp',
      status: 'ACTIVE',
    },
    avatar: '',
    online: true,
    unread: 0,
    lastMessage: 'I cannot log in',
    updatedAt: minutesAgo(5),
    messages: [dbMessageRow()],
    ...overrides,
  };
}

export function dbArticleRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'article-1',
    title: 'How to reset your password',
    slug: 'how-to-reset-your-password',
    category: 'Accounts',
    status: 'DRAFT',
    author: { name: 'Viviana' },
    updatedAt: minutesAgo(60),
    views: 0,
    ...overrides,
  };
}

export function dbAiMessageRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ai-msg-1',
    role: 'USER',
    content: 'Hello',
    createdAt: minutesAgo(5),
    ...overrides,
  };
}

export function dbAiConversationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: AI_CONVERSATION_ID,
    title: 'Help with login',
    customerId: null,
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(5),
    _count: { messages: 2 },
    messages: [dbAiMessageRow()],
    ...overrides,
  };
}

export function prismaError(code: string, message: string): Error {
  const error = new Error(message);
  (error as Error & { code?: string }).code = code;
  return error;
}
