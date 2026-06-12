import type { PostSummary } from "@/types";

// 使用通用类型而不是直接导入 Prisma 生成类型
// 避免 tsx 路径解析问题
type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  createdAt: Date;
  publishedAt: Date | null;
  tags: { tag: { name: string; slug: string } }[];
  author: { username: string };
};

export function postToSummary(post: PostRecord): PostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    status: post.status as "DRAFT" | "PUBLISHED",
    tags: post.tags.map((t) => t.tag),
    author: post.author,
    createdAt: post.createdAt,
    publishedAt: post.publishedAt,
  };
}
