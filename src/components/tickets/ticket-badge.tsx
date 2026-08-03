import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketBadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger';
}

const variantClasses: Record<TicketBadgeProps['variant'], string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

export function TicketBadge({ children, variant }: TicketBadgeProps) {
  return (
    <Badge className={cn('px-3', variantClasses[variant])}>
      {children}
    </Badge>
  );
}
