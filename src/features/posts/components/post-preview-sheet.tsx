import { useEffect, useRef, type ReactElement } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

import { getPublicAssetUrl } from "@/shared/lib/public-asset"
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import type { ArchivePost } from '@/shared/types/content'

interface PostPreviewSheetProps {
  post: ArchivePost | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function renderPreviewSections(post: ArchivePost): ReactElement[] {
  const elements: ReactElement[] = []

  for (const previewSection of post.previewSections) {
    elements.push(
      <section key={`${post.slug}-${previewSection.heading}`} className="space-y-3">
        <h3 className="font-heading text-2xl font-black tracking-tight">
          {previewSection.heading}
        </h3>
        <p className="leading-8 text-black/72">{previewSection.content}</p>
      </section>,
    )
  }

  return elements
}

export function PostPreviewSheet({
  post,
  open,
  onOpenChange,
}: PostPreviewSheetProps): ReactElement | null {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (open) {
      gsap.fromTo(
        contentElement,
        {
          xPercent: prefersReducedMotion ? 0 : 8,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: prefersReducedMotion ? 0.01 : 0.32,
          ease: prefersReducedMotion ? 'none' : 'power3.out',
        },
      )
      return
    }

    gsap.to(contentElement, {
      xPercent: prefersReducedMotion ? 0 : 6,
      autoAlpha: 0,
      duration: prefersReducedMotion ? 0.01 : 0.22,
      ease: prefersReducedMotion ? 'none' : 'power2.inOut',
    })

    return () => {
      gsap.killTweensOf(contentElement)
    }
  }, [open])

  if (!post) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={contentRef}
        forceMount
        side="right"
        className="w-full overflow-y-auto border-l-4 border-black bg-white sm:max-w-2xl"
      >
        <SheetHeader className="border-b-4 border-black bg-secondary">
          <div className="flex flex-wrap gap-3">
            <Badge variant="ink">{post.date}</Badge>
            <Badge variant="outlineInk">{post.categoryLabel}</Badge>
          </div>
          <SheetTitle className="font-heading text-4xl font-black leading-tight tracking-tight">
            {post.title}
          </SheetTitle>
          <SheetDescription className="text-base leading-8 text-black/65">
            {post.excerpt}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-8 p-6">
          <img
            src={getPublicAssetUrl(post.image.src)}
            alt={post.image.alt}
            className="h-64 w-full border-4 border-black object-cover"
          />
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Badge key={`${post.slug}-${tag}`} variant="outlineInk">
                #{tag}
              </Badge>
            ))}
          </div>
          <Button asChild variant="ink" size="lg">
            <Link to={`/posts/${post.slug}`}>进入详情页阅读</Link>
          </Button>
          {renderPreviewSections(post)}
        </div>
      </SheetContent>
    </Sheet>
  )
}
