'use client';

import Link from 'next/link';
import { AlertTriangle, TicketX } from 'lucide-react';

import { useTicketDetail } from '@/hooks/use-tickets';
import { TicketDetail } from '@/components/tickets/ticket-detail';
import { TicketDetailSkeleton } from '@/components/tickets/ticket-detail-skeleton';
import { TicketActivityTimeline } from '@/components/tickets/ticket-activity-timeline';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface TicketDetailClientProps {
  id: string;
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export function TicketDetailClient({ id }: TicketDetailClientProps) {
  const { data, isLoading, error, refetch } = useTicketDetail(id);

  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (error) {
    if (isNotFoundError(error)) {
      return (
        <EmptyState
          icon={TicketX}
          title="Ticket not found"
          description="This ticket does not exist or has been deleted."
          action={
            <Link href="/tickets">
              <Button variant="outline">Back to Tickets</Button>
            </Link>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load this ticket. Please try again."
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (!data) {
    return <TicketDetailSkeleton />;
  }

  return (
    <div className="space-y-6">
      <TicketDetail ticket={data} />

      <TicketActivityTimeline activity={data.activity} />
    </div>
  );
}
