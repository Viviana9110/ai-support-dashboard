import { formatRelativeTime } from '@/lib/relative-time';
import { TICKET_PRIORITY, TICKET_STATUS } from '@/lib/serializers';

import type {
  TicketPriority as DBTicketPriority,
  TicketStatus as DBTicketStatus,
} from '@/generated/prisma/enums';

type TicketCustomer = {
  id: string;
  name: string;
};

type TicketContextRecord = {
  subject: string;
  status: DBTicketStatus;
  priority: DBTicketPriority;
  updatedAt: Date;
  customer: TicketCustomer;
};

export function buildTicketContext(tickets: TicketContextRecord[]): string {
  const blocks = tickets.map((ticket) =>
    [
      'Ticket',
      `Customer: ${ticket.customer.name} (${ticket.customer.id})`,
      `Subject: ${ticket.subject}`,
      `Priority: ${TICKET_PRIORITY[ticket.priority]}`,
      `Status: ${TICKET_STATUS[ticket.status]}`,
      `Last Updated: ${formatRelativeTime(ticket.updatedAt)}`,
    ].join('\n'),
  );

  return ['Open Tickets', ...blocks].join('\n\n');
}
