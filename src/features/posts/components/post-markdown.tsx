import type { ReactElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostMarkdownProps {
  markdownContent: string
}

/**
 * 渲染文章详情页中心区域的 Markdown 正文。
 * 这里把常见的标题、列表、引用、表格和代码块样式统一收敛到一处，后续只需要维护 Markdown 文件本身即可。
 */
export function PostMarkdown({
  markdownContent,
}: PostMarkdownProps): ReactElement {
  return (
    <div
      className="
        text-base leading-8 text-black/78
        [&>*:first-child]:mt-0
        [&_a]:font-bold [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4
        [&_blockquote]:my-8 [&_blockquote]:border-l-8 [&_blockquote]:border-black [&_blockquote]:bg-secondary [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_blockquote]:text-black
        [&_code]:rounded-sm [&_code]:bg-black/6 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em]
        [&_em]:italic
        [&_h1]:mt-14 [&_h1]:mb-6 [&_h1]:font-heading [&_h1]:text-4xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:tracking-tight
        [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:border-b-4 [&_h2]:border-black [&_h2]:pb-3 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:tracking-tight
        [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-black [&_h3]:tracking-tight
        [&_hr]:my-10 [&_hr]:border-black
        [&_img]:my-8 [&_img]:border-4 [&_img]:border-black
        [&_li]:mb-2
        [&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal
        [&_p]:mb-6
        [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:border-4 [&_pre]:border-black [&_pre]:bg-black [&_pre]:p-6 [&_pre]:text-sm [&_pre]:text-white md:[&_pre]:text-base
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
        [&_strong]:font-black [&_strong]:text-black
        [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:border-4 [&_table]:border-black
        [&_tbody_tr:nth-child(even)]:bg-black/3
        [&_td]:border-2 [&_td]:border-black [&_td]:px-4 [&_td]:py-3 [&_td]:align-top
        [&_th]:border-2 [&_th]:border-black [&_th]:bg-black [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-heading [&_th]:text-sm [&_th]:font-black [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-white
        [&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
    </div>
  )
}
