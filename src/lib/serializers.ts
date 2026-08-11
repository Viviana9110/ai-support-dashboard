import type {
  AiMessageRole as DBAiMessageRole,
  ArticleStatus as DBArticleStatus,
  CustomerStatus as DBCustomerStatus,
  MessageSender as DBMessageSender,
  TicketPriority as DBTicketPriority,
  TicketStatus as DBTicketStatus,
} from '@/generated/prisma/enums';

import type {
  ArticleStatus,
  KnowledgeArticle,
} from '@/services/knowledge/knowledge.types';

import type {
  Customer,
  CustomerDetail,
  CustomerStatus,
} from '@/services/customers/customers.types';

import type {
  Conversation,
  ConversationDetail,
  Message,
} from '@/services/conversations/conversation.types';

import type {
  Ticket,
  TicketActivity,
  TicketDetail,
  TicketPriority,
  TicketStatus,
} from '@/services/ticket.types';

import {
  formatDate,
  formatRelativeTime,
  formatTime,
} from '@/lib/relative-time';

export const TICKET_STATUS: Record<DBTicketStatus, TicketStatus> = {
  OPEN: 'Open',
  PENDING: 'Pending',
  CLOSED: 'Closed',
};

export const TICKET_PRIORITY: Record<DBTicketPriority, TicketPriority> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const CUSTOMER_STATUS: Record<DBCustomerStatus, CustomerStatus> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

const ARTICLE_STATUS: Record<DBArticleStatus, ArticleStatus> = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

const MESSAGE_SENDER: Record<DBMessageSender, Message['sender']> = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  SYSTEM: 'agent',
};

const TICKET_STATUS_REVERSE: Record<TicketStatus, DBTicketStatus> = {
  Open: 'OPEN',
  Pending: 'PENDING',
  Closed: 'CLOSED',
};

const TICKET_PRIORITY_REVERSE: Record<TicketPriority, DBTicketPriority> = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
};

const CUSTOMER_STATUS_REVERSE: Record<CustomerStatus, DBCustomerStatus> = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
};

export function toDBTicketStatus(status: TicketStatus): DBTicketStatus {
  return TICKET_STATUS_REVERSE[status];
}

export function toDBTicketPriority(priority: TicketPriority): DBTicketPriority {
  return TICKET_PRIORITY_REVERSE[priority];
}

export function toDBCustomerStatus(status: CustomerStatus): DBCustomerStatus {
  return CUSTOMER_STATUS_REVERSE[status];
}

export function serializeTicket(dbTicket: {
  id: string;
  subject: string;
  status: DBTicketStatus;
  priority: DBTicketPriority;
  customer: { id: string; name: string };
  agent: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
}): Ticket {
  return {
    id: dbTicket.id,
    customer: dbTicket.customer.name,
    customerId: dbTicket.customer.id,
    subject: dbTicket.subject,
    status: TICKET_STATUS[dbTicket.status],
    priority: TICKET_PRIORITY[dbTicket.priority],
    agent: dbTicket.agent?.name ?? '',
    agentId: dbTicket.agent?.id ?? null,
    createdAt: formatRelativeTime(dbTicket.createdAt),
    updatedAt: formatRelativeTime(dbTicket.updatedAt),
  };
}

export function serializeAuditLog(dbLog: {
  id: string;
  action: string;
  metadata: unknown;
  createdAt: Date;
  user: { name: string } | null;
}): TicketActivity {
  return {
    id: dbLog.id,
    action: dbLog.action,
    metadata: (dbLog.metadata as Record<string, unknown> | null) ?? null,
    createdAt: formatRelativeTime(dbLog.createdAt),
    user: dbLog.user?.name ?? null,
  };
}

export function serializeTicketDetail(
  dbTicket: {
    id: string;
    subject: string;
    status: DBTicketStatus;
    priority: DBTicketPriority;
    customer: { id: string; name: string };
    agent: { id: string; name: string } | null;
    createdAt: Date;
    updatedAt: Date;
  },
  activity: {
    id: string;
    action: string;
    metadata: unknown;
    createdAt: Date;
    user: { name: string } | null;
  }[],
): TicketDetail {
  return {
    ...serializeTicket(dbTicket),
    activity: activity.map(serializeAuditLog),
  };
}

export function serializeCustomer(dbCustomer: {
  id: string;
  name: string;
  email: string;
  company: string;
  status: DBCustomerStatus;
}): Customer {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    email: dbCustomer.email,
    company: dbCustomer.company,
    status: CUSTOMER_STATUS[dbCustomer.status],
  };
}

