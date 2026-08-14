import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { updateAiConversationSchema } from '@/lib/schemas/ai.schema';
import {
  serializeAiConversation,
  serializeAiConversationDetail,
} from '@/lib/serializers';

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

  const conversation = await prisma.aiConversation.findUnique({
    where: { id, deletedAt: null, userId: auth.sub },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json(serializeAiConversationDetail(conversation));
}

export async function PATCH(request: Request, context: RouteContext) {
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
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = updateAiConversationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? 'Invalid title.',
      },
      { status: 400 },
    );
  }

  const existing = await prisma.aiConversation.findUnique({
    where: { id, deletedAt: null, userId: auth.sub },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  if (parsed.data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: parsed.data.customerId, deletedAt: null },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found.' },
        { status: 404 },
      );
    }
  }

  const hasCustomerId = Object.prototype.hasOwnProperty.call(
    parsed.data,
    'customerId',
  );

  try {
    const conversation = await prisma.aiConversation.update({
      where: { id, userId: auth.sub, deletedAt: null },
      data: {
        title: parsed.data.title,
        ...(hasCustomerId
          ? { customerId: parsed.data.customerId ?? null }
          : {}),
      },
    });

    return NextResponse.json(
      serializeAiConversation(conversation),
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to rename the conversation.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  const existing = await prisma.aiConversation.findUnique({
    where: { id, deletedAt: null, userId: auth.sub },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  await prisma.aiConversation.update({
    where: { id, userId: auth.sub, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
