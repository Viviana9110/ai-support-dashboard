'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTicket, deleteTicket, getTickets, restoreTicket, updateTicket } from '@/services/ticket.service';

import type { Ticket } from '@/services/ticket.types';
import type { UpdateTicketPayload } from '@/services/ticket.service';
import type { Customer } from '@/services/customers/customers.types';
import type { User } from '@/services/dashboard.types';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

interface UpdateTicketInput {
  id: string;
  payload: UpdateTicketPayload;
}

function applyOptimisticUpdate(
  ticket: Ticket,
  payload: UpdateTicketPayload,
  customers: Customer[],
  users: User[],
): Ticket {
  const next: Ticket = { ...ticket };

  if (payload.subject !== undefined) {
    next.subject = payload.subject;
  }

  if (payload.status !== undefined) {
    next.status = payload.status;
  }

  if (payload.priority !== undefined) {
    next.priority = payload.priority;
  }

  if (payload.customerId !== undefined) {
    next.customerId = payload.customerId;
    next.customer =
      customers.find((customer) => customer.id === payload.customerId)?.name ??
      ticket.customer;
  }

  if (payload.agentId !== undefined) {
    next.agentId = payload.agentId;
    next.agent =
      users.find((user) => user.id === payload.agentId)?.name ?? '';
  }

  return next;
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTicketInput) =>
      updateTicket(id, payload),

    onMutate: async ({ id, payload }: UpdateTicketInput) => {
      await queryClient.cancelQueries({ queryKey: ['tickets'] });

      const previous = queryClient.getQueryData<Ticket[]>(['tickets']);

      const customers =
        queryClient.getQueryData<Customer[]>(['customers']) ?? [];

      const users = queryClient.getQueryData<User[]>(['users']) ?? [];

      queryClient.setQueryData<Ticket[]>(['tickets'], (old = []) =>
        old.map((ticket) =>
          ticket.id === id
            ? applyOptimisticUpdate(ticket, payload, customers, users)
            : ticket,
        ),
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tickets'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTicket,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tickets'] });

      const previous = queryClient.getQueryData<Ticket[]>(['tickets']);

      queryClient.setQueryData<Ticket[]>(['tickets'], (old = []) =>
        old.filter((ticket) => ticket.id !== id),
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tickets'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useRestoreTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
