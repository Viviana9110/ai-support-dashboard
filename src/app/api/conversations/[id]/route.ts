import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { serializeConversation, serializeConversationDetail } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

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

  const existing = await prisma.conversation.findUnique({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  const data = body as Record<string, unknown>;

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      ...(data.customerId !== undefined && { customerId: String(data.customerId) }),
      ...(typeof data.avatar === 'string' && { avatar: data.avatar }),
      ...(typeof data.online === 'boolean' && { online: data.online }),
      ...(typeof data.unread === 'number' && { unread: data.unread }),
      ...(typeof data.lastMessage === 'string' && { lastMessage: data.lastMessage }),
    },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(serializeConversation(conversation));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.conversation.findUnique({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  await prisma.conversation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
