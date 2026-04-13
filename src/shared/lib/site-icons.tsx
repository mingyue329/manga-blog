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

import type { SiteIconKey } from '@/shared/types/content'

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
 * 鏍规嵁鏁版嵁灞傛彁渚涚殑瀛楃涓查敭鎷垮埌鐪熸鐨勫浘鏍囩粍浠躲€? * 杩欐牱鍋氬彲浠ラ伩鍏嶅湪閰嶇疆鏂囦欢閲岀洿鎺ュ缁勪欢瀵硅薄锛屼究浜庢湭鏉ユ敼鎴愭帴鍙ｈ繑鍥炴暟鎹€? */
export function getSiteIcon(iconKey: SiteIconKey): LucideIcon {
  return siteIconMap[iconKey]
}

