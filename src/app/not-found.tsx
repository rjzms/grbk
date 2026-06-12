import { Container } from "@/components/layout/container";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--color-text-primary)]">
          页面不存在
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)] max-w-md leading-relaxed">
          你访问的页面可能已被删除、移动或从未存在过。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-150"
        >
          返回首页
        </Link>
      </div>
    </Container>
  );
}
