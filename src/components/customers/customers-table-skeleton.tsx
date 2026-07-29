import { Skeleton } from "@/components/ui/skeleton";

export function CustomersTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-72" />

      <div className="rounded-2xl border p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-14 w-full"
          />
        ))}
      </div>
    </div>
  );
}