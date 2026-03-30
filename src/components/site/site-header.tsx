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
 * 计算桌面端导航链接样式。
 * 这里把激活态逻辑独立出去，是为了避免 JSX 中塞入太多字符串判断。
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
 * 计算移动端导航链接样式。
 * 移动端需要更强的点击反馈，因此这里使用整块填充的方式提高可点击感。
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
 * 使用 for...of 而不是直接 map，可以把渲染过程写得更显式，更方便后续插入埋点或权限判断。
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
 * 这些按钮目前跳往首页中的锚点区域，后面也可以很容易替换成外链、弹窗或命令面板入口。
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
 * 这里用 SheetClose 包裹链接，确保用户点击后菜单会自动关闭。
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
 * 渲染站点顶栏。
 * 这个组件只关心全局导航和品牌展示，不承载具体页面业务逻辑。
 */
export function SiteHeader({ config }: SiteHeaderProps): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 处理快捷入口点击事件。
   * 在首页内直接滚动；如果当前不在首页，则先记住目标区块，再导航回首页。
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
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-transparent">
      <div className="site-shell flex min-h-20 items-center justify-between gap-4 py-4">
        <Link
          to="/"
          className="-rotate-1 whitespace-nowrap border-4 border-black bg-white px-3 py-1 font-heading text-base leading-none font-black uppercase tracking-tight transition-transform hover:-translate-y-0.5 sm:text-lg md:text-xl"
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
    </header>
  )
}
