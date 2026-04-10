import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlogSystem — AI-Powered Blog Platform",
    template: "%s | BlogSystem",
  },
  description:
    "Financial blog platform delivering expert insights, guides, and articles optimized for search engines and AI assistants.",
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "BlogSystem",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3249757315042445"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-foreground">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-white font-bold text-base tracking-tight">
                B
              </span>
              <span className="text-xl font-bold tracking-tight text-heading">
                Blog<span className="text-accent">System</span>
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <div className="hidden sm:flex items-center gap-8 text-[15px] font-medium">
                <Link
                  href="/"
                  className="text-muted hover:text-heading transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="text-muted hover:text-heading transition-colors duration-200"
                >
                  Blogs
                </Link>
              </div>
              <Link
                href="/blog"
                className="px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors duration-200"
              >
                Start Reading
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Brand */}
              <div>
                <Link href="/" className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white font-bold text-sm">
                    B
                  </span>
                  <span className="text-lg font-bold tracking-tight text-heading">
                    Blog<span className="text-accent">System</span>
                  </span>
                </Link>
                <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
                  Expert financial insights and guides powered by AI. Helping you make smarter decisions.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                  Quick Links
                </h4>
                <div className="flex flex-col gap-3 text-sm">
                  <Link href="/" className="text-foreground/70 hover:text-accent transition-colors">
                    Home
                  </Link>
                  <Link href="/blog" className="text-foreground/70 hover:text-accent transition-colors">
                    All Articles
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                  About
                </h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  AI-powered financial blog delivering expert analysis, market insights, and actionable guides.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}



