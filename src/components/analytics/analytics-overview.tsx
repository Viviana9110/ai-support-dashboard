"use client";

import {
  DollarSign,
  Ticket,
  Clock3,
  Star,
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
        title="Revenue"
        value={`$${data.revenue.toLocaleString()}`}
        subtitle="+12.5% vs last month"
        icon={DollarSign}
      />

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
        title="Satisfaction"
        value={`${data.satisfaction}%`}
        subtitle="+2% this month"
        icon={Star}
      />
    </div>
  );
}