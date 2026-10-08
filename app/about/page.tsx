import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { tools } from "@/lib/tools";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} \u2014 what it is, how it works, and why the tools run in your browser.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        About {siteConfig.name}
      </h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted sm:text-base">
        <p>
          {siteConfig.name} is a collection of {tools.length} small, focused tools for tasks people
          run into every day: formatting JSON, resizing an image, converting units, checking a
          date difference. Instead of installing software or digging through settings menus, you
          open a tab and get the answer.
        </p>
        <p>
          Every tool here is built to do one job well. There are no accounts, no paywalls, and no
          dark patterns steering you toward a subscription. Tools marked <strong className="text-ink">Runs locally</strong> process
          your input entirely in your browser using standard web APIs like Canvas and Web Crypto
          &mdash; the data behind them is never sent to a server.
        </p>
        <p>
          The site is organized by category so related tools stay easy to find, and the underlying
          architecture is built so new tools can be added without reworking the rest of the site.
        </p>
      </div>

      <div className="mt-10 rounded-md border border-border bg-panel-raised p-5">
        <h2 className="font-display text-base font-semibold text-ink">Built by</h2>
        <p className="mt-1 text-sm font-medium text-ink">{siteConfig.developerName}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
          >
            <Mail className="size-4" />
            {siteConfig.contactEmail}
          </a>
          <a
            href={`tel:${siteConfig.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
          >
            <Phone className="size-4" />
            {siteConfig.contactPhone}
          </a>
        </div>
      </div>

      <Link href="/tools" className={buttonVariants({ variant: "primary", size: "md", className: "mt-8" })}>
        Browse all tools
      </Link>
    </div>
  );
}
