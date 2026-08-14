import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { aiRateLimitResponse, checkAiRateLimit } from '@/lib/ai/rate-limit';
import { requireSession } from '@/lib/require-session';
import { serializeAiMessage } from '@/lib/serializers';
import { aiMessageSchema } from '@/lib/schemas/ai.schema';

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class ConversationNotFoundError extends Error {
  constructor() {
    super('Conversation not found.');
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rateLimitResult = checkAiRateLimit(auth.sub, 'messages');

  if (!rateLimitResult.allowed) {
    return aiRateLimitResponse(rateLimitResult.retryAfterSeconds);
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

  const parsed = aiMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid message' },
      { status: 400 },
    );
  }

  const { content } = parsed.data;

  try {
    const message = await prisma.$transaction(async (tx) => {
      const conversation = await tx.aiConversation.findUnique({
        where: { id, deletedAt: null, userId: auth.sub },
        select: { id: true },
      });

      if (!conversation) {
        throw new ConversationNotFoundError();
      }

      const created = await tx.aiMessage.create({
        data: {
          role: 'USER',
          content,
          aiConversationId: id,
        },
      });

      await tx.aiConversation.update({
        where: { id, userId: auth.sub, deletedAt: null },
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

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rateLimitResult = checkAiRateLimit(auth.sub, 'messages');

  if (!rateLimitResult.allowed) {
    return aiRateLimitResponse(rateLimitResult.retryAfterSeconds);
  }

  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const conversation = await tx.aiConversation.findUnique({
        where: { id, deletedAt: null, userId: auth.sub },
        select: { id: true },
      });

      if (!conversation) {
        throw new ConversationNotFoundError();
      }

      const deleted = await tx.aiMessage.deleteMany({
        where: { aiConversationId: id },
      });

      await tx.aiConversation.update({
        where: { id, userId: auth.sub, deletedAt: null },
        data: { updatedAt: new Date() },
      });

      return deleted.count;
    });

    return NextResponse.json({ success: true, deletedMessages: result });
  } catch (error) {
    if (error instanceof ConversationNotFoundError) {
      return NextResponse.json(
        { error: 'Conversation not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to clear conversation.' },
      { status: 500 },
    );
  }
}
