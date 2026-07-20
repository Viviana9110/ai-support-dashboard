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

const data = [
  { day: 'Mon', tickets: 18 },
  { day: 'Tue', tickets: 24 },
  { day: 'Wed', tickets: 15 },
  { day: 'Thu', tickets: 28 },
  { day: 'Fri', tickets: 34 },
  { day: 'Sat', tickets: 12 },
  { day: 'Sun', tickets: 8 },
];

export function TicketsChart() {
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
