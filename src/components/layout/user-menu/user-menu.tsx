'use client';

import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar } from '@/components/ui/avatar';

import { useSession, useSignOut } from '@/hooks/use-session';

export function UserMenu() {
  const router = useRouter();

  const { data: session } = useSession();
  const signOut = useSignOut();

  const name = session?.name ?? 'User';

  async function handleLogout() {
    await signOut();

    router.push('/login');
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={name} size="sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{name}</p>

          <p className="text-xs text-muted-foreground">{session?.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/settings')}>
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
