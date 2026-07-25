"use client";

import { TopAgent } from "@/services/analytics/analytics.types";
import { ChartCard } from "./chart-card";

interface TopAgentsProps {
  data: TopAgent[];
}

export function TopAgents({
  data,
}: TopAgentsProps) {
  const maxTickets = Math.max(
    ...data.map((agent) => agent.tickets)
  );

  return (
    <ChartCard
      title="Top Agents"
      subtitle="Resolved tickets"
    >
      <div className="space-y-6">
        {data.map((agent) => (
          <div
            key={agent.name}
            className="space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-medium">
                {agent.name}
              </span>

              <span className="text-gray-500">
                {agent.tickets}
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-700"
                style={{
                  width: `${
                    (agent.tickets / maxTickets) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}