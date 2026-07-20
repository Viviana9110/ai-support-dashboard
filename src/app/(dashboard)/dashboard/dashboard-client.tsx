'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { MessageSquare, Star, Ticket, Users } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { RecentTickets } from '@/components/dashboard/recent-tickets';
import { TicketsChart } from '@/components/dashboard/tickets-chart';

export function DashboardClient() {
  const { data, isLoading, error } = useDashboard();

  return (
    <>
      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading users...</p>
      )}

      {error && <p className="text-red-500">Something went wrong.</p>}

      {data && (
        <p className="text-muted-foreground text-sm">
          API loaded successfully. {data.length} users found.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Open Tickets"
          value="143"
          icon={<Ticket className="text-blue-500" />}
        />

        <DashboardCard
          title="Conversations"
          value="82"
          icon={<MessageSquare className="text-green-500" />}
        />

        <DashboardCard
          title="Customers"
          value="210"
          icon={<Users className="text-orange-500" />}
        />

        <DashboardCard
          title="Satisfaction"
          value="98%"
          icon={<Star className="text-yellow-500" />}
        />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>

        <div>
          <TicketsChart />
        </div>
      </div>
    </>
  );
}
