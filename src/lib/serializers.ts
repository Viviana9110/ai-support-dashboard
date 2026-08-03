import type {
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
  CustomerStatus,
} from '@/services/customers/customers.types';

import type {
  Conversation,
  Message,
} from '@/services/conversations/conversation.types';

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '@/services/ticket.types';

import {
  formatDate,
  formatRelativeTime,
  formatTime,
} from '@/lib/relative-time';

const TICKET_STATUS: Record<DBTicketStatus, TicketStatus> = {
  OPEN: 'Open',
  PENDING: 'Pending',
  CLOSED: 'Closed',
};

const TICKET_PRIORITY: Record<DBTicketPriority, TicketPriority> = {
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
    updatedAt: formatRelativeTime(dbTicket.updatedAt),
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
