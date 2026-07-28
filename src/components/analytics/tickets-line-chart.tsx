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
import { ChartTooltip } from "./chart-tooltip";

import { CHART_COLORS } from "@/lib/chart-colors";

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
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 13,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 13,
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{
              stroke: CHART_COLORS.primary,
              strokeOpacity: 0.15,
            }}
            content={<ChartTooltip />}
          />

          <Line
            type="monotone"
            dataKey="tickets"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{
              r: 4,
              fill: CHART_COLORS.primary,
              strokeWidth: 2,
              stroke: "hsl(var(--card))",
            }}
            activeDot={{
              r: 6,
              fill: CHART_COLORS.primary,
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}