'use client';

import {
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ChatConversation } from '@/services/ai/ai.types';

import { formatRelativeDate } from '@/lib/date';

interface Props {
  conversation: ChatConversation;
  active: boolean;
  onSelect: () => void;
}

export function ConversationItem({
  conversation,
  active,
  onSelect,
}: Props) {
  return (
    <div
      onClick={onSelect}
      className={`
        group
        cursor-pointer
        rounded-xl
        border
        p-3
        transition-all
        ${
          active
            ? 'border-primary bg-primary/10'
            : 'hover:bg-muted'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <MessageSquare
            size={18}
            className="mt-1"
          />

          <div>
            <p className="line-clamp-1 font-medium">
              {conversation.title}
            </p>

            {conversation.lastMessage ? (
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {conversation.lastMessage}
              </p>
            ) : null}

            <p className="text-muted-foreground text-xs">
  {(conversation.messageCount ?? conversation.messages.length) === 0
    ? 'No messages yet'
    : `${conversation.messageCount ?? conversation.messages.length} messages`}{' '}
  •{' '}
  {formatRelativeDate(
    conversation.createdAt,
  )}
</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
        >
          <MoreHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}