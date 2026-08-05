'use client';

import Link from 'next/link';
import { AlertTriangle, UserX } from 'lucide-react';

import { useCustomerDetail } from '@/hooks/use-customers';
import { CustomerDetail } from '@/components/customers/customer-detail';
import { CustomerDetailSkeleton } from '@/components/customers/customer-detail-skeleton';
import { CustomerTicketsTable } from '@/components/customers/customer-tickets-table';
import { CustomerActivityTimeline } from '@/components/customers/customer-activity-timeline';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface CustomerDetailClientProps {
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

export function CustomerDetailClient({ id }: CustomerDetailClientProps) {
  const { data, isLoading, error, refetch } = useCustomerDetail(id);

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (error) {
    if (isNotFoundError(error)) {
      return (
        <EmptyState
          icon={UserX}
          title="Customer not found"
          description="This customer does not exist or has been deleted."
          action={
            <Link href="/customers">
              <Button variant="outline">Back to Customers</Button>
            </Link>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load this customer. Please try again."
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (!data) {
    return <CustomerDetailSkeleton />;
  }

  return (
    <div className="space-y-6">
      <CustomerDetail customer={data} />

      <CustomerTicketsTable tickets={data.tickets} />

      <CustomerActivityTimeline activity={data.activity} />
    </div>
  );
}
