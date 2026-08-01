'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ConversationSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">

      <Search
        size={16}
        className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
      />

      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="pl-9"
      />

    </div>
  );
}