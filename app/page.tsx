import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-accent/10 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Financial Insights
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.1] text-heading">
              Smart financial insights,
              <br />
              <span className="text-gradient">powered by AI.</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              Expert analysis on personal finance, investing, markets, and wealth building. AI-generated, SEO-optimized content you can trust.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-semibold hover:bg-accent-dark shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 transition-all duration-200"
              >
                Read Articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "AI", label: "Generated Content" },
              { value: "SEO", label: "Optimized Posts" },
              { value: "24/7", label: "Always Available" },
              { value: "Fast", label: "Instant Publishing" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-heading">
              Why read our blog?
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto">
              We combine artificial intelligence with financial expertise to deliver content that matters.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Analysis",
                desc: "Every article uses AI-assisted research to deliver clear, relevant financial insights on saving, investing, markets, and long-term wealth building.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                ),
              },
              {
                title: "SEO & AEO Ready",
                desc: "Each post is built around finance-focused topics and optimized for search engines and AI assistants, making money guidance easier to discover.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                ),
              },
              {
                title: "Actionable Guides",
                desc: "More than theory, every post includes practical financial guidance you can apply to budgeting, debt reduction, investing, and future planning.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-white p-8 hover:shadow-lg hover:shadow-black/[0.04] hover:border-accent/20 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/10 text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-heading mb-4">
            Stay ahead of the market
          </h2>
          <p className="text-muted mb-10 max-w-md mx-auto">
            Explore our latest financial articles, investment guides, and expert analysis.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-dark shadow-lg shadow-accent/20 transition-all duration-200"
          >
            Browse All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
