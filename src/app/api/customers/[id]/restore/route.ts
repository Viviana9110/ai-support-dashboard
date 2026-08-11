import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import { serializeCustomer } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.customer.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Customer not found.' },
      { status: 404 },
    );
  }

  const actorId = await getActorId();

  const customer = await prisma.$transaction(async (tx) => {
    const restored = await tx.customer.update({
      where: { id },
      data: { deletedAt: null },
    });

    await writeAuditLog(tx, {
      entity: 'Customer',
      entityId: restored.id,
      action: 'restored',
      userId: actorId,
      metadata: {
        name: existing.name,
        restoredAt: new Date().toISOString(),
      },
    });

    return restored;
  });

  return NextResponse.json(serializeCustomer(customer));
}
