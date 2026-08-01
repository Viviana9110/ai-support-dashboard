'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface Props {
  onRename: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}

export function ConversationActions({
  onRename,
  onFavorite,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal size={16} />
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem onClick={onRename}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onFavorite}>
          <Star className="mr-2 h-4 w-4" />
          Favorite
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}