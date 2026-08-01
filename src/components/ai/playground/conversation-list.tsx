'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ChatConversation } from '@/services/ai/ai.types';

import { ConversationItem } from './conversation-item';

interface Props {
  conversations: ChatConversation[];
  activeId: string;

  onSelect: (id: string) => void;

  onNew: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <Button
        className="mb-6 w-full"
        onClick={onNew}
      >
        <Plus size={16} />

        New Chat
      </Button>

      <div className="space-y-3 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            active={
              conversation.id === activeId
            }
            onSelect={() =>
              onSelect(conversation.id)
            }
          />
        ))}
      </div>
    </div>
  );
}