'use client';

import {
  BookOpen,
  CheckCircle2,
  CircleDot,
  Clock3,
  Ticket,
  UserCheck,
  Users,
} from 'lucide-react';

import { useDashboard } from '@/hooks/use-dashboard';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TicketsChart } from '@/components/dashboard/tickets-chart';

export function DashboardClient() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Loading dashboard...</p>
    );
  }

  if (error || !data) {
    return <p className="text-red-500">Something went wrong.</p>;
  }

  const { metrics, ticketsByDay, recentActivity } = data;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Tickets"
          value={String(metrics.totalTickets)}
          icon={<Ticket className="text-blue-500" />}
        />

        <DashboardCard
          title="Open Tickets"
          value={String(metrics.openTickets)}
          icon={<CircleDot className="text-emerald-500" />}
        />

        <DashboardCard
          title="Pending Tickets"
          value={String(metrics.pendingTickets)}
          icon={<Clock3 className="text-amber-500" />}
        />

        <DashboardCard
          title="Closed Tickets"
          value={String(metrics.closedTickets)}
          icon={<CheckCircle2 className="text-violet-500" />}
        />

        <DashboardCard
          title="Customers"
          value={String(metrics.customers)}
          icon={<Users className="text-orange-500" />}
        />

        <DashboardCard
          title="Knowledge Articles"
          value={String(metrics.knowledgeArticles)}
          icon={<BookOpen className="text-sky-500" />}
        />

        <DashboardCard
          title="Active Agents"
          value={String(metrics.activeAgents)}
          icon={<UserCheck className="text-rose-500" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activity={recentActivity} />
        </div>

        <div>
          <TicketsChart data={ticketsByDay} />
        </div>
      </div>
    </>
  );
}
