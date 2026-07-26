"use client";

import { ChartSkeleton } from "./chart-skeleton";
import { KpiCardSkeleton } from "./kpi-card-skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>

      <ChartSkeleton />

      <div className="grid gap-8 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <ChartSkeleton />
    </div>
  );
}