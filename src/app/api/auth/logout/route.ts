import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    if (session.userId) {
      await destroySession();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("退出错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}
