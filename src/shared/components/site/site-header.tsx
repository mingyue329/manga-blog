import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
} from 'react'
import { Menu, MoonStar, Palette, RotateCcw, SunMedium } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import {
  extractAnchorTarget,
  savePendingAnchorTarget,
  scrollToAnchorTarget,
} from '@/shared/lib/anchor-scroll'
import { getSiteIcon } from '@/shared/lib/site-icons'
import { cn } from '@/shared/lib/utils'
import { useTheme } from '@/shared/site/theme-provider'
import type {
  NavigationLink,
  SiteConfig,
  SiteQuickAction,
} from '@/shared/types/content'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

interface SiteHeaderProps {
  config: SiteConfig
}

function isDesktopNavigationItemActive(
  currentPathname: string,
  itemTo: string,
): boolean {
  if (itemTo === '/') {
    return currentPathname === '/'
  }

  return currentPathname === itemTo || currentPathname.startsWith(`${itemTo}/`)
}

function renderDesktopNavigationItems(
  navigation: NavigationLink[],
  currentPathname: string,
  setItemRef: (to: string, element: HTMLAnchorElement | null) => void,
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of navigation) {
    const isActive = isDesktopNavigationItemActive(currentPathname, item.to)

    elements.push(
      <NavLink
        key={item.to}
        to={item.to}
        ref={(element) => setItemRef(item.to, element)}
        className={cn(
          'relative px-1 pb-2 font-heading text-base font-black uppercase tracking-[0.18em] transition-[transform,opacity] duration-300',
          isActive
            ? 'theme-text-strong opacity-100'
            : 'theme-text-soft opacity-100 hover:opacity-100 hover:skew-x-[-8deg]',
        )}
      >
        {item.label}
      </NavLink>,
    )
  }

  return elements
}

function buildThemeSliderTrack(colors: readonly string[]): string {
  if (colors.length === 1) {
    return colors[0]
  }

  return `linear-gradient(90deg, ${colors
    .map(
      (color, index) =>
        `${color} ${(index / (colors.length - 1)) * 100}%`,
    )
    .join(', ')})`
}

function getThemeSliderStyle(track: string): CSSProperties {
  return {
    ['--theme-slider-track' as '--theme-slider-track']: track,
  }
}

function getMobileNavigationLinkClassName({
  isActive,
}: {
  isActive: boolean
}): string {
  return cn(
    'block border-b-2 px-4 py-4 font-heading text-lg font-black uppercase tracking-[0.2em] transition-colors theme-border',
    isActive
      ? 'theme-ink-surface'
      : 'theme-paper-surface hover:bg-secondary',
  )
}

function renderQuickActionItems(
  actions: SiteQuickAction[],
  onQuickActionClick: (
    event: MouseEvent<HTMLAnchorElement>,
    action: SiteQuickAction,
  ) => void,
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const action of actions) {
    const Icon = getSiteIcon(action.icon)

    elements.push(
      <Button
        key={action.to}
        asChild
        variant="iconInk"
        size="icon"
        className="size-11"
      >
        <Link
          to={action.to}
          aria-label={action.ariaLabel}
          onClick={(event) => onQuickActionClick(event, action)}
        >
          <Icon className="size-5" />
        </Link>
      </Button>,
    )
  }

  return elements
}

function renderMobileNavigationItems(
  navigation: NavigationLink[],
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of navigation) {
    elements.push(
      <SheetClose key={item.to} asChild>
        <NavLink
          to={item.to}
          className={({ isActive }) => getMobileNavigationLinkClassName({ isActive })}
        >
          {item.label}
        </NavLink>
      </SheetClose>,
    )
  }

  return elements
}

