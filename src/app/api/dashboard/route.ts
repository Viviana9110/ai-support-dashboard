import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { formatRelativeTime } from '@/lib/relative-time';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAYS_ON_CHART = 7;

export async function GET() {
  const since = new Date(Date.now() - (DAYS_ON_CHART - 1) * 86_400_000);

  const [statusGroups, customerCount, articleCount, activeAgentCount, activity, dayRows] =
    await Promise.all([
      prisma.ticket.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { _all: true },
      }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.knowledgeArticle.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: 'AGENT', deletedAt: null } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
      prisma.$queryRaw<{ day: string; count: number }[]>`
        SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
               COUNT(*)::int AS count
        FROM "Ticket"
        WHERE "createdAt" >= ${since} AND "deletedAt" IS NULL
        GROUP BY day
        ORDER BY day
      `,
    ]);

  const statusCount: Record<string, number> = {};

  let totalTickets = 0;

  for (const group of statusGroups) {
    statusCount[group.status] = group._count._all;
    totalTickets += group._count._all;
  }

  const ticketsByDayMap = new Map<string, number>();

  for (const row of dayRows) {
    ticketsByDayMap.set(row.day, row.count);
  }

  const ticketsByDay = Array.from({ length: DAYS_ON_CHART }, (_, index) => {
    const offset = DAYS_ON_CHART - 1 - index;
    const date = new Date(Date.now() - offset * 86_400_000);
    const key = date.toISOString().slice(0, 10);

    return {
      day: WEEKDAYS[date.getUTCDay()],
      tickets: ticketsByDayMap.get(key) ?? 0,
    };
  });

  const recentActivity = activity.map((log) => ({
    id: log.id,
    user: log.user?.name ?? null,
    action: log.action,
    entity: log.entity,
    createdAt: formatRelativeTime(log.createdAt),
  }));

  return NextResponse.json({
    metrics: {
      totalTickets,
      openTickets: statusCount['OPEN'] ?? 0,
      pendingTickets: statusCount['PENDING'] ?? 0,
      closedTickets: statusCount['CLOSED'] ?? 0,
      customers: customerCount,
      knowledgeArticles: articleCount,
      activeAgents: activeAgentCount,
    },
    ticketsByDay,
    recentActivity,
  });
}
