import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from "react";
import { Menu, MoonStar, Palette, RotateCcw, SunMedium } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  extractAnchorTarget,
  savePendingAnchorTarget,
  scrollToAnchorTarget,
} from "@/shared/lib/anchor-scroll";
import { getSiteIcon } from "@/shared/lib/site-icons";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "@/shared/site/theme-provider";
import type {
  NavigationLink,
  SiteConfig,
  SiteQuickAction,
} from "@/shared/types/content";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

interface DynamicIslandHeaderProps {
  config: SiteConfig;
}

function isDesktopNavigationItemActive(
  currentPathname: string,
  itemTo: string,
): boolean {
  if (itemTo === "/") {
    return currentPathname === "/";
  }

  return currentPathname === itemTo || currentPathname.startsWith(`${itemTo}/`);
}

function renderDesktopNavigationItems(
  navigation: NavigationLink[],
  currentPathname: string,
  setItemRef: (to: string, element: HTMLAnchorElement | null) => void,
): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const item of navigation) {
    const isActive = isDesktopNavigationItemActive(currentPathname, item.to);

    elements.push(
      <NavLink
        key={item.to}
        to={item.to}
        ref={(element) => setItemRef(item.to, element)}
        className={cn(
          "relative z-10 inline-flex h-11 min-w-[5.5rem] translate-y-0 items-center justify-center border-4 px-4 py-0 font-heading text-base leading-none font-black uppercase tracking-[0.18em] transition-[translate,color,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          isActive
            ? "border-transparent bg-transparent text-[var(--copy-strong)] opacity-100"
            : "border-transparent bg-transparent text-[var(--copy-soft)] opacity-100 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--line-strong)_72%,transparent)] hover:bg-[color-mix(in_srgb,var(--surface-panel)_68%,transparent)] hover:text-[var(--copy-strong)]",
        )}
      >
        {item.label}
      </NavLink>,
    );
  }

  return elements;
}

function buildThemeSliderTrack(colors: readonly string[]): string {
  if (colors.length === 1) {
    return colors[0];
  }

  return `linear-gradient(90deg, ${colors
    .map((color, index) => `${color} ${(index / (colors.length - 1)) * 100}%`)
    .join(", ")})`;
}

function getThemeSliderStyle(track: string): CSSProperties {
  return {
    ["--theme-slider-track"]: track,
  } as CSSProperties;
}

function getMobileNavigationLinkClassName({
  isActive,
}: {
  isActive: boolean;
}): string {
  return cn(
    "block border-b-2 px-4 py-4 font-heading text-lg font-black uppercase tracking-[0.2em] transition-colors theme-border",
    isActive ? "theme-ink-surface" : "theme-paper-surface hover:bg-secondary",
  );
}

function renderQuickActionItems(
  actions: SiteQuickAction[],
  onQuickActionClick: (
    event: MouseEvent<HTMLAnchorElement>,
    action: SiteQuickAction,
  ) => void,
): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const action of actions) {
    const Icon = getSiteIcon(action.icon);

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
    );
  }

  return elements;
}

function renderMobileNavigationItems(
  navigation: NavigationLink[],
): ReactElement[] {
  const elements: ReactElement[] = [];

  for (const item of navigation) {
    elements.push(
      <SheetClose key={item.to} asChild>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            getMobileNavigationLinkClassName({ isActive })
          }
        >
          {item.label}
        </NavLink>
      </SheetClose>,
    );
  }

  return elements;
}

/**
 * 灵动岛风格的 Header 容器组件
 *
 * 核心特性:
 * 1. 展开状态 - 显示完整导航栏
 * 2. 收起状态 - 胶囊形状,只显示品牌名
 * 3. 自动收起 - 3秒无操作自动收起
 * 4. 向下滚动收起 - 检测到向下滚动立即收起
 * 5. 悬停展开 - 鼠标悬停时展开
 *
 * 动画曲线参考苹果Dynamic Island的弹簧物理效果
 */
