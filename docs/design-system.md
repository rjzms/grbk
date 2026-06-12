# 设计系统规范

> 版本：1.0.0
> 最后更新：2026-06-12
> 本项目博客的单一设计真相来源 (Single Source of Truth)

---

## 一、设计原则

1. **内容优先** — 设计服务于文字，而非反之
2. **大量留白** — 让内容有呼吸空间
3. **克制色彩** — 中性色为主，强调色仅在必要时出现
4. **清晰层级** — 用户在任何页面都能瞬间理解信息结构
5. **无障碍优先** — 满足 WCAG 2.2 AA 标准
6. **无冗余装饰** — 去除一切不必要的视觉元素

---

## 二、色彩系统

### 2.1 语义色板 (Light Mode)

| Token | 色值 | 用途 |
|-------|------|------|
| `--background` | `#f8f9fa` | 页面底色 |
| `--surface` | `#ffffff` | 卡片/容器背景 |
| `--surface-hover` | `#f1f3f5` | 卡片悬停 |
| `--border` | `#e9ecef` | 分割线/边框 |
| `--text-primary` | `#1a1d23` | 主要文字 |
| `--text-secondary` | `#6b7280` | 次要文字 |
| `--text-tertiary` | `#9ca3af` | 辅助文字 |
| `--accent` | `#4f46e5` | 强调色（靛蓝） |
| `--accent-hover` | `#4338ca` | 强调色悬停 |
| `--accent-subtle` | `#eef2ff` | 强调色浅底 |
| `--success` | `#059669` | 成功状态 |
| `--error` | `#dc2626` | 错误状态 |
| `--warning` | `#d97706` | 警告状态 |

### 2.2 深色模式色板 (Dark Mode)

| Token | 色值 | 用途 |
|-------|------|------|
| `--background` | `#0f172a` | 页面底色 |
| `--surface` | `#1e293b` | 卡片/容器背景 |
| `--surface-hover` | `#334155` | 卡片悬停 |
| `--border` | `#334155` | 分割线/边框 |
| `--text-primary` | `#e2e8f0` | 主要文字 |
| `--text-secondary` | `#94a3b8` | 次要文字 |
| `--text-tertiary` | `#64748b` | 辅助文字 |
| `--accent` | `#818cf8` | 强调色（靛蓝） |
| `--accent-hover` | `#6366f1` | 强调色悬停 |
| `--accent-subtle` | `#1e1b4b` | 强调色深底 |

### 2.3 对比度验证

| 组合 | 浅色模式 | 深色模式 | WCAG AA |
|------|----------|----------|---------|
| 正文/背景 | 15.2:1 ✅ | 12.8:1 ✅ | 4.5:1 |
| 次要文字/背景 | 5.1:1 ✅ | 5.8:1 ✅ | 4.5:1 |
| 强调色/白底 | 5.8:1 ✅ | 4.9:1 ✅ | 4.5:1 |
| 大标题/背景 | 10.4:1 ✅ | 9.2:1 ✅ | 3:1 |

---

## 三、字体系统

### 3.1 字体族

```css
--font-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono',
             'Fira Mono', 'Roboto Mono', 'Consolas', monospace;
```

### 3.2 字号层级

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `text-display` | 48px / 3rem | 1.1 | 800 | 首页大标题 |
| `text-h1` | 36px / 2.25rem | 1.2 | 700 | 文章标题 |
| `text-h2` | 24px / 1.5rem | 1.3 | 600 | 二级标题 |
| `text-h3` | 20px / 1.25rem | 1.4 | 600 | 三级标题 |
| `text-lead` | 18px / 1.125rem | 1.6 | 400 | 引导段落 |
| `text-body` | 16px / 1rem | 1.75 | 400 | 正文 |
| `text-small` | 14px / 0.875rem | 1.5 | 400 | 辅助文字 |
| `text-caption` | 12px / 0.75rem | 1.5 | 500 | 标签/日期 |

### 3.3 排版规则

- 英文正文每行不超过 75 字符
- 中文正文每行不超过 30 字
- 段落间距：1.5rem (24px)
- 标题与正文间距：标题上方 2rem，下方 1rem
- 列表缩进：1.5rem
- 引用块左边框：3px solid var(--accent)，左内边距 1rem

---

## 四、间距系统

基于 4px 基准网格：

| Token | 值 | rem | 用途 |
|-------|-----|-----|------|
| `space-1` | 4px | 0.25 | 极小间距（图标-文字） |
| `space-2` | 8px | 0.5 | 标签间距 |
| `space-3` | 12px | 0.75 | 小元素间距 |
| `space-4` | 16px | 1 | 默认内边距 |
| `space-6` | 24px | 1.5 | 段落间距、卡片内边距 |
| `space-8` | 32px | 2 | 区块间距 |
| `space-12` | 48px | 3 | 大区块间距 |
| `space-16` | 64px | 4 | 区域分隔 |
| `space-24` | 96px | 6 | 首页区域间距 |

### 4.1 页面宽度

| 元素 | 最大宽度 | 说明 |
|------|----------|------|
| 正文内容 | 680px | 文章、关于页面 |
| 导航/页脚 | 1152px | 全宽布局 |
| 卡片网格 | 1152px | 文章列表 |

---

## 五、组件样式

### 5.1 按钮

**主按钮 (Primary)**

```css
.btn-primary {
  background: var(--accent);
  color: #ffffff;
  padding: 0.625rem 1.25rem;   /* 10px 20px */
  border-radius: 0.5rem;        /* 8px */
  font-size: 0.875rem;          /* 14px */
  font-weight: 500;
  transition: background-color 150ms ease;
}
.btn-primary:hover {
  background: var(--accent-hover);
}
```

