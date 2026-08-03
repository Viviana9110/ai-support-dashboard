'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  ticketSchema,
  TicketFormData,
} from '@/lib/schemas/ticket.schema';

import { useCustomers } from '@/hooks/use-customers';
import { useUsers } from '@/hooks/use-users';

import type { Ticket } from '@/services/ticket.types';

interface TicketFormProps {
  ticket?: Ticket;
  isSubmitting: boolean;
  submitError: string | null;
  onCancel: () => void;
  onSubmit: (data: TicketFormData) => void;
}

export function TicketForm({
  ticket,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: TicketFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      status: 'Open',
      priority: 'Medium',
      agentId: '',
    },
  });

  useEffect(() => {
    if (!ticket) {
      reset({
        subject: '',
        status: 'Open',
        priority: 'Medium',
        agentId: '',
      });
      return;
    }

    reset({
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      customerId: ticket.customerId,
      agentId: ticket.agentId ?? '',
    });
  }, [ticket, reset]);

  const { data: customers = [] } = useCustomers();
  const { data: users = [] } = useUsers();

  const isEditing = !!ticket;

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          agentId: data.agentId === '' ? undefined : data.agentId,
        }),
      )}
      className="space-y-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Subject</label>

        <Input
          {...register('subject')}
          placeholder="Brief description of the issue"
        />

        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Customer</label>

        <select
          {...register('customerId')}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">Select a customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} — {customer.company}
            </option>
          ))}
        </select>

        {errors.customerId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.customerId.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Assigned Agent</label>

        <select
          {...register('agentId')}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">Unassigned</option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {errors.agentId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.agentId.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>

          <select
            {...register('priority')}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="Low">Low</option>

            <option value="Medium">Medium</option>

            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>

          <select
            {...register('status')}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="Open">Open</option>

            <option value="Pending">Pending</option>

            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save Changes'
              : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
}
