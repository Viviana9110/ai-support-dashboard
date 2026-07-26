import {
  AnalyticsData,
  AnalyticsPeriod,
} from "./analytics.types";

export async function getAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsData> {
  const analyticsByPeriod: Record<
  AnalyticsPeriod,
  AnalyticsData
> = {
  today: {
    revenue: 1250,
    tickets: 28,
    responseTime: "2m 15s",
    satisfaction: 99,

    monthlyTickets: [
      { month: "08:00", tickets: 2 },
      { month: "10:00", tickets: 5 },
      { month: "12:00", tickets: 8 },
      { month: "14:00", tickets: 11 },
      { month: "16:00", tickets: 16 },
      { month: "18:00", tickets: 20 },
    ],

    ticketStatus: [
      { name: "Open", value: 6 },
      { name: "Pending", value: 4 },
      { name: "Closed", value: 18 },
    ],

    topAgents: [
      { name: "Sarah", tickets: 12 },
      { name: "John", tickets: 8 },
      { name: "Emily", tickets: 5 },
      { name: "Michael", tickets: 3 },
    ],

    resolutionTime: [
      { day: "8 AM", minutes: 8 },
      { day: "10 AM", minutes: 7 },
      { day: "12 PM", minutes: 5 },
      { day: "2 PM", minutes: 6 },
      { day: "4 PM", minutes: 4 },
    ],
  },

  "7d": {
    revenue: 18420,
    tickets: 324,
    responseTime: "3m 42s",
    satisfaction: 98,

    monthlyTickets: [
      { month: "Mon", tickets: 38 },
      { month: "Tue", tickets: 44 },
      { month: "Wed", tickets: 57 },
      { month: "Thu", tickets: 63 },
      { month: "Fri", tickets: 81 },
      { month: "Sat", tickets: 72 },
      { month: "Sun", tickets: 55 },
    ],

    ticketStatus: [
      { name: "Open", value: 32 },
      { name: "Pending", value: 18 },
      { name: "Closed", value: 91 },
    ],

    topAgents: [
      { name: "Sarah", tickets: 84 },
      { name: "John", tickets: 73 },
      { name: "Emily", tickets: 61 },
      { name: "Michael", tickets: 55 },
    ],

    resolutionTime: [
      { day: "Mon", minutes: 12 },
      { day: "Tue", minutes: 9 },
      { day: "Wed", minutes: 14 },
      { day: "Thu", minutes: 8 },
      { day: "Fri", minutes: 6 },
    ],
  },

  "30d": {
    revenue: 52340,
    tickets: 1240,
    responseTime: "4m 10s",
    satisfaction: 97,

    monthlyTickets: [
      { month: "W1", tickets: 210 },
      { month: "W2", tickets: 280 },
      { month: "W3", tickets: 340 },
      { month: "W4", tickets: 410 },
    ],

    ticketStatus: [
      { name: "Open", value: 82 },
      { name: "Pending", value: 36 },
      { name: "Closed", value: 312 },
    ],

    topAgents: [
      { name: "Sarah", tickets: 210 },
      { name: "John", tickets: 188 },
      { name: "Emily", tickets: 170 },
      { name: "Michael", tickets: 145 },
    ],

    resolutionTime: [
      { day: "W1", minutes: 11 },
      { day: "W2", minutes: 10 },
      { day: "W3", minutes: 9 },
      { day: "W4", minutes: 8 },
    ],
  },

  "12m": {
    revenue: 325000,
    tickets: 8240,
    responseTime: "5m 01s",
    satisfaction: 96,

    monthlyTickets: [
      { month: "Jan", tickets: 520 },
      { month: "Mar", tickets: 630 },
      { month: "May", tickets: 700 },
      { month: "Jul", tickets: 860 },
      { month: "Sep", tickets: 920 },
      { month: "Nov", tickets: 1100 },
    ],

    ticketStatus: [
      { name: "Open", value: 320 },
      { name: "Pending", value: 110 },
      { name: "Closed", value: 1420 },
    ],

    topAgents: [
      { name: "Sarah", tickets: 810 },
      { name: "John", tickets: 780 },
      { name: "Emily", tickets: 705 },
      { name: "Michael", tickets: 670 },
    ],

    resolutionTime: [
      { day: "Q1", minutes: 12 },
      { day: "Q2", minutes: 10 },
      { day: "Q3", minutes: 8 },
      { day: "Q4", minutes: 7 },
    ],
  },
};
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(analyticsByPeriod[period]);
    }, 800);
  });
}