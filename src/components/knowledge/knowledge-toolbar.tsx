'use client';

import { Search, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KnowledgeToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewArticle: () => void;
}

export function KnowledgeToolbar({
  search,
  onSearchChange,
  onNewArticle,
}: KnowledgeToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full gap-3 lg:max-w-2xl">
        <div className="relative flex-1">
          <Search
            size={18}
            className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
          />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles..."
            className="pl-10"
          />
        </div>
      </div>

      <Button onClick={onNewArticle}>
        <Plus size={18} />

        New Article
      </Button>
    </div>
  );
}