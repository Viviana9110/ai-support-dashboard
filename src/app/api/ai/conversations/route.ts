import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { renameConversationSchema } from '@/lib/schemas/ai.schema';
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = renameConversationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A title is required.' },
      { status: 400 },
    );
  }

  const conversation = await prisma.aiConversation.create({
    data: {
      title: parsed.data.title,
      userId: auth.sub,
    },
  });

  return NextResponse.json(serializeAiConversation(conversation), { status: 201 });
}
