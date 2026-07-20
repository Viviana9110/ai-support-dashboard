import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters'),

  email: z.email('Invalid email address'),

  company: z.string().min(2, 'Company is required'),

  status: z.enum(['Active', 'Inactive']),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
