import { z } from 'zod';

export const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'Password must have at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    },
  );

export type SecurityFormData = z.infer<typeof securitySchema>;