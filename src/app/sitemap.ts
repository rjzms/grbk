import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  const staticPages = [
    { url: SITE_URL, priority: 1, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/tags`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/search`, priority: 0.5, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/about`, priority: 0.6, changeFrequency: "monthly" as const },
  ];

  const blogPosts = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagPages = tags.map((tag) => ({
    url: `${SITE_URL}/tags/${tag.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPosts, ...tagPages];
}
