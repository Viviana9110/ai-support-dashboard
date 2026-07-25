"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { TicketStatus } from "@/services/analytics/analytics.types";
import { ChartCard } from "./chart-card";

interface TicketStatusChartProps {
  data: TicketStatus[];
}

const COLORS = [
  "#2563eb",
  "#f59e0b",
  "#22c55e",
];

export function TicketStatusChart({
  data,
}: TicketStatusChartProps) {
  return (
    <ChartCard
      title="Tickets by Status"
      subtitle="Current distribution"
    >
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}