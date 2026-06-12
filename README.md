# grbk — 个人博客

一个简洁、克制的个人博客。以阅读体验为中心，大量留白，排版清晰。

## 技术栈

| 层 | 技术 |
|-----|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 + `@tailwindcss/typography` |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| ORM | Prisma 7 |
| 认证 | iron-session + bcryptjs |
| Markdown | unified + remark + rehype-pretty-code |
| 部署 | Render / Neon |

## 功能

- 文章发布与管理（Markdown）
- 用户注册与登录（最多 10 人）
- 标签系统
- 全文搜索
- 分页
- 草稿与发布
- 暗色模式
- RSS / Sitemap / SEO
- 响应式设计
- WCAG 2.2 AA 无障碍

## 环境要求

- Node.js >= 18
- npm >= 9

## 安装步骤

```bash
# 1. 克隆仓库
git clone <repo-url>
cd grbk

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库连接串和密钥

# 4. 初始化数据库
npx prisma generate
npx prisma db push

# 5. 创建种子数据
npx tsx prisma/seed.ts

# 6. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | 是 | 数据库连接串（本地: `file:./dev.db`） |
| `SESSION_SECRET` | 是 | 会话加密密钥（≥32 字符） |
| `NEXT_PUBLIC_SITE_URL` | 否 | 站点 URL（用于 RSS/Sitemap/OG） |

## 数据库初始化

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送 schema（自动创建表）
npx prisma db push

# 浏览数据库
npx prisma studio

# 创建示例数据
npx tsx prisma/seed.ts
```

种子数据包含：
- 管理员账号: admin@grbk.dev / password123
- 6 篇示例文章

## 本地运行

```bash
npm run dev
```

## 测试

```bash
# TypeScript 类型检查
npx tsc --noEmit

# ESLint
npm run lint

# 生产构建测试
npm run build
```

## 构建

```bash
npm run build
npm start
```

## 部署

详见 [docs/deployment.md](docs/deployment.md)。

推荐部署方案：

1. **数据库**: [Neon](https://neon.tech) — 免费 PostgreSQL
2. **应用**: [Render](https://render.com) — 免费 Node.js 托管

## 项目结构

```
grbk/
├── docs/                   # 设计文档
├── prisma/                 # 数据库 schema 和迁移
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/                # Next.js App Router 页面和 API
│   │   ├── page.tsx        # 首页
│   │   ├── blog/           # 文章页
│   │   ├── tags/           # 标签页
│   │   ├── search/         # 搜索页
│   │   ├── about/          # 关于页
│   │   ├── login/          # 登录页
│   │   ├── register/       # 注册页
│   │   ├── dashboard/      # 管理后台
│   │   ├── api/            # API 路由
│   │   ├── rss.xml/        # RSS
│   │   └── sitemap.ts      # Sitemap
│   ├── components/         # React 组件
│   ├── lib/                # 工具库
│   ├── hooks/              # 自定义 Hooks
│   └── types/              # TypeScript 类型
└── public/                 # 静态资源
```

## 常见问题

### 数据库连接失败

确保 `.env` 中的 `DATABASE_URL` 正确。本地开发使用 `file:./dev.db`。

### 构建时报错

1. 确保已运行 `npx prisma generate`
2. 确保已运行 `npx prisma db push`
3. 检查 TypeScript 类型: `npx tsc --noEmit`

### 页面 404

确保数据库中有已发布的文章。运行种子数据: `npx tsx prisma/seed.ts`。

## 数据备份与恢复

### 本地开发（SQLite）

```bash
# 备份
cp prisma/dev.db prisma/backup.db

# 恢复
cp prisma/backup.db prisma/dev.db
```

### 生产环境（PostgreSQL）

```bash
# 备份
pg_dump "$DATABASE_URL" > backup.sql

# 恢复
psql "$DATABASE_URL" < backup.sql
```

## 设计文档

- [设计调研](docs/design-research.md)
- [设计系统](docs/design-system.md)
- [架构文档](docs/architecture.md)
- [实施计划](docs/implementation-plan.md)
- [部署指南](docs/deployment.md)
- [维护指南](docs/maintenance.md)

## License

MIT
