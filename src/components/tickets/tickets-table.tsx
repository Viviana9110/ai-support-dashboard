'use client';

import { Ticket } from '@/services/ticket.types';
import { TicketBadge } from './ticket-badge';

import { getPriorityVariant, getStatusVariant } from '@/lib/ticket-utils';
import { ArrowUpDown } from 'lucide-react';

interface TicketsTableProps {
  tickets: Ticket[];

  sortBy: (key: keyof Ticket) => void;

  sortKey: keyof Ticket | null;

  direction: 'asc' | 'desc';
}

export function TicketsTable({
  tickets,
  sortBy,
  sortKey,
  direction,
}: TicketsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('id')}
                className="flex items-center gap-2 font-semibold"
              >
                ID
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('customer')}
                className="flex items-center gap-2 font-semibold"
              >
                Customer
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left text-sm">Subject</th>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('status')}
                className="flex items-center gap-2 font-semibold"
              >
                Status
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('priority')}
                className="flex items-center gap-2 font-semibold"
              >
                Priority
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('agent')}
                className="flex items-center gap-2 font-semibold"
              >
                Agent
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left">
              <button
                onClick={() => sortBy('updated')}
                className="flex items-center gap-2 font-semibold"
              >
                Updated
                <ArrowUpDown size={16} />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{ticket.id}</td>
              <td className="p-4">{ticket.customer}</td>
              <td className="p-4">{ticket.subject}</td>
              <td className="p-4">
                <TicketBadge variant={getStatusVariant(ticket.status)}>
                  {ticket.status}
                </TicketBadge>
              </td>
              <td className="p-4">
                <TicketBadge variant={getPriorityVariant(ticket.priority)}>
                  {ticket.priority}
                </TicketBadge>
              </td>
              <td className="p-4">{ticket.agent}</td>
              <td className="p-4">{ticket.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
