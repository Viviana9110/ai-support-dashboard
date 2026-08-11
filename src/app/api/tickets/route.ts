import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import {
  serializeTicket,
  toDBTicketPriority,
  toDBTicketStatus,
} from '@/lib/serializers';
import { ticketSchema } from '@/lib/schemas/ticket.schema';

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const tickets = await prisma.ticket.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: { customer: true, agent: true },
  });

  return NextResponse.json(tickets.map(serializeTicket));
}

export async function POST(request: Request) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = ticketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid ticket data.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const createdById = await getActorId();

  if (!createdById) {
    return NextResponse.json(
      { error: 'No user available to create the ticket.' },
      { status: 401 },
    );
  }

  const data = parsed.data;

  try {
    const ticket = await prisma.$transaction(async (tx) => {
      const created = await tx.ticket.create({
        data: {
          subject: data.subject,
          status: toDBTicketStatus(data.status),
          priority: toDBTicketPriority(data.priority),
          customerId: data.customerId,
          agentId: data.agentId ?? null,
          createdById,
        },
        include: { customer: true, agent: true },
      });

      await writeAuditLog(tx, {
        entity: 'Ticket',
        entityId: created.id,
        action: 'created',
        userId: createdById,
        metadata: {
          subject: created.subject,
          status: created.status,
          priority: created.priority,
          customerId: created.customerId,
          agentId: created.agentId,
        },
      });

      return created;
    });

    return NextResponse.json(serializeTicket(ticket), { status: 201 });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'The selected customer does not exist.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong while creating the ticket.' },
      { status: 500 },
    );
  }
}
