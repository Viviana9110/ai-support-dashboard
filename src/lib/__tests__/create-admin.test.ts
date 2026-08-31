import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/db';
import {
  AdminCredentialsError,
  createInitialAdmin,
  resolveAdminCredentials,
} from '@/lib/create-admin';

import {
  asDb,
  type DbMocks,
} from '@/test/api-utils';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

const ADMIN_EMAIL = 'admin@acme.com';
const ADMIN_PASSWORD = 'Str0ngPassw0rd';

describe('createInitialAdmin', () => {
  let db: DbMocks;

  beforeEach(() => {
    db = asDb(prisma);
    vi.resetAllMocks();
  });

  it('creates the ADMIN user with a bcrypt-hashed password', async () => {
    db.user.findUnique.mockResolvedValue(null);
    db.user.create.mockResolvedValue({
      id: 'admin-1',
      email: ADMIN_EMAIL,
    });

    const result = await createInitialAdmin(
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    );

    expect(result).toEqual({
      status: 'created',
      id: 'admin-1',
      email: ADMIN_EMAIL,
    });

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { email: ADMIN_EMAIL },
      select: { id: true, email: true },
    });

    const createCall = db.user.create.mock.calls[0]?.[0] as {
      data: { role: string; password: string };
    };

    expect(createCall.data.role).toBe('ADMIN');
    expect(createCall.data.password).not.toBe(ADMIN_PASSWORD);

    await expect(
      bcrypt.compare(ADMIN_PASSWORD, createCall.data.password),
    ).resolves.toBe(true);
  });

  it('returns exists and does not create a second user when the user already exists', async () => {
    db.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      email: ADMIN_EMAIL,
    });

    const result = await createInitialAdmin(
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    );

    expect(result).toEqual({
      status: 'exists',
      id: 'admin-1',
      email: ADMIN_EMAIL,
    });

    expect(db.user.create).not.toHaveBeenCalled();
  });

  it('is idempotent when called multiple times with the same email', async () => {
    db.user.findUnique.mockResolvedValue({ id: 'admin-1', email: ADMIN_EMAIL });

    const first = await createInitialAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
    const second = await createInitialAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);

    expect(first.status).toBe('exists');
    expect(second.status).toBe('exists');
    expect(db.user.create).not.toHaveBeenCalled();
  });
});

describe('resolveAdminCredentials', () => {
  it('throws when ADMIN_EMAIL is missing', () => {
    expect(() =>
      resolveAdminCredentials({ ADMIN_PASSWORD }),
    ).toThrow(AdminCredentialsError);

    expect(() =>
      resolveAdminCredentials({}),
    ).toThrow(/ADMIN_EMAIL is required/);
  });

  it('throws when ADMIN_PASSWORD is missing', () => {
    expect(() =>
      resolveAdminCredentials({ ADMIN_EMAIL }),
    ).toThrow(/ADMIN_PASSWORD is required/);
  });

  it('throws for an invalid email', () => {
    expect(() =>
      resolveAdminCredentials({
        ADMIN_EMAIL: 'not-an-email',
        ADMIN_PASSWORD,
      }),
    ).toThrow(AdminCredentialsError);

    expect(() =>
      resolveAdminCredentials({
        ADMIN_EMAIL: 'not-an-email',
        ADMIN_PASSWORD,
      }),
    ).toThrow(/valid email/);
  });

  it('rejects passwords that do not meet the project strength rules', () => {
    const weakPasswords = [
      'short1A', // 7 chars
      'alllowercase1' as string, // no uppercase
      'ALLUPPERCASE1' as string, // no lowercase
      'NoDigitsHere!' as string, // no number
      'A'.repeat(129),
    ];

    for (const password of weakPasswords) {
      expect(() =>
        resolveAdminCredentials({
          ADMIN_EMAIL,
          ADMIN_PASSWORD: password,
        }),
      ).toThrow(AdminCredentialsError);
    }
  });

  it('normalizes and returns valid credentials', () => {
    const result = resolveAdminCredentials({
      ADMIN_EMAIL: `  ${ADMIN_EMAIL.toUpperCase()}  `,
      ADMIN_PASSWORD,
    });

    expect(result).toEqual({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
  });
});