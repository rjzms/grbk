# 部署指南

> 最后更新：2026-06-12

---

## 一、本地开发/生产数据库选择

| 环境 | 数据库 | 配置 |
|------|--------|------|
| 本地开发 | SQLite (libSQL) | `DATABASE_URL="file:./dev.db"` |
| 生产 | PostgreSQL | Neon / Render / Railway |

---

## 二、部署前检查清单

- [x] `npm run build` 通过
- [ ] 初始化 Git 并提交
- [ ] 创建 GitHub 仓库
- [ ] 注册 Neon 账号（获取 PostgreSQL 连接串）
- [ ] 注册 Render 账号（部署应用）
- [ ] 更新 `.env` 生产环境变量
- [ ] 推送代码并部署

---

## 三、部署到 Render

### 步骤 1：准备代码仓库

```bash
git init
git add .
git commit -m "Initial commit: grbk personal blog"
```

创建 GitHub 仓库并推送。

### 步骤 2：创建 Neon 数据库

1. 访问 https://neon.tech
2. 注册免费账号
3. 创建项目 → 选择区域
4. 创建数据库 → 复制连接串

### 步骤 3：部署到 Render

1. 访问 https://render.com
2. 注册 → New Web Service
3. 连接 GitHub 仓库
4. 配置：

```
Name: grbk
Runtime: Node
Build Command: npm install && npx prisma generate && npx prisma db push --skip-generate && npm run build
Start Command: npm start
```

5. 添加环境变量：

```
DATABASE_URL=postgresql://...  (Neon 连接串)
SESSION_SECRET=<随机 64 字符十六进制>
NEXT_PUBLIC_SITE_URL=https://grbk.onrender.com
NODE_ENV=production
```

### 步骤 4：迁移数据库

Prisma 的 `db push` 在 Build Command 中自动执行。部署完成后登录 Render shell 运行种子数据：

```bash
npx tsx prisma/seed.ts
```

---

## 四、环境变量清单

| 变量 | 必需 | 说明 |
|------|------|------|
| `DATABASE_URL` | 是 | 数据库连接串 |
| `SESSION_SECRET` | 是 | iron-session 加密密钥 (≥32字符) |
| `NEXT_PUBLIC_SITE_URL` | 否 | 站点 URL (用于 RSS/Sitemap/OG) |
| `NODE_ENV` | 否 | 环境 (production/development) |

---

## 五、数据备份

### SQLite（本地开发）

```bash
# 直接复制文件
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

### PostgreSQL（生产环境）

Neon 免费层提供自动时间点恢复（Point-in-Time Recovery），可直接在 Neon 控制台操作。

如需手动导出：

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql
```

---

## 六、常见问题

### 构建失败：Prisma generate

确保 `prisma.config.ts` 中的 `DATABASE_URL` 正确。

### 页面刷新后 404

确保部署平台配置了 SPA fallback（Next.js 的 `start` 命令已处理）。

### 数据库休眠

Render 免费层 15 分钟无请求后会休眠，首次唤醒需 30-60 秒。
