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
    "Read the latest articles, guides, and insights on our AI-powered blog.",
};

const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    return prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["blog-posts"],
  { revalidate: 60 } // refresh cache every 60 seconds
);

export default async function BlogListPage() {
  const posts = (await getPosts()) as Post[];

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted">Thoughts, guides, and insights.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-border bg-card p-6 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all"
            >
              <time className="text-xs text-muted">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-4 inline-block text-sm text-accent font-medium">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
