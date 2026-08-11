import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';
import { getActorId } from '@/lib/audit';

import {
  SESSION_USER,
  cookieStore,
  asDb,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('getActorId', () => {
  let db: DbMocks;

  beforeEach(() => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
  });

  it('returns the authenticated user id from the session', async () => {
    await setSession(SESSION_USER);

    await expect(getActorId()).resolves.toBe(SESSION_USER.sub);
    expect(db.user.findFirst).not.toHaveBeenCalled();
  });

  it('returns null when there is no session', async () => {
    await expect(getActorId()).resolves.toBeNull();
  });

  it('never falls back to the first database user', async () => {
    db.user.findFirst.mockResolvedValue({ id: 'first-user-in-db' });

    await expect(getActorId()).resolves.toBeNull();
    expect(db.user.findFirst).not.toHaveBeenCalled();
  });

  it('uses the session user even when another user exists first in the DB', async () => {
    db.user.findFirst.mockResolvedValue({ id: 'first-user-in-db' });
    await setSession(SESSION_USER);

    await expect(getActorId()).resolves.toBe(SESSION_USER.sub);
    expect(db.user.findFirst).not.toHaveBeenCalled();
  });
});
