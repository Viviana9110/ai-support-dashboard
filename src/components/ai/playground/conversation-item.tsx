'use client';

import { useState } from 'react';

import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { ChatConversation } from '@/services/ai/ai.types';

import { useRenameAiConversation } from '@/hooks/use-ai-conversations';

import { formatRelativeDate } from '@/lib/date';

interface Props {
  conversation: ChatConversation;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  active,
  onSelect,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conversation.title);

  const renameAiConversation = useRenameAiConversation();

  function startEditing() {
    setDraft(conversation.title);
    setEditing(true);
  }

  function handleSubmit() {
    if (!editing) return;

    const title = draft.trim();

    if (title && title !== conversation.title) {
      void renameAiConversation.mutateAsync({
        id: conversation.id,
        title,
      });
    }

    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  return (
    <div
      onClick={onSelect}
      className={`
        group
        cursor-pointer
        rounded-xl
        border
        p-3
        transition-all
        ${
          active
            ? 'border-primary bg-primary/10'
            : 'hover:bg-muted'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <MessageSquare
            size={18}
            className="mt-1"
          />

          <div>
            {editing ? (
              <Input
                autoFocus
                value={draft}
                maxLength={100}
                onChange={(e) => setDraft(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancel();
                  }
                }}
                onBlur={handleSubmit}
                className="h-7 min-w-[180px] px-2 py-1 text-sm"
              />
            ) : (
              <p className="line-clamp-1 font-medium">
                {conversation.title}
              </p>
            )}

            {conversation.lastMessage ? (
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {conversation.lastMessage}
              </p>
            ) : null}

            <p className="text-muted-foreground text-xs">
  {(conversation.messageCount ?? conversation.messages.length) === 0
    ? 'No messages yet'
    : `${conversation.messageCount ?? conversation.messages.length} messages`}{' '}
  •{' '}
  {formatRelativeDate(
    conversation.createdAt,
  )}
</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="icon"
                variant="ghost"
                className="
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />
            }
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => startEditing()}>
              <Pencil />
              Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={onDelete}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
