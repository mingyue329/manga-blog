import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * 杈撳叆妗嗙粍浠躲€? * 杩欓噷鍩轰簬 shadcn/ui 鐨勬爣鍑嗗啓娉曞仛浜嗘极鐢婚鏍兼敼閫狅紝缁熶竴浣跨敤閲嶈竟妗嗗拰鏂硅澶栬銆? */
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

