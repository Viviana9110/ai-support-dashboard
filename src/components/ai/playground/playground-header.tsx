'use client';

import { Bot } from 'lucide-react';

export function PlaygroundHeader({ model }: { model: string }) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">

      <div className="flex items-center gap-3">

        <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
          <Bot size={20} />
        </div>

        <div>

          <h2 className="font-semibold">
            AI Playground
          </h2>

          <p className="text-muted-foreground text-sm">
            Test your assistant
          </p>

        </div>

      </div>

      <div className="text-muted-foreground text-sm">

        {model}

      </div>

    </div>
  );
}
