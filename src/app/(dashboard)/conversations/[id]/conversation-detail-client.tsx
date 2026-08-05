'use client';

import Link from 'next/link';
import { AlertTriangle, MessageSquareX } from 'lucide-react';

import { useConversationDetail } from '@/hooks/use-conversation-detail';
import { ConversationDetail } from '@/components/conversations/conversation-detail';
import { ConversationDetailSkeleton } from '@/components/conversations/conversation-detail-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface ConversationDetailClientProps {
  id: string;
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export function ConversationDetailClient({ id }: ConversationDetailClientProps) {
  const { data, isLoading, error, refetch } = useConversationDetail(id);

  if (isLoading) {
    return <ConversationDetailSkeleton />;
  }

  if (error) {
    if (isNotFoundError(error)) {
      return (
        <EmptyState
          icon={MessageSquareX}
          title="Conversation not found"
          description="This conversation does not exist or has been deleted."
          action={
            <Link href="/conversations">
              <Button variant="outline">Back to Conversations</Button>
            </Link>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load this conversation. Please try again."
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (!data) {
    return <ConversationDetailSkeleton />;
  }

  return <ConversationDetail conversation={data} />;
}
