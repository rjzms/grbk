# 设计调研报告

> 调研日期：2026-06-12
> 调研范围：2025-2026 年个人博客/开发者网站设计趋势、排版系统、无障��设计

---

## 一、设计趋势总结

### 1.1 当前主流方向

| 方向 | 特征 | 代表案例 |
|------|------|----------|
| 极简瑞士风格 | 强烈留白、网格系统、无衬线字体 | Stefan Vitasović, Kevin Moore |
| 内容优先型 | 排版驱动、无装饰元素、聚焦可读性 | Essentialist 主题, Brittany Chiang |
| 终端/CLI 美学 | 等宽字体、命令行交互、极轻量 | Tamino Martinius, lilweb-template |
| 日本侘寂美学 | 有机质感、不对称、手工感 | Mark Galkins (GR0UD) |
| Bento 网格 | 非对称卡片、模块化、动态布局 | v0.dev 模板 |

### 1.2 本项目方向选择

**选定：内容优先型 + 极简瑞士风格 的融合**

理由：
- 个人博客以文字阅读为核心，排版必须优先
- 开发者博客需要清晰的信息层级
- 大量留白让内容呼吸
- 克制、高级、不跟随短期设计潮流
- 区别于常见 AI 生成的模板化设计

---

## 二、排版系统调研

### 2.1 字体选择

| 用途 | 推荐字体 | 备选 |
|------|----------|------|
| 正文 | Inter | SF Pro, system-ui |
| 标题 | Inter (Bold/ExtraBold) | Cal Sans, Space Grotesk |
| 等宽/代码 | JetBrains Mono | Fira Code, Cascadia Code |

**决定：正文字体使用 `Inter`，代码使用 `JetBrains Mono`**

Inter 是专为屏幕阅读设计的无衬线字体，具有优异的小字号可读性和丰富的字重变化。

### 2.2 字号层级（Typography Scale）

参考 Tailwind CSS 默认比例，结合 NL Health Services 设计系统的 4px 基线网格：

| 角色 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| Display | 48px (3rem) | 1.1 | 800 | 首页大标题 |
| H1 | 36px (2.25rem) | 1.2 | 700 | 文章标题 |
| H2 | 24px (1.5rem) | 1.3 | 600 | 文章二级标题 |
| H3 | 20px (1.25rem) | 1.4 | 600 | 文章三级标题 |
| Lead | 18px (1.125rem) | 1.6 | 400 | 引导段落 |
| Body | 16px (1rem) | 1.75 | 400 | 正文 |
| Small | 14px (0.875rem) | 1.5 | 400 | 辅助文字 |
| Caption | 12px (0.75rem) | 1.5 | 500 | 标签、日期 |

### 2.3 字符数控制

基于 WCAG 2.2 和阅读科学研究：

- 正文每行 45-75 个字符（汉字约 25-40 字）
- 英文最佳阅读宽度约 65 字符
- 在 16px 字号下，最大文字列宽约 680px

---

## 三、色彩系统调研

### 3.1 色彩原则

- 主色不超过 2-3 个
- 高对比度确保可读性（WCAG AA 4.5:1）
- 浅色/深色模式都需独立验证
- 使用 OKLCH 色彩空间（Tailwind v4 原生支持）

### 3.2 参考色彩方案

| 来源 | 主色 | 背景 | 特点 |
|------|------|------|------|
| Linear | 中性灰 + 蓝色强调 | #fafafa | 极度克制 |
| Vercel | 黑色 + 几何紫 | #ffffff | 高对比 |
| Notion | 灰色系 + 蓝色 | #ffffff | 中性底 |
| Medium | 深绿 + 白色 | #ffffff | 阅读友好 |

### 3.3 本项目色彩方向

- 中性色为主，单一强调色
- 浅色模式：温暖微灰色背景（非纯白）
- 深色模式：深蓝灰背景（非纯黑）
- 强调色：使用一个内敛的靛蓝色

---

## 四、布局与间距研究

### 4.1 页面宽度

| 断点 | 最大宽度 | 用途 |
|------|----------|------|
| 内容区 | 680px | 文章正文 |
| 页面最大 | 1152px | 全宽布局 |
| 导航 | 1152px | 与页面统一 |

