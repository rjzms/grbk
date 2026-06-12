import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tags — 获取所有标签
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: { post: { status: "PUBLISHED" } },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const result = tags
      .filter((t) => t._count.posts > 0)
      .map((t) => ({
        name: t.name,
        slug: t.slug,
        count: t._count.posts,
      }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("获取标签错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}
