import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeAiMessage } from '@/lib/serializers';
import { aiMessageSchema } from '@/lib/schemas/ai.schema';

import type { AiMessageRole as DBAiMessageRole } from '@/generated/prisma/enums';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const AI_MESSAGE_ROLE_TO_DB: Record<'user' | 'assistant', DBAiMessageRole> = {
  user: 'USER',
  assistant: 'ASSISTANT',
};

class ConversationNotFoundError extends Error {
  constructor() {
    super('Conversation not found.');
  }
}

export async function POST(request: Request, context: RouteContext) {
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

  const parsed = aiMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid message' },
      { status: 400 },
    );
  }

  const { content, role } = parsed.data;

  const dbRole = AI_MESSAGE_ROLE_TO_DB[role];

  try {
    const message = await prisma.$transaction(async (tx) => {
      const conversation = await tx.aiConversation.findUnique({
        where: { id, deletedAt: null },
        select: { id: true },
      });

      if (!conversation) {
        throw new ConversationNotFoundError();
      }

      const created = await tx.aiMessage.create({
        data: {
          role: dbRole,
          content,
          aiConversationId: id,
        },
      });

      await tx.aiConversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      });

      return created;
    });

    return NextResponse.json(serializeAiMessage(message), { status: 201 });
  } catch (error) {
    if (error instanceof ConversationNotFoundError) {
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
