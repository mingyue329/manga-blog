import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * 输入框组件。
 * 这里基于 shadcn/ui 的标准写法做了漫画风格改造，统一使用重边框和方角外观。
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-12 w-full min-w-0 border-4 border-black bg-white px-4 py-3 text-base font-medium outline-none transition-[background-color,color,transform]',
        'placeholder:text-black/40 focus-visible:-translate-y-0.5 focus-visible:bg-secondary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
