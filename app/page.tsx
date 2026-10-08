import Link from "next/link";
import { ArrowRight, Lock, Gauge, Smartphone, Ban } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ToolCard } from "@/components/tool-card";
import { CategoryCard } from "@/components/category-card";
import { buttonVariants } from "@/components/ui/button";
import { getPopularTools, tools } from "@/lib/tools";
import { categories } from "@/lib/categories";

const benefits = [
  {
    icon: Lock,
    title: "Privacy-focused",
    description:
      "Every tool listed as local-only processes your data in your browser \u2014 nothing is uploaded to a server.",
  },
  {
    icon: Gauge,
    title: "Fast by default",
    description: "No sign-up, no page reloads. Results update instantly as you type.",
  },
  {
    icon: Ban,
    title: "No installs",
    description: "Everything runs in the browser tab you already have open.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Every tool is fully usable on desktop, tablet, and mobile.",
  },
];

const faqs = [
  {
    question: "Are these tools really free?",
    answer:
      "Yes. Every tool on this site is free to use, with no account or sign-up required.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Tools marked local-only process everything in your browser \u2014 files and text never leave your device. Each tool page states clearly how it handles your data.",
  },
  {
    question: "Can I use these tools on mobile?",
    answer:
      "Yes. The entire site, including every tool workspace, is designed to work on phones and tablets.",
  },
  {
    question: "How often are new tools added?",
    answer:
      "New tools are added regularly. If there's a specific tool you need, reach out from the Contact page.",
  },
];

export default function HomePage() {
  const popularTools = getPopularTools(6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              <span className="size-1.5 rounded-full bg-teal" />
              {tools.length} tools &middot; runs in your browser
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Powerful online tools,
              <br />
              all in one place.
            </h1>
            <p className="mt-5 text-balance text-base leading-relaxed text-ink-muted sm:text-lg">
              Format JSON, resize images, convert units, and more &mdash; instantly, in
              your browser, with no installs and no sign-up.
            </p>
            <div className="mt-8">
              <SearchBar autoFocus={false} placeholder="Try &ldquo;json&rdquo;, &ldquo;resize image&rdquo;, &ldquo;bmi&rdquo;\u2026" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/tools" className={buttonVariants({ variant: "primary", size: "md" })}>
                Browse all tools <ArrowRight className="size-4" />
              </Link>
              <Link href="/categories" className={buttonVariants({ variant: "outline", size: "md" })}>
                View categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular tools */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Popular tools</h2>
            <p className="mt-1 text-sm text-ink-muted">The tools people reach for most.</p>
          </div>
          <Link
            href="/tools"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong sm:flex"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        <Link
          href="/tools"
          className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:text-accent-strong sm:hidden"
        >
          View all tools <ArrowRight className="size-3.5" />
        </Link>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-panel-raised/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Browse by category</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Every tool is organized into a focused, easy-to-scan category.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Why use */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Why use these tools</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title}>
              <span className="flex size-10 items-center justify-center rounded-md border border-border bg-panel text-accent">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-panel-raised/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-border border-t border-border">
            {faqs.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
                  {f.question}
                  <span className="shrink-0 text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
