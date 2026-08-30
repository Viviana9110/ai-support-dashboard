import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';

import type { SessionPayload } from '@/lib/jwt';

export type AllowedRole = 'ADMIN' | 'AGENT';

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

export async function requireRole(
  roles: AllowedRole[],
): Promise<SessionPayload | NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    );
  }

  if (!roles.includes(session.role as AllowedRole)) {
    return NextResponse.json(
      { error: 'Forbidden.' },
      { status: 403 },
    );
  }

  return session;
}
