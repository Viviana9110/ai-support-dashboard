import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import { serializeTicket } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireRole(['ADMIN']);

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const actorId = await getActorId();

  const ticket = await prisma.$transaction(async (tx) => {
    const restored = await tx.ticket.update({
      where: { id },
      data: { deletedAt: null },
      include: { customer: true, agent: true },
    });

    await writeAuditLog(tx, {
      entity: 'Ticket',
      entityId: restored.id,
      action: 'restored',
      userId: actorId,
      metadata: {
        subject: restored.subject,
        restoredAt: new Date().toISOString(),
      },
    });

    return restored;
  });

  return NextResponse.json(serializeTicket(ticket));
}
