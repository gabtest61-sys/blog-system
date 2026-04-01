import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
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
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        )}

        <hr className="my-8 border-border" />

        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>
    </section>
  );
}
