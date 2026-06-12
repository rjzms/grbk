# 技术架构文档

> 版本：1.0.0 | 日期：2026-06-12

---

## 一、技术栈选型

### 1.1 最终方案

| 层 | 技术 | 版本 | 理由 |
|-----|------|------|------|
| 框架 | Next.js | 15.x | App Router, RSC, SSG, ISR, SEO 友好 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 3.x | 成熟生态, @tailwindcss/typography, 文档完善 |
| 数据库 | PostgreSQL (Neon) | 16 | 免费层, 持久化, 全文搜索 |
| ORM | Prisma | 7.x | 类型安全, 迁移, 成熟 |
| 认证 | bcryptjs + iron-session | — | 轻量, 密封 Cookie, 无第三方依赖 |
| Markdown | unified + remark + rehype | — | 可扩展的 AST 处理 |
| Markdown 安全 | isomorphic-dompurify | — | 服务端+客户端 XSS 防护 |
| 图标 | Lucide React | — | Tree-shakeable, MIT 协议 |
| 部署 | Render | — | PostgreSQL 免费层, 不休眠 |

### 1.2 为什么不选其他方案

| 方案 | 排除理由 |
|------|----------|
| SQLite | 多用户并发写入锁、无持久化磁盘平台会丢失数据 |
| Vercel (默认 PG) | Vercel Postgres 免费层严重受限 |
| NextAuth/Auth.js | 本项目 10 用户以内，不需要第三方 OAuth |
| Neon 作为部署平台 | Neon 只提供数据库，不提供应用托管 |
| Supabase | 功能过重，自带 Auth/Storage/Realtime 且大部分用不到 |
| Tailwind v4 | 较新，@tailwindcss/typography 兼容性待验证，先使用 v3 |
| MDX 文件存储 | 多用户博客需要数据库存储，文件存储不适合 |
| Docker 本地 PG | 本机未安装 Docker，使用 Neon 云端 PG 更简单 |

---

## 二、数据库设计

### 2.1 ERD

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   User   │       │     Post     │       │    Tag   │
├──────────┤       ├──────────────┤       ├──────────┤
│ id (PK)  │──<    │ id (PK)      │       │ id (PK)  │
│ email    │       │ title        │       │ name     │
│ username │       │ slug         │       │ slug     │
│ password │       │ content      │       └──────────┘
│ bio      │       │ excerpt      │            │
│ avatar   │       │ coverImage   │            │
│ createdAt│       │ status       │       ┌────┴───────┐
│ updatedAt│       │ authorId(FK) │       │ PostTag    │
└──────────┘       │ createdAt    │       ├────────────┤
                   │ updatedAt    │       │ postId(FK) │
                   │ publishedAt  │       │ tagId(FK)  │
                   └──────────────┘       └────────────┘
```

### 2.2 Prisma Schema 核心字段

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  coverImage  String?
  status      PostStatus @default(DRAFT)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  tags        PostTag[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  slug  String    @unique
  posts PostTag[]
}

model PostTag {
  postId String
  tagId  String
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([postId, tagId])
}

enum PostStatus {
  DRAFT
  PUBLISHED
}
```

---

## 三、认证架构

### 3.1 流程

```
注册: POST /api/auth/register
  → 验证输入 (zod)
  → 检查用户总数 < 10 (事务)
  → bcryptjs 哈希密码 (cost=12)
  → 创建用户
  → 创建 Session (iron-session)
  → 设置 HttpOnly Cookie

登录: POST /api/auth/login
  → 验证输入
  → 按邮箱查找用户
  → bcryptjs 验证密码
  → 创建 Session
  → 设置 HttpOnly Cookie

退出: POST /api/auth/logout
  → 销毁 Session
  → 清除 Cookie
```

### 3.2 Session 配置

```ts
// iron-session 配置
{
  cookieName: 'grbk_sid',
  password: process.env.SESSION_SECRET!, // 至少 32 字符
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 天
    path: '/',
  }
}
```

### 3.3 登录限流

