import { AnalyticsData } from "./analytics.types";

export async function getAnalytics(): Promise<AnalyticsData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenue: 18420,

        tickets: 324,

        responseTime: "3m 42s",

        satisfaction: 98,

        monthlyTickets: [
          { month: "Jan", tickets: 38 },
          { month: "Feb", tickets: 44 },
          { month: "Mar", tickets: 57 },
          { month: "Apr", tickets: 63 },
          { month: "May", tickets: 81 },
          { month: "Jun", tickets: 72 },
        ],

        ticketStatus: [
          {
            name: "Open",
            value: 32,
          },
          {
            name: "Pending",
            value: 18,
          },
          {
            name: "Closed",
            value: 91,
          },
        ],

        topAgents: [
          {
            name: "Sarah",
            tickets: 84,
          },
          {
            name: "John",
            tickets: 73,
          },
          {
            name: "Emily",
            tickets: 61,
          },
          {
            name: "Michael",
            tickets: 55,
          },
        ],

        resolutionTime: [
          {
            day: "Mon",
            minutes: 12,
          },
          {
            day: "Tue",
            minutes: 9,
          },
          {
            day: "Wed",
            minutes: 14,
          },
          {
            day: "Thu",
            minutes: 8,
          },
          {
            day: "Fri",
            minutes: 6,
          },
        ],
      });
    }, 800);
  });
}