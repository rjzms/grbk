import { Container } from "@/components/layout/container";
import { SearchForm } from "@/components/blog/search-form";

export default function SearchPage() {
  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          搜索
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          搜索文章标题和内容
        </p>
        <SearchForm />
      </div>
    </Container>
  );
}
