import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * 定义按钮的视觉变体。
 * 这里在 shadcn 默认能力上叠加了项目自定义的漫画风格 variant，业务层只需要传语义化的名字即可。
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-4 border-transparent font-heading text-sm font-black uppercase tracking-[0.12em] transition-[background-color,color,transform] duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'border-black bg-black text-white hover:-translate-y-0.5 hover:bg-white hover:text-black',
        ink: 'border-black bg-black text-white hover:-translate-y-0.5 hover:bg-white hover:text-black',
        outlineInk:
          'border-black bg-white text-black hover:-translate-y-0.5 hover:bg-black hover:text-white',
        iconInk:
          'border-black bg-white text-black hover:-translate-y-0.5 hover:bg-black hover:text-white',
        destructive:
          'border-destructive bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border-black bg-background text-black hover:bg-accent hover:text-accent-foreground',
        secondary: 'border-black bg-secondary text-black hover:bg-white',
        ghost: 'border-transparent bg-transparent text-black hover:bg-secondary',
        link: 'border-transparent px-0 py-0 text-black underline-offset-4 hover:underline',
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

/**
 * 按钮组件。
 * 这个组件保留了 shadcn 的 asChild 机制，因此既能渲染 button，也能无缝托管 Link 或 a 标签。
 */
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
