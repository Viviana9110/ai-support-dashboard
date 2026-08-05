'use client';

import Link from 'next/link';
import { TicketX } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketBadge } from '@/components/tickets/ticket-badge';
import { getPriorityVariant, getStatusVariant } from '@/lib/ticket-utils';

import type { Ticket } from '@/services/ticket.types';

interface CustomerTicketsTableProps {
  tickets: Ticket[];
}

export function CustomerTicketsTable({ tickets }: CustomerTicketsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Tickets</CardTitle>
      </CardHeader>

      <CardContent>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <TicketX size={22} className="text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">No tickets found</p>

            <p className="text-muted-foreground mt-1 text-sm">
              This customer has no active tickets.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-muted-foreground border-b border-border text-left text-xs font-medium uppercase tracking-wide">
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3 pr-4">Assigned Agent</th>
                <th className="pb-3">Updated</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-medium hover:underline"
                    >
                      {ticket.subject}
                    </Link>
                  </td>

                  <td className="py-3 pr-4">
                    <TicketBadge variant={getStatusVariant(ticket.status)}>
                      {ticket.status}
                    </TicketBadge>
                  </td>

                  <td className="py-3 pr-4">
                    <TicketBadge variant={getPriorityVariant(ticket.priority)}>
                      {ticket.priority}
                    </TicketBadge>
                  </td>

                  <td className="py-3 pr-4">
                    {ticket.agent || 'Unassigned'}
                  </td>

                  <td className="py-3">{ticket.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
