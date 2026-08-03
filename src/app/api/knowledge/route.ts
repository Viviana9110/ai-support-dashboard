import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { serializeArticle } from '@/lib/serializers';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  const articles = await prisma.knowledgeArticle.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { author: true },
  });

  return NextResponse.json(articles.map(serializeArticle));
}

export async function POST(request: Request) {
  const body = await request.json();

  const session = await getSession();

  const authorId =
    body.authorId ?? session?.sub ?? (await prisma.user.findFirst())?.id;

  if (!authorId) {
    return NextResponse.json(
      { error: 'No user available to author the article.' },
      { status: 401 },
    );
  }

  const article = await prisma.knowledgeArticle.create({
    data: {
      title: body.title,
      slug: body.slug ?? slugify(body.title),
      category: body.category,
      status: body.status ?? 'DRAFT',
      content: body.content ?? '',
      views: body.views ?? 0,
      authorId,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
    },
    include: { author: true },
  });

  return NextResponse.json(serializeArticle(article), { status: 201 });
}
