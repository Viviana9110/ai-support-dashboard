import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const tickets = [
  {
    id: '#1023',
    customer: 'John Doe',
    subject: 'Login issue',
    status: 'Open',
    priority: 'High',
  },
  {
    id: '#1024',
    customer: 'Sarah Lee',
    subject: 'Payment failed',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: '#1025',
    customer: 'Michael Smith',
    subject: 'Refund request',
    status: 'Closed',
    priority: 'Low',
  },
  {
    id: '#1026',
    customer: 'Emily Brown',
    subject: 'AI response incorrect',
    status: 'Open',
    priority: 'High',
  },
];

export function RecentTickets() {
  return (
    <div className="bg-background rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">Recent Tickets</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.customer}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
