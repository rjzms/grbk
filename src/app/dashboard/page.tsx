import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { PenLine, FileText, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import type { SessionData } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, {
    password: process.env.SESSION_SECRET || "fallback-dev-key-change-me",
    cookieName: "grbk_sid",
  });

  if (!session.userId) {
    redirect("/login");
  }

  const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: session.userId } }),
    prisma.post.count({
      where: { authorId: session.userId, status: "PUBLISHED" },
    }),
    prisma.post.count({
      where: { authorId: session.userId, status: "DRAFT" },
    }),
  ]);

  return (
    <Container>
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            你好，{session.username}
          </h1>
          <LogoutButton />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)]">
            <FileText className="w-6 h-6 text-[var(--color-text-tertiary)] mb-3" />
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {totalPosts}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              总文章数
            </p>
          </div>
          <div className="border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)]">
            <PenLine className="w-6 h-6 text-[var(--color-accent)] mb-3" />
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {publishedPosts}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              已发布
            </p>
          </div>
          <div className="border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)]">
            <FileText className="w-6 h-6 text-[var(--color-text-tertiary)] mb-3" />
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {draftPosts}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              草稿
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
          >
            <PenLine className="w-4 h-4" />
            写新文章
          </Link>
        </div>
      </div>
    </Container>
  );
}
