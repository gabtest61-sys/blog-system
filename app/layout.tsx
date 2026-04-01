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
  title: "BlogSystem",
  description: "AI-powered blog platform",
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
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
          <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Blog<span className="text-accent">System</span>
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-muted hover:text-foreground transition-colors">
                Blog
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} BlogSystem. Built with Next.js &amp; AI.
          </div>
        </footer>
      </body>
    </html>
  );
}
