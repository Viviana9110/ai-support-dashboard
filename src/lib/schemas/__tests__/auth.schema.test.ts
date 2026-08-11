import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from '@/lib/schemas/auth.schema';

describe('loginSchema', () => {
  it('parses a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'Agent@Example.com',
      password: 'secret',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe('agent@example.com');
      expect(result.data.password).toBe('secret');
    }
  });

  it('trims the email and lowercases it', () => {
    const result = loginSchema.safeParse({
      email: '  JOHN.DOE@EXAMPLE.COM  ',
      password: 'secret',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe('john.doe@example.com');
    }
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('email');
    }
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'agent@example.com',
      password: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('password');
    }
  });

  it('rejects a password longer than 128 characters', () => {
    const result = loginSchema.safeParse({
      email: 'agent@example.com',
      password: 'a'.repeat(129),
    });

    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('parses a valid payload', () => {
    const result = registerSchema.safeParse({
      name: '  Viviana  ',
      email: 'Viviana@Example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe('Viviana');
      expect(result.data.email).toBe('viviana@example.com');
      expect(result.data.password).toBe('password123');
    }
  });

  it('rejects an empty name', () => {
    const result = registerSchema.safeParse({
      name: '   ',
      email: 'viviana@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('name');
    }
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Viviana',
      email: 'viviana@example.com',
      password: '12345',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('password');
    }
  });
});
