import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import {
  serializeTicket,
  toDBTicketPriority,
  toDBTicketStatus,
} from '@/lib/serializers';
import { ticketSchema } from '@/lib/schemas/ticket.schema';

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: { customer: true, agent: true },
  });

  return NextResponse.json(tickets.map(serializeTicket));
}

export async function POST(request: Request) {
  const body = await request.json();

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

  const session = await getSession();

  const createdById =
    session?.sub ?? (await prisma.user.findFirst())?.id;

  if (!createdById) {
    return NextResponse.json(
      { error: 'No user available to create the ticket.' },
      { status: 401 },
    );
  }

  const data = parsed.data;

  try {
    const ticket = await prisma.ticket.create({
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
