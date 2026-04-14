import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { gsap } from 'gsap'
import { Slot } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-4 border-transparent font-heading text-sm font-black uppercase tracking-[0.12em] transition-[background-color,color] duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default:
          'border-[var(--line-strong)] bg-[var(--surface-ink)] text-[var(--copy-inverse)] hover:bg-[var(--surface-panel)] hover:text-[var(--copy-strong)]',
        ink:
          'border-[var(--line-strong)] bg-[var(--surface-ink)] text-[var(--copy-inverse)] hover:bg-[var(--surface-panel)] hover:text-[var(--copy-strong)]',
        outlineInk:
          'border-[var(--line-strong)] bg-[var(--surface-panel)] text-[var(--copy-strong)] hover:bg-[var(--surface-ink)] hover:text-[var(--copy-inverse)]',
        iconInk:
          'border-[var(--line-strong)] bg-[var(--surface-panel)] text-[var(--copy-strong)] hover:bg-[var(--surface-ink)] hover:text-[var(--copy-inverse)]',
        destructive:
          'border-destructive bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border-[var(--line-strong)] bg-background text-[var(--copy-strong)] hover:bg-accent hover:text-accent-foreground',
        secondary:
          'border-[var(--line-strong)] bg-secondary text-[var(--secondary-foreground)] hover:bg-[var(--surface-panel)] hover:text-[var(--copy-strong)]',
        ghost:
          'border-transparent bg-transparent text-[var(--copy-strong)] hover:bg-secondary',
        link:
          'border-transparent px-0 py-0 text-[var(--copy-strong)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2 has-[>svg]:px-4',
        xs: 'h-7 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*=size-])]:size-3',
        sm: 'h-9 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        icon: 'size-10',
        'icon-xs': 'size-7 [&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef<
  HTMLElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(({ className, variant = 'default', size = 'default', asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button'
  const internalRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const element = internalRef.current

    if (!element || variant === 'link') {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.set(element, {
      y: 0,
      boxShadow: '0px 0px 0px 0px var(--surface-ink)',
    })

    function handlePointerEnter(): void {
      gsap.to(element, {
        y: prefersReducedMotion ? 0 : -2,
        boxShadow: '4px 4px 0px 0px var(--surface-ink)',
        duration: prefersReducedMotion ? 0.01 : 0.2,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
      })
    }

    function handlePointerLeave(): void {
      gsap.to(element, {
        y: 0,
        boxShadow: '0px 0px 0px 0px var(--surface-ink)',
        duration: prefersReducedMotion ? 0.01 : 0.18,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
      })
    }

    element.addEventListener('pointerenter', handlePointerEnter)
    element.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter)
      element.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(element)
    }
  }, [variant])

  function handleRef(node: HTMLElement | null): void {
    internalRef.current = node

    if (typeof forwardedRef === 'function') {
      forwardedRef(node)
      return
    }

    if (forwardedRef) {
      forwardedRef.current = node
    }
  }

  return (
    <Comp
      ref={handleRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }
