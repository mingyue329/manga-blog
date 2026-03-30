import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 className 片段。
 * 这个函数是 shadcn/ui 的标准工具函数，用来解决 Tailwind 类名冲突和条件拼接问题。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
