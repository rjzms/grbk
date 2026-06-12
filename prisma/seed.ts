// 种子数据脚本 — 创建示例用户和文章
// 运行: DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 开始创建种子数据...");

  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@grbk.dev" },
    update: {},
    create: {
      email: "admin@grbk.dev",
      username: "admin",
      password,
      bio: "grbk 博客的管理员。热爱技术与写作。",
    },
  });
  console.log(`✅ 用户: ${admin.username} (${admin.email})`);

  await prisma.postTag.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});

  const posts = [
    {
      title: "欢迎来到 grbk",
      slug: "welcome-to-grbk",
      content: `## 你好，世界\n\n欢迎来到 **grbk**——一个简洁、克制的个人博客。\n\n在这个信息泛滥的时代，我们比任何时候都更需要一个安静的角落来**思考和写作**。\n\n这里没有喧闹的评论区和复杂的社交功能。这里只有清晰的排版、纯粹的内容和舒适的阅读体验。\n\n> "写作即是思考。清晰的写作反映清晰的思考。"`,
      excerpt: "一个简洁、克制的个人博客，开始记录思考与创造。",
      status: "PUBLISHED" as const,
      tags: ["博客", "设计"],
    },
    {
      title: "为什么选择 Next.js 构建博客",
      slug: "why-nextjs-for-blog",
      content: `## 为什么选择 Next.js\n\n在 2026 年，构建个人博客有很多选择。Next.js 的 App Router 支持 SSG、ISR 和 SSR，为博客场景提供了恰到好处的灵活性。\n\n- TypeScript 原生支持\n- 文件系统路由\n- 热模块更新\n\n### 技术栈\n\n- **Next.js** — 框架\n- **TypeScript** — 类型安全\n- **Tailwind CSS** — 样式\n- **Prisma + SQLite** — 数据库`,
      excerpt: "探讨为什么 Next.js 是构建现代个人博客的理想选择。",
      status: "PUBLISHED" as const,
      tags: ["技术", "Next.js", "Web开发"],
    },
    {
      title: "设计系统的力量",
      slug: "power-of-design-systems",
      content: `## 设计系统的力量\n\n好的设计不是偶然产生的。它是系统化思考和反复迭代的结果。\n\n### 什么是设计系统？\n\n设计系统是一套可复用的设计标准，包括设计原则、视觉语言、组件库和文档。\n\n### 为什么需要？\n\n1. **一致性** — 确保每个页面遵循相同规则\n2. **效率** — 不需要每次从头设计\n3. **可维护性** — 修改 token 即可全局生效\n\n> 设计不是关于外观，而是关于它如何工作。`,
      excerpt: "探讨设计系统如何提升产品的一致性和可维护性。",
      status: "PUBLISHED" as const,
      tags: ["设计", "设计系统", "CSS"],
    },
    {
      title: "Markdown 写作指南",
      slug: "markdown-writing-guide",
      content: `## Markdown 写作指南\n\nMarkdown 是程序员和技术写作者的首选标记语言。\n\n### 基础语法\n\n- **粗体**：\`**文字**\`\n- *斜体*：\`*文字*\`\n- \`行内代码\`：\`\\\`代码\\\`\`\n\n### 代码块\n\n\`\`\`javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n\`\`\`\n\n### 写作建议\n\n1. 从大纲开始\n2. 一段一个观点\n3. 使用列表让信息更易扫描`,
      excerpt: "全面的 Markdown 语法指南和写作建议。",
      status: "PUBLISHED" as const,
      tags: ["写作", "Markdown", "教程"],
    },
    {
      title: "可持续的 Web 开发实践",
      slug: "sustainable-web-development",
      content: `## 可持续的 Web 开发\n\n"可持续"在 Web 开发中意味着代码的长期可维护性。\n\n### 实践原则\n\n1. **选择稳定的依赖** — 不要安装 50 个包来实现一个表单\n2. **保持简单** — 每个工具都要解决核心问题\n3. **编写文档** — 代码说"怎么做"，文档说"为什么"\n4. **测试关键路径** — 不需要 100% 覆盖，但要覆盖核心流程\n\n### 总结\n\n可持续的开发是关于**决策**，而非工具。`,
      excerpt: "探讨如何在 Web 开发中做出可持续的技术决策。",
      status: "PUBLISHED" as const,
      tags: ["技术", "最佳实践", "Web开发"],
    },
    {
      title: "从零构建个人博客的完整记录",
      slug: "building-blog-from-scratch",
      content: `## 从零构建个人博客\n\n这篇文章记录了我从头构建这个博客的完整过程。\n\n### 第一步：设计研究\n\n研究了极简瑞士风格、内容优先排版和无障碍设计标准。\n\n### 第二步：建立设计系统\n\n定义了完整的色彩、字体和间距系统。\n\n### 第三步：技术选型\n\n选择了 Next.js + TypeScript + Tailwind CSS + Prisma。\n\n### 经验总结\n\n1. 先设计，后编码\n2. 保持简单\n3. 文档是给自己写的\n4. 测试关键路径`,
      excerpt: "记录从零到一构建个人博客的完整过程。",
      status: "PUBLISHED" as const,
      tags: ["博客", "教程", "Web开发"],
    },
  ];

  for (const postData of posts) {
    const { tags: tagNames, ...data } = postData;

    const tagRecords = await Promise.all(
      tagNames.map(async (name) =>
        prisma.tag.upsert({
          where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
          update: {},
          create: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          },
        }),
      ),
    );

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: admin.id,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        tags: {
          create: tagRecords.map((tag) => ({ tagId: tag.id })),
        },
      },
    });

    console.log(`📝 文章: ${post.title} [${post.status}]`);
  }

  console.log("\n✅ 种子数据创建完成！");
  console.log("   登录账号: admin@grbk.dev");
  console.log("   登录密码: password123");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
