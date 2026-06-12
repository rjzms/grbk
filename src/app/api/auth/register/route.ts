import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { createSession } from "@/lib/auth";
import { MAX_USERS, BCRYPT_SALT_ROUNDS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. 验证输入
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => e.message).join("；");
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 },
      );
    }

    const { email, username, password } = parsed.data;

    // 2. 检查并创建用户（不使用事务，Neon WebSocket 不支持）
    // 检查邮箱是否已注册
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "该邮箱已被注册" },
        { status: 409 },
      );
    }

    // 检查用户名是否已占用
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "该用户名已被占用" },
        { status: 409 },
      );
    }

    // 检查用户总数
    const userCount = await prisma.user.count();
    if (userCount >= MAX_USERS) {
      return NextResponse.json(
        {
          success: false,
          error: "本站用户注册已达上限（10 人），暂时无法注册新账号",
        },
        { status: 403 },
      );
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // 3. 创建 Session
    await createSession(user.id, user.username);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("注册错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误，请稍后重试" },
      { status: 500 },
    );
  }
}
