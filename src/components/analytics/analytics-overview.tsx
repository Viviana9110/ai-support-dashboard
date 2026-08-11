"use client";

import {
  Ticket,
  Clock3,
  Target,
} from "lucide-react";

import { AnalyticsData } from "@/services/analytics/analytics.types";

import { AnalyticsKpiCard } from "./analytics-kpi-card";

interface AnalyticsOverviewProps {
  data: AnalyticsData;
}

export function AnalyticsOverview({
  data,
}: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <AnalyticsKpiCard
        title="Tickets"
        value={data.tickets}
        subtitle="+18 this week"
        icon={Ticket}
      />

      <AnalyticsKpiCard
        title="Response Time"
        value={data.responseTime}
        subtitle="-24s improvement"
        icon={Clock3}
      />

      <AnalyticsKpiCard
        title="Resolution Rate"
        value={`${data.resolutionRate}%`}
        subtitle="Closed vs total tickets"
        icon={Target}
      />
    </div>
  );
}