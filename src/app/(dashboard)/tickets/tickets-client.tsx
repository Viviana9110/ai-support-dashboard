'use client';

import { useMemo, useState } from 'react';

import { useCreateTicket, useDeleteTicket, useTickets, useUpdateTicket } from '@/hooks/use-tickets';
import { useToast } from '@/hooks/use-toast';
import { TicketsToolbar } from '@/components/tickets/tickets-toolbar';
import { TicketsTable } from '@/components/tickets/tickets-table';
import { TicketForm } from '@/components/tickets/ticket-form';
import { useSort } from '@/hooks/use-sort';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/shared/pagination';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import type { TicketFormData } from '@/lib/schemas/ticket.schema';
import type { UpdateTicketPayload } from '@/services/ticket.service';
import type { Ticket } from '@/services/ticket.types';

export function TicketsClient() {
  const { data = [], isLoading, error } = useTickets();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    return data.filter((ticket) => {
      const matchesSearch =
        ticket.customer.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'all' || ticket.status === status;

      const matchesPriority =
        priority === 'all' || ticket.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, search, status, priority]);

  const { sortedItems, sortBy } = useSort(filteredTickets);

  const { paginatedItems, page, totalPages, nextPage, previousPage } =
    usePagination(sortedItems, 5);

  function handleOpenCreate() {
    setSubmitError(null);
    setCreateOpen(true);
  }

  function handleCloseCreate() {
    if (createTicket.isPending) return;

    setSubmitError(null);
    setCreateOpen(false);
  }

  async function handleCreateTicket(data: TicketFormData) {
    setSubmitError(null);

    try {
      await createTicket.mutateAsync(data);

      setCreateOpen(false);

      toast.success('Ticket created', 'The ticket was created successfully.');
    } catch {
      setSubmitError('Something went wrong while creating the ticket.');

      toast.error('Failed to create ticket', 'Something went wrong.');
    }
  }

  function handleEditTicket(ticket: Ticket) {
    setEditingTicket(ticket);
    setEditError(null);
    setEditOpen(true);
  }

  function handleCloseEdit() {
    if (updateTicket.isPending) return;

    setEditingTicket(null);
    setEditError(null);
    setEditOpen(false);
  }

  async function handleUpdateTicket(data: TicketFormData) {
    if (!editingTicket) return;

    setEditError(null);

    const payload: UpdateTicketPayload = {
      subject: data.subject,
      status: data.status,
      priority: data.priority,
      customerId: data.customerId,
    };

    if (data.agentId !== undefined) {
      payload.agentId = data.agentId;
    } else if (editingTicket.agentId !== null) {
      payload.agentId = null;
    }

    try {
      await updateTicket.mutateAsync({ id: editingTicket.id, payload });

      setEditingTicket(null);
      setEditOpen(false);

      toast.success('Ticket updated', 'The ticket was updated successfully.');
    } catch {
      setEditError('Something went wrong while updating the ticket.');

      toast.error('Failed to update ticket', 'Something went wrong.');
    }
  }

  async function handleDeleteTicket() {
    if (!ticketToDelete) return;

    try {
      await deleteTicket.mutateAsync(ticketToDelete.id);

      setTicketToDelete(null);

      toast.success('Ticket deleted', 'The ticket was deleted successfully.');
    } catch {
      toast.error('Failed to delete ticket', 'Something went wrong.');
    }
  }

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error...</p>;

  return (
    <div className="space-y-6">
      <TicketsToolbar
        search={search}
        status={status}
        priority={priority}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onNewTicket={handleOpenCreate}
      />

      <TicketsTable
        tickets={paginatedItems}
        sortBy={sortBy}
        onEdit={handleEditTicket}
        onDelete={setTicketToDelete}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        nextPage={nextPage}
        previousPage={previousPage}
      />

      <Modal
        open={createOpen}
        title="New Ticket"
        onClose={handleCloseCreate}
      >
        <TicketForm
          isSubmitting={createTicket.isPending}
          submitError={submitError}
          onCancel={handleCloseCreate}
          onSubmit={handleCreateTicket}
        />
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Ticket"
        onClose={handleCloseEdit}
      >
        <TicketForm
          ticket={editingTicket ?? undefined}
          isSubmitting={updateTicket.isPending}
          submitError={editError}
          onCancel={handleCloseEdit}
          onSubmit={handleUpdateTicket}
        />
      </Modal>

      <ConfirmDialog
        open={!!ticketToDelete}
        title="Delete Ticket"
        description={`Are you sure you want to delete "${ticketToDelete?.subject}"? This action can be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteTicket.isPending}
        onCancel={() => setTicketToDelete(null)}
        onConfirm={handleDeleteTicket}
      />
    </div>
  );
}
