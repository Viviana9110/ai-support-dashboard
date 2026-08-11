import { describe, expect, it } from 'vitest';

import {
  serializeAiConversation,
  serializeAiConversationDetail,
  serializeAiMessage,
  serializeArticle,
  serializeConversation,
  serializeConversationDetail,
  serializeCustomer,
  serializeCustomerDetail,
  serializeMessage,
  serializeTicket,
  serializeTicketDetail,
  toDBCustomerStatus,
  toDBTicketPriority,
  toDBTicketStatus,
} from '@/lib/serializers';

const now = Date.now();

const minutesAgo = (minutes: number) =>
  new Date(now - minutes * 60 * 1000);

const dbTicket = {
  id: 'tk_1',
  subject: 'Cannot log in',
  status: 'OPEN' as const,
  priority: 'HIGH' as const,
  customer: { id: 'c_1', name: 'Ada Lovelace' },
  agent: { id: 'u_1', name: 'Grace Hopper' },
  createdAt: minutesAgo(5),
  updatedAt: minutesAgo(1),
};

const dbActivity: Array<{
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  user: { name: string } | null;
}> = [
  {
    id: 'a_1',
    action: 'status_changed',
    metadata: { from: 'OPEN', to: 'PENDING' },
    createdAt: minutesAgo(10),
    user: { name: 'Grace Hopper' },
  },
  {
    id: 'a_2',
    action: 'ticket_created',
    metadata: null,
    createdAt: minutesAgo(20),
    user: null,
  },
];

describe('serializeTicket', () => {
  it('maps ticket fields and relation names', () => {
    const ticket = serializeTicket(dbTicket);

    expect(ticket).toEqual({
      id: 'tk_1',
      customer: 'Ada Lovelace',
      customerId: 'c_1',
      subject: 'Cannot log in',
      status: 'Open',
      priority: 'High',
      agent: 'Grace Hopper',
      agentId: 'u_1',
      createdAt: '5 min ago',
      updatedAt: '1 min ago',
    });
  });

  it('falls back to empty agent when unassigned', () => {
    const ticket = serializeTicket({ ...dbTicket, agent: null });

    expect(ticket.agent).toBe('');
    expect(ticket.agentId).toBeNull();
  });
});

describe('serializeTicketDetail', () => {
  it('spreads the ticket and maps the activity timeline', () => {
    const detail = serializeTicketDetail(dbTicket, dbActivity);

    expect(detail.id).toBe('tk_1');
    expect(detail.activity).toEqual([
      {
        id: 'a_1',
        action: 'status_changed',
        metadata: { from: 'OPEN', to: 'PENDING' },
        createdAt: '10 min ago',
        user: 'Grace Hopper',
      },
      {
        id: 'a_2',
        action: 'ticket_created',
        metadata: null,
        createdAt: '20 min ago',
        user: null,
      },
    ]);
  });
});

describe('serializeCustomer / serializeCustomerDetail', () => {
  const dbCustomer = {
    id: 'c_1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Analytical Engine Co',
    status: 'ACTIVE' as const,
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(5),
  };

  it('maps the customer status enum', () => {
    expect(serializeCustomer(dbCustomer)).toEqual({
      id: 'c_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engine Co',
      status: 'Active',
    });
  });

  it('includes serialized tickets and activity', () => {
    const detail = serializeCustomerDetail(
      dbCustomer,
      [dbTicket],
      dbActivity,
    );

    expect(detail.createdAt).toBe('30 min ago');
    expect(detail.updatedAt).toBe('5 min ago');
    expect(detail.tickets).toHaveLength(1);
    expect(detail.tickets[0].subject).toBe('Cannot log in');
    expect(detail.activity).toHaveLength(2);
  });
});

