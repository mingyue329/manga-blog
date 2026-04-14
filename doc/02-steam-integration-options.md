# Steam 接入技术方案

## 1. 目标先分清

“接入 Steam”不是一个单一需求，至少有三种不同层级：

### A. 展示型接入

只做静态展示：

- Steam 个人主页链接
- 游戏商店链接
- 最近在玩模块
- 通关清单
- 愿望单精选
- 文章中的游戏信息卡片

### B. 半动态接入

前端展示的数据定期更新，但不是实时直连：

- 近期游玩游戏
- 已拥有游戏列表
- 游戏总时长
- 成就摘要

### C. 动态同步接入

通过服务端自动拉取 Steam 数据，并提供博客自身 API：

- 定时同步
- 服务端缓存
- 手动刷新
- 多模块复用
- 后续支持后台配置

这三档会直接决定要不要后端。

## 2. 当前项目最适合的第一步

对于当前这个博客，建议先做 A，再为 B/C 预留接口。

原因：

- 当前项目是静态博客，不需要马上承担动态系统复杂度
- 现在最重要的是把博客做成稳定模板
- Steam 内容是否长期需要自动同步，当前还不确定
- 直接上后端会把部署、配置、维护成本立刻抬高

结论：

第一版建议先做“静态 Steam 展示模块”。

## 3. 不加后端时怎么做

### 3.1 适合的内容

可以直接静态维护：

- Steam 主页链接
- 常玩游戏列表
- 当前在玩
- 通关记录
- 收藏游戏
- 文章关联游戏

### 3.2 数据放哪里

建议不要继续散落在页面文案里，直接单独建内容源：

- `src/features/steam/steam-content.ts`
- 或 `src/content/steam-profile.ts`
- 或 `src/content/steam/*.json`

建议先定义数据模型，例如：

```ts
interface SteamProfileSummary {
  profileUrl: string
  vanityId?: string
  displayName: string
  avatar: {
    src: string
    alt: string
  }
  favoriteGenres: string[]
  currentlyPlaying?: SteamGameCard
  featuredGames: SteamGameCard[]
}

interface SteamGameCard {
  appId: number
  title: string
  steamUrl: string
  coverImage: string
  playtimeHours?: number
  status?: 'playing' | 'finished' | 'wishlist' | 'backlog'
  note?: string
}
```

### 3.3 页面层怎么接

建议新增独立 feature，而不是把 Steam 内容硬塞到 home / about / posts 的现有 service 里：

- `features/steam/components`
- `features/steam/steam-service.ts`
- `features/steam/steam-types.ts`

这样未来切换为 API 拉取时，改动范围更小。

## 4. 什么时候需要后端

只要你出现下面任意一种需求，就建议加后端：

- 想隐藏 Steam API key
- 想自动同步最近游玩
- 想获取拥有游戏、成就、统计
- 想做缓存，避免每次页面加载都请求 Steam
- 想加后台刷新功能
- 想让多个页面复用同一份 Steam 数据

## 5. 为什么不建议前端直连 Steam API

主要问题有四个：

### 5.1 密钥暴露

如果接口需要 key，放前端就是公开。

### 5.2 稳定性差

第三方接口波动会直接影响页面加载。

### 5.3 无法做好缓存

缓存、降级、重试、定时刷新，这些都更适合服务端。

### 5.4 扩展成本高

等你后面想做“最近游玩 + 拥有游戏 + 成就统计 + 数据清洗”，前端会变得越来越难维护。

## 6. 推荐的服务端形态

如果以后要上后端，建议不是直接做“大后台”，而是先做一个很薄的 BFF。

推荐职责：

- 调 Steam API
- 做服务端缓存
- 做字段裁剪与清洗
- 输出博客前端需要的轻量 JSON

推荐接口示例：

- `GET /api/steam/profile`
- `GET /api/steam/recent-games`
- `GET /api/steam/owned-games`
- `GET /api/steam/featured-games`

这层不要一开始就做管理后台，先把“聚合 + 缓存 + 安全”做好。

## 7. 推荐的演进设计

### 阶段 1：静态 Steam Source

实现：

- 本地 TS / JSON 数据源
- 首页展示 Steam 模块
- 关于页增加玩家档案模块
- 文章页支持关联游戏卡片

优点：

- 快
- 稳
- 不增加部署复杂度

### 阶段 2：抽象 Steam Source 接口

建议增加接口层：

```ts
interface SteamSource {
  getProfileSummary(): Promise<SteamProfileSummary>
  getRecentGames(): Promise<SteamGameCard[]>
  getFeaturedGames(): Promise<SteamGameCard[]>
}
```

然后先做本地实现：

- `LocalSteamSource`

### 阶段 3：增加 API 实现

后续新增：

- `ApiSteamSource`

页面层不变，只替换数据源实现。

## 8. 如果未来要做后端，推荐一起补的能力

后端一旦上了，建议顺手把下面这些边界也设计好：

- 环境变量管理
- 缓存 TTL
- 请求失败降级
- API 返回 DTO
- 数据刷新策略
- 服务端日志
- 错误监控

否则“虽然加了后端”，但只是把不稳定性从前端搬到了另一边。

## 9. 与当前博客架构的结合建议

结合当前项目，推荐的技术策略是：

### 现在做

- 新增 `features/steam`
- 定义 `SteamGameCard` / `SteamProfileSummary`
- 首页、关于页预留 Steam 模块位置
- 文章 frontmatter 预留 `relatedGames`

### 暂时不做

- 不立即上后端
- 不立即接真实 Steam API
- 不立即做自动同步

### 后续再做

- 抽 `SteamSource`
- 加服务端 BFF
- 缓存 Steam 数据

## 10. 最终建议

当前最优解不是“立刻接 Steam API”，而是：

1. 先设计 Steam 内容模型
2. 先用静态数据把页面结构做出来
3. 把 Steam 接入点做成可替换的数据源接口
4. 只有在确实需要动态同步时，再补后端

这样可以把现在的开发重点放在站点本身，而不是过早进入第三方集成维护。
