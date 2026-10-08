import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Tool } from "@/lib/tools";
import { getRelatedTools } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { CategoryIcon } from "@/components/category-icon";

export function ToolShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>
        {category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/categories/${category.slug}`} className="hover:text-ink">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-ink">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-accent">
            <CategoryIcon id={tool.category} className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
              {tool.description}
            </p>
          </div>
        </div>
        {tool.localOnly && (
          <span className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-teal">
            <ShieldCheck className="size-3.5" />
            Runs locally
          </span>
        )}
      </div>

      {/* Workspace */}
      <div className="mt-8 rounded-md border border-border bg-panel p-4 sm:p-6">{children}</div>

      {/* Instructions */}
      {tool.instructions.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">How to use this tool</h2>
          <ol className="mt-4 space-y-2.5">
            {tool.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11px] text-ink-muted">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* FAQ */}
      {tool.faqs.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-border border-t border-border">
            {tool.faqs.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
                  {f.question}
                  <span className="shrink-0 text-ink-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Related tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
