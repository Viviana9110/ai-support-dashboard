import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { updateProfileSchema } from '@/lib/schemas/profile.schema';

export async function PATCH(request: Request) {
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

  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Invalid profile data.',
      },
      { status: 400 },
    );
  }

  const { firstName, lastName, email } = parsed.data;

  const name = `${firstName} ${lastName}`.trim();

  if (email !== auth.email) {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing && existing.id !== auth.sub) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 },
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: auth.sub },
    data: {
      name,
      ...(email !== auth.email ? { email } : {}),
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
