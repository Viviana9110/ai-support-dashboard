import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `
        border-input
        bg-background
        text-foreground
        placeholder:text-muted-foreground

        focus-visible:border-ring
        focus-visible:ring-ring/50

        aria-invalid:border-destructive
        aria-invalid:ring-destructive/20

        dark:aria-invalid:ring-destructive/40

        flex
        min-h-32
        w-full
        rounded-xl
        border
        px-3
        py-3
        text-sm
        outline-none
        transition-colors
        focus-visible:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        resize-y
        `,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };