'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketBadge } from '@/components/tickets/ticket-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { MessageList } from '@/components/conversations/message-list';
import { ChatInput } from '@/components/conversations/chat-input';
import { useSendMessage } from '@/hooks/use-send-message';

import type { ConversationDetail as ConversationDetailData } from '@/services/conversations/conversation.types';

interface ConversationDetailProps {
  conversation: ConversationDetailData;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  const customer = conversation.customer;

  const sendMessage = useSendMessage();

  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages.length]);

  async function handleSend() {
    if (!text.trim() || sendMessage.isPending) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: conversation.id,
        sender: 'agent',
        text: text.trim(),
      });

      setText('');
    } catch {
      // Keep the text so the user can retry after a failure.
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/conversations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to conversations
      </Link>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {conversation.avatar}
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>

            <p className="text-muted-foreground mt-1 text-sm">
              Last activity: {conversation.updatedAt}
            </p>
          </div>
        </div>

        {conversation.online ? (
          <TicketBadge variant="success">Online</TicketBadge>
        ) : (
          <span className="text-muted-foreground text-sm">Offline</span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>

        <CardContent>
          {conversation.messages.length === 0 ? (
            <EmptyState
              icon={MessageSquareOff}
              title="No messages yet"
              description="Messages from this conversation will appear here."
            />
          ) : (
            <MessageList
              messages={conversation.messages}
              messagesEndRef={messagesEndRef}
            />
          )}

          <ChatInput
            value={text}
            onChange={setText}
            onSend={handleSend}
            disabled={sendMessage.isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-2">
            <DetailItem label="Name" value={customer.name} />
            <DetailItem label="Email" value={customer.email} />
            <DetailItem label="Company" value={customer.company} />
            <DetailItem label="Status" value={customer.status} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
