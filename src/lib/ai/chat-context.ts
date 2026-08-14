import { buildCustomerContext } from './customer-context';
import {
  buildKnowledgeContext,
  selectRelevantKnowledgeArticles,
} from './knowledge-context';
import { buildSystemPrompt } from './system-prompt';
import { buildTicketContext } from './ticket-context';

import type {
  TicketPriority as DBTicketPriority,
  TicketStatus as DBTicketStatus,
} from '@/generated/prisma/enums';

export type AiChatRole = 'user' | 'assistant' | 'system';

type ConversationMessage = {
  role: AiChatRole;
  content: string;
};

type CustomerContext = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
};

type CustomerTicket = {
  subject: string;
  status: DBTicketStatus;
  priority: DBTicketPriority;
  updatedAt: Date;
  customer: { id: string; name: string };
};

type KnowledgeArticle = {
  title: string;
  category: string;
  content: string;
};

export function buildAiChatInput({
  assistant,
  message,
  history,
  articles,
  customer,
  tickets = [],
}: {
  assistant: string;
  message: string;
  history: ConversationMessage[];
  articles: KnowledgeArticle[];
  customer?: CustomerContext;
  tickets?: CustomerTicket[];
}): ConversationMessage[] {
  const relevantArticles = selectRelevantKnowledgeArticles(
    articles,
    message,
  );
  const scopedTickets = customer
    ? tickets.filter((ticket) => ticket.customer.id === customer.id)
    : [];

  return [
    {
      role: 'system',
      content: buildSystemPrompt(assistant),
    },
    ...(customer
      ? [{ role: 'system' as const, content: buildCustomerContext(customer) }]
      : []),
    ...(relevantArticles.length > 0
      ? [{ role: 'system' as const, content: buildKnowledgeContext(relevantArticles) }]
      : []),
    ...(scopedTickets.length > 0
      ? [{ role: 'system' as const, content: buildTicketContext(scopedTickets) }]
      : []),
    ...history,
    { role: 'user', content: message },
  ];
}
