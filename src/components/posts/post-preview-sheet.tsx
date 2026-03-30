import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { ArchivePost } from '@/types/content'

interface PostPreviewSheetProps {
  post: ArchivePost | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 渲染文章预览分节内容。
 */
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

/**
 * 渲染文章预览抽屉。
 * 这里先提供内容预览，后续如果你决定补文章详情路由，可以沿用同一份数据结构继续扩展。
 */
export function PostPreviewSheet({
  post,
  open,
  onOpenChange,
}: PostPreviewSheetProps): ReactElement | null {
  if (!post) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
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
            src={post.image.src}
            alt={post.image.alt}
            className="h-64 w-full border-4 border-black object-cover grayscale contrast-125"
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
