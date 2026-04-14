import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

interface HoverPreviewCardRefs {
  triggerRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  shadowRef: RefObject<HTMLDivElement | null>
  imageRef: RefObject<HTMLImageElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
}

/**
 * 统一处理预览卡片的 hover 动画。
 * 预览类卡片只在悬停时出现漫画阴影，图片则从灰度态平滑过渡到彩色并轻微放大。
 */
export function useGsapHoverPreviewCard(): HoverPreviewCardRefs {
  const triggerRef = useRef<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const shadowRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const triggerElement = triggerRef.current
    const cardElement = cardRef.current
    const shadowElement = shadowRef.current
    const imageElement = imageRef.current
    const overlayElement = overlayRef.current

    if (!triggerElement || !cardElement || !shadowElement) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.set(cardElement, { boxShadow: 'none' })
    gsap.set(shadowElement, { x: 0, y: 0, opacity: 0 })

    if (imageElement) {
      gsap.set(imageElement, {
        scale: 1,
        filter: prefersReducedMotion ? 'none' : 'grayscale(1)',
        transformOrigin: 'center center',
      })
    }

    if (overlayElement) {
      gsap.set(overlayElement, { opacity: 0 })
    }

    function handlePointerEnter(): void {
      gsap.to(shadowElement, {
        x: 10,
        y: 10,
        opacity: 1,
        duration: 0.24,
        ease: 'power2.out',
      })

      if (imageElement) {
        gsap.to(imageElement, {
          scale: 1.05,
          filter: 'grayscale(0)',
          duration: prefersReducedMotion ? 0.01 : 0.5,
          ease: prefersReducedMotion ? 'none' : 'power3.out',
        })
      }

    }

    function handlePointerLeave(): void {
      gsap.to(shadowElement, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.24,
        ease: 'power2.out',
      })

      if (imageElement) {
        gsap.to(imageElement, {
          scale: 1,
          filter: prefersReducedMotion ? 'none' : 'grayscale(1)',
          duration: prefersReducedMotion ? 0.01 : 0.42,
          ease: prefersReducedMotion ? 'none' : 'power2.out',
        })
      }

    }

    triggerElement.addEventListener('pointerenter', handlePointerEnter)
    triggerElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      triggerElement.removeEventListener('pointerenter', handlePointerEnter)
      triggerElement.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(cardElement)
      gsap.killTweensOf(shadowElement)
      if (imageElement) {
        gsap.killTweensOf(imageElement)
      }
      if (overlayElement) {
        gsap.killTweensOf(overlayElement)
      }
    }
  }, [])

  return {
    triggerRef,
    cardRef,
    shadowRef,
    imageRef,
    overlayRef,
  }
}

interface HoverLiftRefs {
  triggerRef: RefObject<HTMLElement | null>
  targetRef: RefObject<HTMLElement | null>
}

export function useGsapHoverLift(distance = 6): HoverLiftRefs {
  const triggerRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const triggerElement = triggerRef.current
    const targetElement = targetRef.current

    if (!triggerElement || !targetElement) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.set(targetElement, {
      y: 0,
      boxShadow: '0px 0px 0px 0px var(--surface-ink)',
    })

    function handlePointerEnter(): void {
      gsap.to(targetElement, {
        y: prefersReducedMotion ? 0 : -distance,
        boxShadow: '6px 6px 0 0 var(--surface-ink)',
        duration: prefersReducedMotion ? 0.01 : 0.26,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
      })
    }

    function handlePointerLeave(): void {
      gsap.to(targetElement, {
        y: 0,
        boxShadow: '0px 0px 0px 0px var(--surface-ink)',
        duration: prefersReducedMotion ? 0.01 : 0.22,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
      })
    }

    triggerElement.addEventListener('pointerenter', handlePointerEnter)
    triggerElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      triggerElement.removeEventListener('pointerenter', handlePointerEnter)
      triggerElement.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(targetElement)
    }
  }, [distance])

  return {
    triggerRef,
    targetRef,
  }
}
