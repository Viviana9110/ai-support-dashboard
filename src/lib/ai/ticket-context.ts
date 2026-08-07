import { formatRelativeTime } from '@/lib/relative-time';
import { TICKET_PRIORITY, TICKET_STATUS } from '@/lib/serializers';

import type {
  TicketPriority as DBTicketPriority,
  TicketStatus as DBTicketStatus,
} from '@/generated/prisma/enums';

type TicketContextRecord = {
  subject: string;
  status: DBTicketStatus;
  priority: DBTicketPriority;
  updatedAt: Date;
};

export function buildTicketContext(tickets: TicketContextRecord[]): string {
  const blocks = tickets.map((ticket) =>
    [
      'Ticket',
      `Subject: ${ticket.subject}`,
      `Priority: ${TICKET_PRIORITY[ticket.priority]}`,
      `Status: ${TICKET_STATUS[ticket.status]}`,
      `Last Updated: ${formatRelativeTime(ticket.updatedAt)}`,
    ].join('\n'),
  );

  return ['Open Tickets', ...blocks].join('\n\n');
}
