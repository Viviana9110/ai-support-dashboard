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
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-card-foreground">
            {typeof value === "number" ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <TrendingUp
              size={16}
              className="text-emerald-500"
            />

            <span className="text-sm font-medium text-emerald-500">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-muted
          "
        >
          <Icon
            size={22}
            className="text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}