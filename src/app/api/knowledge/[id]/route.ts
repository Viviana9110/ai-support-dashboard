import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { serializeArticle } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const article = await prisma.knowledgeArticle.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeArticle(article));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const article = await prisma.knowledgeArticle.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.status !== undefined && {
        status: body.status,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      }),
      ...(body.authorId !== undefined && { authorId: body.authorId }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.views !== undefined && { views: body.views }),
    },
    include: { author: true },
  });

  return NextResponse.json(serializeArticle(article));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  await prisma.knowledgeArticle.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
