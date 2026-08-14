import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { aiRateLimitResponse, checkAiRateLimit } from '@/lib/ai/rate-limit';
import { requireSession } from '@/lib/require-session';
import { createAiConversationSchema } from '@/lib/schemas/ai.schema';
import { serializeAiConversation } from '@/lib/serializers';

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const conversations = await prisma.aiConversation.findMany({
    where: { deletedAt: null, userId: auth.sub },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      customerId: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { role: true, content: true },
      },
    },
  });

  return NextResponse.json(conversations.map(serializeAiConversation));
}

export async function POST(request: Request) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rateLimitResult = checkAiRateLimit(auth.sub, 'conversations');

  if (!rateLimitResult.allowed) {
    return aiRateLimitResponse(rateLimitResult.retryAfterSeconds);
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

  const parsed = createAiConversationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A title is required.' },
      { status: 400 },
    );
  }

  if (parsed.data.customerId) {
    const customer = await prisma.customer.findUnique({
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

  const conversation = await prisma.aiConversation.create({
    data: {
      title: parsed.data.title,
      userId: auth.sub,
      customerId: parsed.data.customerId ?? null,
    },
  });

  return NextResponse.json(serializeAiConversation(conversation), { status: 201 });
}
