# 维护指南

> 最后更新：2026-06-12

---

## 一、日常操作

### 启动本地开发服务器

```bash
npm run dev
```

### 创建新用户

访问 http://localhost:3000/register 注册。

系统最多支持 10 个用户。

### 重置密码（管理员）

目前没有密码重置功能。如果需要重置密码，可以：

1. 用 Node.js 生成新哈希：

```bash
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('newpassword', 12).then(h => console.log(h));
"
```

2. 连接数据库直接更新：

```sql
UPDATE User SET password = '<新哈希>' WHERE email = 'user@example.com';
```

---

## 二、数据库维护

### SQLite 本地数据库

```bash
# 查看数据
npx prisma studio

# 备份
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# 重置（删除所有数据）
rm prisma/dev.db && npx prisma db push
```

### 生产 PostgreSQL 数据库

```bash
# 远程连接（需要连接串）
npx prisma studio

# 备份
pg_dump "$DATABASE_URL" > backup.sql

# 恢复
psql "$DATABASE_URL" < backup.sql
```

---

## 三、内容管理

### 管理后台

访问 http://localhost:3000/dashboard
- 登录后可以创建、编辑、删除文章
- 支持 Markdown 书写
- 支持草稿和直接发布

### 文章状态

| 状态 | 说明 | 可见范围 |
|------|------|----------|
| DRAFT | 草稿 | 仅作者 |
| PUBLISHED | 已发布 | 所有人 |

### 标签管理

标签在创建/编辑文章时自动创建。未被任何文章使用的标签不会出现在标签页面。

---

## 四、性能优化

### 图片

文章封面图建议使用 WebP 格式，尺寸不超过 1200px 宽。使用外部图床（如 Cloudinary、Imgur）而非直接上传。

### 静态生成

博客文章在构建时预渲染为静态页面。内容更新后会自动通过 ISR 重新生成（60秒内）。

---

## 五、安全更新

### 定期更新依赖

```bash
# 检查过期依赖
npm outdated

# 更新依赖
npm update

# 检查安全漏洞
npm audit
```

### 监控

- Render 控制台查看应用日志
- Neon 控制台查看数据库性能
- 定期检查 `/rss.xml` 和 `/sitemap.xml` 是否正常生成

---

## 六、迁移指南

### 从 SQLite 迁移到 PostgreSQL

1. 导出 SQLite 数据为 SQL
2. 修改 `prisma/schema.prisma`：`provider = "postgresql"`
3. 修改 `prisma.config.ts` 中的 DATABASE_URL
4. 修改 `prisma.ts`：替换 libSQL adapter 为 `@prisma/adapter-pg`
5. 重新生成 Prisma client
6. 推送 schema 到 PostgreSQL
7. 导入数据

### 从 Render 迁移到其他平台

Next.js 应用可以部署到任何支持 Node.js 的平台。只需：
1. 设置相同的环境变量
2. 运行相同的构建命令
3. 启动 `npm start`
