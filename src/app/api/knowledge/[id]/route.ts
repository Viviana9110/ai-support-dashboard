import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { knowledgeArticleUpdateSchema } from '@/lib/schemas/article.schema';
import { serializeArticle } from '@/lib/serializers';

import type { ArticleStatus } from '@/generated/prisma/enums';

type RouteContext = { params: Promise<{ id: string }> };

const ARTICLE_STATUSES: ArticleStatus[] = [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
];

function normalizeArticleStatus(
  status: string | undefined,
): ArticleStatus {
  const normalized = status?.trim().toUpperCase();

  return normalized &&
    (ARTICLE_STATUSES as string[]).includes(normalized)
    ? (normalized as ArticleStatus)
    : 'DRAFT';
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const article = await prisma.knowledgeArticle.findUnique({
    where: { id, deletedAt: null },
    include: { author: true },
  });

  if (!article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeArticle(article));
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = knowledgeArticleUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid article data.' },
      { status: 400 },
    );
  }

  const existing = await prisma.knowledgeArticle.findUnique({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  const data = parsed.data;

  const normalizedStatus =
    data.status !== undefined
      ? normalizeArticleStatus(data.status)
      : undefined;

  const article = await prisma.knowledgeArticle.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.category !== undefined && { category: data.category }),
      ...(normalizedStatus !== undefined && {
        status: normalizedStatus,
        publishedAt:
          normalizedStatus === 'PUBLISHED' ? new Date() : null,
      }),
      ...(data.authorId !== undefined && { authorId: data.authorId }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.views !== undefined && { views: data.views }),
    },
    include: { author: true },
  });

  return NextResponse.json(serializeArticle(article));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const existing = await prisma.knowledgeArticle.findUnique({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  await prisma.knowledgeArticle.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
