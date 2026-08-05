import { ConversationDetailClient } from './conversation-detail-client';

interface ConversationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = await params;

  return <ConversationDetailClient id={id} />;
}
