import type { Ticket, TicketActivity } from '@/services/ticket.types';

export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
}

export interface CustomerDetail extends Customer {
  createdAt: string;
  updatedAt: string;
  tickets: Ticket[];
  activity: TicketActivity[];
}
