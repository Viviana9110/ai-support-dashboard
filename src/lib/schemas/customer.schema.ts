import { z } from 'zod';

export const customerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name must be 100 characters or less'),

  email: z
    .email('Invalid email address')
    .max(254, 'Email must be 254 characters or less'),

  company: z
    .string()
    .min(2, 'Company is required')
    .max(100, 'Company must be 100 characters or less'),

  status: z.enum(['Active', 'Inactive']),
});

export const customerUpdateSchema = customerSchema.partial();

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CustomerUpdateData = z.infer<typeof customerUpdateSchema>;
