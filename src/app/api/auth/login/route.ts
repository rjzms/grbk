import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // 1. 限流检查（基于 IP）
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(`login:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "登录尝试过于频繁，请 1 分钟后再试",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 2. 验证输入
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => e.message).join("；");
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // 3. 查找用户
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    // 4. 验证密码
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    // 5. 创建 Session
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
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (error) {
    console.error("登录错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误，请稍后重试" },
      { status: 500 },
    );
  }
}
