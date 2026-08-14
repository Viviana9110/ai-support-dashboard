'use client';

import { useEffect, useState } from 'react';

import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  resetKey?: number;
}

export function PromptInput({
  onSend,
  disabled,
  resetKey,
}: Props) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (resetKey !== undefined) {
      setMessage('');
    }
  }, [resetKey]);

  async function send() {
    if (!message.trim() || disabled) return;

    try {
      await onSend(message);

      setMessage('');
    } catch {
      // Keep the message so the user can retry after a failure.
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-end gap-3">
        <Textarea
          placeholder="Type your message..."
          value={message}
          rows={2}
          maxLength={4000}
          aria-label="Message"
          className="min-h-12 max-h-40 resize-y"
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          disabled={disabled}
        />

        <Button
          onClick={() => void send()}
          disabled={disabled}
          aria-label="Send message"
        >
          <SendHorizontal size={18} />
        </Button>
      </div>
    </div>
  );
}
