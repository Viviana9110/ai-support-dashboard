'use client';

import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';

import { ChatMessage as ChatMessageType } from '@/services/ai/ai.types';

interface Props {
  messages: ChatMessageType[];
  loading?: boolean;
}

export function ChatWindow({
  messages,
  loading,
}: Props) {
  return (
    <div className="space-y-6 overflow-y-auto p-6">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {loading && <TypingIndicator />}
    </div>
  );
}