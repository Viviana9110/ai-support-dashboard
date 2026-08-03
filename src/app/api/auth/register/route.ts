import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { createSession, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { error: 'Name, a valid email and a password of at least 6 characters are required.' },
      { status: 400 },
    );
  }

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
