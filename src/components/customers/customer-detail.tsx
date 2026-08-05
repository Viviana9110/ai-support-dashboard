'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketBadge } from '@/components/tickets/ticket-badge';

import type { CustomerDetail as CustomerDetailData } from '@/services/customers/customers.types';

interface CustomerDetailProps {
  customer: CustomerDetailData;
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

export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>

          <p className="text-muted-foreground mt-1 text-sm">ID {customer.id}</p>
        </div>

        <TicketBadge
          variant={customer.status === 'Active' ? 'success' : 'warning'}
        >
          {customer.status}
        </TicketBadge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <DetailItem label="Name" value={customer.name} />
            <DetailItem label="Email" value={customer.email} />
            <DetailItem label="Company" value={customer.company} />
            <DetailItem label="Status" value={customer.status} />
            <DetailItem label="Created At" value={customer.createdAt} />
            <DetailItem label="Updated At" value={customer.updatedAt} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
