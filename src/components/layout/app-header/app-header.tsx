'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SearchBar } from '../search-bar/search-bar';
import { UserMenu } from '../user-menu/user-menu';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p className="text-sm text-zinc-500">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-5">
        <SearchBar />

        <Button size="icon" variant="ghost">
          <Bell size={18} />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}
