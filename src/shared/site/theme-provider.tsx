import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

import {
  clampThemeToneIndex,
  DEFAULT_INK_TONE_INDEX,
  DEFAULT_PAPER_TONE_INDEX,
  findThemeToneIndex,
  INK_TONE_OPTIONS,
  INK_TONE_STORAGE_KEY,
  LEGACY_INK_COLOR_STORAGE_KEY,
  LEGACY_PAPER_COLOR_STORAGE_KEY,
  PAPER_TONE_OPTIONS,
  PAPER_TONE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ThemeToneOption,
} from '@/shared/site/theme-options'

type SiteTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: SiteTheme
  paperToneIndex: number
  inkToneIndex: number
  paperToneLabel: string
  inkToneLabel: string
  paperToneOptions: readonly ThemeToneOption[]
  inkToneOptions: readonly ThemeToneOption[]
  paperColor: string
  inkColor: string
  toggleTheme: () => void
  setPaperToneIndex: (value: number) => void
  setInkToneIndex: (value: number) => void
  resetThemeColors: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: SiteTheme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
}

function applyThemeColors(paperToneIndex: number, inkToneIndex: number): void {
  document.documentElement.style.setProperty(
    '--theme-paper-base',
    PAPER_TONE_OPTIONS[paperToneIndex].value,
  )
  document.documentElement.style.setProperty(
    '--theme-ink-base',
    INK_TONE_OPTIONS[inkToneIndex].value,
  )
}

function getStoredThemeToneIndex({
  storageKey,
  legacyColorKey,
  options,
  defaultIndex,
}: {
  storageKey: string
  legacyColorKey: string
  options: readonly ThemeToneOption[]
  defaultIndex: number
}): number {
  if (typeof window === 'undefined') {
    return defaultIndex
  }

  const storedIndex = window.localStorage.getItem(storageKey)

  if (storedIndex !== null) {
    return clampThemeToneIndex(Number.parseInt(storedIndex, 10), options)
  }

  const legacyColor = window.localStorage.getItem(legacyColorKey)
  const legacyIndex = findThemeToneIndex(options, legacyColor)

  return legacyIndex >= 0 ? legacyIndex : defaultIndex
}

export function ThemeProvider({ children }: { children: ReactNode }): ReactElement {
  const [theme, setTheme] = useState<SiteTheme>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme === 'dark' ? 'dark' : 'light'
  })
  const [paperToneIndex, setPaperToneIndex] = useState<number>(() =>
    getStoredThemeToneIndex({
      storageKey: PAPER_TONE_STORAGE_KEY,
      legacyColorKey: LEGACY_PAPER_COLOR_STORAGE_KEY,
      options: PAPER_TONE_OPTIONS,
      defaultIndex: DEFAULT_PAPER_TONE_INDEX,
    }),
  )
  const [inkToneIndex, setInkToneIndex] = useState<number>(() =>
    getStoredThemeToneIndex({
      storageKey: INK_TONE_STORAGE_KEY,
      legacyColorKey: LEGACY_INK_COLOR_STORAGE_KEY,
      options: INK_TONE_OPTIONS,
      defaultIndex: DEFAULT_INK_TONE_INDEX,
    }),
  )

  const paperColor = PAPER_TONE_OPTIONS[paperToneIndex].value
  const inkColor = INK_TONE_OPTIONS[inkToneIndex].value

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    applyThemeColors(paperToneIndex, inkToneIndex)
    window.localStorage.setItem(PAPER_TONE_STORAGE_KEY, String(paperToneIndex))
    window.localStorage.setItem(INK_TONE_STORAGE_KEY, String(inkToneIndex))
    window.localStorage.setItem(LEGACY_PAPER_COLOR_STORAGE_KEY, paperColor)
    window.localStorage.setItem(LEGACY_INK_COLOR_STORAGE_KEY, inkColor)
  }, [inkColor, inkToneIndex, paperColor, paperToneIndex])

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      paperToneIndex,
      inkToneIndex,
      paperToneLabel: PAPER_TONE_OPTIONS[paperToneIndex].label,
      inkToneLabel: INK_TONE_OPTIONS[inkToneIndex].label,
      paperToneOptions: PAPER_TONE_OPTIONS,
      inkToneOptions: INK_TONE_OPTIONS,
      paperColor,
      inkColor,
      toggleTheme: () => {
        setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
      },
      setPaperToneIndex: (value: number) => {
        setPaperToneIndex(clampThemeToneIndex(value, PAPER_TONE_OPTIONS))
      },
      setInkToneIndex: (value: number) => {
        setInkToneIndex(clampThemeToneIndex(value, INK_TONE_OPTIONS))
      },
      resetThemeColors: () => {
        setPaperToneIndex(DEFAULT_PAPER_TONE_INDEX)
        setInkToneIndex(DEFAULT_INK_TONE_INDEX)
      },
    }),
    [theme, paperColor, inkColor, paperToneIndex, inkToneIndex],
  )

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const contextValue = useContext(ThemeContext)

  if (!contextValue) {
    throw new Error('useTheme must be used within ThemeProvider.')
  }

  return contextValue
}
