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

// Dynamic SEO metadata for each blog post
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found" };

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

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  // JSON-LD structured data for Google rich results + AI engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 155),
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "BlogSystem",
    },
    publisher: {
      "@type": "Organization",
      name: "BlogSystem",
    },
  };

  // Split content into blocks (headings + paragraphs)
  const blocks = post.content
    .split(/\n\n+/)
    .filter((b: string) => b.trim());

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      {/* JSON-LD for SEO + GEO (AI engines like ChatGPT read this) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        &larr; Back to blog
      </Link>

      <article className="mt-8">
        <time className="text-sm text-muted">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {/* H1 — primary SEO signal */}
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Intro answer — optimized for featured snippets (AEO) */}
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <hr className="my-8 border-border" />

        {/* Structured content with semantic paragraphs */}
        <div className="space-y-6 text-base leading-relaxed">
          {blocks.map((block: string, i: number) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="text-2xl font-bold mt-10 mb-2">
                {block.replace("## ", "")}
              </h2>
            ) : block.startsWith("Q: ") ? (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="font-semibold">{block.split("\n")[0]}</p>
                <p className="mt-2 text-muted">
                  {block.split("\n").slice(1).join(" ").replace(/^A:\s*/, "")}
                </p>
              </div>
            ) : (
              <p key={i}>{block}</p>
            )
          )}
        </div>
      </article>
    </section>
  );
}
