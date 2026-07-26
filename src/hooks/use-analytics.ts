import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics/analytics.service";
import { AnalyticsPeriod } from "@/services/analytics/analytics.types";

export function useAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: ["analytics", period],
    queryFn: () => getAnalytics(period),

    placeholderData: keepPreviousData,
  });
}