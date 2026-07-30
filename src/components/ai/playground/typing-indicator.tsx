'use client';

import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full">
        <Bot size={18} />
      </div>

      <div className="bg-muted flex items-center gap-2 rounded-2xl px-5 py-4">
        <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-current"
          style={{ animationDelay: '.2s' }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-current"
          style={{ animationDelay: '.4s' }}
        />
      </div>
    </div>
  );
}