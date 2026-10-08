import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "ToolHub",
  tagline: "Powerful online tools, all in one place",
  description:
    "Free browser-based tools for developers, writers, and everyday tasks. Fast, private, and no installs required.",
  // REQUIRED BEFORE DEPLOY: replace with your real production domain (no
  // trailing slash). This feeds canonical URLs, Open Graph tags, JSON-LD,
  // and the sitemap — leaving it as-is will break social share previews
  // and confuse search engines about the site's real address.
  url: "https://yourdomain.com",
  contactEmail: "taha.mueed.link@gmail.com",
  contactPhone: "+92 328 6424902",
  developerName: "Taha Mueed",
};
