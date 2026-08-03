import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeTicket } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: { deletedAt: null },
    include: { customer: true, agent: true },
  });

  return NextResponse.json(serializeTicket(ticket));
}
