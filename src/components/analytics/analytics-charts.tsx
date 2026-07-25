'use client';

import { AnalyticsData } from '@/services/analytics/analytics.types';

import { TicketsLineChart } from './tickets-line-chart';
import { TicketStatusChart } from './ticket-status-chart';
import { TopAgents } from './top-agents';
import { ResolutionTimeChart } from './resolution-time-chart';

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      <TicketsLineChart data={data.monthlyTickets} />

      <div className="grid gap-8 lg:grid-cols-2">
        <TicketStatusChart data={data.ticketStatus} />

        <TopAgents data={data.topAgents} />

        <ResolutionTimeChart data={data.resolutionTime} />
      </div>
    </div>
  );
}
