import { z } from 'zod';

export const notificationsSchema = z.object({
  newTickets: z.boolean(),

  customerReplies: z.boolean(),

  weeklySummary: z.boolean(),

  productUpdates: z.boolean(),

  desktop: z.boolean(),

  mobile: z.boolean(),

  mentions: z.boolean(),

  assignedTickets: z.boolean(),

  aiSuggestions: z.boolean(),

  digest: z.enum([
    'never',
    'daily',
    'weekly',
  ]),
});

export type NotificationsFormData =
  z.infer<typeof notificationsSchema>;