import ConversationsClient from './conversations-client';

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversations</h1>

        <p className="text-muted-foreground">Manage customer conversations.</p>
      </div>

      <ConversationsClient />
    </div>
  );
}
