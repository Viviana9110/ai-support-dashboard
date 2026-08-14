'use client';

import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ChatMessage as Message } from '@/services/ai/ai.types';
import { Markdown } from '@/components/ui/markdown';

interface Props {
  message: Message;
  streaming?: boolean;
}

export function ChatMessage({
  message,
  streaming = false,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(
      message.content,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const assistant =
    message.role === 'assistant';

  const content = message.content;

  return (
    <div
      className={`flex gap-4 rounded-2xl p-5 ${
        assistant
          ? 'bg-muted/40'
          : ''
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          assistant
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        }`}
      >
        {assistant ? (
          <Bot size={18} />
        ) : (
          <User size={18} />
        )}
      </div>

      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">
            {assistant
              ? 'AI Assistant'
              : 'You'}
          </h4>

          {assistant && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          )}
        </div>

      
        <Markdown>{content}</Markdown>

{assistant && streaming && (
    <span
        className="
            ml-1
            inline-block
            h-5
            w-[2px]
            animate-pulse
            bg-primary
        "
    />
)}
      </div>
    </div>
  );
}
