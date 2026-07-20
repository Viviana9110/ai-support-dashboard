import { DashboardData } from '@/types/dashboard';

export const dashboardMock: DashboardData = {
  stats: {
    openTickets: 143,
    conversations: 82,
    customers: 210,
    satisfaction: 98,
  },

  recentTickets: [
    {
      id: 1023,
      customer: 'John Doe',
      subject: 'Login issue',
      status: 'Open',
      priority: 'High',
    },
    {
      id: 1024,
      customer: 'Sarah Lee',
      subject: 'Payment failed',
      status: 'Pending',
      priority: 'Medium',
    },
    {
      id: 1025,
      customer: 'Michael Smith',
      subject: 'Refund request',
      status: 'Closed',
      priority: 'Low',
    },
    {
      id: 1026,
      customer: 'Emily Brown',
      subject: 'AI response incorrect',
      status: 'Open',
      priority: 'High',
    },
  ],

  weeklyTickets: [
    { day: 'Mon', tickets: 18 },
    { day: 'Tue', tickets: 24 },
    { day: 'Wed', tickets: 15 },
    { day: 'Thu', tickets: 28 },
    { day: 'Fri', tickets: 34 },
    { day: 'Sat', tickets: 12 },
    { day: 'Sun', tickets: 8 },
  ],
};
