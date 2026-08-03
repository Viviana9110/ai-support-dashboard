import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeConversation } from '@/lib/serializers';

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(conversations.map(serializeConversation));
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.customerId) {
    return NextResponse.json(
      { error: 'A customerId is required.' },
      { status: 400 },
    );
  }

  const conversation = await prisma.conversation.create({
    data: {
      customerId: body.customerId,
      avatar: body.avatar ?? '',
      online: body.online ?? false,
      unread: body.unread ?? 0,
      lastMessage: body.lastMessage ?? '',
      messages: body.messages
        ? { create: body.messages }
        : undefined,
    },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json(serializeConversation(conversation), { status: 201 });
}
