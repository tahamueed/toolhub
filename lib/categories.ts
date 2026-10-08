export type CategoryId =
  | "developer"
  | "text"
  | "converter"
  | "calculator"
  | "image"
  | "document"
  | "study"
  | "writing";

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer",
    tagline: "Formatters, encoders, and decoders for daily dev work",
    description:
      "JSON, Base64, hashing, tokens, and other everyday utilities for building and debugging software.",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    tagline: "Clean, count, and reshape text in seconds",
    description:
      "Word counts, case conversion, de-duplication, and other plain-text utilities.",
  },
  {
    id: "writing",
    name: "Writing Tools",
    slug: "writing",
    tagline: "Naturalize, refine, and polish academic and professional text",
    description:
      "Tools for students, researchers, and writers to enhance sentence flow, natural tone, and clarity while preserving core meaning.",
  },
  {
    id: "converter",
    name: "Converter Tools",
    slug: "converter",
    tagline: "Convert units without leaving the browser",
    description:
      "Length, weight, temperature, and data-storage conversions with instant results.",
  },
  {
    id: "calculator",
    name: "Calculator Tools",
    slug: "calculator",
    tagline: "Quick calculations for everyday numbers",
    description:
      "Percentages, ages, BMI, and date differences, calculated instantly as you type.",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    tagline: "Resize, compress, and convert images locally",
    description:
      "Image processing that runs entirely on your device using the canvas API — files are never uploaded.",
  },
  {
    id: "document",
    name: "Document Tools",
    slug: "document",
    tagline: "Convert, merge, and split PDFs and Word documents",
    description:
      "PDF and Word utilities for study and everyday paperwork — merging, splitting, and converting files entirely in your browser.",
  },
  {
    id: "study",
    name: "Study Tools",
    slug: "study",
    tagline: "Plan, calculate, and stay on top of coursework",
    description:
      "Calculators and planners built for students — GPA, grades, attendance, exam countdowns, and focused study sessions.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
