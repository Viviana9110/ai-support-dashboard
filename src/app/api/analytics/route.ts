import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

import type {
  AnalyticsData,
  AnalyticsPeriod,
  MonthlyTickets,
  ResolutionTime,
  TicketStatus,
  TopAgent,
} from '@/services/analytics/analytics.types';

const PERIODS: AnalyticsPeriod[] = ['today', '7d', '30d', '12m'];

const PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  today: 1,
  '7d': 7,
  '30d': 30,
  '12m': 365,
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function bucketLabel(date: Date, period: AnalyticsPeriod): string {
  switch (period) {
    case 'today':
      return `${String(date.getHours()).padStart(2, '0')}:00`;
    case '7d':
      return WEEKDAYS[date.getDay()];
    case '30d':
      return `W${Math.min(4, Math.floor(date.getDate() / 7) + 1)}`;
    case '12m':
      return MONTHS[date.getMonth()];
  }
}

function bucketOrder(label: string, period: AnalyticsPeriod): number {
  switch (period) {
    case 'today':
      return Number(label.split(':')[0]);
    case '7d':
      return WEEKDAYS.indexOf(label);
    case '30d':
      return Number(label.slice(1));
    case '12m':
      return MONTHS.indexOf(label);
  }
}

function formatMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}m ${m % 60}s`;
}

export async function GET(request: NextRequest) {
  const rawPeriod = request.nextUrl.searchParams.get('period');
  const period: AnalyticsPeriod = PERIODS.includes(rawPeriod as AnalyticsPeriod)
    ? (rawPeriod as AnalyticsPeriod)
    : '7d';

  const since = new Date(Date.now() - PERIOD_DAYS[period] * 86_400_000);

  const tickets = await prisma.ticket.findMany({
    where: { createdAt: { gte: since } },
    include: { agent: true },
  });

  const statusCounts: Record<string, number> = {
    Open: 0,
    Pending: 0,
    Closed: 0,
  };
  const agentCounts: Record<string, number> = {};
  const ticketsByBucket: Record<string, number> = {};
  const resolutionByBucket: Record<string, { total: number; count: number }> = {};

  for (const ticket of tickets) {
    const label = bucketLabel(ticket.createdAt, period);

    ticketsByBucket[label] = (ticketsByBucket[label] ?? 0) + 1;

    const status =
      ticket.status === 'OPEN'
        ? 'Open'
        : ticket.status === 'PENDING'
          ? 'Pending'
          : 'Closed';

    statusCounts[status] += 1;
    agentCounts[ticket.agent?.name ?? 'Unassigned'] =
      (agentCounts[ticket.agent?.name ?? 'Unassigned'] ?? 0) + 1;

    if (ticket.status === 'CLOSED') {
      const minutes =
        (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / 60_000;

      const bucket = (resolutionByBucket[label] ??= { total: 0, count: 0 });
      bucket.total += minutes;
      bucket.count += 1;
    }
  }

  const monthlyTickets: MonthlyTickets[] = Object.entries(ticketsByBucket)
    .map(([month, tickets]) => ({ month, tickets }))
    .sort((a, b) => bucketOrder(a.month, period) - bucketOrder(b.month, period));

  const ticketStatus: TicketStatus[] = (['Open', 'Pending', 'Closed'] as const)
    .filter((status) => statusCounts[status] > 0)
    .map((name) => ({ name, value: statusCounts[name] }));

  const topAgents: TopAgent[] = Object.entries(agentCounts)
    .map(([name, tickets]) => ({ name, tickets }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 4);

  const resolutionTime: ResolutionTime[] = Object.entries(resolutionByBucket)
    .map(([day, { total, count }]) => ({
      day,
      minutes: Math.round(total / count),
    }))
    .sort((a, b) => bucketOrder(a.day, period) - bucketOrder(b.day, period));

  const totalTickets = tickets.length;
  const closedTickets = statusCounts['Closed'];
  const satisfaction =
    totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;

  const avgResolution = resolutionTime.length
    ? resolutionTime.reduce((sum, entry) => sum + entry.minutes, 0) /
      resolutionTime.length
    : 0;

  const data: AnalyticsData = {
    revenue: 0,
    tickets: totalTickets,
    responseTime: formatMinutes(avgResolution),
    satisfaction,
    monthlyTickets,
    ticketStatus,
    topAgents,
    resolutionTime,
  };

  return NextResponse.json(data);
}
