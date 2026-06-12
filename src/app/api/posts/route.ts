import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validators";
import { getSession } from "@/lib/auth";
import { generateSlug, generateExcerpt } from "@/lib/markdown";

// GET /api/posts — 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | null;
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");

    const where: Record<string, unknown> = {};

    // 公开请求只看已发布文章；登录用户可以看到自己的文章
    if (status && session.userId) {
      where.status = status;
      where.authorId = session.userId;
    } else if (author && session.userId && author === session.userId) {
      where.authorId = author;
    } else {
      where.status = "PUBLISHED";
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: { select: { tag: { select: { name: true, slug: true } } } },
          author: { select: { username: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: posts.map((p) => ({
          ...p,
          tags: p.tags.map((t) => t.tag),
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("获取文章列表错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}

// POST /api/posts — 创建文章
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => e.message).join("；");
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 },
      );
    }

    const { title, content, excerpt, coverImage, status, tags } = parsed.data;

    // 生成 slug（处理重复）
    let slug = generateSlug(title);
    if (!slug) slug = `post-${Date.now()}`;
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // 生成摘要
    const finalExcerpt = excerpt || generateExcerpt(content) || null;
    const publishedAt = status === "PUBLISHED" ? new Date() : null;

    // 处理标签
    const tagRecords = await Promise.all(
      tags.map(async (tagName) => {
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

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: finalExcerpt,
        coverImage: coverImage || null,
        status,
        publishedAt,
        authorId: session.userId,
        tags: {
          create: tagRecords.map((tag) => ({ tagId: tag.id })),
        },
      },
      include: {
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        author: { select: { username: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...post, tags: post.tags.map((t) => t.tag) },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("创建文章错误:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}
