"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePostButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-2 py-1 text-xs font-medium text-white bg-[var(--color-error)] rounded-md hover:opacity-90 transition-opacity duration-150"
        >
          {deleting ? "..." : "确认"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs font-medium border border-[var(--color-border)] rounded-md"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
      title={`删除"${postTitle}"`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
