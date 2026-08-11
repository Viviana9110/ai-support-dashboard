import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

import {
  cookieStore,
  asDb,
  installTransactionMock,
  makeRequest,
  setSession,
  type DbMocks,
} from '@/test/api-utils';

import { POST as login } from '../auth/login/route';
import { POST as register } from '../auth/register/route';
import { GET as session } from '../auth/session/route';
import { POST as logout } from '../auth/logout/route';

vi.mock('@/lib/db', async () => {
  const { createPrismaMock } = await import('@/test/api-utils');
  return { prisma: createPrismaMock() };
});

vi.mock('next/headers', async () => {
  const { cookieStore } = await import('@/test/api-utils');
  return { cookies: async () => cookieStore };
});

describe('auth routes', () => {
  let db: DbMocks;
  let passwordHash: string;

  const USER = {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Viviana',
    email: 'viviana@example.com',
    role: 'AGENT',
  };

  beforeEach(async () => {
    db = asDb(prisma);
    vi.resetAllMocks();
    cookieStore.clear();
    installTransactionMock(db);
  });

  beforeAll(async () => {
    passwordHash = await hashPassword('secret123');
  });

  describe('POST /api/auth/login', () => {
    it('logs in a valid user and sets the session cookie', async () => {
      db.user.findUnique.mockResolvedValue({
        ...USER,
        password: passwordHash,
      });

      const response = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          body: { email: 'viviana@example.com', password: 'secret123' },
        }),
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(body).toEqual(USER);
      expect(cookieStore.get('session')).toBeDefined();
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'viviana@example.com' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
      });
    });

    it('rejects an invalid password', async () => {
      db.user.findUnique.mockResolvedValue({
        ...USER,
        password: passwordHash,
      });

      const response = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          body: { email: 'viviana@example.com', password: 'wrong' },
        }),
      );

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: 'Invalid email or password.',
      });
    });

    it('rejects an unknown email', async () => {
      db.user.findUnique.mockResolvedValue(null);

      const response = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          body: { email: 'ghost@example.com', password: 'secret123' },
        }),
      );

      expect(response.status).toBe(401);
    });

    it('rejects a body that fails schema validation', async () => {
      const response = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          body: { email: 'viviana@example.com' },
        }),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid JSON body', async () => {
      const response = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          body: '{invalid',
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid JSON body.' });
    });

    it('rate limits after 10 attempts from the same IP', async () => {
      db.user.findUnique.mockResolvedValue(null);

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const response = await login(
          makeRequest('http://localhost/api/auth/login', {
            method: 'POST',
            ip: '10.0.0.99',
            body: { email: 'a@b.com', password: 'x' },
          }),
        );

        expect(response.status).toBe(401);
      }

      const blocked = await login(
        makeRequest('http://localhost/api/auth/login', {
          method: 'POST',
          ip: '10.0.0.99',
          body: { email: 'a@b.com', password: 'x' },
        }),
      );

      expect(blocked.status).toBe(429);
      expect(await blocked.json()).toEqual({
        error: 'Too many attempts. Please try again later.',
      });
    });
  });

  describe('POST /api/auth/register', () => {
    it('registers a user, hashes the password and sets a cookie', async () => {
      db.user.findUnique.mockResolvedValue(null);
      db.user.create.mockResolvedValue(USER);

      const response = await register(
        makeRequest('http://localhost/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Viviana',
            email: 'viviana@example.com',
            password: 'secret123',
          },
        }),
      );

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(USER);
      expect(cookieStore.get('session')).toBeDefined();

      const createCall = db.user.create.mock.calls[0]?.[0] as {
        data: { password: string; role: string };
      };

      expect(createCall.data.role).toBe('AGENT');
      expect(createCall.data.password).not.toBe('secret123');
    });

    it('returns 409 when the email is already registered', async () => {
      db.user.findUnique.mockResolvedValue(USER);

      const response = await register(
        makeRequest('http://localhost/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Viviana',
            email: 'viviana@example.com',
            password: 'secret123',
          },
        }),
      );

      expect(response.status).toBe(409);
    });

    it('rejects a payload with a short password', async () => {
      const response = await register(
        makeRequest('http://localhost/api/auth/register', {
          method: 'POST',
          body: { name: 'Viviana', email: 'a@b.com', password: '123' },
        }),
      );

      expect(response.status).toBe(400);
    });

    it('rejects an invalid JSON body', async () => {
      const response = await register(
        makeRequest('http://localhost/api/auth/register', {
          method: 'POST',
          body: '{invalid',
        }),
      );

      expect(response.status).toBe(400);
    });

    it('returns 403 when public registration is disabled', async () => {
      process.env.ALLOW_PUBLIC_REGISTRATION = 'false';

      try {
        const response = await register(
          makeRequest('http://localhost/api/auth/register', {
            method: 'POST',
            body: {
              name: 'Viviana',
              email: 'viviana@example.com',
              password: 'secret123',
            },
          }),
        );

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({
          error: 'Registration is disabled.',
        });
      } finally {
        process.env.ALLOW_PUBLIC_REGISTRATION = 'true';
      }
    });
  });

  describe('GET /api/auth/session', () => {
    it('returns null when there is no session cookie', async () => {
      const response = await session();

      expect(response.status).toBe(200);
      expect(await response.json()).toBeNull();
    });

    it('returns the session payload for a valid cookie', async () => {
      await setSession({
        sub: USER.id,
        email: USER.email,
        name: USER.name,
        role: USER.role,
      });

      const response = await session();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        id: USER.id,
        name: USER.name,
        email: USER.email,
        role: USER.role,
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('destroys the session cookie', async () => {
      await setSession({
        sub: USER.id,
        email: USER.email,
        name: USER.name,
        role: USER.role,
      });

      expect(cookieStore.get('session')).toBeDefined();

      const response = await logout();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
      expect(cookieStore.get('session')).toBeUndefined();
    });
  });
});