**次按钮 (Secondary)**

```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: border-color 150ms ease, background-color 150ms ease;
}
.btn-secondary:hover {
  border-color: var(--text-secondary);
  background: var(--surface-hover);
}
```

**幽灵按钮 (Ghost)**

```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 150ms ease, color 150ms ease;
}
.btn-ghost:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}
```

### 5.2 卡片

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;       /* 12px */
  padding: 1.5rem;              /* 24px */
  transition: border-color 200ms ease;
}
.card:hover {
  border-color: var(--text-tertiary);
}
/* 不使用阴影，用边框区分 */
```

### 5.3 输入框

```css
.input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;        /* 8px */
  padding: 0.625rem 0.875rem;
  font-size: 1rem;              /* 16px, 防 iOS 缩放 */
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
.input::placeholder {
  color: var(--text-tertiary);
}
```

### 5.4 标签/徽章

```css
.tag {
  display: inline-flex;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9999px;        /* 全圆角 */
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;           /* 12px */
  font-weight: 500;
  color: var(--text-secondary);
  transition: border-color 150ms ease;
}
.tag:hover {
  border-color: var(--text-tertiary);
}
```

### 5.5 导航栏

```css
.navbar {
  position: sticky;
  top: 0;
  height: 64px;
  background: var(--background); /* 非纯白，需要半透明 */
  background: rgba(248, 249, 250, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 50;
}
```

---

## 六、圆角规则

| 元素 | 圆角值 | CSS |
|------|--------|-----|
| 输入框 | 8px | `border-radius: 0.5rem` |
| 按钮 | 8px | `border-radius: 0.5rem` |
| 卡片 | 12px | `border-radius: 0.75rem` |
| 标签 | 全圆角 | `border-radius: 9999px` |
| 图片 | 8px | `border-radius: 0.5rem` |

**原则：不使用 16px 以上的大圆角，不使用圆形头像框。**

---

## 七、阴影规则

**本项目不使用阴影作为主要视觉区分手段。**

- 卡片使用 1px 边框区分，不使用 box-shadow
- 导航栏使用底部边框
- 焦点环使用 box-shadow（`0 0 0 3px` 光环模式）
- 仅在需要表示浮层（如下拉菜单）时使用微弱阴影

例外（下拉菜单）：

```css
.dropdown {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

---

## 八、响应式设计

### 8.1 断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| `sm` | 640px | 大屏手机横屏 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小笔记本/平板横屏 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大桌面 |

### 8.2 移动端适配规则

- 正文宽度：移动端 100% - 32px (两侧各 16px padding)
- 导航：移动端汉堡菜单
- 首页标题字号从 48px 缩至 32px
- H1 从 36px 缩至 28px
- 文章列表从双列变单列
- 表单占满宽度

### 8.3 视口测试尺寸

| 尺寸 | 用途 |
|------|------|
| 390×844 | iPhone 14 Pro |
| 768×1024 | iPad 竖屏 |
| 1024×768 | iPad 横屏 |
| 1440×900 | 常见笔记本 |
| 1920×1080 | 桌面显示器 |

---

## 九、暗色模式

### 9.1 实现方式

- 使用 Tailwind CSS `class` 策略
- `<html>` 元素上切换 `dark` class
- 通过 `next-themes` 管理持久化
- 默认跟随系统 `prefers-color-scheme`
- 提供手动切换按钮

### 9.2 过渡

```css
html {
  transition: color 200ms ease, background-color 200ms ease;
}
```

### 9.3 注意事项

- 图片在深色模式下不需要反转
- 代码块背景使用独立的深色 token
- 输入框在深色模式下边框更亮

---

## 十、文章排版 (prose)

基于 `@tailwindcss/typography` 插件，自定义以下：

### 10.1 正文字号

- 桌面端：`prose-lg` (18px 正文)
- 移动端：`prose` (16px 正文)

### 10.2 元素样式覆盖

| 元素 | 样式 |
|------|------|
| 段落 | margin-bottom: 1.5rem |
| 标题 | 上方 2rem 间距，下方 1rem |
| 链接 | 靛蓝色下划线，hover 加深 |
| 引用块 | 左侧 3px 靛蓝边框 |
| 代码块 | 独立背景色，圆角 8px |
| 行内代码 | 浅灰背景，0.25rem 内边距 |
| 列表 | 左侧缩进，项目符号使用强调色 |
| 图片 | 全宽，圆角 8px，居中 |
| 表格 | 1px 边框，斑马纹行 |
| 水平线 | 1px var(--border)，上下间距 3rem |

---

## 十一、图标

- 使用 Lucide Icons（轻量、开源、React 原生支持）
- 统一 20px 大小用于行内图标
- 24px 用于独立图标按钮
- 图标颜色继承文字颜色

---

## 十二、空状态设计

- 居中排列
- 使用精简的图标（灰色调）
- 标题使用 text-secondary
- 描述使用 text-tertiary
- 间距宽松，不拥挤

---

## 十三、误状态设计

- 错误信息使用 --error 色
- 置于相关输入框下方
- 字号 14px，与输入框间距 4px
- 表单顶部汇总错误（如适用）
- 不使用红色边框（太重），仅文字提示

---

## 十四、设计检查清单

开发完成后逐项验证：

- [ ] 所有文字对比度满足 WCAG AA
- [ ] 键盘 Tab 顺序合理
- [ ] 焦点环可见
- [ ] 200% 缩放无内容丢失
- [ ] 320px 宽度无水平滚动
- [ ] 暗色模式完整覆盖
- [ ] 移动端导航可用
- [ ] 表单有标签关联
- [ ] 图片有 alt 文本
- [ ] 链接有下划线或其他区分
