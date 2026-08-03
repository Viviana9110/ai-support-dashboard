export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface DashboardMetrics {
  totalTickets: number;
  openTickets: number;
  pendingTickets: number;
  closedTickets: number;
  customers: number;
  knowledgeArticles: number;
  activeAgents: number;
}

export interface DashboardDayTickets {
  day: string;
  tickets: number;
}

export interface DashboardActivity {
  id: string;
  user: string | null;
  action: string;
  entity: string;
  createdAt: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  ticketsByDay: DashboardDayTickets[];
  recentActivity: DashboardActivity[];
}
