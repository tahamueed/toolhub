import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { ToolsExplorer } from "@/components/tools-explorer";
import { siteConfig } from "@/lib/utils";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${siteConfig.url}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${siteConfig.url}/categories/${category.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
        {category.description}
      </p>
      <div className="mt-8">
        <ToolsExplorer initialCategory={category.id} />
      </div>
    </div>
  );
}
