import type { MouseEvent, ReactElement } from 'react'
import { Menu } from 'lucide-react'
import {
  Link,
  NavLink,
  type NavLinkRenderProps,
  useLocation,
  useNavigate,
} from 'react-router-dom'

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
import {
  extractAnchorTarget,
  savePendingAnchorTarget,
  scrollToAnchorTarget,
} from '@/shared/lib/anchor-scroll'
import { getSiteIcon } from '@/shared/lib/site-icons'
import { cn } from '@/shared/lib/utils'
import type { NavigationLink, SiteConfig, SiteQuickAction } from '@/shared/types/content'

interface SiteHeaderProps {
  config: SiteConfig
}

/**
 * 璁＄畻妗岄潰绔鑸摼鎺ョ殑鏍峰紡銆? * 婵€娲绘€佷繚鐣欐洿鏄庣‘鐨勪笅鍒掔嚎鍜屾枃瀛楀己璋冿紝鏈縺娲绘€佸彧淇濈暀杞婚噺鐨?hover 鍙嶉銆? * 杩欐牱鍙互鍦ㄥ綋鍓嶇珯鐐瑰亸婕敾鎰熺殑閲嶈竟妗嗛鏍间笅锛屼緷鐒惰瀵艰埅灞傜骇瓒冲娓呮銆? */
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
 * 璁＄畻绉诲姩绔鑸摼鎺ョ殑鏍峰紡銆? * 鎶藉眽鑿滃崟閲岀殑鐐瑰嚮鍖哄煙闇€瑕佹洿澶э紝鍥犳杩欓噷缁х画淇濈暀鏁村潡鎸夐挳寮忕殑澶勭悊鏂瑰紡锛? * 璁╃Щ鍔ㄧ鐐瑰嚮鍛戒腑鑼冨洿鏇寸ǔ瀹氾紝涓嶄細鍑虹幇杩囧皬鏂囨湰闅句互鐐逛腑鐨勯棶棰樸€? */
function getMobileNavigationLinkClassName({
  isActive,
}: NavLinkRenderProps): string {
  return cn(
    'block border-b-2 border-black px-4 py-4 font-heading text-lg font-black uppercase tracking-[0.2em] transition-colors',
    isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-secondary',
  )
}

/**
 * 娓叉煋妗岄潰绔鑸」銆? * 杩欓噷鏄惧紡浣跨敤 `for...of`锛屼究浜庡悗缁彃鍏ュ煁鐐广€佹潈闄愬垽鏂垨瀹為獙閫昏緫锛? * 鑰屼笉鏄妸鎵€鏈夐€昏緫閮藉杩?`map` 鐨勫洖璋冨嚱鏁伴噷銆? */
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
 * 娓叉煋 Header 鍙充晶蹇嵎鍏ュ彛銆? * 杩欓噷浣跨敤 `Link` 鑰屼笉鏄師鐢?`<a>`锛岀洰鐨勬槸璁?GitHub Pages 杩欑瀛愯矾寰勯儴缃? * 鑷姩缁ф壙 React Router 鐨?basename锛岄伩鍏嶉摼鎺ュ湴鍧€涓㈠け `/manga-blog` 杩欑被鍓嶇紑銆? * 鍚屾椂浠嶇劧淇濈暀 `onClick` 鎷︽埅鑳藉姏锛岀敤浜庨椤甸敋鐐圭殑骞虫粦婊氬姩鎺у埗銆? */
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
 * 娓叉煋绉诲姩绔娊灞変腑鐨勫鑸」銆? * 杩欓噷鐢?`SheetClose` 鍖呰９閾炬帴锛岀‘淇濈敤鎴风偣鍑诲悗鎶藉眽浼氱珛鍒诲叧闂紝
 * 涓嶄細鍑虹幇璺敱宸茬粡璺宠浆浜嗭紝浣嗘娊灞変粛鍋滅暀鍦ㄩ〉闈笂鐨勫壊瑁傛劅銆? */
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
 * 娓叉煋绔欑偣椤堕儴瀵艰埅銆? * 椤堕儴淇濈暀鍗婇€忔槑鎻忓浘绾搁鏍硷紝璁╃偣闃佃儗鏅彲浠ラ€忓嚭鏉ワ紝鍚屾椂闈犺竟妗嗐€佹ā绯婂拰灞傜骇
 * 淇濇寔瀵艰埅鐨勫彲璇绘€т笌瀹瑰櫒鎰熴€傝繖閲屽悓鏃舵壙鎷呯珯鍐呭鑸笌棣栭〉閿氱偣鍏ュ彛鐨勮亴璐ｃ€? */
export function SiteHeader({ config }: SiteHeaderProps): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * 澶勭悊蹇嵎鍏ュ彛鐐瑰嚮浜嬩欢銆?   * 濡傛灉褰撳墠宸茬粡鍦ㄩ椤碉紝灏辩洿鎺ュ湪褰撳墠鍦板潃鍚庨潰琛ヤ笂 hash 骞舵墽琛屽钩婊戞粴鍔紱
   * 杩欓噷鏄惧紡澶嶇敤娴忚鍣ㄥ綋鍓嶇殑 pathname 鍜?search锛岀‘淇?GitHub Pages 涓嬬湡瀹炲湴鍧€
   * 浠嶇劧淇濇寔 `/manga-blog/` 杩欐牱鐨勫瓙璺緞鍓嶇紑锛岃€屼笉鏄閿欒鏇挎崲鎴愬煙鍚嶆牴璺緞 `/`銆?   * 濡傛灉褰撳墠涓嶅湪棣栭〉锛屽垯鍏堟妸鐩爣閿氱偣鏆傚瓨璧锋潵锛屽啀鍥炲埌棣栭〉鍚庣户缁粴鍔ㄣ€?   */
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
                  aria-label="鎵撳紑绔欑偣瀵艰埅"
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
                    MENU // 瀵艰埅
                  </SheetTitle>
                  <SheetDescription className="text-sm text-black/70">
                    杩欓噷淇濈暀浜嗗悗缁柊澧炴爮鐩€佺敤鎴蜂腑蹇冨拰鎼滅储鍏ュ彛鐨勬墿灞曠┖闂淬€?                  </SheetDescription>
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

