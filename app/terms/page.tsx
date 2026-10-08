import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for using ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Using the site</h2>
          <p className="mt-2">
            {siteConfig.name} provides free, browser-based tools &ldquo;as is,&rdquo; without
            warranty of any kind. You&rsquo;re responsible for verifying that results (conversions,
            calculations, formatted output, and so on) are accurate enough for your use case before
            relying on them.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Acceptable use</h2>
          <p className="mt-2">
            Don&rsquo;t use this site to process content you don&rsquo;t have the right to process,
            or to attempt to disrupt, reverse engineer, or overload the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">No liability</h2>
          <p className="mt-2">
            {siteConfig.name} is not liable for any loss or damage arising from use of the tools on
            this site, including data loss from client-side processing.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Changes</h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continued use of the site after a change
            means you accept the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
