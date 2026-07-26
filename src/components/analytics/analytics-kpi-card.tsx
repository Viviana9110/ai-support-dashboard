"use client";

import { LucideIcon, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/animated-number";

interface AnalyticsKpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

export function AnalyticsKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: AnalyticsKpiCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {typeof value === "number" ? (
    <AnimatedNumber value={value} />
  ) : (
    value
  )}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <TrendingUp
              size={16}
              className="text-green-600"
            />

            <span className="text-sm text-green-600">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-gray-100 p-3">
          <Icon
            size={24}
            className="text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}