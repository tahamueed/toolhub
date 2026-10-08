import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">How tools process your data</h2>
          <p className="mt-2">
            Tools labeled &ldquo;Runs locally&rdquo; on their page process text and files entirely
            in your browser, using standard web APIs (such as Canvas and Web Crypto). That data is
            never transmitted to {siteConfig.name}&rsquo;s servers or any third party as part of
            using the tool.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Information we collect</h2>
          <p className="mt-2">
            {siteConfig.name} does not require an account to use any tool. If you use the contact
            form, the information you enter (name, email, and message) is sent to our email address
            via your own email application &mdash; it is not stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Cookies and analytics</h2>
          <p className="mt-2">
            This site may use privacy-respecting, aggregate analytics to understand which tools are
            useful, without tracking you individually across other sites.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Changes to this policy</h2>
          <p className="mt-2">
            If this policy changes, the updated version will be posted on this page with a new
            &ldquo;last updated&rdquo; date.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent through the <a href="/contact" className="text-accent hover:text-accent-strong">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
