'use client';

import { Message } from '@/services/conversations/conversation.types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.sender === 'customer';

  return (
    <div
      className={cn('mb-4 flex', isCustomer ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-sm rounded-2xl px-4 py-3',
          isCustomer ? 'bg-muted' : 'bg-blue-600 text-white',
        )}
      >
        <p>{message.text}</p>

        <span
          className={cn(
            'mt-2 block text-xs',
            isCustomer ? 'text-muted-foreground' : 'text-blue-100',
          )}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}
