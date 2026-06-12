import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";
import { postToSummary } from "@/lib/post-utils";
import type { PostSummary } from "@/types";
import { Pagination } from "@/components/blog/pagination";
import { POSTS_PER_PAGE } from "@/lib/constants";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: {
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        author: { select: { username: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const typedPosts: PostSummary[] = posts.map(postToSummary);

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          文章
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          共 {total} 篇文章
        </p>

        {typedPosts.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {typedPosts.map((post) => (
                <PostCardClient key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/blog"
            />
          </>
        ) : (
          <div className="mt-20 text-center py-16">
            <p className="text-[var(--color-text-tertiary)]">
              还没有文章。开始写作吧。
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

import { PostCardClient } from "@/components/blog/post-card-client";
