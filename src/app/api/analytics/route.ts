import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';

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

function granularity(period: AnalyticsPeriod): 'hour' | 'day' | 'month' {
  if (period === 'today') return 'hour';
  if (period === '12m') return 'month';
  return 'day';
}

function dateFormat(period: AnalyticsPeriod): string {
  return period === 'today' ? 'YYYY-MM-DD HH24:00' : 'YYYY-MM-DD';
}

function bucketLabel(bucket: string, period: AnalyticsPeriod): string {
  switch (period) {
    case 'today':
      return `${String(Number(bucket.slice(11, 13))).padStart(2, '0')}:00`;
    case '7d':
      return WEEKDAYS[new Date(`${bucket}T00:00:00Z`).getUTCDay()];
    case '30d':
      return `W${Math.min(4, Math.floor(Number(bucket.slice(8, 10)) / 7) + 1)}`;
    case '12m':
      return MONTHS[new Date(`${bucket}T00:00:00Z`).getUTCMonth()];
  }
}

function formatMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}m ${m % 60}s`;
}

export async function GET(request: NextRequest) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rawPeriod = request.nextUrl.searchParams.get('period');
  const period: AnalyticsPeriod = PERIODS.includes(rawPeriod as AnalyticsPeriod)
    ? (rawPeriod as AnalyticsPeriod)
    : '7d';

  const since = new Date(Date.now() - PERIOD_DAYS[period] * 86_400_000);

  const unit = granularity(period);
  const format = dateFormat(period);

  const [statusGroups, agentGroups, bucketRows, resolutionRows] =
    await Promise.all([
      prisma.ticket.groupBy({
        by: ['status'],
        where: { deletedAt: null, createdAt: { gte: since } },
        _count: { _all: true },
      }),
      prisma.ticket.groupBy({
        by: ['agentId'],
        where: { deletedAt: null, createdAt: { gte: since } },
        _count: { _all: true },
        orderBy: { _count: { agentId: 'desc' } },
        take: 4,
      }),
      prisma.$queryRaw<{ bucket: string; count: number }[]>`
        SELECT to_char(date_trunc(${unit}, "createdAt"), ${format}) AS bucket,
               COUNT(*)::int AS count
        FROM "Ticket"
        WHERE "createdAt" >= ${since} AND "deletedAt" IS NULL
        GROUP BY bucket
        ORDER BY bucket
      `,
      prisma.$queryRaw<{ bucket: string; total: number; cnt: number }[]>`
        SELECT to_char(date_trunc(${unit}, "createdAt"), ${format}) AS bucket,
               SUM(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 60)::double precision AS total,
               COUNT(*)::int AS cnt
        FROM "Ticket"
        WHERE status = 'CLOSED' AND "createdAt" >= ${since} AND "deletedAt" IS NULL
        GROUP BY bucket
        ORDER BY bucket
      `,
    ]);

  const statusCounts: Record<string, number> = { Open: 0, Pending: 0, Closed: 0 };

  for (const group of statusGroups) {
    const key =
      group.status === 'OPEN'
        ? 'Open'
        : group.status === 'PENDING'
          ? 'Pending'
          : 'Closed';
    statusCounts[key] = group._count._all;
  }

  const agentIds = agentGroups
    .map((group) => group.agentId)
    .filter((id): id is string => id !== null);

  const users = agentIds.length
    ? await prisma.user.findMany({
        where: { id: { in: agentIds } },
        select: { id: true, name: true },
      })
    : [];

  const nameById = new Map(users.map((user) => [user.id, user.name]));

  const topAgents: TopAgent[] = agentGroups.map((group) => ({
    name: group.agentId
      ? (nameById.get(group.agentId) ?? 'Unknown')
      : 'Unassigned',
    tickets: group._count._all,
  }));

  const monthlyTickets: MonthlyTickets[] = [];

  for (const row of bucketRows) {
    const label = bucketLabel(row.bucket, period);
    const existing = monthlyTickets.find((entry) => entry.month === label);

    if (existing) {
      existing.tickets += row.count;
    } else {
      monthlyTickets.push({ month: label, tickets: row.count });
    }
  }

  const resolutionAgg: Record<string, { total: number; cnt: number }> = {};

  for (const row of resolutionRows) {
    const label = bucketLabel(row.bucket, period);
    const entry = (resolutionAgg[label] ??= { total: 0, cnt: 0 });

    entry.total += row.total;
    entry.cnt += row.cnt;
  }

  const resolutionTime: ResolutionTime[] = Object.entries(resolutionAgg).map(
    ([day, entry]) => ({
      day,
      minutes: entry.cnt > 0 ? Math.round(entry.total / entry.cnt) : 0,
    }),
  );

  const ticketStatus: TicketStatus[] = (['Open', 'Pending', 'Closed'] as const)
    .filter((status) => statusCounts[status] > 0)
    .map((name) => ({ name, value: statusCounts[name] }));

  const totalTickets = bucketRows.reduce((sum, row) => sum + row.count, 0);
  const closedTickets = statusCounts['Closed'];
  const resolutionRate =
    totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;

  const avgResolution = resolutionTime.length
    ? resolutionTime.reduce((sum, entry) => sum + entry.minutes, 0) /
      resolutionTime.length
    : 0;

  const data: AnalyticsData = {
    tickets: totalTickets,
    responseTime: formatMinutes(avgResolution),
    resolutionRate,
    monthlyTickets,
    ticketStatus,
    topAgents,
    resolutionTime,
  };

  return NextResponse.json(data);
}
