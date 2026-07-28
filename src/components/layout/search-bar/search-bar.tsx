'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-muted-foreground
          transition-colors
        "
      />

      <Input
        placeholder="Search tickets..."
        className="
          pl-10
          bg-background
          border-border
          focus-visible:ring-ring
        "
      />
    </div>
  );
}