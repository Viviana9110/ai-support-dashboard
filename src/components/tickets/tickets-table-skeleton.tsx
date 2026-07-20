export function TicketsTableSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
