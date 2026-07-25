"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { MonthlyTickets } from "@/services/analytics/analytics.types";

import { ChartCard } from "./chart-card";

interface TicketsLineChartProps {
  data: MonthlyTickets[];
}

export function TicketsLineChart({
  data,
}: TicketsLineChartProps) {
  return (
    <ChartCard
      title="Tickets per Month"
      subtitle="Last 6 months"
    >
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}