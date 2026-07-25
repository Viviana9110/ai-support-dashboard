import { useQuery } from "@tanstack/react-query";

import { getAnalytics } from "@/services/analytics/analytics.service";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });
}