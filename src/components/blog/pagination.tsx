import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const range = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="分页导航">
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-3 py-2 text-sm text-[var(--color-text-tertiary)]"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}?page=${page}`}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150",
              page === currentPage
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
            )}
          >
            {page}
          </Link>
        ),
      )}
    </nav>
  );
}
