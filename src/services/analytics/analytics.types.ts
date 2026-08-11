export interface MonthlyTickets {
  month: string;
  tickets: number;
}

export interface TicketStatus {
  name: string;
  value: number;
}

export interface TopAgent {
  name: string;
  tickets: number;
}

export interface ResolutionTime {
  day: string;
  minutes: number;
}

export interface AnalyticsData {
  tickets: number;
  responseTime: string;
  resolutionRate: number;

  monthlyTickets: MonthlyTickets[];

  ticketStatus: TicketStatus[];

  topAgents: TopAgent[];

  resolutionTime: ResolutionTime[];
}

export type AnalyticsPeriod =
  | "today"
  | "7d"
  | "30d"
  | "12m";