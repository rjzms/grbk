import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-4">
          <div className="text-sm text-[var(--color-text-tertiary)]">
            <span>&copy; {new Date().getFullYear()} grbk</span>
            <span className="mx-2">·</span>
            <span>保持好奇，保持创造</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
            <Link
              href="/rss.xml"
              className="hover:text-[var(--color-text-secondary)] transition-colors duration-150"
            >
              RSS
            </Link>
            <Link
              href="/sitemap.xml"
              className="hover:text-[var(--color-text-secondary)] transition-colors duration-150"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
