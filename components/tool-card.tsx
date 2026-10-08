import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import { CategoryIcon } from "@/components/category-icon";

export function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between gap-4 rounded-md border border-border bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-panel-raised text-accent">
            <CategoryIcon id={tool.category} className="size-4" />
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <h3 className="mt-3 font-display text-base font-semibold text-ink">{tool.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{tool.shortDescription}</p>
      </div>
      {category && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {category.name}
        </span>
      )}
    </Link>
  );
}
