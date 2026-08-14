import type { AiConversationSummary } from '@/services/ai/ai.types';

export function resolveActiveConversationId(
  conversations: AiConversationSummary[],
  currentId: string,
): string {
  if (currentId && conversations.some((conversation) => conversation.id === currentId)) {
    return currentId;
  }

  return conversations[0]?.id ?? '';
}
