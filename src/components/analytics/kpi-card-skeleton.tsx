"use client";

export function KpiCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="h-4 w-28 rounded bg-gray-200" />

        <div className="h-8 w-32 rounded bg-gray-300" />

        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}