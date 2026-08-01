import {
  LayoutDashboard,
  MessagesSquare,
  Ticket,
  Users,
  BookOpen,
  Bot,
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
    label: 'Knowledge Base',
    href: '/knowledge',
    icon: BookOpen,
  },
  {
    label: 'AI',
    href: '/ai',
    icon: Bot,
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