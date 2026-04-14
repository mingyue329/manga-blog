export interface ThemeToneOption {
  label: string
  value: string
}

export const PAPER_TONE_OPTIONS = [
  { label: 'Warm Ivory', value: '#fbf8ef' },
  { label: 'Studio Paper', value: '#f8f7f4' },
  { label: 'Cream Draft', value: '#f3eee2' },
  { label: 'Mist Sheet', value: '#ecefe8' },
  { label: 'Cool Plate', value: '#e8edf3' },
  { label: 'Soft Sepia', value: '#efe7df' },
] as const satisfies readonly ThemeToneOption[]

export const INK_TONE_OPTIONS = [
  { label: 'Sumi Black', value: '#111111' },
  { label: 'Graphite', value: '#1a1a1a' },
  { label: 'Navy Carbon', value: '#1b2430' },
  { label: 'Forest Ink', value: '#20271d' },
  { label: 'Sepia Ink', value: '#2a231d' },
  { label: 'Slate Night', value: '#171a24' },
] as const satisfies readonly ThemeToneOption[]

export const THEME_STORAGE_KEY = 'kawaiitech-theme'
export const PAPER_TONE_STORAGE_KEY = 'kawaiitech-paper-tone'
export const INK_TONE_STORAGE_KEY = 'kawaiitech-ink-tone'
export const LEGACY_PAPER_COLOR_STORAGE_KEY = 'kawaiitech-paper-color'
export const LEGACY_INK_COLOR_STORAGE_KEY = 'kawaiitech-ink-color'

export const DEFAULT_PAPER_TONE_INDEX = 1
export const DEFAULT_INK_TONE_INDEX = 0

export function clampThemeToneIndex(
  index: number,
  options: readonly ThemeToneOption[],
): number {
  if (!Number.isFinite(index)) {
    return 0
  }

  return Math.min(Math.max(Math.round(index), 0), options.length - 1)
}

export function findThemeToneIndex(
  options: readonly ThemeToneOption[],
  value: string | null,
): number {
  if (!value) {
    return -1
  }

  return options.findIndex(
    (option) => option.value.toLowerCase() === value.toLowerCase(),
  )
}
