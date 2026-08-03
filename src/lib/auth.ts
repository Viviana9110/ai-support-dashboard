import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import {
  SESSION_COOKIE,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from '@/lib/jwt';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}): Promise<void> {
  const token = await signSessionToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();

  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();

  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  return verifySessionToken(token);
}
