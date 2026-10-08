import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools-explorer";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse every tool on ToolHub \u2014 developer utilities, text tools, converters, calculators, and image tools, all free and browser-based.",
  alternates: { canonical: "/tools" },
};

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">All tools</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Every tool on ToolHub, searchable and filterable by category.
      </p>
      <div className="mt-8">
        <ToolsExplorer />
      </div>
    </div>
  );
}
