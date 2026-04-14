import type { ReactElement } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card, CardContent } from '@/shared/ui/card'
import type { AboutPageData } from '@/shared/types/content'

interface AboutIdentitySectionProps {
  pageData: AboutPageData
}

/**
 * 渲染关于页标题和角色档案卡片。
 * 这一块负责建立页面的角色感，让“关于页”看起来更像一张风格化人物档案。
 */
export function AboutIdentitySection({
  pageData,
}: AboutIdentitySectionProps): ReactElement {
  return (
    <section id="identity" className="scroll-mt-32 space-y-8">
      <header className="relative space-y-4">
        <h1 className="-rotate-1 font-heading text-5xl font-black leading-none tracking-tight md:text-7xl">
          {pageData.pageTitle} //{' '}
          <span className="inline-block bg-black px-4 py-2 text-white">
            {pageData.pageTitleHighlight}
          </span>
        </h1>
        <div className="h-2 w-full bg-black" />
        <div className="manga-halftone absolute -right-4 -top-4 size-28 text-black/12" />
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="border-4 border-black bg-white py-0 manga-panel">
            <CardContent className="space-y-4 p-3">
              <div className="relative overflow-hidden border-4 border-black bg-secondary">
                <div className="manga-speed-lines absolute inset-0 opacity-20" />
                <Avatar className="aspect-[3/4] h-auto w-full border-none">
                  <AvatarImage
                    src={pageData.profileImage.src}
                    alt={pageData.profileImage.alt}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-heading text-4xl font-black">
                    KC
                  </AvatarFallback>
                </Avatar>
                <div className="absolute left-4 top-4 border-2 border-white bg-black px-5 py-2 font-heading text-2xl font-black text-white -skew-x-12">
                  {pageData.profileLevel}
                </div>
              </div>
              <div className="space-y-2 px-2 pb-2">
                <h2 className="inline-block border-b-8 border-black pb-2 font-heading text-4xl font-black uppercase tracking-tight">
                  {pageData.profileName}
                </h2>
                <p className="text-lg font-bold italic text-black/60">
                  “{pageData.profileTagline}”
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="relative border-4 border-black bg-black p-6 text-white manga-panel-reverse">
            <p className="text-lg font-bold leading-8">{pageData.quote}</p>
            <div className="speech-bubble-tail absolute -top-5 left-10 size-8 bg-black" />
          </div>
        </div>

        <div className="flex items-end">
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#111111]">
            <p className="manga-label text-black/55">Identity Note</p>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-black/75">
              这里不是传统简历页，而是把个人能力、工作习惯、创作偏好和工具系统都翻译成
              “玩家档案”的表达方式。这样做不是单纯追求风格，而是让页面本身也参与叙事。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
