'use client';

import { Button } from '@/components/ui/button';

import { Conversation } from '@/services/ai/ai.types';

import { ConversationItem } from './conversation-item';

interface Props {
  conversations: Conversation[];

  selectedId: string;

  onSelect: (id: string) => void;

  onNewConversation: () => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewConversation,
}: Props) {
  return (
    <aside className="w-72 border-r p-4">

      <Button
        className="mb-6 w-full"
        onClick={onNewConversation}
      >
        New Chat
      </Button>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            selected={
              conversation.id === selectedId
            }
            onClick={() =>
              onSelect(conversation.id)
            }
          />
        ))}
      </div>

    </aside>
  );
}