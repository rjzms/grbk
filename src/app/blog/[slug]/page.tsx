import { NarrowContainer } from "@/components/layout/container";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: "文章不存在" };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      author: { select: { id: true, username: true, bio: true, avatar: true } },
    },
  });

  if (!post) {
    notFound();
  }

  const html = await renderMarkdown(post.content);

  return (
    <NarrowContainer>
      <article className="py-12 sm:py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文章列表
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((t) => (
                <Link
                  key={t.tag.slug}
                  href={`/tags/${t.tag.slug}`}
                  className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] transition-colors duration-150"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {t.tag.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-[var(--color-text-primary)]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(post.createdAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.author.username}
            </span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </NarrowContainer>
  );
}
