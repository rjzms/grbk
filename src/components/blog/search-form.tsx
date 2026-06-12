"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import type { PostSummary } from "@/types";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 1) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/posts?limit=50&status=PUBLISHED");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const q = trimmed.toLowerCase();
          const filtered = data.data.items.filter(
            (p: PostSummary) =>
              p.title.toLowerCase().includes(q) ||
              (p.excerpt && p.excerpt.toLowerCase().includes(q)),
          );
          setResults(filtered);
        }
      }
    } catch (err) {
      console.error("搜索出错:", err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <>
      <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] transition-all duration-150"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors duration-150"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "搜索"
          )}
        </button>
      </form>

      {searched && (
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              搜索中...
            </p>
          ) : results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)] hover:border-[var(--color-text-tertiary)] transition-colors duration-200"
                >
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              没有找到匹配的文章
            </p>
          )}
        </div>
      )}
    </>
  );
}
