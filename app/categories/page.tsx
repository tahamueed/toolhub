import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse ToolHub's tools organized by category.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Categories</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Every tool belongs to one focused category, so you can find what you need quickly.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
