import { gsap } from "gsap";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Outlet, useLocation } from "react-router-dom";

import { BannerCrossfadeMarquee } from "@/shared/site/banner-crossfade-marquee";
import { DynamicIslandHeader } from "@/shared/components/site/dynamic-island-header";
import { HashScrollHandler } from "@/shared/components/site/hash-scroll-handler";
import { InteractiveDotBackground } from "@/shared/components/site/interactive-dot-background";
import { SiteFooter } from "@/shared/components/site/site-footer";
import { cn } from "@/shared/lib/utils";
import { endRouteTransition, installMotionPerf, logLastTransition, startRouteTransition } from "@/shared/motion/motion-perf";
import { MotionPerfHud } from "@/shared/motion/motion-perf-hud";
import { motionTokens } from "@/shared/motion/motion-tokens";
import { resolveRouteScene } from "@/shared/site/route-scene-config";
import { siteConfig } from "@/shared/site/site-config";

const COLLAPSED_BANNER_HEIGHT = "min(58.8vh, 728px)";
const BANNER_IMAGE_SAFE_BLEED_RATIO = 0.18;

function shouldPinBanner(pathname: string): boolean {
  return pathname === "/";
}

function getRouteBannerHeightStyle(isFullBanner: boolean): {
  height: "100svh" | typeof COLLAPSED_BANNER_HEIGHT;
} {
  return { height: isFullBanner ? "100svh" : COLLAPSED_BANNER_HEIGHT };
}

function getRouteBannerHeightPx(isFullBanner: boolean): number {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  if (isFullBanner) {
    return viewportHeight;
  }

  return Math.min(viewportHeight * 0.588, 728);
}

function getRouteBannerParallaxOffset({
  currentIsFullBanner,
  targetIsFullBanner,
}: {
  currentIsFullBanner: boolean;
  targetIsFullBanner: boolean;
}): number {
  if (currentIsFullBanner && !targetIsFullBanner) {
    return motionTokens.parallax.homeToInnerY;
  }

  if (!currentIsFullBanner && targetIsFullBanner) {
    return motionTokens.parallax.innerToHomeY;
  }

  return 0;
}

function clampRouteBannerParallaxOffset(
  offset: number,
  containerHeight: number,
): number {
  const safeTravel = Math.max(
    0,
    Math.round(containerHeight * BANNER_IMAGE_SAFE_BLEED_RATIO),
  );

  return Math.max(-safeTravel, Math.min(safeTravel, offset));
}

