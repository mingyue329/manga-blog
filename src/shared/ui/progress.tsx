import * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

/**
 * 杩涘害鏉＄粍浠躲€? * 杩欓噷淇濈暀 shadcn 鐨?Radix 缁撴瀯锛屽悓鏃舵妸瑙嗚椋庢牸鏀规垚鏇磋创杩戣璁＄鐨勬柟瑙掗噸杈规牱寮忋€? */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden bg-primary/20',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="manga-halftone h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

