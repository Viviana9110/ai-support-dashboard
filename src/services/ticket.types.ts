export type TicketStatus = 'Open' | 'Pending' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: number;
  customer: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  agent: string;
  updatedAt: string;
}