```ts
// 基于内存 Map 的简易限流器
// 每 IP 每 60 秒最多 5 次登录尝试
// 超出后返回 429 + 友好中文提示
```

---

## 四、路由架构

### 4.1 前台 (App Router Pages)

| 路由 | 渲染策略 | 说明 |
|------|----------|------|
| `/` | SSG + ISR (60s) | 首页，展示最新公开文章 |
| `/blog` | SSG + ISR (60s) | 文章列表，分页 |
| `/blog/[slug]` | SSG + ISR (300s) | 文章详情 |
| `/tags` | SSG | 标签列表 |
| `/tags/[tag]` | SSG | 标签下文章 |
| `/search` | SSR (dynamic) | 搜索页面 |
| `/about` | SSG | 关于页面 |
| `/login` | SSR | 登录页面 |
| `/register` | SSR | 注册页面 |

### 4.2 管理后台

| 路由 | 渲染策略 | 权限 |
|------|----------|------|
| `/dashboard` | SSR | 需登录 |
| `/dashboard/posts` | SSR | 需登录 |
| `/dashboard/posts/new` | SSR | 需登录 |
| `/dashboard/posts/[id]/edit` | SSR | 需登录，且为作者 |

### 4.3 API 路由

| 路由 | 方法 | 权限 |
|------|------|------|
| `/api/auth/register` | POST | 公开 |
| `/api/auth/login` | POST | 公开 |
| `/api/auth/logout` | POST | 需登录 |
| `/api/me` | GET | 需登录 |
| `/api/posts` | GET | 公开(仅 PUBLISHED) / 需登录(自己的) |
| `/api/posts` | POST | 需登录 |
| `/api/posts/[id]` | GET | 公开(仅 PUBLISHED) / 需登录(作者) |
| `/api/posts/[id]` | PATCH | 需登录，且为作者 |
| `/api/posts/[id]` | DELETE | 需登录，且为作者 |
| `/api/tags` | GET | 公开 |
| `/rss.xml` | SSG | 公开 |
| `/sitemap.xml` | SSG | 公开 |

---

## 五、安全架构

| 层面 | 措施 |
|------|------|
| 密码 | bcryptjs, cost=12 |
| Session | iron-session 密封, HttpOnly, Secure, SameSite=Lax |
| CSRF | SameSite Cookie + Origin/Referer 检查 |
| XSS | Markdown HTML 通过 DOMPurify 清理 |
| SQL 注入 | Prisma 参数化查询（默认防注入） |
| 输入验证 | Zod schema 验证所有输入 |
| 限流 | 登录 API 内存限流 5次/60秒/IP |
| 响应头 | CSP, X-Content-Type-Options, X-Frame-Options, HSTS |
| 环境变量 | .env 不入 Git, .env.example 提供模板 |
| 权限 | 每个 API 检查 authorId 所有权 |

---

## 六、部署架构

### 6.1 平台选择

| 组件 | 平台 | 免费额度 | 说明 |
|------|------|----------|------|
| 应用托管 | Render | 750h/月 免费 | 自定义域名、HTTPS、CI/CD |
| 数据库 | Neon | 0.5GB 存储, 1 项目 | Serverless PostgreSQL |
| 静态资源 | 内置于 Next.js | — | SSG 页面由 Render 服务 |

### 6.2 环境变量

```env
DATABASE_URL="postgresql://..."              # Neon 连接串
DIRECT_URL="postgresql://..."                # Prisma 直连（无连接池）
SESSION_SECRET="至少32字符的随机字符串"       # iron-session 密钥
NEXT_PUBLIC_SITE_URL="https://..."           # 站点 URL
NODE_ENV="production"
```

### 6.3 Render 配置

```yaml
# render.yaml
services:
  - type: web
    name: grbk
    runtime: node
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: SESSION_SECRET
        generateValue: true
```

---

## 七、监控和维护

- Render 内置日志（stdout/stderr）
- 数据库定期备份（Neon 免费层自动时间点恢复）
- 无第三方监控服务依赖
- 维护文档见 `docs/maintenance.md`
