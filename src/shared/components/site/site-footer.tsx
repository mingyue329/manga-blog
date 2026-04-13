import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { Separator } from '@/shared/ui/separator'
import type { FooterLink, SiteConfig } from '@/shared/types/content'

interface SiteFooterProps {
  config: SiteConfig
}

/**
 * 娓叉煋椤佃剼閾炬帴鍙婁腑闂村垎闅旂銆? * 杩欓噷娌℃湁鐩存帴鐢?map 鎷兼帴瀛楃涓诧紝鏄负浜嗚鍒嗛殧绗︾殑鎻掑叆閫昏緫鏇寸洿瑙傘€? */
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
 * 娓叉煋绔欑偣椤佃剼銆? * 椤佃剼鏄叏灞€甯冨眬鐨勪竴閮ㄥ垎锛屽洜姝ゅ彧娑堣垂绔欑偣閰嶇疆锛屼笉渚濊禆鍏蜂綋椤甸潰鏁版嵁銆? */
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

