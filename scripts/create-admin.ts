import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@grbk.com";
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123456";

  // 检查管理员是否已存在
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("✓ 管理员账号已存在:", existingAdmin.username);
    return;
  }

  // 创建管理员
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✓ 管理员账号创建成功！");
  console.log("  用户名:", admin.username);
  console.log("  邮箱:", admin.email);
  console.log("  密码:", password);
  console.log("\n请立即登录并修改密码：https://grbk-mauve.vercel.app/login");
}

main()
  .catch((e) => {
    console.error("错误:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
