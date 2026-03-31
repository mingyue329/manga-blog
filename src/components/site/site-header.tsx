import type { MouseEvent, ReactElement } from 'react'
import { Menu } from 'lucide-react'
import {
  Link,
  NavLink,
  type NavLinkRenderProps,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  extractAnchorTarget,
  savePendingAnchorTarget,
  scrollToAnchorTarget,
} from '@/lib/anchor-scroll'
import { getSiteIcon } from '@/lib/site-icons'
import { cn } from '@/lib/utils'
import type { NavigationLink, SiteConfig, SiteQuickAction } from '@/types/content'

interface SiteHeaderProps {
  config: SiteConfig
}

/**
 * 计算桌面端导航链接的样式。
 * 激活状态需要保留明确的下划线与更深的文字颜色，未激活状态则只保留轻一点的悬停反馈。
 */
function getDesktopNavigationLinkClassName({
  isActive,
}: NavLinkRenderProps): string {
  return cn(
    'relative px-1 pb-2 font-heading text-sm font-black uppercase tracking-[0.24em] transition-all',
    isActive
      ? 'text-black after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-black'
      : 'text-black/65 hover:text-black hover:skew-x-[-8deg]',
  )
}

/**
 * 计算移动端导航链接的样式。
 * 抽屉菜单里的点击区域需要更大，因此这里继续保留整块可点击的按钮式处理。
 */
function getMobileNavigationLinkClassName({
  isActive,
}: NavLinkRenderProps): string {
  return cn(
    'block border-b-2 border-black px-4 py-4 font-heading text-lg font-black uppercase tracking-[0.2em] transition-colors',
    isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-secondary',
  )
}

/**
 * 渲染桌面端导航项。
 * 这里显式使用 for...of，便于后续继续插入埋点、权限判断或 A/B 配置，而不是把逻辑全部塞进 map 回调里。
 */
function renderDesktopNavigationItems(
  navigation: NavigationLink[],
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of navigation) {
    elements.push(
      <NavLink
        key={item.to}
        to={item.to}
        className={getDesktopNavigationLinkClassName}
      >
        {item.label}
      </NavLink>,
    )
  }

  return elements
}

/**
 * 渲染 Header 右侧快捷入口。
 * 快捷入口当前主要用于跳转首页锚点，因此这里保留 a 标签语义，再统一交给点击事件做路由内滚动处理。
 */
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
        <a
          href={action.to}
          aria-label={action.ariaLabel}
          onClick={(event) => onQuickActionClick(event, action)}
        >
          <Icon className="size-5" />
        </a>
      </Button>,
    )
  }

  return elements
}

/**
 * 渲染移动端抽屉中的导航项。
 * 这里用 SheetClose 包裹链接，确保用户点击后抽屉会立即关闭，不会出现路由跳转了但菜单还停留在界面的情况。
 */
function renderMobileNavigationItems(
  navigation: NavigationLink[],
): ReactElement[] {
  const elements: ReactElement[] = []

  for (const item of navigation) {
    elements.push(
      <SheetClose key={item.to} asChild>
        <NavLink to={item.to} className={getMobileNavigationLinkClassName}>
          {item.label}
        </NavLink>
      </SheetClose>,
    )
  }

  return elements
}

/**
 * 渲染站点顶部导航。
 * 这次顶部样式改成“半透明描图纸”方案：保持点阵背景能透出来，同时用轻模糊和白膜提升导航可读性。
 */
export function SiteHeader({ config }: SiteHeaderProps): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 处理快捷入口点击事件。
   * 如果当前就在首页，则直接平滑滚动到目标锚点；如果当前不在首页，则先记住目标，再导航回首页后继续滚动。
   */
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
      window.history.replaceState(null, '', `/#${anchorTarget}`)
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
            className="-rotate-1 whitespace-nowrap border-4 border-black bg-white/88 px-3 py-1 font-heading text-base leading-none font-black uppercase tracking-tight shadow-[4px_4px_0_0_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-0.5 sm:text-lg md:text-xl"
          >
            {config.brand.primaryLabel} // {config.brand.secondaryLabel}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {renderDesktopNavigationItems(config.navigation)}
          </nav>

          <div className="flex items-center gap-3">
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
                className="border-l-4 border-black bg-white p-0"
              >
                <SheetHeader className="border-b-4 border-black bg-secondary px-4 py-5">
                  <SheetTitle className="font-heading text-2xl font-black uppercase tracking-tight">
                    MENU // 导航
                  </SheetTitle>
                  <SheetDescription className="text-sm text-black/70">
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
