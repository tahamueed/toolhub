"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy",
  ...props
}: { value: string; label?: string } & Omit<ButtonProps, "onClick">) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable or blocked; fail silently in UI.
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleCopy} disabled={!value} {...props}>
      {copied ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
