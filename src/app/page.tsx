import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/types";
import { postToSummary } from "@/lib/post-utils";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      author: { select: { username: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  const typedPosts: PostSummary[] = posts.map(postToSummary);

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 sm:py-32 lg:py-40">
        <Container>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[var(--color-text-primary)] max-w-2xl">
            记录思考，
            <br />
            分享创造。
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
            一个简洁、克制的个人博客。写作关于技术、设计和生活的所见所想。
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
            >
              浏览文章
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:border-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
            >
              了解更多
            </Link>
          </div>
        </Container>
      </section>

      {/* Latest Posts */}
      <section className="py-16 sm:py-24 border-t border-[var(--color-border)]">
        <Container>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              最新文章
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
            >
              查看全部 →
            </Link>
          </div>

          {typedPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {typedPosts.map((post) => (
                <PostCardClient key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--color-text-tertiary)]">
                还没有文章。开始写作吧。
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

// Client PostCard component (avoiding server/client interleaving issues)
import { PostCardClient } from "@/components/blog/post-card-client";
