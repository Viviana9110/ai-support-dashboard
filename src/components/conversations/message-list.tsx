'use client';

import { RefObject } from 'react';

import { Message } from '@/services/conversations/conversation.types';

import { MessageBubble } from './message-bubble';

import { TypingIndicator } from './typing-indicator';

interface MessageListProps {
  messages: Message[];
  messagesEndRef?: RefObject<HTMLDivElement | null>;
  isTyping?: boolean;
}

export function MessageList({
  messages,
  messagesEndRef,
  isTyping,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
