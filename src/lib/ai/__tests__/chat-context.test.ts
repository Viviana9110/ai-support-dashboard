import { describe, expect, it } from 'vitest';

import { buildAiChatInput } from '../chat-context';

const customer = {
  id: 'customer-1',
  name: 'Customer One',
  email: 'one@example.com',
  company: 'One Co',
  status: 'ACTIVE',
};

const tickets = [
  {
    subject: 'Customer one ticket',
    status: 'OPEN' as const,
    priority: 'HIGH' as const,
    updatedAt: new Date('2026-08-13T10:00:00Z'),
    customer: { id: 'customer-1', name: 'Customer One' },
  },
  {
    subject: 'Customer two ticket',
    status: 'OPEN' as const,
    priority: 'LOW' as const,
    updatedAt: new Date('2026-08-13T10:00:00Z'),
    customer: { id: 'customer-2', name: 'Customer Two' },
  },
  {
    subject: 'Closed customer one ticket',
    status: 'CLOSED' as const,
    priority: 'MEDIUM' as const,
    updatedAt: new Date('2026-08-13T10:00:00Z'),
    customer: { id: 'customer-1', name: 'Customer One' },
  },
];

const articles = [
  {
    title: 'Password reset',
    category: 'Accounts',
    content: 'Reset a password from the login screen.',
  },
];

describe('shared AI chat context', () => {
  it('scopes tickets to the selected Customer', () => {
    const input = buildAiChatInput({
      assistant: 'Customer Support AI',
      message: 'How do I reset my password?',
      history: [],
      articles,
      customer,
      tickets,
    });

    const text = input.map((item) => item.content).join('\n');

    expect(text).toContain('Customer one ticket');
    expect(text).toContain('Closed customer one ticket');
    expect(text).not.toContain('Customer two ticket');
    expect(text).toContain('Name: Customer One');
  });

  it('does not add customer or ticket data when no Customer is associated', () => {
    const input = buildAiChatInput({
      assistant: 'Customer Support AI',
      message: 'How do I reset my password?',
      history: [],
      articles,
      tickets,
    });

    const text = input.map((item) => item.content).join('\n');

    expect(text).toContain('Reset a password from the login screen.');
    expect(text).not.toContain('Customer one ticket');
    expect(text).not.toContain('Customer two ticket');
    expect(text).not.toContain('Customer One');
  });

  it('produces the same context structure for chat and stream callers', () => {
    const args = {
      assistant: 'Technical Support',
      message: 'How do I reset my password?',
      history: [{ role: 'user' as const, content: 'Previous question' }],
      articles,
      customer,
      tickets,
    };

    expect(buildAiChatInput(args)).toEqual(buildAiChatInput(args));
  });

  it('keeps OPEN, PENDING, and CLOSED tickets for the selected Customer', () => {
    const text = buildAiChatInput({
      assistant: 'Customer Support AI',
      message: 'What is the status of my ticket?',
      history: [],
      articles: [],
      customer,
      tickets,
    }).map((item) => item.content).join('\n');

    expect(text).toContain('Customer one ticket');
    expect(text).toContain('Closed customer one ticket');
    expect(text).not.toContain('Customer two ticket');
  });
});
