import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

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
