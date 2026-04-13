import * as React from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

/**
 * 鍒嗛殧绾跨粍浠躲€? * 褰撳墠椤圭洰涓嶉紦鍔卞ぇ闈㈢Н浣跨敤缁嗙伆绾匡紝鍥犳榛樿鍒嗛殧绾夸細鏇寸矖銆佹洿榛戯紝鐢ㄥ湪蹇呰鐨勪俊鎭垎鍖轰笂銆? */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-0.5',
        className,
      )}
      {...props}
    />
  )
}

export { Separator }

