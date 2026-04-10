import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const getPost = unstable_cache(
  async (slug: string) => {
    return prisma.post.findUnique({ where: { slug } });
  },
  ["blog-post"],
  { revalidate: 60 }
);

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Financial Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 155) + "…",
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 155) + "…",
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
    },
  };
}

function readingTime(content: string) {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 155),
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Organization", name: "BlogSystem Finance" },
    publisher: { "@type": "Organization", name: "BlogSystem Finance" },
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent font-medium transition-colors duration-200 group mb-10"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to financial insights
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Financial Insight
            </span>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-5">
              <time>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-muted/40" />
              <span>{readingTime(post.content)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-heading">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div
          className="
            prose prose-lg max-w-none
            text-foreground/80
            prose-headings:font-extrabold
            prose-headings:tracking-tight
            prose-headings:text-heading
            prose-h2:text-2xl
            prose-h2:sm:text-3xl
            prose-h2:mt-14
            prose-h2:mb-4
            prose-h3:text-xl
            prose-h3:mt-10
            prose-h3:mb-3
            prose-p:text-[17px]
            prose-p:leading-[1.85]
            prose-p:text-foreground/80
            prose-a:text-accent
            prose-a:font-semibold
            prose-a:no-underline
            hover:prose-a:underline
            prose-strong:text-heading
            prose-strong:font-bold
            prose-ul:my-6
            prose-ul:space-y-2
            prose-li:text-[17px]
            prose-li:leading-[1.85]
            prose-li:text-foreground/80
            prose-img:rounded-xl
            prose-img:border
            prose-img:border-border
            prose-img:my-10
            prose-img:w-full
            prose-img:shadow-sm
            prose-blockquote:border-l-accent
            prose-blockquote:bg-surface
            prose-blockquote:rounded-r-xl
            prose-blockquote:py-1
            prose-blockquote:px-6
            prose-code:text-accent
            prose-code:bg-surface
            prose-code:rounded
            prose-code:px-1
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Disclaimer styling */}
        <style>{`
          .disclaimer {
            margin-top: 2rem;
            padding: 1rem 1.25rem;
            background: #f7f8fc;
            border-left: 4px solid #e5e7eb;
            border-radius: 0 0.5rem 0.5rem 0;
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.6;
          }
          .toc-block {
            background: #f0f4ff;
            border: 1px solid #c5d3f0;
            border-left: 4px solid var(--color-accent, #f97316);
            border-radius: 0.5rem;
            padding: 1.25rem 1.5rem;
            margin: 2rem 0;
          }
          .toc-block h2 {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #6b7280;
            margin: 0 0 0.75rem 0;
            border: none;
            padding: 0;
          }
          .toc-block nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .toc-block nav ul li {
            font-size: 0.9rem;
            counter-increment: toc;
          }
          .toc-block nav ul li a {
            color: #374151;
            text-decoration: none;
            font-weight: 500;
          }
          .toc-block nav ul li a:hover {
            color: var(--color-accent, #f97316);
          }
        `}</style>

        {/* Bottom navigation */}
        <div className="mt-20 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all duration-200 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            All financial articles
          </Link>
        </div>
      </article>
    </div>
  );
}