'use client';

import { Conversation } from '@/services/conversations/conversation.types';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  selected,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:bg-muted w-full border-b p-4 text-left transition',
        selected && 'bg-muted',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {conversation.avatar}
          </div>

          <div>
            <p className="font-semibold">{conversation.customer}</p>

            <p className="text-muted-foreground text-sm">
              {conversation.lastMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {conversation.online && (
            <span className="text-xs text-green-600">● Online</span>
          )}

          {conversation.unread > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {conversation.unread}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
