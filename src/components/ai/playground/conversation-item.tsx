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
  const [error, setError] = useState<string | null>(null);

  const renameAiConversation = useRenameAiConversation();

  function startEditing() {
    setDraft(conversation.title);
    setEditing(true);
  }

  async function handleSubmit() {
    if (!editing) return;

    const title = draft.trim();

    if (title && title !== conversation.title) {
      setError(null);

      try {
        await renameAiConversation.mutateAsync({
          id: conversation.id,
          title,
        });
      } catch {
        setError('Unable to rename the conversation. Please try again.');
        return;
      }
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
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="flex min-w-0 gap-3">
          <MessageSquare
            size={18}
            className="mt-1"
          />

          <div className="min-w-0">
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
                className="h-7 w-full min-w-0 px-2 py-1 text-sm"
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

            {error && (
              <p role="alert" className="text-destructive text-xs">
                {error}
              </p>
            )}

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
