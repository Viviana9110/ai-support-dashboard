'use client';

import { useState } from 'react';

import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onSend: (message: string) => void;
}

export function PromptInput({
  onSend,
}: Props) {
  const [message, setMessage] = useState('');

  function send() {
    if (!message.trim()) return;

    onSend(message);

    setMessage('');
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
              send();
            }
          }}
        />

        <Button onClick={send}>
          <SendHorizontal size={18} />
        </Button>
      </div>
    </div>
  );
}