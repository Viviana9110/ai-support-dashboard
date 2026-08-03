import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import {
  serializeTicket,
  toDBTicketPriority,
  toDBTicketStatus,
} from '@/lib/serializers';
import { ticketUpdateSchema } from '@/lib/schemas/ticket.schema';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id, deletedAt: null },
    include: { customer: true, agent: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeTicket(ticket));
}

export async function PATCH(request: Request, context: RouteContext) {
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
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  const data = parsed.data;

  try {
    const ticket = await prisma.ticket.update({
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
  const { id } = await context.params;

  const existing = await prisma.ticket.findUnique({
    where: { id },
    select: { id: true, deletedAt: true },
  });

  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  await prisma.ticket.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