export function serializeCustomerDetail(
  dbCustomer: {
    id: string;
    name: string;
    email: string;
    company: string;
    status: DBCustomerStatus;
    createdAt: Date;
    updatedAt: Date;
  },
  dbTickets: Parameters<typeof serializeTicket>[0][],
  dbActivity: Parameters<typeof serializeAuditLog>[0][],
): CustomerDetail {
  return {
    ...serializeCustomer(dbCustomer),
    createdAt: formatRelativeTime(dbCustomer.createdAt),
    updatedAt: formatRelativeTime(dbCustomer.updatedAt),
    tickets: dbTickets.map(serializeTicket),
    activity: dbActivity.map(serializeAuditLog),
  };
}

export function serializeMessage(dbMessage: {
  id: string;
  sender: DBMessageSender;
  text: string;
  createdAt: Date;
}): Message {
  return {
    id: dbMessage.id,
    sender: MESSAGE_SENDER[dbMessage.sender],
    text: dbMessage.text,
    time: formatTime(dbMessage.createdAt),
  };
}

export function serializeConversation(dbConversation: {
  id: string;
  customer: { name: string };
  avatar: string;
  online: boolean;
  unread: number;
  lastMessage: string;
  updatedAt: Date;
  messages: {
    id: string;
    sender: DBMessageSender;
    text: string;
    createdAt: Date;
  }[];
}): Conversation {
  return {
    id: dbConversation.id,
    customer: dbConversation.customer.name,
    avatar: dbConversation.avatar,
    online: dbConversation.online,
    unread: dbConversation.unread,
    lastMessage: dbConversation.lastMessage,
    updatedAt: formatRelativeTime(dbConversation.updatedAt),
    messages: dbConversation.messages.map(serializeMessage),
  };
}

export function serializeConversationDetail(
  dbConversation: Parameters<typeof serializeConversation>[0] & {
    customer: {
      id: string;
      name: string;
      email: string;
      company: string;
      status: DBCustomerStatus;
    };
  },
): ConversationDetail {
  const conversation = serializeConversation(dbConversation);

  return {
    ...conversation,
    customer: serializeCustomer(dbConversation.customer),
    messages: dbConversation.messages.map(serializeMessage),
  };
}

export function serializeArticle(dbArticle: {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: DBArticleStatus;
  author: { name: string };
  updatedAt: Date;
  views: number;
}): KnowledgeArticle {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    slug: dbArticle.slug,
    category: dbArticle.category,
    status: ARTICLE_STATUS[dbArticle.status],
    author: dbArticle.author.name,
    updatedAt: formatDate(dbArticle.updatedAt),
    views: dbArticle.views,
  };
}

export interface AiConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  lastMessageRole: AiMessage['role'] | null;
}

export function serializeAiConversation(dbAiConversation: {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { messages: number };
  messages?: { role: DBAiMessageRole; content: string }[];
}): AiConversationSummary {
  const messages = dbAiConversation.messages ?? [];

  const lastMessage = messages[messages.length - 1];

  return {
    id: dbAiConversation.id,
    title: dbAiConversation.title,
    createdAt: dbAiConversation.createdAt.toISOString(),
    updatedAt: dbAiConversation.updatedAt.toISOString(),
    messageCount:
      dbAiConversation._count?.messages ?? messages.length,
    lastMessage: lastMessage?.content ?? null,
    lastMessageRole: lastMessage
      ? AI_MESSAGE_ROLE[lastMessage.role]
      : null,
  };
}

const AI_MESSAGE_ROLE: Record<DBAiMessageRole, AiMessage['role']> = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface AiConversationDetail extends AiConversationSummary {
  messages: AiMessage[];
}

export function serializeAiMessage(dbAiMessage: {
  id: string;
  role: DBAiMessageRole;
  content: string;
  createdAt: Date;
}): AiMessage {
  return {
    id: dbAiMessage.id,
    role: AI_MESSAGE_ROLE[dbAiMessage.role],
    content: dbAiMessage.content,
    createdAt: dbAiMessage.createdAt.toISOString(),
  };
}

export function serializeAiConversationDetail(
  dbAiConversation: Parameters<typeof serializeAiConversation>[0] & {
    messages: Parameters<typeof serializeAiMessage>[0][];
  },
): AiConversationDetail {
  return {
    ...serializeAiConversation(dbAiConversation),
    messages: dbAiConversation.messages.map(serializeAiMessage),
  };
}
