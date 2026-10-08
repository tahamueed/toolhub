import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSortedBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: `Guides and explainers from ${siteConfig.name} on formats, tools, and everyday technical questions.`,
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getSortedBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Blog</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Guides and explainers on the formats, standards, and everyday questions behind the tools on
        this site.
      </p>

      <div className="mt-10 divide-y divide-border border-t border-border">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-7 first:pt-0"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {formatDate(post.publishedAt)}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{post.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Read more <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
