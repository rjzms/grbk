import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";
import { postToSummary } from "@/lib/post-utils";
import { Pagination } from "@/components/blog/pagination";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { PostSummary } from "@/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Disabled for now to avoid build-time database access
// export async function generateStaticParams() {
//   const tags = await prisma.tag.findMany({ select: { slug: true } });
//   return tags.map((t) => ({ tag: t.slug }));
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return { title: "标签不存在" };
  return {
    title: tag.name,
    description: `查看标签"${tag.name}"下的所有文章`,
  };
}

export default async function TagPostsPage({ params, searchParams }: Props) {
  const { tag: slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const where = {
    status: "PUBLISHED" as const,
    tags: { some: { tag: { slug } } },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        author: { select: { username: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {tag.name}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          共 {total} 篇文章
        </p>

        {posts.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCardClient key={post.id} post={postToSummary(post)} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/tags/${slug}`}
            />
          </>
        ) : (
          <div className="mt-20 text-center py-16">
            <p className="text-[var(--color-text-tertiary)]">
              该标签下暂无文章
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

import { PostCardClient } from "@/components/blog/post-card-client";
