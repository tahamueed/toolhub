import Link from "next/link";
import type { Category } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import { CategoryIcon } from "@/components/category-icon";

export function CategoryCard({ category }: { category: Category }) {
  const count = getToolsByCategory(category.id).length;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col gap-4 rounded-md border border-border bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-md border border-border bg-panel-raised text-accent">
        <CategoryIcon id={category.id} className="size-5" />
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{category.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{category.tagline}</p>
      </div>
      <span className="mt-auto font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        {count} {count === 1 ? "tool" : "tools"}
      </span>
    </Link>
  );
}
