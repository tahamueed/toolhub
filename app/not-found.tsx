import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="font-mono text-sm uppercase tracking-wider text-ink-muted">Error 404</span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
        The page you&rsquo;re looking for may have moved, or the URL might be off. Try searching for
        a tool instead.
      </p>
      <div className="mt-6 w-full max-w-sm">
        <SearchBar />
      </div>
      <Link href="/" className={buttonVariants({ variant: "outline", size: "md", className: "mt-6" })}>
        Back to home
      </Link>
    </div>
  );
}
