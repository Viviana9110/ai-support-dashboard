import { useQuery } from "@tanstack/react-query";

import { getConversation } from "@/services/ai/ai.service";

export function useAI() {
  return useQuery({
    queryKey: ["ai-playground"],
    queryFn: getConversation,
  });
}