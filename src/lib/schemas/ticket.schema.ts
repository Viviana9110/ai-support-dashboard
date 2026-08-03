import { z } from 'zod';

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must have at least 3 characters'),

  customerId: z.uuid('A valid customer is required'),

  status: z.enum(['Open', 'Pending', 'Closed']),

  priority: z.enum(['Low', 'Medium', 'High']),

  agentId: z.uuid('A valid agent is required').optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export const ticketUpdateSchema = ticketSchema
  .partial()
  .extend({
    agentId: z.uuid('A valid agent is required').nullable().optional(),
  });

export type TicketUpdateData = z.infer<typeof ticketUpdateSchema>;
