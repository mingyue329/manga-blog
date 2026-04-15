import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import type { LucideProps, LucideIcon } from "lucide-react";
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
} from "lucide-react";


import type { SiteIconKey } from "@/shared/types/content";

/**
 * Steam 官方图标 - 使用自定义 SVG 路径
 */
const SteamIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg ref={ref} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.979 0C5.666 0 .548 4.904.053 11.127l4.84 2.005c.42-.397.977-.64 1.593-.64.14 0 .275.015.407.042l2.29-3.283c-.02-.183-.033-.37-.033-.56 0-2.485 2.014-4.5 4.5-4.5s4.5 2.015 4.5 4.5-2.014 4.5-4.5 4.5c-.19 0-.376-.013-.558-.033l-3.284 2.29c.027.132.042.267.042.407 0 .616-.243 1.173-.64 1.593l2.005 4.84C17.536 21.896 22.44 16.778 22.44 10.465 22.44 4.685 17.755 0 11.979 0zM7.5 13.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5S6 15.828 6 15s.672-1.5 1.5-1.5zm6.147-6.147c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z" />
    </svg>
  ),
) as ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

SteamIcon.displayName = "SteamIcon";

const GithubIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg ref={ref} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0.5C5.648 0.5 0.5 5.82 0.5 12.393c0 5.25 3.292 9.706 7.86 11.278.575.111.785-.255.785-.568 0-.282-.01-1.03-.015-2.022-3.197.716-3.872-1.585-3.872-1.585-.523-1.378-1.277-1.744-1.277-1.744-1.043-.734.079-.719.079-.719 1.153.084 1.761 1.224 1.761 1.224 1.026 1.817 2.69 1.292 3.345.988.104-.768.402-1.292.732-1.589-2.553-.299-5.236-1.321-5.236-5.876 0-1.298.45-2.36 1.189-3.192-.119-.3-.515-1.51.113-3.146 0 0 .97-.321 3.18 1.219a10.75 10.75 0 0 1 2.895-.402c.982.005 1.97.136 2.895.402 2.21-1.54 3.178-1.219 3.178-1.219.63 1.636.234 2.846.115 3.146.74.832 1.188 1.894 1.188 3.192 0 4.566-2.688 5.574-5.248 5.868.413.368.78 1.096.78 2.209 0 1.594-.014 2.879-.014 3.27 0 .316.207.685.79.568 4.565-1.574 7.855-6.028 7.855-11.276C23.5 5.82 18.352 0.5 12 0.5z" />
    </svg>
  ),
) as ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

GithubIcon.displayName = "GithubIcon";

const siteIconMap: Record<SiteIconKey, LucideIcon> = {
  "gamepad-2": Gamepad2,
  "code-2": Code2,
  "terminal-square": TerminalSquare,
  "map-pin": MapPin,
  braces: Braces,
  database: Database,
  container: Container,
  figma: PenTool,
  wind: Wind,
  steam: SteamIcon,
  github: GithubIcon,
};

/**
 * 鏍规嵁鏁版嵁灞傛彁渚涚殑瀛楃涓查敭鎷垮埌鐪熸鐨勫浘鏍囩粍浠躲€? * 杩欐牱鍋氬彲浠ラ伩鍏嶅湪閰嶇疆鏂囦欢閲岀洿鎺ュ缁勪欢瀵硅薄锛屼究浜庢湭鏉ユ敼鎴愭帴鍙ｈ繑鍥炴暟鎹€? */
export function getSiteIcon(iconKey: SiteIconKey): LucideIcon {
  return siteIconMap[iconKey];
}
