import { useEffect, useRef, type ReactElement } from 'react'

/**
 * 表示背景聚焦动画的内部状态。
 * current 用于渲染当前帧，target 用于记录鼠标最新位置，两者之间会做平滑过渡。
 */
interface SpotlightState {
  x: number
  y: number
  opacity: number
}

const INITIAL_SPOTLIGHT_X = 0
const INITIAL_SPOTLIGHT_Y = 0
const INITIAL_SPOTLIGHT_OPACITY = 0
const POSITION_EASING = 0.18
const OPACITY_EASING = 0.14
const MIN_UPDATE_DISTANCE = 0.5
const MIN_UPDATE_OPACITY = 0.02

/**
 * 把数值写入 CSS 自定义属性。
 * 这样视觉层可以完全交给 CSS 处理，React 不需要在每次鼠标移动时触发重渲染。
 */
function applySpotlightStyle(
  element: HTMLDivElement,
  spotlightState: SpotlightState,
): void {
  element.style.setProperty('--spotlight-x', `${spotlightState.x}px`)
  element.style.setProperty('--spotlight-y', `${spotlightState.y}px`)
  element.style.setProperty(
    '--spotlight-opacity',
    spotlightState.opacity.toFixed(3),
  )
}

/**
 * 判断动画是否还需要继续。
 * 当当前位置和目标位置非常接近时，就停止 requestAnimationFrame，避免无意义刷新。
 */
function shouldContinueAnimating(
  currentSpotlightState: SpotlightState,
  targetSpotlightState: SpotlightState,
): boolean {
  const xDistance = Math.abs(currentSpotlightState.x - targetSpotlightState.x)
  const yDistance = Math.abs(currentSpotlightState.y - targetSpotlightState.y)
  const opacityDistance = Math.abs(
    currentSpotlightState.opacity - targetSpotlightState.opacity,
  )

  return (
    xDistance > MIN_UPDATE_DISTANCE ||
    yDistance > MIN_UPDATE_DISTANCE ||
    opacityDistance > MIN_UPDATE_OPACITY
  )
}

/**
 * 计算鼠标在背景容器内部的相对坐标。
 * 这样即使背景容器未来不是严格贴着视口左上角，聚焦区域也依然会和真实鼠标热点对齐。
 */
function getRelativePointerPosition(
  element: HTMLDivElement,
  event: PointerEvent,
): Pick<SpotlightState, 'x' | 'y'> {
  const elementRect = element.getBoundingClientRect()

  return {
    x: event.clientX - elementRect.left,
    y: event.clientY - elementRect.top,
  }
}

/**
 * 全站交互式点阵背景。
 * 默认显示浅色点阵，鼠标进入页面后会在当前位置出现一块更聚焦、更深的点阵区域。
 */
export function InteractiveDotBackground(): ReactElement {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const backgroundElement = backgroundRef.current

    if (!backgroundElement) {
      return
    }

    const resolvedBackgroundElement = backgroundElement

    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const currentSpotlightState: SpotlightState = {
      x: INITIAL_SPOTLIGHT_X,
      y: INITIAL_SPOTLIGHT_Y,
      opacity: INITIAL_SPOTLIGHT_OPACITY,
    }
    const targetSpotlightState: SpotlightState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      opacity: INITIAL_SPOTLIGHT_OPACITY,
    }
    let animationFrameId = 0

    /**
     * 推进一帧聚焦动画。
     * 这里用线性插值让聚焦区域跟随鼠标时有一点惯性，看起来会更柔和，不会显得生硬。
     */
    function animateSpotlight(): void {
      currentSpotlightState.x +=
        (targetSpotlightState.x - currentSpotlightState.x) * POSITION_EASING
      currentSpotlightState.y +=
        (targetSpotlightState.y - currentSpotlightState.y) * POSITION_EASING
      currentSpotlightState.opacity +=
        (targetSpotlightState.opacity - currentSpotlightState.opacity) *
        OPACITY_EASING

      applySpotlightStyle(resolvedBackgroundElement, currentSpotlightState)

      if (shouldContinueAnimating(currentSpotlightState, targetSpotlightState)) {
        animationFrameId = window.requestAnimationFrame(animateSpotlight)
        return
      }

      animationFrameId = 0
      currentSpotlightState.x = targetSpotlightState.x
      currentSpotlightState.y = targetSpotlightState.y
      currentSpotlightState.opacity = targetSpotlightState.opacity
      applySpotlightStyle(resolvedBackgroundElement, currentSpotlightState)
    }

    /**
     * 安排下一次动画。
     * 只有当前没有动画在跑时才重新申请 requestAnimationFrame，避免重复排队。
     */
    function scheduleAnimation(): void {
      if (animationFrameId !== 0) {
        return
      }

      animationFrameId = window.requestAnimationFrame(animateSpotlight)
    }

    /**
     * 处理鼠标移动。
     * 鼠标进入页面后，聚焦层会跟随当前位置逐步移动并显现。
     */
    function handlePointerMove(event: PointerEvent): void {
      const pointerPosition = getRelativePointerPosition(
        resolvedBackgroundElement,
        event,
      )

      targetSpotlightState.x = pointerPosition.x
      targetSpotlightState.y = pointerPosition.y
      targetSpotlightState.opacity = 1
      scheduleAnimation()
    }

    /**
     * 处理鼠标离开或窗口失焦。
     * 聚焦层会平滑淡出，保留底层静态点阵。
     */
    function handlePointerLeave(): void {
      targetSpotlightState.opacity = 0
      scheduleAnimation()
    }

    applySpotlightStyle(resolvedBackgroundElement, currentSpotlightState)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('blur', handlePointerLeave)
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId)
      }

      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handlePointerLeave)
      document.documentElement.removeEventListener(
        'mouseleave',
        handlePointerLeave,
      )
    }
  }, [])

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="interactive-dot-background"
    >
      <div className="interactive-dot-background__base" />
      <div className="interactive-dot-background__focus-glow" />
      <div className="interactive-dot-background__focus-dots" />
    </div>
  )
}
