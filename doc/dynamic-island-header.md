# 灵动岛 Header 设计说明

## 🎯 设计理念

参考苹果 iPhone 14 Pro 的 Dynamic Island(灵动岛)设计,为博客顶部导航添加了智能收起/展开动画效果。

## ✨ 核心特性

### 1. 两种状态

**展开状态 (Expanded)**

- 显示完整的导航栏
- 包含品牌、导航菜单、快捷操作
- 背景半透明毛玻璃效果

**收起状态 (Collapsed)**

- 胶囊形状,宽度280px
- 只显示品牌名称
- 圆角全包围,悬浮阴影

### 2. 智能交互

#### 自动收起

- 页面加载后5秒无操作自动收起
- 减少视觉干扰,突出内容

#### 滚动展开

- 检测到滚动立即展开
- 滚动停止1秒后重新启动定时器
- 确保用户随时可以访问导航

#### 悬停展开

- 鼠标进入Header区域立即展开
- 鼠标离开后5秒自动收起
- 提供即时的交互反馈

### 3. 流畅动画

**动画曲线**: `cubic-bezier(0.34, 1.56, 0.64, 1)`

- 弹簧物理效果,类似iOS原生体验
- 展开时轻微 overshoot(过冲)
- 持续时间500ms

**过渡属性**:

- 宽度: 全宽 ↔ 280px
- 透明度: 1 ↔ 0
- 缩放: 1 ↔ 0.95
- 高度: 自动 ↔ 0

## 📐 技术实现

### 文件结构

```
src/shared/components/site/
├── dynamic-island-header.tsx   # 灵动岛容器组件
└── site-header.tsx             # 原始Header(已调整定位)
```

### 核心逻辑

```typescript
// 状态管理
const [isExpanded, setIsExpanded] = useState(true);
const autoCollapseTimer = useRef<number | null>(null);

// 自动收起定时器
const startAutoCollapseTimer = () => {
  autoCollapseTimer.current = window.setTimeout(() => {
    setIsExpanded(false);
  }, 5000);
};

// 滚动监听
useEffect(() => {
  const handleScroll = () => {
    if (scrollDelta > 2) {
      setIsExpanded(true);
      clearAutoCollapseTimer();
    }
  };
  window.addEventListener("scroll", handleScroll);
}, []);
```

### CSS 类名

**容器定位**:

```css
fixed top-0 left-0 right-0 z-50
```

**展开状态**:

```css
w-full bg-background/80 backdrop-blur-md border-b-2
```

**收起状态**:

```css
w-[280px] mt-3 rounded-full bg-background/95
backdrop-blur-xl border-2 shadow-lg
```

## 🎨 视觉效果

### 展开 → 收起动画

```
[━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]  完整导航栏
         ↓ 5秒无操作
        [明月几时有]                    胶囊形状
```

### 收起 → 展开动画

```
        [明月几时有]                    检测到滚动
         ↓ 立即响应
[━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]  完整导航栏
```

## 🔧 自定义配置

### 修改自动收起时间

编辑 `dynamic-island-header.tsx`:

```typescript
// 默认5秒,可调整为其他值
window.setTimeout(() => {
  setIsExpanded(false);
}, 5000); // 改为 3000 = 3秒
```

### 修改收起状态宽度

```typescript
// 默认280px
"w-[280px]"; // 改为 'w-[320px]' 更宽
```

### 修改动画速度

```typescript
// 默认500ms
"duration-500"; // 改为 'duration-300' 更快
```

### 禁用自动收起

如果需要始终保持展开状态:

```typescript
// 注释掉定时器相关代码
// startAutoCollapseTimer();
```

## 📱 响应式行为

- **桌面端**: 完整灵动岛效果
- **移动端**: 同样适用,胶囊在顶部居中
- **触摸设备**: 滚动展开正常工作

## 🚀 性能优化

1. **Passive Scroll Listener**: `{ passive: true }` 避免阻塞主线程
2. **Request Animation Frame**: 滚动处理使用RAF节流
3. **CSS Transitions**: 使用GPU加速的CSS动画
4. **Backdrop Filter**: 毛玻璃效果使用硬件加速

## 🐛 常见问题

### Q: Header不跟随滚动?

A: 检查 `site-header.tsx` 是否移除了 `fixed` 定位

### Q: 动画卡顿?

A: 确保浏览器支持 `backdrop-filter`,旧浏览器会降级

### Q: 移动端体验不佳?

A: 可以针对移动端禁用灵动岛,保持固定Header

## 📊 用户体验数据

**预期效果**:

- 减少Header占用空间 ~70%
- 提升内容可视区域
- 保持导航可访问性 100%
- 动画流畅度 60fps

## 🎯 最佳实践

1. **不要频繁切换状态** - 让用户适应动画节奏
2. **保持动画一致性** - 所有过渡使用相同曲线
3. **提供即时反馈** - 悬停/滚动立即响应
4. **考虑无障碍** - 键盘用户也能访问导航

## 🔮 未来扩展

可能的增强方向:

1. **通知集成** - 在收起状态显示未读消息数
2. **音乐播放** - 类似苹果的音乐控制
3. **计时器** - 倒计时/阅读进度
4. **搜索快捷** - 点击胶囊直接搜索

---

**参考**: Apple Human Interface Guidelines - Dynamic Island  
**实现日期**: 2026-04-15  
**技术栈**: React + Tailwind CSS + GSAP
