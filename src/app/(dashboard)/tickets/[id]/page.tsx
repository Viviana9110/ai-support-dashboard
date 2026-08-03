import { TicketDetailClient } from './ticket-detail-client';

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;

  return <TicketDetailClient id={id} />;
}
