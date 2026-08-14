import { describe, expect, it } from 'vitest';

import { buildCustomerContext } from '../customer-context';
import {
  buildKnowledgeContext,
  selectRelevantKnowledgeArticles,
} from '../knowledge-context';
import { buildTicketContext } from '../ticket-context';

describe('AI context builders', () => {
  it('uses the real Customer fields instead of User or agent fields', () => {
    const context = buildCustomerContext({
      id: 'customer-1',
      name: 'Acme Customer',
      email: 'customer@acme.test',
      company: 'Acme Inc.',
      status: 'ACTIVE',
    });

    expect(context).toContain('ID: customer-1');
    expect(context).toContain('Name: Acme Customer');
    expect(context).toContain('Company: Acme Inc.');
    expect(context).not.toContain('Role: AGENT');
    expect(context).not.toContain('agent@example.com');
  });

  it('keeps each ticket associated with its real Customer', () => {
    const context = buildTicketContext([
      {
        subject: 'Password reset',
        status: 'OPEN',
        priority: 'HIGH',
        updatedAt: new Date('2026-08-13T10:00:00Z'),
        customer: {
          id: 'customer-1',
          name: 'Acme Customer',
        },
      },
    ]);

    expect(context).toContain('Customer: Acme Customer (customer-1)');
    expect(context).toContain('Subject: Password reset');
    expect(context).not.toContain('Agent');
  });

  it('includes only simple keyword-relevant published articles', () => {
    const articles = [
      {
        title: 'Reset your password',
        category: 'Accounts',
        content: 'Use the reset link from the login screen.',
      },
      {
        title: 'Billing contact',
        category: 'Billing',
        content: 'Contact billing for invoice questions.',
      },
    ];

    const relevant = selectRelevantKnowledgeArticles(
      articles,
      'How do I reset my password?',
    );

    expect(relevant).toEqual([articles[0]]);
    expect(buildKnowledgeContext(relevant)).toContain(
      'Use the reset link from the login screen.',
    );
    expect(buildKnowledgeContext(relevant)).not.toContain('Billing contact');
  });
});
