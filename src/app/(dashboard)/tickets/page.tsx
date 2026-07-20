import { TicketsClient } from './tickets-client';

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tickets</h1>
        <p className="text-muted-foreground">
          Manage customer support tickets.
        </p>
      </div>

      <TicketsClient />
    </div>
  );
}
