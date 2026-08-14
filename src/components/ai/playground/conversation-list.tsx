'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ChatConversation } from '@/services/ai/ai.types';

import { useDeleteAiConversation } from '@/hooks/use-ai-conversations';

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
  const deleteAiConversation = useDeleteAiConversation();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setError(null);

    try {
      await deleteAiConversation.mutateAsync(id);
    } catch {
      setError('Unable to delete the conversation. Please try again.');
      return;
    }

    const remaining = conversations.filter(
      (conversation) =>
        conversation.id !== id,
    );

    if (activeId === id) {
      onSelect(remaining[0]?.id ?? '');
    }
  }

  return (
    <div className="flex max-h-48 min-h-0 flex-col md:h-full md:max-h-none">
      <Button
        className="mb-6 w-full"
        onClick={onNew}
      >
        <Plus size={16} />

        New Chat
      </Button>

      {error && (
        <p role="alert" className="text-destructive mb-4 text-sm">
          {error}
        </p>
      )}

      <div className="min-h-0 space-y-3 overflow-y-auto">
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
            onDelete={() =>
              handleDelete(conversation.id)
            }
          />
        ))}
      </div>
    </div>
  );
}
