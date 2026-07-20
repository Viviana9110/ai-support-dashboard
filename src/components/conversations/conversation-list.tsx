'use client';

import { Conversation } from '@/services/conversations/conversation.types';
import { ConversationItem } from './conversation-item';

interface ConversationListProps {
  conversations: Conversation[];
  selected: number;
  onSelect: (index: number) => void;
}

export function ConversationList({
  conversations,
  selected,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation, index) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          selected={selected === index}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
