# 实施计划

> 版本：1.0.0 | 日期：2026-06-12

---

## 一、开发阶段总览

```
第一阶段：项目初始化
  └─ 创建 Next.js 项目、安装依赖、配置 Tailwind

第二阶段：数据库
  └─ 设计 Schema、创建迁移、配置连接

第三阶段：认证系统
  └─ 注册、登录、退出、Session 管理、登录限流

第四阶段：文章管理
  └─ 创建、编辑、删除、Markdown 编辑预览、草稿

第五阶段：前台页面
  └─ 首页、文章列表、详情、标签、搜索、分页

第六阶段：视觉样式
  └─ 设计系统落地、响应式、深色模式

第七阶段：SEO & 发现
  └─ RSS、Sitemap、robots.txt、OG、Metadata

第八阶段：测试与验证
  └─ 类型检查、单元测试、构建、浏览器验证

第九阶段：部署
  └─ 生产构建、数据库配置、部署上线
```

---

## 二、文件结构

```
grbk/
├── .claude/
│   └── launch.json              # Claude Preview 配置
├── docs/
│   ├── design-research.md
│   ├── design-system.md
│   ├── architecture.md
│   ├── implementation-plan.md   # 本文件
│   ├── deployment.md
│   └── maintenance.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── globals.css
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── tags/
│   │   │   ├── page.tsx
│   │   │   └── [tag]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── posts/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── posts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── rss.xml/
│   │   │   └── route.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tag.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── container.tsx
│   │   ├── blog/
│   │   │   ├── post-card.tsx
│   │   │   ├── post-list.tsx
│   │   │   └── markdown-content.tsx
│   │   └── theme/
│   │       └── theme-toggle.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── rate-limit.ts
│   │   ├── markdown.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   └── use-auth.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── auth.test.ts
│   ├── posts.test.ts
│   └── setup.ts
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts (或 postcss 配置)
├── tsconfig.json
├── package.json
└── README.md
```

---

## 三、实施顺序与依赖

| 步骤 | 任务 | 依赖 | 预计文件数 |
|------|------|------|------------|
| 1 | 创建 Next.js 项目 | 无 | ~15 |
| 2 | 安装所有依赖 | 1 | 0 |
| 3 | Tailwind & 全局样式 | 1,2 | ~3 |
| 4 | Prisma Schema + 迁移 | 2 | ~3 |
| 5 | 认证 API (注册/登录/退出) | 3,4 | ~6 |
| 6 | 文章 CRUD API | 4,5 | ~4 |
| 7 | 前台页面 (首页/列表/详情) | 3,4 | ~5 |
| 8 | 管理后台页面 | 5,6 | ~6 |
| 9 | 搜索、标签、关于、404 | 3,7 | ~6 |
| 10 | SEO (RSS/Sitemap/OG) | 7 | ~4 |
| 11 | 视觉样式完整落地 | 3,7,8 | ~8 |
| 12 | 种子数据 | 4,6 | 1 |
| 13 | 测试 | 全部 | ~3 |
| 14 | 构建验证 | 全部 | 0 |
| 15 | 浏览器验证 | 14 | 0 |
| 16 | 部署 | 15 | ~4 |

---

## 四、技术决策速查

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 框架 | Next.js 15 (App Router) | 最新稳定版、RSC、SSG |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS v3 (with typography) | 项目成熟度、文档完善 |
| 数据库 | PostgreSQL | 持久化、全文搜索、事务 |
| ORM | Prisma | 类型安全、迁移、成熟生态 |
| 认证 | bcryptjs + iron-session | 轻量、无第三方依赖 |
| 内容 | Markdown (stored in DB) | 灵活、版本可控 |
| 部署 | Render / Railway | PostgreSQL 免费层、持久化 |
| 图标 | Lucide React | 轻量、Tree-shakeable |

---

## 五、风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| PostgreSQL 本地不可用 | 使用 Neon 免费云 PostgreSQL 开发 |
| 部署平台休眠 | 选择 Render/Railway 免费层（不休眠或快速唤醒） |
| Markdown XSS | 使用 isomorphic-dompurify 清理 HTML |
| 并发注册超限 | 数据库事务 + SELECT FOR UPDATE |

---

## 六、验收标准

- [ ] `npm run build` 零错误
- [ ] `npm run lint` 零错误
- [ ] `npm run test` 全部通过
- [ ] 桌面端 1440px 正常显示
- [ ] 移动端 390px 正常显示
- [ ] 深色模式正常切换
- [ ] 键盘可完成主要流程
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] 线上部署可访问
