'use client';

import { Bot, User } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ChatMessage as ChatMessageType } from '@/services/ai/ai.types';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const assistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-4',
        assistant ? 'justify-start' : 'justify-end',
      )}
    >
      {assistant && (
        <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full">
          <Bot size={18} />
        </div>
      )}

      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-3',
          assistant
            ? 'bg-muted'
            : 'bg-primary text-primary-foreground',
        )}
      >
        <p className="whitespace-pre-wrap text-sm">
          {message.content}
        </p>
      </div>

      {!assistant && (
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
          <User size={18} />
        </div>
      )}
    </div>
  );
}