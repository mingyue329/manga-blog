import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

import { getPublicAssetUrl } from "@/shared/lib/public-asset";

interface PostMarkdownProps {
  markdownContent: string;
}

/**
 * 渲染文章详情页中心区域的 Markdown 正文。
 * 支持：
 * - 基础 Markdown + GFM (表格、任务列表等)
 * - 代码语法高亮 (highlight.js)
 * - 视频嵌入 (YouTube、Bilibili)
 * - 音频嵌入
 * - 自定义 admonitions (提示、警告等)
 */
export function PostMarkdown({
  markdownContent,
}: PostMarkdownProps): ReactElement {
  return (
    <div
      className="
        theme-text-soft text-base leading-8
        [&>*:first-child]:mt-0
        [&_h1:first-child]:mt-0
        [&_h2:first-child]:mt-0
        [&_h3:first-child]:mt-0
        [&_a]:font-bold [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4
        [&_blockquote]:my-8 [&_blockquote]:border-l-8 [&_blockquote]:border-[var(--line-strong)] [&_blockquote]:bg-secondary [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_blockquote]:text-[var(--copy-strong)]
        [&_code]:rounded-sm [&_code]:bg-[color-mix(in_srgb,var(--surface-ink)_6%,transparent)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em]
        [&_em]:italic
        [&_h1]:mt-14 [&_h1]:mb-6 [&_h1]:font-heading [&_h1]:text-4xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-[var(--copy-strong)]
        [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:border-b-4 [&_h2]:border-[var(--line-strong)] [&_h2]:pb-3 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[var(--copy-strong)]
        [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-[var(--copy-strong)]
        [&_hr]:my-10 [&_hr]:border-[var(--line-strong)]
        [&_img]:my-8 [&_img]:border-4 [&_img]:border-[var(--line-strong)]
        [&_li]:mb-2
        [&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal
        [&_p]:mb-6
        [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:border-4 [&_pre]:border-[var(--line-strong)] [&_pre]:bg-[var(--surface-ink)] [&_pre]:p-6 [&_pre]:text-sm [&_pre]:text-[var(--copy-inverse)] md:[&_pre]:text-base
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
        [&_strong]:font-black [&_strong]:text-[var(--copy-strong)]
        [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:border-4 [&_table]:border-[var(--line-strong)]
        [&_tbody_tr:nth-child(even)]:bg-[color-mix(in_srgb,var(--surface-ink)_3%,transparent)]
        [&_td]:border-2 [&_td]:border-[var(--line-strong)] [&_td]:px-4 [&_td]:py-3 [&_td]:align-top
        [&_th]:border-2 [&_th]:border-[var(--line-strong)] [&_th]:bg-[var(--surface-ink)] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-heading [&_th]:text-sm [&_th]:font-black [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-[var(--copy-inverse)]
        [&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // 自定义图片渲染
          img: ({ src, alt, ...props }) => (
            <img
              src={src ? getPublicAssetUrl(src) : undefined}
              alt={alt}
              loading="lazy"
              {...props}
            />
          ),
          // 自定义视频渲染
          video: ({ src, ...props }) => (
            <video
              src={src ? getPublicAssetUrl(src) : undefined}
              controls
              className="my-8 w-full rounded-lg border-4 border-[var(--line-strong)]"
              {...props}
            />
          ),
          // 自定义音频渲染
          audio: ({ src, ...props }) => (
            <audio 
              src={src ? getPublicAssetUrl(src) : undefined} 
              controls 
              className="my-8 w-full" 
              {...props} 
            />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
