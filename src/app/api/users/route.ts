import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import type { User } from '@/services/dashboard.types';

export async function GET() {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  });

  const serialized: User[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.name.toLowerCase().replace(/\s+/g, ''),
    email: user.email,
    phone: '',
    website: '',
  }));

  return NextResponse.json(serialized);
}
