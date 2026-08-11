import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { createSession, hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/schemas/auth.schema';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

function isPublicRegistrationEnabled(): boolean {
  const value = process.env.ALLOW_PUBLIC_REGISTRATION;

  if (value !== undefined && value.trim() !== '') {
    return value.trim() === 'true';
  }

  return process.env.NODE_ENV !== 'production';
}

export async function POST(request: Request) {
  if (!isPublicRegistrationEnabled()) {
    return NextResponse.json(
      { error: 'Registration is disabled.' },
      { status: 403 },
    );
  }

  const rateLimitResult = rateLimit(`register:${getClientIp(request)}`, {
    limit: REGISTER_LIMIT,
    windowMs: REGISTER_WINDOW_MS,
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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Name, a valid email and a password of at least 6 characters are required.',
      },
      { status: 400 },
    );
  }

  const name = parsed.data.name;
  const email = parsed.data.email;
  const password = parsed.data.password;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role: 'AGENT',
    },
    select: { id: true, name: true, email: true, role: true },
  });

  await createSession(user);

  return NextResponse.json(user, { status: 201 });
}
