export interface ThemeToneValue {
  lightness: number
  chroma: number
}

export interface ThemeContrastOption {
  label: string
  paper: ThemeToneValue
  ink: ThemeToneValue
}

export const THEME_CONTRAST_OPTIONS = [
  {
    label: 'Airy',
    paper: { lightness: 0.982, chroma: 0.008 },
    ink: { lightness: 0.18, chroma: 0.008 },
  },
  {
    label: 'Soft',
    paper: { lightness: 0.968, chroma: 0.01 },
    ink: { lightness: 0.21, chroma: 0.012 },
  },
  {
    label: 'Balanced',
    paper: { lightness: 0.952, chroma: 0.013 },
    ink: { lightness: 0.24, chroma: 0.016 },
  },
  {
    label: 'Calm',
    paper: { lightness: 0.936, chroma: 0.016 },
    ink: { lightness: 0.27, chroma: 0.02 },
  },
  {
    label: 'Deep',
    paper: { lightness: 0.918, chroma: 0.02 },
    ink: { lightness: 0.3, chroma: 0.024 },
  },
  {
    label: 'Noir',
    paper: { lightness: 0.9, chroma: 0.024 },
    ink: { lightness: 0.34, chroma: 0.028 },
  },
] as const satisfies readonly ThemeContrastOption[]

export const THEME_STORAGE_KEY = 'kawaiitech-theme'
export const HUE_STORAGE_KEY = 'kawaiitech-theme-hue'
export const CONTRAST_TONE_STORAGE_KEY = 'kawaiitech-contrast-tone'
export const LEGACY_PAPER_COLOR_STORAGE_KEY = 'kawaiitech-paper-color'
export const LEGACY_INK_COLOR_STORAGE_KEY = 'kawaiitech-ink-color'

export const DEFAULT_THEME_HUE = 250
export const DEFAULT_CONTRAST_TONE_INDEX = 2

/**
 * 约束色相范围到 0-360。
 * 主题色允许整圈滑动，但最终要落在浏览器可识别的色相区间内。
 */
export function clampThemeHue(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_THEME_HUE
  }

  const normalizedValue = Math.round(value) % 361

  if (normalizedValue < 0) {
    return normalizedValue + 361
  }

  return normalizedValue
}

/**
 * 把色相与明度参数转成 `oklch` 颜色字符串。
 * 页面里所有主题色都走这层，保证色相变化时仍维持低饱和的中性色。
 */
export function buildThemeToneColor(
  option: ThemeToneValue,
  hue: number,
): string {
  return `oklch(${option.lightness} ${option.chroma} ${hue})`
}

/**
 * 约束对比档位索引。
 * 面板滑杆只允许落在定义好的几个中性档位上，不做连续插值。
 */
export function clampThemeContrastIndex(
  index: number,
  options: readonly ThemeContrastOption[],
): number {
  if (!Number.isFinite(index)) {
    return 0
  }

  return Math.min(Math.max(Math.round(index), 0), options.length - 1)
}

/**
 * 从旧配色里尽量反推出接近的对比档位。
 * 这里只做兼容兜底，不追求像素级精确匹配。
 */
export function findThemeContrastIndex(
  options: readonly ThemeContrastOption[],
  paperValue: string | null,
  inkValue: string | null,
): number {
  if (!paperValue && !inkValue) {
    return -1
  }

  const normalizedPaperValue = paperValue?.toLowerCase() ?? ''
  const normalizedInkValue = inkValue?.toLowerCase() ?? ''

  return options.findIndex(
    (option) =>
      normalizedPaperValue.includes(`${option.paper.lightness}`) ||
      normalizedInkValue.includes(`${option.ink.lightness}`),
  )
}
