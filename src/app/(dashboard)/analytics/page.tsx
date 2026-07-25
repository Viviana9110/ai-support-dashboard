import { AnalyticsClient } from "@/components/analytics/analytics-client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="text-muted-foreground">
          Monitor your support metrics.
        </p>
      </div>

      <AnalyticsClient />
    </div>
  );
}