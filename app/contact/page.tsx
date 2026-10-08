import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Contact</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
        Found a bug, or want to request a tool? Send a message below, or reach out directly.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-md border border-border bg-panel-raised p-4 sm:flex-row sm:items-center sm:gap-6">
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="flex items-center gap-2 text-sm text-ink transition-colors hover:text-accent"
        >
          <Mail className="size-4 text-ink-muted" />
          {siteConfig.contactEmail}
        </a>
        <a
          href={`tel:${siteConfig.contactPhone.replace(/\s+/g, "")}`}
          className="flex items-center gap-2 text-sm text-ink transition-colors hover:text-accent"
        >
          <Phone className="size-4 text-ink-muted" />
          {siteConfig.contactPhone}
        </a>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
