import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeConversation } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json(serializeConversation(conversation));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      ...(body.customerId !== undefined && { customerId: body.customerId }),
      ...(body.avatar !== undefined && { avatar: body.avatar }),
      ...(body.online !== undefined && { online: body.online }),
      ...(body.unread !== undefined && { unread: body.unread }),
      ...(body.lastMessage !== undefined && { lastMessage: body.lastMessage }),
    },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(serializeConversation(conversation));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  await prisma.conversation.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
