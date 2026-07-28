import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  `
    group/card
    flex
    flex-col
    gap-(--card-spacing)
    overflow-hidden
    rounded-xl
    border
    border-border
    bg-card
    py-(--card-spacing)
    text-card-foreground
    text-sm
    shadow-sm
    transition-all
    duration-200

    dark:border-border

    [--card-spacing:--spacing(4)]

    has-data-[slot=card-footer]:pb-0
    has-[>img:first-child]:pt-0

    *:[img:first-child]:rounded-t-xl
    *:[img:last-child]:rounded-b-xl
  `,
  {
    variants: {
      size: {
        default:
          '[--card-spacing:--spacing(4)]',

        sm:
          '[--card-spacing:--spacing(3)]',
      },

      hover: {
        true:
          'hover:-translate-y-0.5 hover:shadow-md',

        false: '',
      },
    },

    defaultVariants: {
      size: 'default',
      hover: false,
    },
  }
);

type CardProps =
  React.ComponentProps<'div'> &
  VariantProps<typeof cardVariants>;

function Card({
  className,
  size,
  hover,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        cardVariants({
          size,
          hover,
        }),
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `
        @container/card-header
        grid
        auto-rows-min
        items-start
        gap-1
        rounded-t-xl
        px-(--card-spacing)

        has-data-[slot=card-action]:grid-cols-[1fr_auto]

        has-data-[slot=card-description]:grid-rows-[auto_auto]

        [.border-b]:pb-(--card-spacing)
      `,
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        `
        font-heading
        text-base
        font-semibold
        leading-snug

        group-data-[size=sm]/card:text-sm
      `,
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        `
        col-start-2
        row-span-2
        row-start-1
        self-start
        justify-self-end
      `,
        className
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'px-(--card-spacing)',
        className
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        `
        flex
        items-center
        border-t
        border-border
        bg-muted/40
        p-(--card-spacing)
      `,
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};