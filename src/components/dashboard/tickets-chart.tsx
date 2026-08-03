'use client';

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardDayTickets } from '@/services/dashboard.types';

interface TicketsChartProps {
  data: DashboardDayTickets[];
}

export function TicketsChart({ data }: TicketsChartProps) {
  return (
    <div className="bg-background rounded-xl border p-6">
      <h2 className="mb-6 text-lg font-semibold">Tickets This Week</h2>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="tickets" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
