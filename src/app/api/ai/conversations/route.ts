import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { serializeAiConversation } from '@/lib/serializers';

export async function GET() {
  const conversations = await prisma.aiConversation.findMany({
    where: { deletedAt: null },
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
  const body = await request.json();

  const title = typeof body.title === 'string' ? body.title.trim() : '';

  if (!title) {
    return NextResponse.json(
      { error: 'A title is required.' },
      { status: 400 },
    );
  }

  const session = await getSession();

  const userId = session?.sub ?? (await prisma.user.findFirst())?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'No user available to own the conversation.' },
      { status: 401 },
    );
  }

  const conversation = await prisma.aiConversation.create({
    data: {
      title,
      userId,
    },
  });

  return NextResponse.json(serializeAiConversation(conversation), { status: 201 });
}
