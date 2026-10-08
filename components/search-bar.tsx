"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchTools } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  placeholder = "Search tools\u2026",
  autoFocus,
}: {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listId = useId();

  const results = useMemo(() => searchTools(query).slice(0, 8), [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/tools/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2.5 transition-colors focus-within:border-accent">
        <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-ink-muted hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && query && (
        <ul
          id={listId}
          role="listbox"
          className="scrollbar-thin absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-panel shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-muted">
              No tools match &ldquo;{query}&rdquo;.
            </li>
          ) : (
            results.map((tool, i) => (
              <li key={tool.id} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(tool.slug)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors",
                    i === activeIndex ? "bg-panel-raised" : ""
                  )}
                >
                  <span className="text-sm font-medium text-ink">{tool.name}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {tool.shortDescription}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
