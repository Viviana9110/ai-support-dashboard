import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';

import type { SessionPayload } from '@/lib/jwt';

export async function requireSession(): Promise<
  SessionPayload | NextResponse
> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    );
  }

  return session;
}
