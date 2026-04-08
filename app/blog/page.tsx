import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest articles, guides, and insights on our AI-powered financial blog.",
};

const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    return prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["blog-posts"],
  { revalidate: 60 }
);

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function BlogListPage() {
  const posts = (await getPosts()) as Post[];
  const [featured, ...rest] = posts;

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading">
            Financial Blog
          </h1>
          <p className="mt-3 text-lg text-muted max-w-xl">
            Expert analysis, market insights, and actionable financial guides.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {posts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl bg-surface border border-border">
            <p className="text-muted text-lg">No posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="space-y-14">
            {/* Featured post */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-black/[0.05] hover:border-accent/25 transition-all duration-300"
              >
                <div className="bg-surface/50 p-8 sm:p-10 lg:p-14">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wide">
                      Latest
                    </span>
                    <span className="text-sm text-muted">{formatDate(featured.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-sm text-muted">{readingTime(featured.content)}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-heading group-hover:text-accent transition-colors duration-200">
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="mt-4 text-muted leading-relaxed max-w-2xl text-lg line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="mt-8 inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    Read full article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post: Post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-white p-7 hover:shadow-lg hover:shadow-black/[0.04] hover:border-accent/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted mb-4">
                      <time>{formatDate(post.createdAt)}</time>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{readingTime(post.content)}</span>
                    </div>

                    <h2 className="text-xl font-bold leading-snug text-heading group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-6 inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                      Read more
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
