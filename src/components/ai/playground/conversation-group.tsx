'use client';

import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export function ConversationGroup({
  title,
  children,
}: Props) {
  return (
    <div>

      <h3 className="text-muted-foreground mb-3 px-2 text-xs font-semibold uppercase">
        {title}
      </h3>

      <div className="space-y-2">
        {children}
      </div>

    </div>
  );
}