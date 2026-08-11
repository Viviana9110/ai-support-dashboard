import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { serializeMessage } from '@/lib/serializers';
import { messageSchema } from '@/lib/schemas/conversation.schema';

import type { MessageSender as DBMessageSender } from '@/generated/prisma/enums';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request, context: RouteContext) {
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid message' },
      { status: 400 },
    );
  }

  const { text, sender } = parsed.data;

  const dbSender: DBMessageSender = sender === 'agent' ? 'AGENT' : 'CUSTOMER';

  try {
    const message = await prisma.$transaction(async (tx) => {
      await tx.conversation.update({
        where: { id, deletedAt: null },
        data: {
          lastMessage: text,
          ...(dbSender === 'CUSTOMER' && { unread: { increment: 1 } }),
        },
      });

      return tx.message.create({
        data: {
          conversationId: id,
          sender: dbSender,
          text,
        },
      });
    });

    return NextResponse.json(serializeMessage(message), { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Conversation not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    );
  }
}
