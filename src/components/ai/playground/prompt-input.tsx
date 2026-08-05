'use client';

import { useState } from 'react';

import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function PromptInput({
  onSend,
  disabled,
}: Props) {
  const [message, setMessage] = useState('');

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
      <div className="flex gap-3">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void send();
            }
          }}
          disabled={disabled}
        />

        <Button
          onClick={() => void send()}
          disabled={disabled}
        >
          <SendHorizontal size={18} />
        </Button>
      </div>
    </div>
  );
}