describe('serializeMessage / serializeConversation', () => {
  const dbConversation = {
    id: 'cv_1',
    customer: { name: 'Ada Lovelace' },
    avatar: '/avatars/ada.png',
    online: true,
    unread: 2,
    lastMessage: 'Help me please',
    updatedAt: minutesAgo(2),
    messages: [
      { id: 'm_1', sender: 'CUSTOMER' as const, text: 'Help me please', createdAt: minutesAgo(2) },
      { id: 'm_2', sender: 'AGENT' as const, text: 'On it', createdAt: minutesAgo(1) },
      { id: 'm_3', sender: 'SYSTEM' as const, text: 'Ticket opened', createdAt: minutesAgo(3) },
    ],
  };

  it('maps message senders including SYSTEM to agent', () => {
    const messages = dbConversation.messages.map(serializeMessage);

    expect(messages.map((m) => m.sender)).toEqual([
      'customer',
      'agent',
      'agent',
    ]);

    expect(messages[0].text).toBe('Help me please');
    expect(messages[0].time).toMatch(/^\d{1,2}:\d{2}/);
  });

  it('serializes a conversation summary with customer name', () => {
    const conversation = serializeConversation(dbConversation);

    expect(conversation).toMatchObject({
      id: 'cv_1',
      customer: 'Ada Lovelace',
      avatar: '/avatars/ada.png',
      online: true,
      unread: 2,
      lastMessage: 'Help me please',
      updatedAt: '2 min ago',
    });

    expect(conversation.messages).toHaveLength(3);
  });

  it('serializes a conversation detail with a full customer', () => {
    const detail = serializeConversationDetail({
      ...dbConversation,
      customer: {
        id: 'c_1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        company: 'Analytical Engine Co',
        status: 'ACTIVE' as const,
      },
    });

    expect(detail.customer).toMatchObject({
      id: 'c_1',
      name: 'Ada Lovelace',
      status: 'Active',
    });

    expect(detail.messages).toHaveLength(3);
  });
});

describe('serializeArticle', () => {
  it('maps an article with its status and author', () => {
    const article = serializeArticle({
      id: 'art_1',
      title: 'Reset your password',
      slug: 'reset-your-password',
      category: 'Security',
      status: 'PUBLISHED' as const,
      author: { name: 'Viviana' },
      updatedAt: new Date('2026-08-01T10:00:00Z'),
      views: 42,
    });

    expect(article).toEqual({
      id: 'art_1',
      title: 'Reset your password',
      slug: 'reset-your-password',
      category: 'Security',
      status: 'published',
      author: 'Viviana',
      updatedAt: '2026-08-01',
      views: 42,
    });
  });
});

describe('AI serializers', () => {
  it('derives the last message and count from messages', () => {
    const summary = serializeAiConversation({
      id: 'ai_1',
      title: 'My chat',
      createdAt: new Date('2026-08-01T10:00:00Z'),
      updatedAt: new Date('2026-08-01T10:00:00Z'),
      messages: [
        { role: 'USER' as const, content: 'Hello' },
        { role: 'ASSISTANT' as const, content: 'Hi there' },
      ],
    });

    expect(summary).toMatchObject({
      id: 'ai_1',
      title: 'My chat',
      messageCount: 2,
      lastMessage: 'Hi there',
      lastMessageRole: 'assistant',
      createdAt: '2026-08-01T10:00:00.000Z',
    });
  });

  it('uses the count when messages are not included', () => {
    const summary = serializeAiConversation({
      id: 'ai_1',
      title: 'My chat',
      createdAt: new Date('2026-08-01T10:00:00Z'),
      updatedAt: new Date('2026-08-01T10:00:00Z'),
      _count: { messages: 7 },
    });

    expect(summary.messageCount).toBe(7);
    expect(summary.lastMessage).toBeNull();
    expect(summary.lastMessageRole).toBeNull();
  });

  it('serializes messages and the full detail', () => {
    const message = serializeAiMessage({
      id: 'm_1',
      role: 'SYSTEM' as const,
      content: 'Done',
      createdAt: new Date('2026-08-01T10:00:00Z'),
    });

    expect(message).toEqual({
      id: 'm_1',
      role: 'system',
      content: 'Done',
      createdAt: '2026-08-01T10:00:00.000Z',
    });

    const detail = serializeAiConversationDetail({
      id: 'ai_1',
      title: 'My chat',
      createdAt: new Date('2026-08-01T10:00:00Z'),
      updatedAt: new Date('2026-08-01T10:00:00Z'),
      messages: [
        {
          id: 'm_1',
          role: 'USER' as const,
          content: 'Hello',
          createdAt: new Date('2026-08-01T10:00:00Z'),
        },
      ],
    });

    expect(detail.messages).toHaveLength(1);
    expect(detail.messages[0].role).toBe('user');
  });
});

describe('reverse enum helpers', () => {
  it('maps UI values back to DB enums', () => {
    expect(toDBTicketStatus('Open')).toBe('OPEN');
    expect(toDBTicketStatus('Pending')).toBe('PENDING');
    expect(toDBTicketStatus('Closed')).toBe('CLOSED');
    expect(toDBTicketPriority('Low')).toBe('LOW');
    expect(toDBTicketPriority('Medium')).toBe('MEDIUM');
    expect(toDBTicketPriority('High')).toBe('HIGH');
    expect(toDBCustomerStatus('Active')).toBe('ACTIVE');
    expect(toDBCustomerStatus('Inactive')).toBe('INACTIVE');
  });
});
