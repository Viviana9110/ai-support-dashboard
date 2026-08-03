import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeMessage } from '@/lib/serializers';

import type { MessageSender as DBMessageSender } from '@/generated/prisma/enums';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const sender: DBMessageSender =
    body.sender === 'agent' ? 'AGENT' : 'CUSTOMER';

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      sender,
      text: body.text,
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: {
      lastMessage: body.text,
      ...(sender === 'CUSTOMER' && { unread: { increment: 1 } }),
    },
  });

  return NextResponse.json(serializeMessage(message), { status: 201 });
}
