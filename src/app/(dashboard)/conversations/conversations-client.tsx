'use client';

import { useState } from 'react';
import { useConversations } from '@/hooks/use-conversations';
import { ConversationList } from '@/components/conversations/conversation-list';
import { ChatWindow } from '@/components/conversations/chat-window';

export default function ConversationsClient() {
  const { data = [] } = useConversations();

  const [selected, setSelected] = useState(0);

  const conversation = data[selected];

  return (
    <div className="grid h-[calc(100vh-140px)] grid-cols-12 overflow-hidden rounded-xl border">
      <div className="col-span-4 border-r">
        <ConversationList
          conversations={data}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      <div className="col-span-8">
        {conversation ? (
          <ChatWindow conversation={conversation} />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
