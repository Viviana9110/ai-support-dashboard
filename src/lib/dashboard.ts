import { User } from '@/services/dashboard.types';

export function getDashboardMetrics(users: User[]) {
  return {
    openTickets: users.length * 5,
    conversations: users.length * 3,
    customers: users.length,
    satisfaction: 98,
  };
}
