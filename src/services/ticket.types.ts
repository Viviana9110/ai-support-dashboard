export type TicketStatus = 'Open' | 'Pending' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: string;
  customer: string;
  customerId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  agent: string;
  agentId: string | null;
  updatedAt: string;
}