### 4.2 间距系统

基于 4px 基线网格：

| Token | 值 | 用途 |
|-------|-----|------|
| 4px | 0.25rem | 最小间距、图标与文字 |
| 8px | 0.5rem | 紧密元素间距 |
| 12px | 0.75rem | 标签间距 |
| 16px | 1rem | 默认间距 |
| 24px | 1.5rem | 段落间距、卡片内边距 |
| 32px | 2rem | 区块间距 |
| 48px | 3rem | 大区块间距 |
| 64px | 4rem | 页面区块分隔 |
| 96px | 6rem | 首页区域分隔 |

### 4.3 留白原则

- 标题上下留白大于段落间距
- 页面边缘在宽屏时大量留白
- 卡片不使用外部边框，用微灰背景区分
- 导航和内容区之间保持呼吸感

---

## 五、暗色模式调研

### 5.1 设计原则

- 不使用纯黑色 (#000) 作为背景
- 深色背景上文字对比度应略低于浅色模式
- 深色模式下阴影应使用边框替代
- 图片和代码块需要适配深色背景

### 5.2 参考数值

| 元素 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 背景 | #fafafa | #0f172a |
| 卡片 | #ffffff | #1e293b |
| 正文 | #1e293b | #e2e8f0 |
| 次要文字 | #64748b | #94a3b8 |
| 强调色 | #4f46e5 | #818cf8 |

---

## 六、无障碍设计 (WCAG 2.2)

### 6.1 关键要求

| 要求 | 标准 | 实现方式 |
|------|------|----------|
| 文字对比度 | AA 4.5:1（正文）/ 3:1（大标题） | 色彩系统验证 |
| 焦点指示器 | 3:1 对比度，最小厚度 | :focus-visible 样式 |
| 触摸目标 | 24×24 CSS 像素 | 按钮和链接最小尺寸 |
| 200% 缩放 | 无内容丢失 | 响应式 + rem 单位 |
| 320px 重排 | 无水平滚动条 | 移动优先设计 |
| 键盘导航 | 所有交互可键盘操作 | Tab 顺序 + skip link |
| 表单标签 | 所有输入有关联标签 | 语义 HTML |

### 6.2 实施工具

- axe DevTools（自动化审计）
- 浏览器 Lighthouse
- 手动键盘测试
- 屏幕阅读器测试（NVDA/VoiceOver）

---

## 七、动画和交互原则

### 7.1 核心理念：少即是多

- 不使用入场动画（页面加载直接显示内容）
- 不使用滚动触发动画
- 不使用视差效果
- 不使用玻璃拟态
- 链接悬停使用简单的颜色/下划线过渡
- 暗色模式切换使用 CSS transition
- 页面切换无动画（即时渲染）

### 7.2 可用的微妙交互

- 链接 hover 时下划线出现/消失（200ms ease）
- 按钮 hover 时背景色微调（150ms ease）
- 焦点环淡入（150ms ease）
- 暗色模式过渡（200ms）

---

## 八、设计参考链接

- [Four design principles behind Stripe, Linear, and Vercel](https://www.pixeldarts.com/en/post/four-design-principles-behind-stripe-linear-and-vercel)
- [Stefan Vitasović Portfolio Case Study (Codrops 2025)](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
- [WCAG 2.2 Color Contrast Requirements](https://www.makethingsaccessible.com/guides/contrast-requirements-for-wcag-2-2-level-aa/)
- [Brittany Chiang Portfolio](https://brittanychiang.com)
- [Tailwind Typography Plugin](https://tailkits.com/blog/tailwind-typography-plugin/)
- [Design Tokens Architecture (2025)](https://www.designsystemscollective.com/design-tokens-the-building-blocks-of-scalable-frontend-design-systems-e41f2705f5f3)

---

## 结论

本项目将采用**内容优先 + 极简瑞士**的设计方向，以 Inter 字体为核心，使用中性色系配合单一靛蓝强调色，严格遵循 WCAG 2.2 AA 无障碍标准，通过大量留白和清晰的排版层级营造高级、克制的阅读体验。
