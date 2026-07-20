'use client';

import { useMemo, useState } from 'react';

import { useTickets } from '@/hooks/use-tickets';
import { TicketsToolbar } from '@/components/tickets/tickets-toolbar';
import { TicketsTable } from '@/components/tickets/tickets-table';
import { useSort } from '@/hooks/use-sort';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/shared/pagination';

export function TicketsClient() {
  const { data = [], isLoading, error } = useTickets();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

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

  const { sortedItems, sortBy, sortKey, direction } = useSort(filteredTickets);

  const { paginatedItems, page, totalPages, nextPage, previousPage } =
    usePagination(sortedItems, 5);

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
      />

      <TicketsTable
        tickets={paginatedItems}
        sortBy={sortBy}
        sortKey={sortKey}
        direction={direction}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </div>
  );
}
