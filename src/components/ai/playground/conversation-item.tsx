'use client';

import { MessageSquare } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Conversation } from '@/services/ai/ai.types';

interface Props {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors',
        selected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted',
      )}
    >
      <MessageSquare size={18} />

      <div className="min-w-0">
        <p className="truncate font-medium">
          {conversation.title}
        </p>

        <p className="text-xs opacity-70">
          {conversation.messages.length} messages
        </p>
      </div>
    </button>
  );
}