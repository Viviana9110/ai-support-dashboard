'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketBadge } from './ticket-badge';
import { getPriorityVariant, getStatusVariant } from '@/lib/ticket-utils';

import type { TicketDetail as TicketDetailData } from '@/services/ticket.types';

interface TicketDetailProps {
  ticket: TicketDetailData;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to tickets
      </Link>

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>

          <p className="text-muted-foreground mt-1 text-sm">ID {ticket.id}</p>
        </div>

        <div className="flex gap-2">
          <TicketBadge variant={getStatusVariant(ticket.status)}>
            {ticket.status}
          </TicketBadge>

          <TicketBadge variant={getPriorityVariant(ticket.priority)}>
            {ticket.priority}
          </TicketBadge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <DetailItem label="Customer" value={ticket.customer} />
            <DetailItem
              label="Assigned Agent"
              value={ticket.agent || 'Unassigned'}
            />
            <DetailItem label="Created At" value={ticket.createdAt} />
            <DetailItem label="Updated At" value={ticket.updatedAt} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
