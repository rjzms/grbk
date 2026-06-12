import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PenLine, Edit, Trash2, Eye } from "lucide-react";
import type { SessionData } from "@/lib/auth";
import { DeletePostButton } from "./delete-button";

export default async function DashboardPostsPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, {
    password: process.env.SESSION_SECRET || "fallback-dev-key-change-me",
    cookieName: "grbk_sid",
  });

  if (!session.userId) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.userId },
    include: {
      tags: { select: { tag: { select: { name: true, slug: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <Container>
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            文章管理
          </h1>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
          >
            <PenLine className="w-4 h-4" />
            新建
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                    标题
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden sm:table-cell">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">
                    更新时间
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-secondary)]">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] truncate max-w-[200px] sm:max-w-[300px]">
                          {post.title}
                        </p>
                        {post.tags.length > 0 && (
                          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                            {post.tags.map((t) => t.tag.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {post.status === "PUBLISHED" ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-tertiary)] hidden md:table-cell">
                      {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
                            title="查看"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
            <PenLine className="w-10 h-10 text-[var(--color-text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">
              还没有文章
            </p>
            <Link
              href="/dashboard/posts/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
            >
              写第一篇文章
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
