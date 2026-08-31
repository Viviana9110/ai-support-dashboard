import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/schemas/auth.schema';

import type { Role } from '@/generated/prisma/enums';

const adminEmailSchema = registerSchema.shape.email;

export class AdminCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminCredentialsError';
  }
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminEnv {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
}

const PASSWORD_MAX_LENGTH = 128;

function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new AdminCredentialsError(
      'ADMIN_PASSWORD must have at least 8 characters.',
    );
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    throw new AdminCredentialsError(
      `ADMIN_PASSWORD must be ${PASSWORD_MAX_LENGTH} characters or less.`,
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw new AdminCredentialsError(
      'ADMIN_PASSWORD must contain an uppercase letter.',
    );
  }

  if (!/[a-z]/.test(password)) {
    throw new AdminCredentialsError(
      'ADMIN_PASSWORD must contain a lowercase letter.',
    );
  }

  if (!/[0-9]/.test(password)) {
    throw new AdminCredentialsError(
      'ADMIN_PASSWORD must contain a number.',
    );
  }
}

export function resolveAdminCredentials(
  env: AdminEnv,
): AdminCredentials {
  const rawEmail = env.ADMIN_EMAIL;
  const rawPassword = env.ADMIN_PASSWORD;

  if (rawEmail === undefined || rawEmail.trim() === '') {
    throw new AdminCredentialsError(
      'ADMIN_EMAIL is required. Set it before running create-admin.',
    );
  }

  if (rawPassword === undefined || rawPassword.trim() === '') {
    throw new AdminCredentialsError(
      'ADMIN_PASSWORD is required. Set it before running create-admin.',
    );
  }

  const parsedEmail = adminEmailSchema.safeParse(
    rawEmail.trim().toLowerCase(),
  );

  if (!parsedEmail.success) {
    throw new AdminCredentialsError(
      'ADMIN_EMAIL must be a valid email address.',
    );
  }

  validatePassword(rawPassword);

  return {
    email: parsedEmail.data,
    password: rawPassword,
  };
}

export type CreateAdminResult =
  | { status: 'created'; id: string; email: string }
  | { status: 'exists'; id: string; email: string };

export async function createInitialAdmin(
  email: string,
  password: string,
): Promise<CreateAdminResult> {
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (existing) {
    return {
      status: 'exists',
      id: existing.id,
      email: existing.email,
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Administrator',
      email,
      password: passwordHash,
      role: 'ADMIN' as Role,
    },
    select: { id: true, email: true },
  });

  return {
    status: 'created',
    id: user.id,
    email: user.email,
  };
}