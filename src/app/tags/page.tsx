import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      posts: {
        where: { post: { status: "PUBLISHED" } },
      },
    },
    orderBy: { name: "asc" },
  });

  // 只显示有关联已发布文章的标签
  const tagsWithPosts = tags.filter((t) => t.posts.length > 0);

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          标签
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {tagsWithPosts.length} 个标签
        </p>

        {tagsWithPosts.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {tagsWithPosts.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
              >
                {tag.name}
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {tag.posts.length}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center py-16">
            <p className="text-[var(--color-text-tertiary)]">
              还没有标签
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
