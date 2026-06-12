import Link from "next/link";
// Using Tag as a type alias since we import lucide tags differently
import { Calendar, Clock } from "lucide-react";
import type { PostSummary } from "@/types";

function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)] hover:border-[var(--color-text-tertiary)] transition-colors duration-200">
      <div className="flex flex-col h-full gap-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] transition-colors duration-150"
              >
                {tag.name}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-[var(--color-text-tertiary)]">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold leading-snug tracking-tight">
          <Link
            href={`/blog/${post.slug}`}
            className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-150"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.author.username}
          </span>
        </div>
      </div>
    </article>
  );
}
