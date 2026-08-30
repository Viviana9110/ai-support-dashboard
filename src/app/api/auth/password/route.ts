import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import {
  comparePassword,
  hashPassword,
} from '@/lib/auth';
import { requireSession } from '@/lib/require-session';
import { securitySchema } from '@/lib/schemas/security.schema';

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

  const parsed = securitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Invalid password data.',
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.sub },
    select: { password: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found.' },
      { status: 404 },
    );
  }

  const valid = await comparePassword(
    parsed.data.currentPassword,
    user.password,
  );

  if (!valid) {
    return NextResponse.json(
      { error: 'The current password is incorrect.' },
      { status: 400 },
    );
  }

  const hashed = await hashPassword(parsed.data.newPassword);

  await prisma.user.update({
    where: { id: auth.sub },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
