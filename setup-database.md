# 数据库设置指南

## 选项 1: Neon（推荐，完全免费）

1. 访问 https://neon.tech
2. 用 GitHub 账号登录（免费）
3. 点击 "Create Project"
4. 复制连接字符串（类似：postgresql://user:pass@xxx.neon.tech/db?sslmode=require）

## 选项 2: Vercel Postgres（免费额度）

1. 访问 https://vercel.com/ym-s-projects9/grbk/stores
2. 点击 "Create Database"
3. 选择 "Postgres"
4. 点击 "Continue"
5. 自动配置完成

## 下一步

获取数据库连接字符串后：

```bash
# 在 Vercel 设置环境变量
vercel env add DATABASE_URL production

# 或者直接在 Vercel 网站：
# https://vercel.com/ym-s-projects9/grbk/settings/environment-variables
```
