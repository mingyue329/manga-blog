export const motionTokens = {
  ease: {
    out: "power2.out",
    outStrong: "power3.out",
    inOut: "power1.inOut",
    none: "none",
  },
  duration: {
    fast: 0.24,
    medium: 0.46,
    fade: 0.24,
    bannerScaleInitial: 0.84,
    bannerScale: 0.72,
    routeEnterInitial: 0.46,
    routeEnter: 0.4,
    bannerResize: 0.45,
    bannerPan: 0.45,
  },
  delay: {
    routeEnterInitial: 0.16,
    routeEnter: 0.12,
  },
  stagger: {
    routeEnter: 0.08,
  },
  parallax: {
    homeToInnerY: -180,
    innerToHomeY: 0,
  },
} as const;
