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
  createdAt: string;
  updatedAt: string;
}

export interface TicketActivity {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: string | null;
}

export interface TicketDetail extends Ticket {
  activity: TicketActivity[];
}
