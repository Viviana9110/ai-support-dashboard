import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{title}</span>

        {icon}
      </div>

      <h2 className="mt-4 text-3xl font-bold">{value}</h2>
    </div>
  );
}
