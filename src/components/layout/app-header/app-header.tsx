'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

import { SearchBar } from '../search-bar/search-bar';
import { UserMenu } from '../user-menu/user-menu';

export function AppHeader() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        items-center
        justify-between
        border-b
        border-border
        bg-background/80
        px-8
        py-4
        backdrop-blur-xl
        transition-colors
        duration-300
      "
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar />

        <ThemeToggle />

        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell size={18} />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}