import { Ticket } from './ticket.types';

const tickets: Ticket[] = [
  {
    id: 1023,
    customer: 'John Doe',
    subject: 'Login issue',
    status: 'Open',
    priority: 'High',
    agent: 'Sophia',
    updatedAt: '5 min ago',
  },
  {
    id: 1024,
    customer: 'Sarah Lee',
    subject: 'Payment failed',
    status: 'Pending',
    priority: 'Medium',
    agent: 'Michael',
    updatedAt: '20 min ago',
  },
  {
    id: 1025,
    customer: 'Emily Brown',
    subject: 'Refund request',
    status: 'Closed',
    priority: 'Low',
    agent: 'David',
    updatedAt: 'Yesterday',
  },
  {
    id: 1026,
    customer: 'Carlos Ruiz',
    subject: 'AI generated wrong answer',
    status: 'Open',
    priority: 'High',
    agent: 'Sophia',
    updatedAt: '1 hour ago',
  },
];

export async function getTickets() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return tickets;
}