export function SiteHeader({ config }: SiteHeaderProps): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    theme,
    paperToneIndex,
    inkToneIndex,
    paperToneLabel,
    inkToneLabel,
    paperToneOptions,
    inkToneOptions,
    paperColor,
    inkColor,
    toggleTheme,
    setPaperToneIndex,
    setInkToneIndex,
    resetThemeColors,
  } = useTheme()
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const navigationRef = useRef<HTMLDivElement | null>(null)
  const navigationIndicatorRef = useRef<HTMLDivElement | null>(null)
  const navigationItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const palettePanelRef = useRef<HTMLDivElement | null>(null)

  function setNavigationItemRef(
    to: string,
    element: HTMLAnchorElement | null,
  ): void {
    navigationItemRefs.current[to] = element
  }

  useLayoutEffect(() => {
    const navigationElement = navigationRef.current
    const indicatorElement = navigationIndicatorRef.current

    if (!navigationElement || !indicatorElement) {
      return
    }

    const activeItem = config.navigation.find((item) =>
      isDesktopNavigationItemActive(location.pathname, item.to),
    )

    if (!activeItem) {
      indicatorElement.style.opacity = '0'
      return
    }

    const activeElement = navigationItemRefs.current[activeItem.to]

    if (!activeElement) {
      indicatorElement.style.opacity = '0'
      return
    }

    const navigationRect = navigationElement.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    indicatorElement.style.opacity = '1'
    indicatorElement.style.width = `${activeRect.width}px`
    indicatorElement.style.transform = `translateX(${activeRect.left - navigationRect.left}px)`
  }, [config.navigation, location.pathname])

  useEffect(() => {
    const indicatorElement = navigationIndicatorRef.current

    if (!indicatorElement) {
      return
    }

    indicatorElement.style.transition =
      'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), width 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out'
  }, [])

  useEffect(() => {
    if (!isPaletteOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent): void {
      const palettePanelElement = palettePanelRef.current

      if (!palettePanelElement) {
        return
      }

      if (palettePanelElement.contains(event.target as Node)) {
        return
      }

      setIsPaletteOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isPaletteOpen])

  function handleQuickActionClick(
    event: MouseEvent<HTMLAnchorElement>,
    action: SiteQuickAction,
  ): void {
    const anchorTarget = extractAnchorTarget(action.to)

    if (!anchorTarget) {
      return
    }

    event.preventDefault()

    if (location.pathname === '/') {
      const nextUrl = `${window.location.pathname}${window.location.search}#${anchorTarget}`

      window.history.replaceState(null, '', nextUrl)
      scrollToAnchorTarget(anchorTarget)
      return
    }

    savePendingAnchorTarget(anchorTarget)
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3">
      <div className="site-shell">
        <div className="site-tracing-header flex min-h-20 items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            to="/"
            className="-rotate-1 whitespace-nowrap px-3 py-1 font-heading text-base leading-none font-black uppercase tracking-tight transition-transform hover:-translate-y-0.5 sm:text-lg md:text-xl"
            style={{
              border: '4px solid var(--line-strong)',
              backgroundColor:
                'color-mix(in srgb, var(--surface-panel) 88%, transparent)',
              color: 'var(--copy-strong)',
              boxShadow:
                '4px 4px 0 0 color-mix(in srgb, var(--surface-ink) 8%, transparent)',
            }}
          >
            {config.brand.primaryLabel} // {config.brand.secondaryLabel}
          </Link>

          <div ref={navigationRef} className="relative hidden items-center gap-8 md:flex">
            {renderDesktopNavigationItems(
              config.navigation,
              location.pathname,
              setNavigationItemRef,
            )}
            <div
              ref={navigationIndicatorRef}
              className="pointer-events-none absolute bottom-0 left-0 h-1 bg-[var(--surface-ink)] opacity-0"
            />
          </div>

          <div className="relative flex items-center gap-3">
            <Button
              type="button"
              variant="iconInk"
              size="icon"
              className="size-11"
              aria-label={theme === 'light' ? '切换到夜间模式' : '切换到日间模式'}
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <MoonStar className="size-5" />
              ) : (
                <SunMedium className="size-5" />
              )}
            </Button>

            <div ref={palettePanelRef} className="relative">
              <Button
                type="button"
                variant="iconInk"
                size="icon"
                className="size-11"
                aria-label="打开主题配色面板"
                onClick={() => setIsPaletteOpen((open) => !open)}
              >
                <Palette className="size-5" />
              </Button>

              {isPaletteOpen ? (
                <div className="theme-surface-panel theme-border-strong absolute right-0 top-[calc(100%+12px)] z-50 w-80 space-y-5 border-4 p-4 shadow-[8px_8px_0_0_var(--surface-ink)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-heading text-sm font-black uppercase tracking-[0.18em]">
                        Theme Tone
                      </p>
                      <p className="theme-text-soft text-xs leading-5">
                        改成受控色阶后，首页和文章区会整站同步，避免颜色偏到不协调的方向。
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outlineInk"
                      size="icon-xs"
                      aria-label="重置主题色阶"
                      onClick={resetThemeColors}
                    >
                      <RotateCcw className="size-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-heading text-xs font-black uppercase tracking-[0.16em]">
                          Paper Tone
                        </p>
                        <p className="theme-text-muted text-xs">{paperToneLabel}</p>
                      </div>
                      <div className="theme-surface-panel-muted theme-border-soft min-w-14 border-2 px-3 py-2 text-center font-heading text-xs font-black uppercase tracking-[0.12em]">
                        {paperToneIndex}
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={paperToneOptions.length - 1}
                      step={1}
                      value={paperToneIndex}
                      aria-label="调整纸面色阶"
                      onChange={(event) =>
                        setPaperToneIndex(Number.parseInt(event.target.value, 10))
                      }
                      className="theme-slider"
                      style={getThemeSliderStyle(
                        buildThemeSliderTrack(
                          paperToneOptions.map((option) => option.value),
                        ),
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-heading text-xs font-black uppercase tracking-[0.16em]">
                          Ink Tone
                        </p>
                        <p className="theme-text-muted text-xs">{inkToneLabel}</p>
                      </div>
                      <div className="theme-surface-panel-muted theme-border-soft min-w-14 border-2 px-3 py-2 text-center font-heading text-xs font-black uppercase tracking-[0.12em]">
                        {inkToneIndex}
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={inkToneOptions.length - 1}
                      step={1}
                      value={inkToneIndex}
                      aria-label="调整墨色深度"
                      onChange={(event) =>
                        setInkToneIndex(Number.parseInt(event.target.value, 10))
                      }
                      className="theme-slider"
                      style={getThemeSliderStyle(
                        buildThemeSliderTrack(
                          inkToneOptions.map((option) => option.value),
                        ),
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="theme-border-soft h-12 border-2"
                      style={{ backgroundColor: paperColor }}
                    />
                    <div
                      className="theme-border-soft h-12 border-2"
                      style={{ backgroundColor: inkColor }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {renderQuickActionItems(config.quickActions, handleQuickActionClick)}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="iconInk"
                  size="icon"
                  className="size-11 md:hidden"
                  aria-label="打开站点导航"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="theme-paper-surface theme-border p-0"
              >
                <SheetHeader className="theme-secondary-surface theme-border border-b-4 px-4 py-5">
                  <SheetTitle className="font-heading text-2xl font-black uppercase tracking-tight">
                    MENU // 导航
                  </SheetTitle>
                  <SheetDescription className="theme-text-soft text-sm">
                    这里保留了后续新增栏目、用户中心和搜索入口的扩展空间。
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col">
                  {renderMobileNavigationItems(config.navigation)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