function interpolate(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * 收集当前路由内容里需要参与入场动画的块级元素。
 * 优先取一层子节点，避免把深层文本节点或装饰节点都卷进动画，导致节奏发散。
 */
function collectRouteEnterElements(
  containerElement: HTMLDivElement,
): HTMLElement[] {
  const directChildren = Array.from(containerElement.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (directChildren.length > 0) {
    const elements: HTMLElement[] = [];

    for (const child of directChildren) {
      const markedElements = Array.from(
        child.querySelectorAll("[data-route-enter]"),
      ).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

      if (markedElements.length > 0) {
        elements.push(...markedElements);
        continue;
      }

      elements.push(child);
    }

    return elements;
  }

  return [containerElement];
}

/**
 * 在降低动态效果时，直接把所有目标元素设回最终状态。
 * 这样可以保留布局结构，不会因为跳过动画而出现透明残留或位移错位。
 */
function applyReducedMotionState(elements: HTMLElement[]): void {
  gsap.set(elements, {
    autoAlpha: 1,
    y: 0,
    clearProps: "transform,opacity,visibility",
  });
}

/**
 * 为当前路由执行分层入场动画。
 * 整体策略参考 `fuwari`：不做整屏遮罩，只让横幅和内容块按顺序轻量进入。
 */
function playRouteEnterAnimation({
  bannerMediaElement,
  routeContentElement,
  hasAnimated,
}: {
  bannerMediaElement: HTMLImageElement;
  routeContentElement: HTMLDivElement;
  hasAnimated: boolean;
}): gsap.core.Timeline {
  const routeEnterElements = collectRouteEnterElements(routeContentElement);
  const timeline = gsap.timeline();
  const bannerMediaStartScale = hasAnimated ? 1.02 : 1.04;
  const routeContentStartY = hasAnimated ? 26 : 34;

  gsap.set(bannerMediaElement, { scale: bannerMediaStartScale });
  gsap.set(routeContentElement, { y: 0 });
  gsap.set(routeEnterElements, { autoAlpha: 0, y: routeContentStartY });

  timeline
    .to(bannerMediaElement, {
      scale: 1,
      duration: hasAnimated
        ? motionTokens.duration.bannerScale
        : motionTokens.duration.bannerScaleInitial,
      ease: motionTokens.ease.out,
    })
    .to(
      routeEnterElements,
      {
        autoAlpha: 1,
        y: 0,
        duration: hasAnimated
          ? motionTokens.duration.routeEnter
          : motionTokens.duration.routeEnterInitial,
        stagger: motionTokens.stagger.routeEnter,
        ease: motionTokens.ease.out,
        clearProps: "transform,opacity,visibility",
      },
      hasAnimated ? motionTokens.delay.routeEnter : motionTokens.delay.routeEnterInitial,
    );

  return timeline;
}

export function SiteLayout(): ReactElement {
  const location = useLocation();
  const bannerFrameRef = useRef<HTMLDivElement | null>(null);
  const bannerMediaRef = useRef<HTMLImageElement | null>(null);
  const routeLayerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const showPerfHud =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("perf") === "1";
  const previousPathnameRef = useRef(location.pathname);
  const bannerHeightTweenRef = useRef<gsap.core.Tween | null>(null);
  const bannerMediaTweenRef = useRef<gsap.core.Tween | null>(null);
  const routeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeRouteScene = resolveRouteScene(location.pathname);
  const [bannerScenePathname, setBannerScenePathname] = useState(
    location.pathname,
  );
  const [isBannerPinned, setIsBannerPinned] = useState(() =>
    shouldPinBanner(location.pathname),
  );
  const resolvedRouteScene = resolveRouteScene(bannerScenePathname);

  useLayoutEffect(() => {
    const bannerFrameElement = bannerFrameRef.current;
    const bannerMediaElement = bannerMediaRef.current;
    const routeLayerElement = routeLayerRef.current;

    if (!bannerFrameElement || !bannerMediaElement || !routeLayerElement) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const previousPathname = previousPathnameRef.current;
    const nextPathname = location.pathname;
    const isRouteChange = previousPathname !== nextPathname;
    const isLeavingHome = previousPathname === "/" && nextPathname !== "/";
    const isReturningHome = previousPathname !== "/" && nextPathname === "/";
    const previousScene = resolveRouteScene(previousPathname);
    const nextScene = resolveRouteScene(nextPathname);
    const routeEnterElements = collectRouteEnterElements(routeLayerElement);

    routeTimelineRef.current?.kill();
    bannerHeightTweenRef.current?.kill();
    bannerMediaTweenRef.current?.kill();
    gsap.killTweensOf([
      bannerFrameElement,
      bannerMediaElement,
      routeLayerElement,
      ...routeEnterElements,
    ]);

    if (prefersReducedMotion) {
      setBannerScenePathname(nextPathname);
      setIsBannerPinned(shouldPinBanner(nextPathname));
      bannerFrameElement.style.height = nextScene.isFullBanner
        ? "100svh"
        : COLLAPSED_BANNER_HEIGHT;
      gsap.set(bannerMediaElement, {
        scale: 1,
        y: nextScene.isFullBanner ? 0 : -96,
        clearProps: "transform,willChange",
      });
      gsap.set(routeLayerElement, { autoAlpha: 1, clearProps: "willChange" });
      applyReducedMotionState(routeEnterElements);
      previousPathnameRef.current = nextPathname;
      hasAnimatedRef.current = true;
      return;
    }

    if (!isRouteChange) {
      bannerFrameElement.style.height = nextScene.isFullBanner
        ? "100svh"
        : COLLAPSED_BANNER_HEIGHT;
      gsap.set(routeLayerElement, {
        autoAlpha: 1,
        clearProps: "willChange",
      });
      applyReducedMotionState(routeEnterElements);
      routeTimelineRef.current = playRouteEnterAnimation({
        bannerMediaElement,
        routeContentElement: routeLayerElement,
        hasAnimated: hasAnimatedRef.current,
      });
      hasAnimatedRef.current = true;

      return () => {
        routeTimelineRef.current?.kill();
      };
    }

    if (import.meta.env.DEV) {
      installMotionPerf("optimized");
      startRouteTransition({ pathname: nextPathname, mode: "optimized" });
    }

    setIsBannerPinned(false);

    const currentBannerHeight = bannerFrameElement.getBoundingClientRect().height;
    const targetBannerHeight = getRouteBannerHeightPx(nextScene.isFullBanner);
    const startBannerY = Number(gsap.getProperty(bannerMediaElement, "y")) || 0;
    const rawTargetBannerY = getRouteBannerParallaxOffset({
      currentIsFullBanner: previousScene.isFullBanner,
      targetIsFullBanner: nextScene.isFullBanner,
    });
    const targetBannerY =
      !previousScene.isFullBanner && !nextScene.isFullBanner
        ? startBannerY
        : clampRouteBannerParallaxOffset(rawTargetBannerY, targetBannerHeight);

    bannerFrameElement.style.height = `${currentBannerHeight}px`;
    gsap.set(routeLayerElement, {
      autoAlpha: 0,
      willChange: "opacity,transform",
    });

    bannerHeightTweenRef.current = gsap.to(bannerFrameElement, {
      height: targetBannerHeight,
      duration: motionTokens.duration.bannerResize,
      ease: motionTokens.ease.inOut,
      overwrite: true,
      onUpdate: () => {
        const tween = bannerHeightTweenRef.current;
        const progress = tween?.progress() ?? 0;
        const easedProgress = tween?.ratio ?? progress;

        gsap.set(bannerMediaElement, {
          y: interpolate(startBannerY, targetBannerY, easedProgress),
        });

        if (isLeavingHome && progress >= 0.72 && bannerScenePathname !== nextPathname) {
          setBannerScenePathname(nextPathname);
        }
      },
      onComplete: () => {
        bannerFrameElement.style.height = nextScene.isFullBanner
          ? "100svh"
          : COLLAPSED_BANNER_HEIGHT;
        if (bannerScenePathname !== nextPathname) {
          setBannerScenePathname(nextPathname);
        }
        if (isReturningHome) {
          setIsBannerPinned(true);
        }
      },
    });
    bannerMediaTweenRef.current = bannerHeightTweenRef.current;

    routeTimelineRef.current = gsap.timeline({
      delay: isReturningHome
        ? motionTokens.duration.bannerResize
        : motionTokens.duration.bannerResize * 0.55,
      onComplete: () => {
        gsap.set(routeLayerElement, { clearProps: "willChange" });
        if (!isReturningHome) {
          setIsBannerPinned(shouldPinBanner(nextPathname));
        }
        if (import.meta.env.DEV) {
          const entry = endRouteTransition({ interrupted: false });
          if (entry) {
            logLastTransition();
          }
        }
      },
    });

    routeTimelineRef.current.to(routeLayerElement, {
      autoAlpha: 1,
      duration: motionTokens.duration.fade,
      ease: motionTokens.ease.inOut,
      overwrite: "auto",
    });

    routeTimelineRef.current.add(
      playRouteEnterAnimation({
        bannerMediaElement,
        routeContentElement: routeLayerElement,
        hasAnimated: hasAnimatedRef.current,
      }),
      0,
    );

    previousPathnameRef.current = nextPathname;
    hasAnimatedRef.current = true;

    return () => {
      routeTimelineRef.current?.kill();
      bannerHeightTweenRef.current?.kill();
      bannerMediaTweenRef.current?.kill();
    };
  }, [location.pathname]);

  return (
    <div className="theme-surface-page relative isolate min-h-screen overflow-x-clip">
      <InteractiveDotBackground />
      <DynamicIslandHeader config={siteConfig} />
      <HashScrollHandler />

      <section className="relative">
        <div
          ref={bannerFrameRef}
          className={cn("relative w-full overflow-hidden")}
          style={getRouteBannerHeightStyle(resolvedRouteScene.isFullBanner)}
        >
          <BannerCrossfadeMarquee
            mediaRef={bannerMediaRef}
            src={resolvedRouteScene.scene.image.src}
            alt={resolvedRouteScene.scene.image.alt}
            imagePosition={resolvedRouteScene.scene.imagePosition}
            positionClassName={isBannerPinned ? "fixed" : "absolute"}
          />
          <div
            className={cn(
              "pointer-events-none inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--surface-panel)_94%,transparent)_0%,color-mix(in_srgb,var(--surface-panel)_78%,transparent)_24%,transparent_58%)]",
              isBannerPinned ? "fixed" : "absolute",
            )}
          />
          <div
            className={cn(
              "pointer-events-none inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-page)_8%,transparent)_0%,transparent_42%,color-mix(in_srgb,var(--surface-page)_30%,transparent)_100%)]",
              isBannerPinned ? "fixed" : "absolute",
            )}
          />
          <div
            className={cn(
              "pointer-events-none manga-halftone -right-8 top-10 size-40 text-[color-mix(in_srgb,var(--surface-ink)_10%,transparent)]",
              isBannerPinned ? "fixed" : "absolute",
            )}
          />
        </div>
      </section>

      <main
        className={cn(
          "site-shell relative z-20 px-4 pb-20 md:px-6",
          activeRouteScene.isFullBanner
            ? "-mt-12 md:-mt-[4.5rem]"
            : "-mt-24 md:-mt-28 lg:-mt-32",
        )}
      >
        <div ref={routeLayerRef}>
          <Outlet />
        </div>
      </main>

      <div className="relative z-20">
        <SiteFooter config={siteConfig} />
      </div>

      {showPerfHud ? <MotionPerfHud /> : null}
    </div>
  );
}
