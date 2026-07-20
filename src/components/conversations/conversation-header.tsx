'use client';

import { Conversation } from '@/services/conversations/conversation.types';

interface Props {
  conversation: Conversation;
}

export function ConversationHeader({ conversation }: Props) {
  return (
    <div className="border-b p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
          {conversation.avatar}
        </div>

        <div>
          <h2 className="font-semibold">{conversation.customer}</h2>

          <p className="text-muted-foreground text-sm">
            {conversation.online ? '🟢 Online' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  );
}
