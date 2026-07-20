'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
      />

      <Input placeholder="Search tickets..." className="pl-10" />
    </div>
  );
}
