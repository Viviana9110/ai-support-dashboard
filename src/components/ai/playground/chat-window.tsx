'use client';

import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';

import { ChatMessage as ChatMessageType } from '@/services/ai/ai.types';

interface Props {
  messages: ChatMessageType[];
  streamingMessageId?: string | null;
  loading?: boolean;
}

export function ChatWindow({
  messages,
  streamingMessageId,
  loading,
}: Props) {
  return (
    <div className="min-h-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          streaming={message.id === streamingMessageId}
        />
      ))}

      {loading && <TypingIndicator />}
    </div>
  );
}
