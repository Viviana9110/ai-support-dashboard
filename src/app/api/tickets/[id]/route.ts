import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { getActorId, writeAuditLog } from '@/lib/audit';
import {
  serializeTicket,
  serializeTicketDetail,
  TICKET_PRIORITY,
  TICKET_STATUS,
  toDBTicketPriority,
  toDBTicketStatus,
} from '@/lib/serializers';
import { ticketUpdateSchema } from '@/lib/schemas/ticket.schema';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const [ticket, activity] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id, deletedAt: null },
      include: { customer: true, agent: true },
    }),
    prisma.auditLog.findMany({
      where: { entity: 'Ticket', entityId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeTicketDetail(ticket, activity));
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = ticketUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid ticket data.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const existing = await prisma.ticket.findUnique({
    where: { id },
    include: { customer: true, agent: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const data = parsed.data;

  const subjectChanged =
    data.subject !== undefined && data.subject !== existing.subject;

  const statusBefore = TICKET_STATUS[existing.status];
  const statusAfter =
    data.status !== undefined
      ? TICKET_STATUS[toDBTicketStatus(data.status)]
      : statusBefore;
  const statusChanged = statusAfter !== statusBefore;

  const priorityBefore = TICKET_PRIORITY[existing.priority];
  const priorityAfter =
    data.priority !== undefined
      ? TICKET_PRIORITY[toDBTicketPriority(data.priority)]
      : priorityBefore;
  const priorityChanged = priorityAfter !== priorityBefore;

  const customerBefore = {
    id: existing.customerId,
    name: existing.customer.name,
  };
  const customerChanged =
    data.customerId !== undefined &&
    data.customerId !== existing.customerId;

  const agentBefore = existing.agent
    ? { id: existing.agent.id, name: existing.agent.name }
    : null;
  const agentChanged =
    data.agentId !== undefined && data.agentId !== existing.agentId;

  const hasChanges =
    subjectChanged ||
    statusChanged ||
    priorityChanged ||
    customerChanged ||
    agentChanged;

  if (!hasChanges) {
    return NextResponse.json(serializeTicket(existing));
  }

  try {
    const ticket = await prisma.$transaction(async (tx) => {
      const updated = await tx.ticket.update({
        where: { id },
        data: {
          ...(data.subject !== undefined && { subject: data.subject }),
          ...(data.customerId !== undefined && {
            customerId: data.customerId,
          }),
          ...(data.agentId !== undefined && { agentId: data.agentId }),
          ...(data.status !== undefined && {
            status: toDBTicketStatus(data.status),
          }),
          ...(data.priority !== undefined && {
            priority: toDBTicketPriority(data.priority),
          }),
        },
        include: { customer: true, agent: true },
      });

      const actorId = await getActorId();

      if (subjectChanged) {
        await writeAuditLog(tx, {
          entity: 'Ticket',
          entityId: updated.id,
          action: 'updated',
          userId: actorId,
          metadata: {
            field: 'subject',
            before: existing.subject,
            after: data.subject,
          },
        });
      }

      if (statusChanged) {
        await writeAuditLog(tx, {
          entity: 'Ticket',
          entityId: updated.id,
          action: 'status_changed',
          userId: actorId,
          metadata: {
            field: 'status',
            before: statusBefore,
            after: statusAfter,
          },
        });
      }

      if (priorityChanged) {
        await writeAuditLog(tx, {
          entity: 'Ticket',
          entityId: updated.id,
          action: 'priority_changed',
          userId: actorId,
          metadata: {
            field: 'priority',
            before: priorityBefore,
            after: priorityAfter,
          },
        });
      }

      if (customerChanged) {
        const customerName =
          (await tx.customer.findUnique({
            where: { id: data.customerId as string },
            select: { name: true },
          })) ?? null;

        await writeAuditLog(tx, {
          entity: 'Ticket',
          entityId: updated.id,
          action: 'customer_changed',
          userId: actorId,
          metadata: {
            field: 'customer',
            before: customerBefore,
            after: {
              id: data.customerId,
              name: customerName?.name ?? null,
            },
          },
        });
      }

      if (agentChanged) {
        const agentName =
          data.agentId !== null
            ? ((await tx.user.findUnique({
                where: { id: data.agentId as string },
                select: { name: true },
              })) ?? null)
            : null;

        await writeAuditLog(tx, {
          entity: 'Ticket',
          entityId: updated.id,
          action: 'agent_changed',
          userId: actorId,
          metadata: {
            field: 'agent',
            before: agentBefore,
            after:
              data.agentId !== null
                ? { id: data.agentId, name: agentName?.name ?? null }
                : null,
          },
        });
      }

      return updated;
    });

    return NextResponse.json(serializeTicket(ticket));
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'The selected customer or agent does not exist.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong while updating the ticket.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true, deletedAt: true, subject: true },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const actorId = await getActorId();
  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id },
      data: { deletedAt },
    });

    await writeAuditLog(tx, {
      entity: 'Ticket',
      entityId: id,
      action: 'deleted',
      userId: actorId,
      metadata: {
        subject: existing.subject,
        deletedAt: deletedAt.toISOString(),
      },
    });
  });

  return NextResponse.json({ success: true });
}
