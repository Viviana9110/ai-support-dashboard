'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, MessageSquare, Search } from 'lucide-react';
import { getConversations } from '@/services/conversations/conversation.service';
import { ConversationList } from '@/components/conversations/conversation-list';
import { ChatWindow } from '@/components/conversations/chat-window';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type ConversationFilter = 'all' | 'online' | 'unread';

const CONVERSATION_FILTERS: { value: ConversationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'online', label: 'Online' },
  { value: 'unread', label: 'Unread' },
];

export default function ConversationsClient() {
  const {
    data: conversations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [selected, setSelected] = useState(0);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !query ||
        conversation.customer.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'online' && conversation.online) ||
        (filter === 'unread' && conversation.unread > 0);

      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  const conversation = filteredConversations[selected];

  if (isLoading) {
    return (
      <div className="grid h-[calc(100vh-140px)] grid-cols-12 overflow-hidden rounded-xl border">
        <div className="col-span-4 border-r">
          <div className="space-y-0 p-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="mb-4 h-20 w-full" />
            ))}
          </div>
        </div>

        <div className="col-span-8 p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load your conversations. Please try again."
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversations yet"
        description="When customers start a conversation, they will appear here."
      />
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No conversations found"
        description="Try adjusting your search or filters to find what you are looking for."
      />
    );
  }

  return (
    <div className="grid h-[calc(100vh-140px)] grid-cols-12 overflow-hidden rounded-xl border">
      <div className="col-span-4 border-r">
        <div className="relative border-b p-3">
          <Search
            size={16}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(0);
            }}
            placeholder="Search conversations..."
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 border-b p-3 pt-2">
          {CONVERSATION_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                setFilter(value);
                setSelected(0);
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition',
                filter === value
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <ConversationList
          conversations={filteredConversations}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      <div className="col-span-8">
        {conversation ? (
          <ChatWindow conversation={conversation} />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
