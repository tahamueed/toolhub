import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, getToolBySlug } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import { ToolShell } from "@/components/tool-shell";
import { ToolLoader } from "@/components/tool-loader";
import { siteConfig } from "@/lib/utils";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const url = `${siteConfig.url}/tools/${tool.slug}`;
  return {
    title: tool.name,
    description: tool.shortDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} \u2014 ${siteConfig.name}`,
      description: tool.shortDescription,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tool.name} \u2014 ${siteConfig.name}`,
      description: tool.shortDescription,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const url = `${siteConfig.url}/tools/${tool.slug}`;

  const softwareAppLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    description: tool.description,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${siteConfig.url}/tools` },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category.name,
              item: `${siteConfig.url}/categories/${category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 4 : 3,
        name: tool.name,
        item: url,
      },
    ],
  };

  const faqLd =
    tool.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <ToolShell tool={tool}>
        <ToolLoader component={tool.component} />
      </ToolShell>
    </>
  );
}
