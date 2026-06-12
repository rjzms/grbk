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

  // 移除 rehype-pretty-code 生成的 <script> 标签
  // 这些 script 标签仅用于代码块的行号高亮逻辑，在 dangerouslySetInnerHTML 中不执行
  // 在 React 中会触发 "Encountered a script tag" 告警，需要移除
  const cleanedHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // 安全清理：移除 XSS 向量但保留代码高亮产生的 HTML
  return DOMPurify.sanitize(cleanedHtml, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "blockquote",
      "pre", "code",
      "a", "em", "strong", "del", "ins",
      "img", "table", "thead", "tbody", "tr", "th", "td",
      "span", "div", "figure", "figcaption",
      "input",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel",
      "class", "id",
      "data-line", "data-language", "data-theme",
      "style",
      "type", "checked", "disabled",
    ],
    ALLOW_DATA_ATTR: true,
  });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
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
