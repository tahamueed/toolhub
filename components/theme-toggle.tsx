"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes only knows the real theme after mounting on the client, so
  // this guards against a server/client mismatch. See next-themes docs.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid a hydration mismatch; recommended by next-themes.
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9 rounded-md border border-border" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-9 items-center justify-center rounded-md border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
