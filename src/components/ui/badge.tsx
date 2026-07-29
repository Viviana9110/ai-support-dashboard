import { cn } from '@/lib/utils';

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',

        variant === 'default' &&
          'bg-muted text-muted-foreground',

        variant === 'success' &&
          'bg-green-500/10 text-green-600 dark:text-green-400',

        variant === 'warning' &&
          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',

        className,
      )}
      {...props}
    />
  );
}