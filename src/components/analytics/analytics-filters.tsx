"use client";

import { AnalyticsPeriod } from "@/services/analytics/analytics.types";

interface AnalyticsFiltersProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

const options = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7d",
    label: "Last 7 Days",
  },
  {
    value: "30d",
    label: "Last 30 Days",
  },
  {
    value: "12m",
    label: "Last 12 Months",
  },
] satisfies {
  value: AnalyticsPeriod;
  label: string;
}[];

export function AnalyticsFilters({
  period,
  onPeriodChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex justify-end">
      <select
        value={period}
        onChange={(e) =>
          onPeriodChange(e.target.value as AnalyticsPeriod)
        }
        className="
          h-10
          min-w-[170px]
          rounded-xl
          border
          border-border
          bg-card
          px-4
          text-sm
          text-card-foreground
          shadow-sm
          transition-all
          duration-200
          outline-none
          hover:border-ring
          focus:border-ring
          focus:ring-2
          focus:ring-ring/20
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-card text-card-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}