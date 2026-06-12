import Link from "next/link";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { Container } from "@/components/layout/container";
import { redirect } from "next/navigation";
import type { SessionData } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, {
    password: process.env.SESSION_SECRET || "fallback-dev-key-change-me",
    cookieName: "grbk_sid",
  });

  if (!session.userId) {
    redirect("/login");
  }

  return (
    <>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Container>
          <div className="flex items-center gap-6 h-12">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
            >
              概览
            </Link>
            <Link
              href="/dashboard/posts"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
            >
              文章管理
            </Link>
            <Link
              href="/dashboard/posts/new"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
            >
              新建文章
            </Link>
          </div>
        </Container>
      </div>
      {children}
    </>
  );
}
