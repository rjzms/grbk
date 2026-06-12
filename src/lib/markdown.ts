import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import DOMPurify from "isomorphic-dompurify";

export async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: true,
    })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  const html = String(result);

  // 安全清理：移除 XSS 向量但保留代码高亮产生的 HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "blockquote",
      "pre", "code",
      "a", "em", "strong", "del", "ins",
      "img", "table", "thead", "tbody", "tr", "th", "td",
      "span", "div", "figure", "figcaption",
      "input", // for task lists
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel",
      "class", "id",
      "data-line", "data-language", "data-theme",
      "style",
      "type", "checked", "disabled", // for task lists
    ],
    ALLOW_DATA_ATTR: true,
  });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/[\s_]+/g, "-") // 空格和下划线替换为连字符
    .replace(/-+/g, "-") // 合并连字符
    .replace(/^-|-$/g, "") // 移除首尾连字符
    .substring(0, 100);
}

export function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
