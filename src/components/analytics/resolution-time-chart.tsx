"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { ResolutionTime } from "@/services/analytics/analytics.types";

import { ChartCard } from "./chart-card";

import { ChartTooltip } from "./chart-tooltip";

interface ResolutionTimeChartProps {
  data: ResolutionTime[];
}

export function ResolutionTimeChart({
  data,
}: ResolutionTimeChartProps) {
  return (
    <ChartCard
      title="Resolution Time"
      subtitle="Average minutes per day"
    >
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip
  content={<ChartTooltip />}
/>

          <Bar
            dataKey="minutes"
            radius={[8, 8, 0, 0]}
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}