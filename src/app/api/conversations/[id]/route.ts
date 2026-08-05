import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeConversation, serializeConversationDetail } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id, deletedAt: null },
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

  return NextResponse.json(serializeConversationDetail(conversation));
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
