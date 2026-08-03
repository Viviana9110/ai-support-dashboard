'use client';

import { Ticket } from '@/services/ticket.types';
import { TicketBadge } from './ticket-badge';

import { getPriorityVariant, getStatusVariant } from '@/lib/ticket-utils';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface TicketsTableProps {
  tickets: Ticket[];

  sortBy: (key: keyof Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

export function TicketsTable({
  tickets,
  sortBy,
  onEdit,
  onDelete,
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
                onClick={() => sortBy('updatedAt')}
                className="flex items-center gap-2 font-semibold"
              >
                Updated
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{ticket.id}</td>
              <td className="p-4">{ticket.customer}</td>
              <td className="p-4">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="font-medium hover:underline"
                >
                  {ticket.subject}
                </Link>
              </td>
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
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(ticket)}
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(ticket)}
                    className="rounded p-2 hover:bg-red-100"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
