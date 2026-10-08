import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { getToolBySlug } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";
import { siteConfig } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedTools = post.relatedToolSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const url = `${siteConfig.url}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/blog" className="hover:text-ink">
          Blog
        </Link>
      </nav>

      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
        {formatDate(post.publishedAt)} &middot; {post.author}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">{post.description}</p>

      <article className="mt-8 space-y-8">
        {post.content.map((block, i) => (
          <div key={i}>
            {block.heading && (
              <h2 className="mb-3 font-display text-xl font-semibold text-ink">{block.heading}</h2>
            )}
            {block.paragraphs.map((p, pi) => (
              <p key={pi} className="mb-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                {p}
              </p>
            ))}
          </div>
        ))}
      </article>

      {relatedTools.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-lg font-semibold text-ink">Try the tool</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
