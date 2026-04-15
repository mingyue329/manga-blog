# Markdown 支持说明

本文档详细说明博客系统支持的 Markdown 语法和扩展功能。

## ✅ 已支持的功能

### 1. 基础 Markdown

- ✅ 标题 (H1-H6)
- ✅ 粗体、斜体、删除线
- ✅ 行内代码
- ✅ 链接 (外部/内部)
- ✅ 图片
- ✅ 引用块
- ✅ 无序列表、有序列表
- ✅ 任务列表 (`- [x]`)
- ✅ 水平线
- ✅ Emoji 表情

### 2. GitHub Flavored Markdown (GFM)

- ✅ 表格
- ✅ 代码块 (带语言标识)
- ✅ 自动链接识别
- ✅ 删除线 (`~~文本~~`)

### 3. 代码语法高亮

使用 `highlight.js` 实现,支持 **185+ 种编程语言**:

#### 常用语言
- JavaScript / TypeScript
- Python / Java / C / C++ / C#
- Rust / Go / Ruby / Swift
- HTML / CSS / SCSS / Less
- SQL / Bash / PowerShell
- JSON / YAML / XML / TOML
- Markdown / LaTeX

#### 使用方法

```javascript
// 在代码块开头指定语言
```javascript
console.log("Hello, World!");
```

```python
print("Hello, World!")
```

### 4. 多媒体嵌入

#### YouTube 视频

直接在 Markdown 中嵌入 HTML:

```html
<iframe 
  width="100%" 
  height="400" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

#### Bilibili 视频

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0;">
  <iframe 
    src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" 
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>
```

#### 音频文件

```html
<audio controls src="/audio/example.mp3">
  您的浏览器不支持音频播放
</audio>
```

#### 视频文件

```html
<video controls width="100%">
  <source src="/video/example.mp4" type="video/mp4">
  您的浏览器不支持视频播放
</video>
```

### 5. 提示框 (Admonitions)

使用 GitHub 风格的提示框语法:

```markdown
> [!NOTE] 提示
> 普通提示信息

> [!TIP] 小贴士
> 有用的技巧

> [!IMPORTANT] 重要
> 重要信息

> [!WARNING] 警告
> 需要注意的事项

> [!CAUTION]  caution
> 危险操作
```

### 6. 数学公式 (需手动启用)

如需支持数学公式,可安装以下插件:

```bash
pnpm add remark-math rehype-katex katex
```

然后在 `post-markdown.tsx` 中添加:

```typescript
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

// 在 ReactMarkdown 中使用
<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeHighlight, rehypeKatex]}
>
```

使用方式:

```markdown
行内公式: $E = mc^2$

块级公式:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
```

### 7. 原生 HTML

支持在 Markdown 中直接使用 HTML:

```html
<div style="custom styles">自定义内容</div>

<details>
  <summary>点击展开</summary>
  隐藏的内容
</details>

<span style="color: red">红色文字</span>
```

---

## 🎨 代码主题

当前使用 **Atom One Dark** 主题,与站点的深色风格一致。

### 可选主题

`highlight.js` 提供 90+ 种主题,修改 `post-markdown.tsx` 中的导入即可:

```typescript
// 浅色主题
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/atom-one-light.css'

// 深色主题
import 'highlight.js/styles/atom-one-dark.css'  // 当前
import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/styles/dracula.css'
import 'highlight.js/styles/nord.css'
```

完整主题列表: https://highlightjs.org/demo

---

## 📸 图片最佳实践

### 本地图片

将图片放入 `public/images/posts/` 目录:

```markdown
![图片描述](/images/posts/my-image.jpg "可选标题")
```

### 推荐尺寸

- **封面图**: 1200x675px (16:9)
- **文章内图片**: 宽度不超过 1200px
- **格式**: JPG (照片) 或 PNG (图形/截图)
- **大小**: 单张不超过 500KB

### 响应式图片

图片会自动适应容器宽度,无需额外处理。

---

## 🔗 链接最佳实践

### 内部链接

```markdown
[关于我](/about)
[文章列表](/posts)
[首页](/)
```

### 外部链接

```markdown
[GitHub](https://github.com)
[Steam](https://store.steampowered.com)
```

外部链接会自动在新标签页打开 (需在组件中配置)。

---

## 📋 表格示例

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
```

对齐方式:

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容   |   内容   |   内容 |
```

---

## 🎯 测试文章

项目中包含一篇完整的测试文章:

**位置**: `src/features/posts/content/posts/markdown-feature-demo.md`

这篇文章展示了所有支持的 Markdown 功能,可以作为写作参考。

---

## 🚀 高级扩展

### 1. 添加更多 Rehype 插件

```bash
pnpm add rehype-autolink-headings rehype-slug rehype-external-links
```

### 2. 添加图表支持 (Mermaid)

```bash
pnpm add remark-gfm mermaid rehype-mermaid
```

### 3. 添加图片懒加载

已在 `<img>` 标签中默认添加 `loading="lazy"`。

---

## 📖 参考资源

- [Markdown 官方规范](https://daringfireball.net/projects/markdown/)
- [GFM 规范](https://github.github.com/gfm/)
- [react-markdown 文档](https://github.com/remarkjs/react-markdown)
- [highlight.js 主题演示](https://highlightjs.org/demo)
- [Admonitions 语法](https://github.com/jamiebuilds/remark-admonitions)
