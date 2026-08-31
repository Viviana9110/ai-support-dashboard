import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { knowledgeArticleCreateSchema } from '@/lib/schemas/article.schema';
import { serializeArticle } from '@/lib/serializers';

import type { ArticleStatus } from '@/generated/prisma/enums';

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

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const articles = await prisma.knowledgeArticle.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: { author: true },
  });

  return NextResponse.json(articles.map(serializeArticle));
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

  const parsed = knowledgeArticleCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid article data.' },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const authorId = data.authorId ?? auth.sub;
  const status = normalizeArticleStatus(data.status);

  const article = await prisma.knowledgeArticle.create({
    data: {
      title: data.title,
      slug: data.slug ?? slugify(data.title),
      category: data.category,
      summary: data.summary ?? null,
      status,
      content: data.content ?? '',
      views: data.views ?? 0,
      authorId,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
    include: { author: true },
  });

  return NextResponse.json(serializeArticle(article), { status: 201 });
}
