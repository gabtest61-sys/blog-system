import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-24 text-center">
      <div className="inline-block mb-6 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
        AI-Powered Blogging
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
        Your ideas, amplified<br />
        <span className="text-accent">by AI.</span>
      </h1>
      <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
        Generate, publish, and optimize blog content with artificial intelligence.
        SEO-ready from day one.
      </p>
      <div className="mt-10 flex gap-4 justify-center">
        <Link
          href="/blog"
          className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-colors"
        >
          Read the Blog
        </Link>
      </div>
    </section>
  );
}
