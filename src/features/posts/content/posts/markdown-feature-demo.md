---
title: "Markdown 功能完整演示"
excerpt: "全面展示博客系统支持的 Markdown 语法和扩展功能,包括代码高亮、多媒体嵌入等"
publishedAt: "2026-04-15"
author: "明月几时有"
categoryKey: "tutorial"
image:
  src: "/images/posts/markdown-demo.jpg"
  alt: "Markdown 功能演示封面"
coverRatio: "landscape"
imageSide: "left"
tags: ["Markdown", "教程", "功能演示"]
featured: true
---

# Markdown 功能完整演示

这是一篇全面展示博客系统 Markdown 支持能力的测试文章。

## 📝 基础文本格式

### 强调与样式

这是**粗体文本**,这是*斜体文本*,这是***粗斜体文本***。

这是~~删除线文本~~,这是`行内代码`。

### 链接与引用

这是一个[外部链接示例](https://github.com),这是一个[内部链接](/about)。

> **引用块示例**
>
> 这是一个引用块,可以包含多段文字。
>
> - 支持列表
> - 支持嵌套
>
> > 甚至可以嵌套引用

---

## 📋 列表功能

### 无序列表

- 第一项
- 第二项
  - 嵌套项 1
  - 嵌套项 2
- 第三项

### 有序列表

1. 第一步
2. 第二步
3. 第三步
   1. 子步骤 1
   2. 子步骤 2

### 任务列表

- [x] 已完成任务
- [ ] 待完成任务
- [ ] 另一个待办事项

---

## 💻 代码高亮

### JavaScript 示例

```javascript
// React 组件示例
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>点击增加</button>
    </div>
  );
}

export default Counter;
```

### TypeScript 示例

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Your role is ${user.role}.`;
}

const currentUser: User = {
  id: 1,
  name: "明月几时有",
  email: "example@test.com",
  role: "admin",
};

console.log(greetUser(currentUser));
```

### Python 示例

```python
def fibonacci(n: int) -> list[int]:
    """生成斐波那契数列"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])

    return sequence

# 测试
print(fibonacci(10))
# 输出: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Rust 示例

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // 使用迭代器计算总和
    let sum: i32 = numbers.iter().sum();

    println!("数字: {:?}", numbers);
    println!("总和: {}", sum);

    // 模式匹配示例
    match sum {
        0..=10 => println!("小数值"),
        11..=100 => println!("中等数值"),
        _ => println!("大数值"),
    }
}
```

### SQL 示例

```sql
-- 查询用户及其订单
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;
```

---

## 📊 表格功能

### 游戏评测评分表

| 游戏名称       | 画面 | 玩法 | 剧情 | 综合评分 |
| -------------- | ---- | ---- | ---- | -------- |
| 黑神话:悟空    | 9.5  | 9.0  | 8.5  | 9.0      |
| ELDEN RING     | 9.0  | 9.5  | 9.0  | 9.2      |
| 对马岛之魂     | 9.5  | 8.5  | 9.0  | 9.0      |
| Cyberpunk 2077 | 8.5  | 8.0  | 8.5  | 8.3      |

### 技术栈对比

| 特性     | React      | Vue      | Svelte     |
| -------- | ---------- | -------- | ---------- |
| 学习曲线 | 中等       | 简单     | 简单       |
| 性能     | ⭐⭐⭐⭐   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐ |
| 生态系统 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐     |
| 类型支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐   |

---

## 🖼️ 图片功能

### 本地图片

![示例图片](/images/posts/markdown-demo.jpg "图片标题")

### 带链接的图片

[![点击图片跳转](/images/posts/markdown-demo.jpg)](https://example.com)

---

## 🎥 多媒体嵌入

### YouTube 视频嵌入

:::video{src="https://www.youtube.com/embed/dQw4w9WgXcQ"}
YouTube 视频示例
:::

### Bilibili 视频嵌入

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
  <iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" 
          scrolling="no" 
          border="0" 
          frameborder="no" 
          framespacing="0" 
          allowfullscreen="true"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>

### 音频嵌入

<audio controls src="/audio/example.mp3">
  您的浏览器不支持音频播放
</audio>

### 通用视频嵌入

<video controls width="100%" style="margin: 2rem 0; border-radius: 8px;">
  <source src="/video/example.mp4" type="video/mp4">
  您的浏览器不支持视频播放
</video>

---

## 🔢 数学公式

### 行内公式

爱因斯坦的质能方程是 $E = mc^2$,这是物理学中最著名的公式之一。

### 块级公式

二次方程求根公式:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

欧拉恒等式:

$$e^{i\pi} + 1 = 0$$

---

## 📌 特殊提示框 (Admonitions)

> [!NOTE] 提示信息
> 这是一个普通的提示框,用于提供额外信息。

> [!TIP] 小贴士
> 这里是一些有用的技巧和建议。

> [!IMPORTANT] 重要说明
> 这部分内容非常重要,请仔细阅读。

> [!WARNING] 警告
> 需要注意的事项,可能会导致问题。

> [!CAUTION] caution
> 危险操作,执行前请三思。

---

## 🔗 脚注

这是一个带有脚注的文本[^1],这是另一个脚注[^2]。

[^1]: 这是第一个脚注的内容。

[^2]: 这是第二个脚注,可以包含**格式化**文本。

---

## 📐 HTML 原生支持

### 自定义样式

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 8px; color: white; margin: 2rem 0;">
  <h3 style="margin-top: 0;">渐变背景卡片</h3>
  <p>这是使用原生 HTML 和 CSS 创建的自定义组件。</p>
</div>

### 折叠面板

<details>
  <summary style="cursor: pointer; font-weight: bold; padding: 1rem; background: var(--surface-ink); color: var(--copy-inverse);">
    点击展开查看详情
  </summary>
  <div style="padding: 1rem; border: 2px solid var(--line-strong); border-top: none;">
    <p>这里是折叠的内容,可以包含:</p>
    <ul>
      <li>列表项 1</li>
      <li>列表项 2</li>
      <li>列表项 3</li>
    </ul>
  </div>
</details>

---

## 🎯 Emoji 表情

支持各种 Emoji 表情: 😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇

游戏相关: 🎮 🕹️ 🎲 🎯 🏆 🎪 🎨 🎭

技术相关: 💻 ⌨️ 🖥️ 📱 💾 💿 📀 🔧

---

## 📝 水平线与分隔

上面是一条横线,下面是另一条:

---

## 🎨 代码块语言标识

支持的语言包括但不限于:

- JavaScript / TypeScript
- Python / Java / C++ / C#
- Rust / Go / Ruby
- HTML / CSS / SCSS
- SQL / Bash / PowerShell
- JSON / YAML / XML
- Markdown / LaTeX

只需在代码块开头指定语言名称即可自动高亮!

---

## ✨ 总结

本篇文档展示了博客系统完整的 Markdown 支持能力:

✅ 基础文本格式化  
✅ 列表与任务列表  
✅ 代码语法高亮 (30+ 语言)  
✅ 表格渲染  
✅ 图片与多媒体  
✅ 数学公式  
✅ 提示框 (Admonitions)  
✅ 脚注  
✅ 原生 HTML  
✅ Emoji 表情

**现在你可以开始创作精彩的内容了!** 🚀
