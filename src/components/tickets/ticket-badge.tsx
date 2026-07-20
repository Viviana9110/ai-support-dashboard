import { cn } from '@/lib/utils';

interface TicketBadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger';
}

export function TicketBadge({ children, variant }: TicketBadgeProps) {
  return (
    <span
      className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', {
        'bg-green-100 text-green-700': variant === 'success',
        'bg-yellow-100 text-yellow-700': variant === 'warning',
        'bg-red-100 text-red-700': variant === 'danger',
      })}
    >
      {children}
    </span>
  );
}
