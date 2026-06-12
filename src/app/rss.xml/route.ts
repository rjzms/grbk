import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      tags: { select: { tag: { select: { name: true } } } },
      author: { select: { username: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = await Promise.all(
    posts.map(async (post) => {
      const html = await renderMarkdown(post.content);
      return `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${html}]]></description>
      <author>${post.author.username}</author>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${t.tag.name}</category>`).join("\n      ")}
    </item>`;
    }),
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>grbk — 个人博客</title>
    <link>${SITE_URL}</link>
    <description>一个简洁、克制的个人博客，记录思考与创造。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join("\n    ")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
