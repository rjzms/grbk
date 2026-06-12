import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePostSchema } from "@/lib/validators";
import { getSession } from "@/lib/auth";
import { generateSlug, generateExcerpt } from "@/lib/markdown";

// GET /api/posts/[id] — 获取文章详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getSession();

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        author: { select: { id: true, username: true, bio: true, avatar: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    // 草稿文章只能由作者查看
    if (post.status === "DRAFT") {
      if (!session.userId || session.userId !== post.authorId) {
        return NextResponse.json(
          { success: false, error: "文章不存在" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: { ...post, tags: post.tags.map((t) => t.tag) },
    });
  } catch (error) {
    console.error("获取文章详情错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}

// PATCH /api/posts/[id] — 更新文章
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    // 权限检查：只能编辑自己的文章
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }
    if (existing.authorId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "无权编辑此文章" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => e.message).join("；");
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};

    if (parsed.data.title !== undefined) {
      data.title = parsed.data.title;
      const newSlug = generateSlug(parsed.data.title);
      if (newSlug && newSlug !== existing.slug) {
        const slugConflict = await prisma.post.findUnique({
          where: { slug: newSlug },
        });
        data.slug = slugConflict
          ? `${newSlug}-${Date.now().toString(36)}`
          : newSlug;
      }
    }

    if (parsed.data.content !== undefined) {
      data.content = parsed.data.content;
      if (!parsed.data.excerpt) {
        data.excerpt = generateExcerpt(parsed.data.content) || null;
      }
    }

    if (parsed.data.excerpt !== undefined) {
      data.excerpt = parsed.data.excerpt || null;
    }

    if (parsed.data.coverImage !== undefined) {
      data.coverImage = parsed.data.coverImage || null;
    }

    if (parsed.data.status !== undefined) {
      data.status = parsed.data.status;
      if (parsed.data.status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    // 更新标签
    if (parsed.data.tags !== undefined) {
      // 删除旧关联
      await prisma.postTag.deleteMany({ where: { postId: id } });
      // 创建新标签
      const tagRecords = await Promise.all(
        parsed.data.tags.map(async (tagName) => {
          const tagSlug = tagName
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, "-")
            .replace(/[^\w-]/g, "");
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name: tagName.trim(), slug: tagSlug },
          });
        }),
      );
      await prisma.postTag.createMany({
        data: tagRecords.map((tag) => ({ postId: id, tagId: tag.id })),
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        author: { select: { username: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...post, tags: post.tags.map((t) => t.tag) },
    });
  } catch (error) {
    console.error("更新文章错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id] — 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }
    if (existing.authorId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "无权删除此文章" },
        { status: 403 },
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除文章错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}
