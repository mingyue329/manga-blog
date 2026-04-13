import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * 鍗＄墖瀹瑰櫒銆? * 椤甸潰涓殑澶ч儴鍒嗛潰鏉块兘鍩轰簬瀹冩瀯寤猴紝鍥犳杩欓噷缁熶竴鏀跺彛杈规銆佽儗鏅拰闃村奖椋庢牸銆? */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 bg-card py-6 text-card-foreground shadow-none',
        className,
      )}
      {...props}
    />
  )
}

/**
 * 鍗＄墖澶撮儴鍖哄煙銆? */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

/**
 * 鍗＄墖鏍囬銆? */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

/**
 * 鍗＄墖鎻忚堪鏂囨湰銆? */
function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

/**
 * 鍗＄墖鎿嶄綔鍖恒€? */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

/**
 * 鍗＄墖鍐呭鍖恒€? */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

/**
 * 鍗＄墖搴曢儴鍖恒€? */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

