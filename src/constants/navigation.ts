import {
  LayoutDashboard,
  MessagesSquare,
  Ticket,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

export const navigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Conversations',
    href: '/conversations',
    icon: MessagesSquare,
  },
  {
    label: 'Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
