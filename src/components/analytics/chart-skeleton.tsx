"use client";

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 h-5 w-44 rounded bg-gray-300" />

      <div className="h-80 rounded-xl bg-gray-200" />
    </div>
  );
}