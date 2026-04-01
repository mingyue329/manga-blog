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
 * 激活态保留更明确的下划线和文字强调，未激活态只保留轻量的 hover 反馈。
 * 这样可以在当前站点偏漫画感的重边框风格下，依然让导航层级足够清楚。
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
 * 抽屉菜单里的点击区域需要更大，因此这里继续保留整块按钮式的处理方式，
 * 让移动端点击命中范围更稳定，不会出现过小文本难以点中的问题。
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
 * 这里显式使用 `for...of`，便于后续插入埋点、权限判断或实验逻辑，
 * 而不是把所有逻辑都塞进 `map` 的回调函数里。
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
 * 这里使用 `Link` 而不是原生 `<a>`，目的是让 GitHub Pages 这种子路径部署
 * 自动继承 React Router 的 basename，避免链接地址丢失 `/manga-blog` 这类前缀。
 * 同时仍然保留 `onClick` 拦截能力，用于首页锚点的平滑滚动控制。
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

/**
 * 渲染移动端抽屉中的导航项。
 * 这里用 `SheetClose` 包裹链接，确保用户点击后抽屉会立刻关闭，
 * 不会出现路由已经跳转了，但抽屉仍停留在页面上的割裂感。
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
 * 顶部保留半透明描图纸风格，让点阵背景可以透出来，同时靠边框、模糊和层级
 * 保持导航的可读性与容器感。这里同时承担站内导航与首页锚点入口的职责。
 */
export function SiteHeader({ config }: SiteHeaderProps): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 处理快捷入口点击事件。
   * 如果当前已经在首页，就直接在当前地址后面补上 hash 并执行平滑滚动；
   * 这里显式复用浏览器当前的 pathname 和 search，确保 GitHub Pages 下真实地址
   * 仍然保持 `/manga-blog/` 这样的子路径前缀，而不是被错误替换成域名根路径 `/`。
   * 如果当前不在首页，则先把目标锚点暂存起来，再回到首页后继续滚动。
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
