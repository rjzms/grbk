"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NarrowContainer } from "@/components/layout/container";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("标题不能为空");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          excerpt: excerpt.trim() || undefined,
          status,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "保存失败");
        return;
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <NarrowContainer>
      <div className="py-12">
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文章列表
        </Link>

        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">
          新建文章
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-[var(--color-error)] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
            >
              标题
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] transition-all duration-150"
            />
          </div>

          {/* Content (Markdown) */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
            >
              内容（Markdown）
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="使用 Markdown 书写..."
              className="w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] transition-all duration-150 font-mono resize-y"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
            >
              摘要（可选）
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="文章摘要，留空则自动生成"
              className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] transition-all duration-150"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              标签
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)] bg-[var(--color-surface)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-[var(--color-error)] transition-colors duration-150"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="输入标签名"
                maxLength={30}
                className="flex-1 px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] transition-all duration-150"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status + Submit */}
          <div className="flex items-center gap-3 pt-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-150"
            >
              <option value="DRAFT">保存为草稿</option>
              <option value="PUBLISHED">直接发布</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors duration-150"
            >
              {saving ? "保存中..." : status === "PUBLISHED" ? "发布" : "保存草稿"}
            </button>
          </div>
        </form>
      </div>
    </NarrowContainer>
  );
}