export function DynamicIslandHeader({
  config,
}: DynamicIslandHeaderProps): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const isExpandedRef = useRef(true);
  const autoCollapseTimer = useRef<number | null>(null);
  const lastScrollPosition = useRef(0);
  const suppressScrollRef = useRef(false);
  const suppressScrollTimer = useRef<number | null>(null);
  const {
    theme,
    resolvedTheme,
    hue,
    contrastToneIndex,
    contrastToneLabel,
    contrastToneOptions,
    paperColor,
    inkColor,
    toggleTheme,
    setHue,
    setContrastToneIndex,
    resetThemeColors,
  } = useTheme();
  const themeHueColor = `oklch(0.72 0.08 ${hue})`;
  const compatibleColor = resolvedTheme === "dark" ? paperColor : inkColor;
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const navigationIndicatorRef = useRef<HTMLDivElement | null>(null);
  const navigationItemRefs = useRef<Record<string, HTMLAnchorElement | null>>(
    {},
  );
  const palettePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  function setNavigationItemRef(
    to: string,
    element: HTMLAnchorElement | null,
  ): void {
    navigationItemRefs.current[to] = element;
  }

  // 启动自动收起定时器
  const startAutoCollapseTimer = () => {
    if (autoCollapseTimer.current) {
      window.clearTimeout(autoCollapseTimer.current);
    }

    autoCollapseTimer.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 3000);
  };

  // 清除定时器
  const clearAutoCollapseTimer = () => {
    if (autoCollapseTimer.current) {
      window.clearTimeout(autoCollapseTimer.current);
      autoCollapseTimer.current = null;
    }
  };

  useEffect(() => {
    suppressScrollRef.current = true;
    lastScrollPosition.current = window.scrollY;

    if (suppressScrollTimer.current) {
      window.clearTimeout(suppressScrollTimer.current);
    }

    suppressScrollTimer.current = window.setTimeout(() => {
      suppressScrollRef.current = false;
      suppressScrollTimer.current = null;
    }, 900);

    return () => {
      if (suppressScrollTimer.current) {
        window.clearTimeout(suppressScrollTimer.current);
        suppressScrollTimer.current = null;
      }
      suppressScrollRef.current = false;
    };
  }, [location.key]);

  // 处理滚动事件
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;

          if (suppressScrollRef.current) {
            lastScrollPosition.current = currentScroll;
            ticking = false;
            return;
          }

          const scrollDelta = currentScroll - lastScrollPosition.current;

          if (scrollDelta > 2 && isExpandedRef.current) {
            setIsExpanded(false);
            clearAutoCollapseTimer();
          }

          if (scrollDelta < -2 && !isExpandedRef.current) {
            setIsExpanded(true);
            clearAutoCollapseTimer();
            startAutoCollapseTimer();
          }

          lastScrollPosition.current = currentScroll;
          ticking = false;
        });

        ticking = true;
      }
    };

    // 初始启动定时器
    startAutoCollapseTimer();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearAutoCollapseTimer();
    };
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (suppressScrollRef.current) {
        return;
      }

      if (event.deltaY >= 0) {
        return;
      }

      if (isExpandedRef.current) {
        return;
      }

      setIsExpanded(true);
      clearAutoCollapseTimer();
      startAutoCollapseTimer();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 鼠标进入时展开
  const handleMouseEnter = () => {
    setIsExpanded(true);
    clearAutoCollapseTimer();
  };

  // 鼠标离开时重启定时器
  const handleMouseLeave = () => {
    startAutoCollapseTimer();
  };

  const handleIslandPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ): void => {
    if (isExpandedRef.current) {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (target?.closest("a,button")) {
      return;
    }

    setIsExpanded(true);
    clearAutoCollapseTimer();
    startAutoCollapseTimer();
  };

  useLayoutEffect(() => {
    const navigationElement = navigationRef.current;
    const indicatorElement = navigationIndicatorRef.current;

    if (!navigationElement || !indicatorElement) {
      return;
    }

    const activeItem = config.navigation.find((item) =>
      isDesktopNavigationItemActive(location.pathname, item.to),
    );

    if (!activeItem) {
      indicatorElement.style.opacity = "0";
      return;
    }

    const activeElement = navigationItemRefs.current[activeItem.to];

    if (!activeElement) {
      indicatorElement.style.opacity = "0";
      return;
    }

    const navigationRect = navigationElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    indicatorElement.style.opacity = "1";
    indicatorElement.style.width = `${activeRect.width}px`;
    indicatorElement.style.transform = `translateX(${activeRect.left - navigationRect.left}px)`;
  }, [config.navigation, location.pathname]);

  useEffect(() => {
    const indicatorElement = navigationIndicatorRef.current;

    if (!indicatorElement) {
      return;
    }

    indicatorElement.style.transition =
      "transform 420ms cubic-bezier(0.2, 0.9, 0.22, 1), width 420ms cubic-bezier(0.2, 0.9, 0.22, 1), opacity 180ms ease-out";
    indicatorElement.style.willChange = "transform,width";
  }, []);

  useEffect(() => {
    if (!isPaletteOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      const palettePanelElement = palettePanelRef.current;

      if (!palettePanelElement) {
        return;
      }

      if (palettePanelElement.contains(event.target as Node)) {
        return;
      }

      setIsPaletteOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isPaletteOpen]);

  function handleQuickActionClick(
    event: MouseEvent<HTMLAnchorElement>,
    action: SiteQuickAction,
  ): void {
    const anchorTarget = extractAnchorTarget(action.to);

    if (!anchorTarget) {
      return;
    }

    event.preventDefault();

    if (location.pathname === "/") {
      const nextUrl = `${window.location.pathname}${window.location.search}#${anchorTarget}`;

      window.history.replaceState(null, "", nextUrl);
      scrollToAnchorTarget(anchorTarget);
      return;
    }

    savePendingAnchorTarget(anchorTarget);
    navigate("/");
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 灵动岛容器 */}
      <div
        className={cn(
          "relative isolate",
          isExpanded
            ? "site-shell h-20 mt-0 overflow-visible rounded-none bg-[color-mix(in_srgb,var(--surface-header)_88%,transparent)] shadow-none border-2 border-black border-b-[5px]"
            : "mx-auto w-[280px] h-14 mt-3 overflow-hidden rounded-full bg-background/95 backdrop-blur-xl shadow-lg border-2 border-black border-b-[5px]",
        )}
        style={{
          transition: isExpanded
            ? "width 900ms cubic-bezier(0.22,1,0.36,1), height 900ms cubic-bezier(0.22,1,0.36,1), border-radius 260ms cubic-bezier(0.22,1,0.36,1), margin-top 900ms cubic-bezier(0.22,1,0.36,1), background-color 900ms cubic-bezier(0.22,1,0.36,1), box-shadow 900ms cubic-bezier(0.22,1,0.36,1)"
            : "width 750ms cubic-bezier(0.34,1.56,0.64,1), height 750ms cubic-bezier(0.34,1.56,0.64,1), border-radius 750ms cubic-bezier(0.34,1.56,0.64,1), margin-top 750ms cubic-bezier(0.34,1.56,0.64,1), background-color 750ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 750ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onPointerDown={handleIslandPointerDown}
      >
        <div
          className={cn(
            "absolute top-1/2 z-20 -translate-y-1/2 transition-[left,transform] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isExpanded
              ? "left-4 md:left-6 translate-x-0 -rotate-1"
              : "left-1/2 -translate-x-1/2 rotate-0",
          )}
        >
          <Link
            to="/"
            className={cn(
              "block whitespace-nowrap font-heading text-base leading-none font-black uppercase tracking-tight",
              isExpanded ? "px-3 py-1" : "px-0 py-0",
            )}
            style={
              isExpanded
                ? {
                    border: "4px solid var(--line-strong)",
                    backgroundColor:
                      "color-mix(in srgb, var(--surface-panel) 88%, transparent)",
                    color: "var(--copy-strong)",
                    boxShadow:
                      "4px 4px 0 0 color-mix(in srgb, var(--surface-ink) 8%, transparent)",
                  }
                : {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color: "var(--copy-strong)",
                  }
            }
          >
            {config.brand.primaryLabel}
          </Link>
        </div>

        {/* 展开状态内容 */}
        <div
          className={cn(
            "absolute inset-0 z-10 transition-[opacity,transform]",
            isExpanded
              ? "duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "duration-750 ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-0 translate-y-0 scale-[0.99] pointer-events-none",
          )}
        >
          <header className="pt-0">
            <div
              className="relative flex h-full items-center justify-end gap-4 px-4 py-2 md:px-6"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center md:flex"
              >
                <div
                  ref={navigationRef}
                  className="pointer-events-auto relative flex items-center gap-4"
                >
                  {renderDesktopNavigationItems(
                    config.navigation,
                    location.pathname,
                    setNavigationItemRef,
                  )}
                  <div
                    ref={navigationIndicatorRef}
                    className="pointer-events-none absolute inset-y-0 left-0 z-0 my-auto h-11 border-4 border-[var(--line-strong)] bg-[var(--surface-panel)] shadow-[4px_4px_0px_0px_var(--surface-ink)] opacity-0"
                  />
                </div>
              </div>

              <div
                className={cn(
                  "relative flex items-center gap-3 transition-[opacity,transform] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isExpanded
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 -translate-x-6 scale-[0.96] pointer-events-none",
                )}
              >
                <Button
                  type="button"
                  variant="iconInk"
                  size="icon"
                  className="size-11"
                  aria-label={
                    theme === "light" ? "切换到夜间模式" : "切换到日间模式"
                  }
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
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

                  <div
                    className={cn(
                      "theme-surface-panel theme-border-strong absolute right-0 top-[calc(100%+12px)] z-50 w-80 space-y-5 border-4 p-4 shadow-[8px_8px_0_0_var(--surface-ink)]",
                      "origin-top-right transition-[opacity,transform] duration-200 ease-out",
                      isPaletteOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "pointer-events-none opacity-0 -translate-y-1 scale-[0.98]",
                    )}
                  >
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
                              Theme Hue
                            </p>
                            <p className="theme-text-muted text-xs">
                              {hue}
                            </p>
                          </div>
                          <div className="theme-surface-panel-muted theme-border-soft min-w-14 border-2 px-3 py-2 text-center font-heading text-xs font-black uppercase tracking-[0.12em]">
                            {hue}
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          step={1}
                          value={hue}
                          aria-label="调整主题色相"
                          onChange={(event) =>
                            setHue(Number.parseInt(event.target.value, 10))
                          }
                          className="theme-slider"
                          style={getThemeSliderStyle(
                            buildThemeSliderTrack(
                              Array.from({ length: 13 }, (_, index) => {
                                const hueStop = index * 30;
                                return `oklch(0.72 0.08 ${hueStop})`;
                              }),
                            ),
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-heading text-xs font-black uppercase tracking-[0.16em]">
                              Contrast Tone
                            </p>
                            <p className="theme-text-muted text-xs">
                              {contrastToneLabel}
                            </p>
                          </div>
                          <div className="theme-surface-panel-muted theme-border-soft min-w-14 border-2 px-3 py-2 text-center font-heading text-xs font-black uppercase tracking-[0.12em]">
                            {contrastToneIndex}
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={contrastToneOptions.length - 1}
                          step={1}
                          value={contrastToneIndex}
                          aria-label="调整对比色阶"
                          onChange={(event) =>
                            setContrastToneIndex(
                              Number.parseInt(event.target.value, 10),
                            )
                          }
                          className="theme-slider"
                          style={getThemeSliderStyle(
                            buildThemeSliderTrack(
                              contrastToneOptions.map(
                                (option) =>
                                  `oklch(${option.ink.lightness} ${option.ink.chroma} ${hue})`,
                              ),
                            ),
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className="theme-border-soft h-12 border-2"
                          style={{ backgroundColor: themeHueColor }}
                        />
                        <div
                          className="theme-border-soft h-12 border-2"
                          style={{ backgroundColor: compatibleColor }}
                        />
                      </div>
                  </div>
                </div>

                  {renderQuickActionItems(
                    config.quickActions,
                    handleQuickActionClick,
                  )}

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
          </header>
        </div>
      </div>
    </div>
  );
}
