import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogPages = posts.map((post: { slug: string; updatedAt: Date }) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    ...blogPages,
  ];
}
