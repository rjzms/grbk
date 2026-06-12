import { Container } from "@/components/layout/container";
import { NarrowContainer } from "@/components/layout/container";

export default function AboutPage() {
  return (
    <>
      {/* About hero */}
      <section className="py-16 sm:py-24 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            关于
          </h1>
        </Container>
      </section>

      {/* About content */}
      <section className="py-12 sm:py-16">
        <NarrowContainer>
          <div className="prose prose-lg max-w-none">
            <h2>关于本博客</h2>
            <p>
              grbk 是一个简洁、克制的个人博客。它诞生于对清晰思考和优质写作的追求。
            </p>
            <p>
              这里没有喧闹的广告，没有复杂的社交功能，只有纯粹的写作与阅读。
            </p>

            <h2>关于我</h2>
            <p>
              一个热爱技术、设计和写作的开发者。相信好的工具和好的设计可以让世界变得更好。
            </p>
            <p>
              在这里记录思考的片段、技术的心得和生活的观察。
            </p>

            <h2>设计理念</h2>
            <ul>
              <li><strong>内容优先</strong> — 设计服务于文字</li>
              <li><strong>大量留白</strong> — 让内容有呼吸的空间</li>
              <li><strong>克制色彩</strong> — 中性色为主，强调色仅在必要时出现</li>
              <li><strong>无障碍优先</strong> — 满足 WCAG 2.2 AA 标准</li>
              <li><strong>无冗余装饰</strong> — 去除一切不必要的视觉元素</li>
            </ul>

            <h2>技术栈</h2>
            <p>
              本博客使用 Next.js、TypeScript、Tailwind CSS 和 Prisma 构建，
              托管于 Render，数据库使用 Neon PostgreSQL。
              项目源代码可在 GitHub 上查看。
            </p>

            <h2>联系</h2>
            <p>
              如果你对这里的内容有任何想法或建议，欢迎通过 GitHub Issues 与我交流。
            </p>
          </div>
        </NarrowContainer>
      </section>
    </>
  );
}
