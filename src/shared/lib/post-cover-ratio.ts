import type { PostCoverRatio } from '@/shared/types/content'

/**
 * 鎶婃枃绔犲皝闈㈡瘮渚嬫槧灏勬垚椤甸潰閲岀湡姝ｄ娇鐢ㄧ殑 Tailwind aspect 绫诲悕銆? * 缁熶竴鏀惧湪宸ュ叿鍑芥暟閲屼箣鍚庯紝褰掓。椤点€佽鎯呴〉鍜岄椤靛崱鐗囬兘鍙互鍏辩敤鍚屼竴濂楁瘮渚嬭涔夛紝閬垮厤鍚勮嚜缁存姢涓€浠芥潯浠跺垽鏂€? */
export function getPostCoverRatioClass(coverRatio: PostCoverRatio): string {
  switch (coverRatio) {
    case 'portrait':
      return 'aspect-[4/5]'
    case 'square':
      return 'aspect-square'
    case 'wide':
      return 'aspect-[16/9]'
    case 'landscape':
    default:
      return 'aspect-[4/3]'
  }
}

