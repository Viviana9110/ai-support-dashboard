'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '@/services/conversations/conversation.service';
import { ConversationList } from '@/components/conversations/conversation-list';
import { ChatWindow } from '@/components/conversations/chat-window';

export default function ConversationsClient() {
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const [selected, setSelected] = useState(0);

  const conversation = conversations[selected];

  return (
    <div className="grid h-[calc(100vh-140px)] grid-cols-12 overflow-hidden rounded-xl border">
      <div className="col-span-4 border-r">
        <ConversationList
          conversations={conversations}
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
