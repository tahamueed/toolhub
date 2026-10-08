"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";
import { tools as allTools } from "@/lib/tools";
import type { CategoryId } from "@/lib/categories";

type SortKey = "popular" | "az";

export function ToolsExplorer({ initialCategory }: { initialCategory?: CategoryId }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">(
    initialCategory ?? "all"
  );
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allTools.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) =>
      sort === "az" ? a.name.localeCompare(b.name) : b.popularity - a.popularity
    );

    return list;
  }, [query, activeCategory, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, description, or keyword\u2026"
            className="pl-9"
            aria-label="Search tools"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-border bg-panel px-2.5 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="popular">Most popular</option>
            <option value="az">A&ndash;Z</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            activeCategory === "all"
              ? "border-accent bg-accent text-accent-ink"
              : "border-border text-ink-muted hover:text-ink"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeCategory === c.id
                ? "border-accent bg-accent text-accent-ink"
                : "border-border text-ink-muted hover:text-ink"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium text-ink">No tools match your search</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different keyword or category.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
