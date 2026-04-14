import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

/**
 * 瀹氫箟寰芥爣鍙樹綋銆? */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border-2 border-transparent px-2.5 py-1 font-heading text-xs font-black uppercase tracking-[0.14em] whitespace-nowrap transition-[color,background-color] [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-[var(--line-strong)] bg-[var(--surface-ink)] text-[var(--copy-inverse)] [a&]:hover:opacity-90',
        ink:
          'border-[var(--line-strong)] bg-[var(--surface-ink)] text-[var(--copy-inverse)] [a&]:hover:opacity-90',
        outlineInk:
          'border-[var(--line-strong)] bg-[var(--surface-panel)] text-[var(--copy-strong)] [a&]:hover:bg-secondary',
        secondary:
          'border-[var(--line-strong)] bg-secondary text-[var(--secondary-foreground)] [a&]:hover:bg-[var(--surface-panel)]',
        destructive:
          'border-destructive bg-destructive text-white [a&]:hover:bg-destructive/90',
        outline:
          'border-[var(--ink)] text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

/**
 * 寰芥爣缁勪欢銆? */
function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

