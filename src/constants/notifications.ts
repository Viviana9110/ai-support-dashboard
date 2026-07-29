import { NotificationsFormData } from '@/lib/schemas/notifications.schema';

export const defaultNotifications: NotificationsFormData = {
  newTickets: true,
  customerReplies: true,
  weeklySummary: true,
  productUpdates: false,

  desktop: true,
  mobile: false,

  mentions: true,
  assignedTickets: true,
  aiSuggestions: true,

  digest: 'daily',
};