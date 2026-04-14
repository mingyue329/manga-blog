import { gsap } from 'gsap'
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
} from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { HashScrollHandler } from '@/shared/components/site/hash-scroll-handler'
import { InteractiveDotBackground } from '@/shared/components/site/interactive-dot-background'
import { SiteFooter } from '@/shared/components/site/site-footer'
import { SiteHeader } from '@/shared/components/site/site-header'
import { resolveRouteScene } from '@/shared/site/route-scene-config'
import { siteConfig } from '@/shared/site/site-config'

function getRouteBannerHeightStyle(isHomeScene: boolean): CSSProperties {
  return {
    height: isHomeScene ? 'min(68vh, 760px)' : 'min(34vh, 420px)',
  }
}

export function SiteLayout(): ReactElement {
  const location = useLocation()
  const bannerFrameRef = useRef<HTMLDivElement | null>(null)
  const bannerMediaRef = useRef<HTMLImageElement | null>(null)
  const bannerContentRef = useRef<HTMLDivElement | null>(null)
  const routeContentRef = useRef<HTMLDivElement | null>(null)
  const routeCurtainRef = useRef<HTMLDivElement | null>(null)
  const hasAnimatedRef = useRef(false)
  const resolvedRouteScene = resolveRouteScene(location.pathname)

  useLayoutEffect(() => {
    const bannerFrameElement = bannerFrameRef.current
    const bannerMediaElement = bannerMediaRef.current
    const bannerContentElement = bannerContentRef.current
    const routeContentElement = routeContentRef.current
    const routeCurtainElement = routeCurtainRef.current

    if (
      !bannerFrameElement ||
      !bannerMediaElement ||
      !bannerContentElement ||
      !routeContentElement ||
      !routeCurtainElement
    ) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.killTweensOf([
      bannerFrameElement,
      bannerMediaElement,
      bannerContentElement,
      routeContentElement,
      routeCurtainElement,
    ])

    if (prefersReducedMotion) {
      gsap.set(routeCurtainElement, { autoAlpha: 0, scaleY: 0 })
      gsap.set(bannerMediaElement, { scale: 1 })
      gsap.set(bannerContentElement, { autoAlpha: 1, y: 0 })
      gsap.set(routeContentElement, { autoAlpha: 1, y: 0 })
      hasAnimatedRef.current = true
      return
    }

    const timeline = gsap.timeline()

    if (!hasAnimatedRef.current) {
      gsap.set(routeCurtainElement, { autoAlpha: 0, scaleY: 0 })
      gsap.set(bannerMediaElement, { scale: 1.06 })
      gsap.set(bannerContentElement, { autoAlpha: 0, y: 26 })
      gsap.set(routeContentElement, { autoAlpha: 0, y: 32 })

      timeline
        .to(bannerMediaElement, {
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
        })
        .to(
          bannerContentElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power3.out',
          },
          0.12,
        )
        .to(
          routeContentElement,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            ease: 'power3.out',
          },
          0.18,
        )

      hasAnimatedRef.current = true
      return () => {
        timeline.kill()
      }
    }

    gsap.set(routeCurtainElement, {
      autoAlpha: 1,
      scaleY: 1,
      transformOrigin: 'top center',
    })
    gsap.set(bannerMediaElement, { scale: 1.05 })
    gsap.set(bannerContentElement, { autoAlpha: 0, y: 20 })
    gsap.set(routeContentElement, { autoAlpha: 0, y: 26 })

    timeline
      .to(routeCurtainElement, {
        scaleY: 0,
        transformOrigin: 'bottom center',
        duration: 0.55,
        ease: 'power4.out',
      })
      .to(
        bannerMediaElement,
        {
          scale: 1,
          duration: 0.78,
          ease: 'power3.out',
        },
        0.05,
      )
      .to(
        bannerContentElement,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: 'power3.out',
        },
        0.16,
      )
      .to(
        routeContentElement,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        0.22,
      )
      .set(routeCurtainElement, { autoAlpha: 0 })

    return () => {
      timeline.kill()
    }
  }, [location.pathname])

  return (
    <div className="theme-surface-page relative isolate min-h-screen overflow-x-clip">
      <InteractiveDotBackground />
      <SiteHeader config={siteConfig} />
      <HashScrollHandler />

      <div
        ref={routeCurtainRef}
        className="theme-surface-ink pointer-events-none fixed inset-x-0 top-0 z-40 h-screen origin-top"
      />

      <section className="relative">
        <div
          ref={bannerFrameRef}
          className="relative w-full overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={getRouteBannerHeightStyle(resolvedRouteScene.isHomeScene)}
        >
          <img
            ref={bannerMediaRef}
            src={resolvedRouteScene.scene.image.src}
            alt={resolvedRouteScene.scene.image.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: resolvedRouteScene.scene.imagePosition }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--surface-panel)_94%,transparent)_0%,color-mix(in_srgb,var(--surface-panel)_78%,transparent)_24%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-page)_8%,transparent)_0%,transparent_42%,color-mix(in_srgb,var(--surface-page)_30%,transparent)_100%)]" />
          <div className="manga-halftone absolute -right-8 top-10 size-40 text-[color-mix(in_srgb,var(--surface-ink)_10%,transparent)]" />

          <div
            ref={bannerContentRef}
            className="site-shell relative z-10 flex h-full items-end px-4 pb-6 pt-28 md:px-6 md:pb-8 lg:pb-10"
          >
            <div className="theme-border-strong max-w-4xl space-y-4 border-4 bg-[color-mix(in_srgb,var(--surface-panel)_84%,transparent)] px-5 py-5 shadow-[10px_10px_0_0_var(--surface-ink)] backdrop-blur-[10px] md:px-7 md:py-6">
              <p className="font-heading text-xs font-black uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--copy-base)_68%,transparent)]">
                {resolvedRouteScene.scene.eyebrow}
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <h1 className="font-heading text-4xl font-black leading-none tracking-tight text-[var(--copy-base)] md:text-6xl">
                  {resolvedRouteScene.scene.title}
                </h1>
                <span className="theme-surface-ink theme-border-strong mb-1 border-4 px-3 py-1 font-heading text-sm font-black uppercase tracking-[0.14em] text-[var(--copy-inverse)] md:text-base">
                  {resolvedRouteScene.scene.emphasis}
                </span>
              </div>
              <p className="max-w-3xl text-sm font-medium leading-7 text-[color-mix(in_srgb,var(--copy-base)_82%,transparent)] md:text-base md:leading-8">
                {resolvedRouteScene.scene.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="site-shell relative z-20 -mt-12 px-4 pb-20 md:-mt-[4.5rem] md:px-6">
        <div ref={routeContentRef}>
          <Outlet />
        </div>
      </main>

      <div className="relative z-20">
        <SiteFooter config={siteConfig} />
      </div>
    </div>
  )
}
