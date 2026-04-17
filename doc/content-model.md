# 内容模型规范

本文档说明博客系统中所有内容的标准字段和格式要求。

## 文章 Frontmatter 字段

每篇 Markdown 文章的顶部必须包含以下 YAML frontmatter：

### 必填字段

| 字段          | 类型   | 说明                       | 示例                                   |
| ------------- | ------ | -------------------------- | -------------------------------------- |
| `title`       | string | 文章标题                   | `"黑神话：悟空评测"`                   |
| `excerpt`     | string | 文章摘要，用于列表页展示   | `"一款融合了中国神话与动作元素的佳作"` |
| `publishedAt` | string | 发布日期，格式 YYYY-MM-DD  | `"2024-08-20"`                         |
| `author`      | string | 作者名称                   | `"明月几时有"`                         |
| `categoryKey` | string | 分类键，见下方分类列表     | `"geek-life"`                          |
| `image.src`   | string | 封面图路径                 | `"/images/posts/wukong.jpg"`           |
| `image.alt`   | string | 封面图替代文本             | `"黑神话：悟空游戏截图"`               |
| `coverRatio`  | string | 封面图比例，见下方比例列表 | `"landscape"`                          |
| `imageSide`   | string | 列表页封面位置             | `"left"` 或 `"right"`                  |
| `tags`        | array  | 标签数组                   | `["动作", "RPG", "国产"]`              |

### 可选字段

| 字段              | 类型    | 默认值    | 说明                         |
| ----------------- | ------- | --------- | ---------------------------- |
| `slug`            | string  | 文件名    | URL 路径标识，需与文件名一致 |
| `updatedAt`       | string  | null      | 最后更新日期                 |
| `series`          | string  | null      | 系列文章名称                 |
| `featured`        | boolean | false     | 是否精选，影响首页排序       |
| `draft`           | boolean | false     | 是否为草稿，生产环境不显示   |
| `previewSections` | array   | []        | 详情页预览段落               |
| `relatedGames`    | array   | undefined | 关联的 Steam 游戏（见下方）  |

### 分类键值 (categoryKey)

- `technical` - 技术文章
- `geek-life` - 极客生活
- `tutorial` - 教程指南
- `devlog` - 开发日志
- `culture` - 文化评论

### 封面图比例 (coverRatio)

- `portrait` - 竖版 (3:4)
- `square` - 方形 (1:1)
- `landscape` - 横版 (16:9)
- `wide` - 超宽 (21:9)

### 关联游戏 (relatedGames)

用于在文章中引用 Steam 游戏，结构如下：

```yaml
relatedGames:
  - appId: 2358720
    title: "黑神话：悟空"
    steamUrl: "https://store.steampowered.com/app/2358720/_/"
    coverImage: "/images/games/wukong.jpg"
    note: "本文评测的游戏"
```

| 字段         | 类型   | 必填 | 说明                    |
| ------------ | ------ | ---- | ----------------------- |
| `appId`      | number | 是   | Steam 应用 ID（正整数） |
| `title`      | string | 是   | 游戏标题                |
| `steamUrl`   | string | 是   | Steam 商店页链接        |
| `coverImage` | string | 否   | 游戏封面图路径          |
| `note`       | string | 否   | 备注说明                |

## 文章文件命名规范

- 文件位置：`src/features/posts/content/posts/`
- 命名格式：使用 kebab-case（短横线分隔）
- 示例：`black-myth-wukong-review.md`
- slug 字段应与文件名保持一致（不含 .md 扩展名）

## 图片资源规范

### 文章封面图

- 存放位置：`public/images/posts/`
- 推荐尺寸：
  - landscape (16:9): 1200x675px
  - portrait (3:4): 600x800px
  - square (1:1): 800x800px
  - wide (21:9): 1920x823px
- 格式建议：JPG（照片类）或 PNG（含文字/图形）
- 文件大小：建议小于 500KB

### 游戏封面图

- 存放位置：`public/images/games/`
- 推荐尺寸：300x400px (3:4 比例)
- 格式：JPG 或 WebP

## 标签命名规范

- 使用中文或英文均可
- 保持简洁，一般 2-4 个字
- 避免过于宽泛的标签（如"游戏"），尽量具体（如"动作 RPG"）
- 同一主题的标签应保持用词一致

## 示例 Frontmatter

```yaml
---
title: "黑神话：悟空评测"
excerpt: "一款融合了中国神话与动作元素的佳作，虽有小瑕疵但整体表现出色"
publishedAt: "2024-08-20"
author: "明月几时有"
categoryKey: "geek-life"
image:
  src: "/images/posts/wukong.jpg"
  alt: "黑神话：悟空游戏截图"
coverRatio: "landscape"
imageSide: "left"
tags: ["动作", "RPG", "国产游戏", "评测"]
featured: true
relatedGames:
  - appId: 2358720
    title: "黑神话：悟空"
    steamUrl: "https://store.steampowered.com/app/2358720/_/"
    coverImage: "/images/games/wukong.jpg"
    note: "本文评测的主游戏"
---
文章正文从这里开始...
```

## 站点配置

站点级配置位于 `src/shared/site/site-config.ts`，包含：

- `brand` - 品牌名称
- `navigation` - 导航菜单
- `quickActions` - 快捷操作按钮
- `footer` - 页脚链接和版权信息
- `seo` - SEO 描述和关键词
- `socialLinks` - 社交媒体链接
- `hero` - 首页 Hero 区域文案

修改这些配置即可快速定制站点品牌和基本信息。
