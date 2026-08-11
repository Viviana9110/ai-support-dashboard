import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/schemas/auth.schema';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const rateLimitResult = rateLimit(`login:${getClientIp(request)}`, {
    limit: LOGIN_LIMIT,
    windowMs: LOGIN_WINDOW_MS,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfterSeconds),
        },
      },
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

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Email and password are required.',
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email;
  const password = parsed.data.password;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, password: true },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  await createSession(sessionUser);

  return NextResponse.json(sessionUser);
}
