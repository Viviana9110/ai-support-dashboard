export interface DashboardStats {
  openTickets: number;
  conversations: number;
  customers: number;
  satisfaction: number;
}

export interface Ticket {
  id: number;
  customer: string;
  subject: string;
  status: 'Open' | 'Pending' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface WeeklyTickets {
  day: string;
  tickets: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTickets: Ticket[];
  weeklyTickets: WeeklyTickets[];
}
