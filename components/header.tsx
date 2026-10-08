"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <Logo className="size-6 text-accent" />
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Tools <ChevronDown className="size-3.5" />
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full w-64 rounded-md border border-border bg-panel p-2 shadow-lg">
                <Link
                  href="/tools"
                  className="block rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-panel-raised"
                >
                  All Tools
                </Link>
                <div className="my-1 h-px bg-border" />
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className="block rounded-sm px-3 py-2 text-sm text-ink-muted hover:bg-panel-raised hover:text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/categories"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Categories
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            About
          </Link>
        </nav>

        <div className="hidden flex-1 justify-end md:flex">
          <SearchBar className="max-w-xs" />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md border border-border text-ink md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-canvas px-4 pb-6 pt-4 md:hidden">
          <SearchBar className="mb-4" />
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            <Link
              href="/tools"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-panel-raised"
              onClick={() => setMobileOpen(false)}
            >
              All Tools
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="rounded-md px-3 py-2.5 text-sm text-ink-muted hover:bg-panel-raised hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <div className="my-1 h-px bg-border" />
            <Link
              href="/blog"
              className="rounded-md px-3 py-2.5 text-sm text-ink-muted hover:bg-panel-raised hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="rounded-md px-3 py-2.5 text-sm text-ink-muted hover:bg-panel-raised hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-md px-3 py-2.5 text-sm text-ink-muted hover:bg-panel-raised hover:text-ink"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
