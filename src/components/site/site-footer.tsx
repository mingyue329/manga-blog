import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'
import type { FooterLink, SiteConfig } from '@/types/content'

interface SiteFooterProps {
  config: SiteConfig
}

/**
 * 渲染页脚链接及中间分隔符。
 * 这里没有直接用 map 拼接字符串，是为了让分隔符的插入逻辑更直观。
 */
function renderFooterLinks(links: FooterLink[]): ReactElement[] {
  const elements: ReactElement[] = []

  for (let index = 0; index < links.length; index += 1) {
    const link = links[index]

    elements.push(
      <Link
        key={`${link.label}-${link.to}`}
        to={link.to}
        className="text-xs font-bold uppercase tracking-[0.24em] text-black/70 transition-colors hover:text-black hover:underline"
      >
        {link.label}
      </Link>,
    )

    if (index < links.length - 1) {
      elements.push(
        <Separator
          key={`${link.label}-separator`}
          orientation="vertical"
          className="hidden h-4 bg-black/20 md:block"
        />,
      )
    }
  }

  return elements
}

/**
 * 渲染站点页脚。
 * 页脚是全局布局的一部分，因此只消费站点配置，不依赖具体页面数据。
 */
export function SiteFooter({ config }: SiteFooterProps): ReactElement {
  return (
    <footer className="border-t-4 border-black bg-transparent">
      <div className="site-shell flex flex-col items-center gap-6 py-12 text-center">
        <Link
          to="/"
          className="border-b-4 border-black font-heading text-3xl font-black uppercase tracking-tight"
        >
          {config.brand.primaryLabel} // {config.brand.secondaryLabel}
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {renderFooterLinks(config.footer.links)}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-black/80">
            {config.footer.copyright}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="size-2 bg-black" />
            <span className="size-2 bg-black" />
            <span className="size-2 bg-black" />
          </div>
        </div>
      </div>
    </footer>
  )
}
