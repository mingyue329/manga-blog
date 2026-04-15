import type { ReactElement } from "react";
import { ExternalLink } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import type { AboutPageData } from "@/shared/types/content";
import { siteConfig } from "@/shared/site/site-config";

interface AboutIdentitySectionProps {
  pageData: AboutPageData;
}

/**
 * 社交图标组件(简化版,统一使用 ExternalLink)
 */
function SocialIcon() {
  return <ExternalLink className="h-4 w-4" />;
}

/**
 * 关于页个人信息区域 - 采用 fuwari 风格的简洁布局
 * 左侧：头像 + 基本信息卡片
 * 右侧：个人简介和引言
 */
export function AboutIdentitySection({
  pageData,
}: AboutIdentitySectionProps): ReactElement {
  const socialLinks = siteConfig.socialLinks || [];

  return (
    <section id="identity" className="scroll-mt-24">
      {/* 页面标题 */}
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl">
          {pageData.pageTitle}{" "}
          <span className="text-primary">// {pageData.pageTitleHighlight}</span>
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent" />
      </div>

      {/* 个人信息网格布局 */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* 左侧：个人信息卡片 */}
        <Card className="border-2 p-6">
          <CardContent className="space-y-6 p-0">
            {/* 头像 */}
            <div className="flex justify-center">
              <Avatar className="h-40 w-40 rounded-xl border-4 border-border shadow-lg">
                <AvatarImage
                  src={pageData.profileImage.src}
                  alt={pageData.profileImage.alt}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold">
                  {pageData.profileName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* 姓名 */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{pageData.profileName}</h2>
              <p className="text-sm text-muted-foreground italic">
                {pageData.profileTagline}
              </p>
              {/* 装饰线 */}
              <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
            </div>

            {/* 社交链接 */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {socialLinks.map((link) => (
                  <Button
                    key={link.platform}
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-lg"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label || link.platform}
                    >
                      <SocialIcon />
                      {socialLinks.length === 1 && (
                        <span className="ml-2">{link.label}</span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右侧：个人简介 */}
        <div className="space-y-6">
          {/* 引言卡片 */}
          <blockquote className="relative rounded-lg border-l-4 border-primary bg-secondary/50 p-6 pl-8">
            <p className="text-lg font-medium leading-relaxed">
              {pageData.quote}
            </p>
            {/* 引用标记 */}
            <span className="absolute -top-2 left-4 text-6xl text-primary/20">
              "
            </span>
          </blockquote>

          {/* 简介文本 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-muted-foreground">
              这里不是传统简历页，而是把个人能力、工作习惯、创作偏好和工具系统都翻译成
              "玩家档案"的表达方式。这样做不是单纯追求风格，而是让页面本身也参与叙事。
            </p>
          </div>

          {/* 快速信息 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border-2 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                位置
              </p>
              <p className="mt-1 font-medium">中国</p>
            </div>
            <div className="rounded-lg border-2 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                专注领域
              </p>
              <p className="mt-1 font-medium">前端开发 / 游戏评测</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
