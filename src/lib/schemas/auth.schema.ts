import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email is too long')
  .pipe(z.email('A valid email is required'));

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must be 128 characters or less'),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  email: emailField,
  password: z
    .string()
    .min(6, 'Password must have at least 6 characters')
    .max(128, 'Password must be 128 characters or less'),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
