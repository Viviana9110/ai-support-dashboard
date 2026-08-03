import { api } from './api';
import type { Ticket } from './ticket.types';
import type {
  TicketFormData,
  TicketUpdateData,
} from '@/lib/schemas/ticket.schema';

export type CreateTicketPayload = TicketFormData;

export type UpdateTicketPayload = TicketUpdateData;

export async function getTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/tickets');

  return data;
}

export async function getTicket(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`);

  return data;
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  const { data } = await api.post<Ticket>('/tickets', payload);

  return data;
}

export async function updateTicket(
  id: string,
  payload: UpdateTicketPayload,
): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, payload);

  return data;
}

export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`/tickets/${id}`);
}

export async function restoreTicket(id: string): Promise<Ticket> {
  const { data } = await api.post<Ticket>(`/tickets/${id}/restore`);

  return data;
}
