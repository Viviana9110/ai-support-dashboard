import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { conversationCreateSchema } from '@/lib/schemas/conversation.schema';
import { serializeConversation } from '@/lib/serializers';

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const conversations = await prisma.conversation.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(conversations.map(serializeConversation));
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

  const parsed = conversationCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid conversation data.' },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const conversation = await prisma.conversation.create({
    data: {
      customerId: data.customerId,
      avatar: data.avatar ?? '',
      online: data.online ?? false,
      unread: data.unread ?? 0,
      lastMessage: data.lastMessage ?? '',
      messages: data.messages
        ? { create: data.messages }
        : undefined,
    },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(serializeConversation(conversation), { status: 201 });
}
