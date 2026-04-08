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

  const blocks = post.content
    .split(/\n\n+/)
    .filter((b: string) => b.trim());

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Financial article header */}
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

      {/* Financial article body */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="space-y-6 text-[17px] leading-[1.85] text-foreground/80">
          {blocks.map((block: string, i: number) =>
            block.startsWith("## ") ? (
              <h2
                key={i}
                className="text-2xl sm:text-3xl font-extrabold mt-14 mb-3 text-heading"
              >
                {block.replace("## ", "")}
              </h2>
            ) : block.startsWith("Q: ") ? (
              <div
                key={i}
                className="bg-surface border-l-4 border-accent rounded-r-xl p-6 my-10"
              >
                <p className="font-bold text-heading text-base">
                  {block.split("\n")[0]}
                </p>
                <p className="mt-3 text-muted leading-relaxed text-[15px]">
                  {block.split("\n").slice(1).join(" ").replace(/^A:\s*/, "")}
                </p>
              </div>
            ) : (
              <p key={i}>{block}</p>
            )
          )}
        </div>

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
