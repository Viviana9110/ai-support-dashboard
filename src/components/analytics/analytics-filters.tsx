"use client";

import { AnalyticsPeriod } from "@/services/analytics/analytics.types";

interface AnalyticsFiltersProps {
  period: AnalyticsPeriod;
  onPeriodChange: (
    period: AnalyticsPeriod
  ) => void;
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
          onPeriodChange(
            e.target.value as AnalyticsPeriod
          )
        }
        className="
          rounded-xl
          border
          bg-white
          px-4
          py-2
          text-sm
          shadow-sm
          outline-none
          transition
          focus:ring-2
          focus:ring-blue-500
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}