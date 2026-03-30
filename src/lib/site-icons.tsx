import type { LucideIcon } from 'lucide-react'
import {
  Braces,
  Code2,
  Container,
  Database,
  Gamepad2,
  MapPin,
  PenTool,
  TerminalSquare,
  Wind,
} from 'lucide-react'

import type { SiteIconKey } from '@/types/content'

const siteIconMap: Record<SiteIconKey, LucideIcon> = {
  'gamepad-2': Gamepad2,
  'code-2': Code2,
  'terminal-square': TerminalSquare,
  'map-pin': MapPin,
  braces: Braces,
  database: Database,
  container: Container,
  figma: PenTool,
  wind: Wind,
}

/**
 * 根据数据层提供的字符串键拿到真正的图标组件。
 * 这样做可以避免在配置文件里直接塞组件对象，便于未来改成接口返回数据。
 */
export function getSiteIcon(iconKey: SiteIconKey): LucideIcon {
  return siteIconMap[iconKey]
}
