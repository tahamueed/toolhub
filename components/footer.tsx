import Link from "next/link";
import { Logo } from "@/components/logo";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <Logo className="size-5 text-accent" />
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">{siteConfig.description}</p>
            <div className="mt-4 space-y-1.5">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="block text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {siteConfig.contactEmail}
              </a>
              <a
                href={`tel:${siteConfig.contactPhone.replace(/\s+/g, "")}`}
                className="block text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {siteConfig.contactPhone}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Site
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. Built by {siteConfig.developerName}.
          </p>
          <p>Every tool runs locally in your browser &mdash; no files ever leave your device.</p>
        </div>
      </div>
    </footer>
  );
}
