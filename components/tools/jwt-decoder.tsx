"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(segment.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function JwtDecoder() {
  const [input, setInput] = useState("");

  type Result =
    | { kind: "error"; error: string }
    | { kind: "decoded"; header: string; payload: string };

  const result: Result | null = useMemo(() => {
    const token = input.trim();
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2)
      return { kind: "error", error: "A JWT needs at least a header and payload segment." };
    try {
      const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
      return { kind: "decoded", header, payload };
    } catch {
      return { kind: "error", error: "Couldn't decode that token \u2014 check that it's a valid JWT." };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a JWT (eyJhbGciOi...)"
        aria-label="JWT input"
        className="min-h-24"
      />
      {result && result.kind === "error" && (
        <p role="alert" className="text-sm text-danger">
          {result.error}
        </p>
      )}
      {result && result.kind === "decoded" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Header</span>
              <CopyButton value={result.header} />
            </div>
            <pre className="scrollbar-thin max-h-64 overflow-auto rounded-md border border-border bg-panel-raised p-3 font-mono text-[13px] text-ink">
              {result.header}
            </pre>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Payload</span>
              <CopyButton value={result.payload} />
            </div>
            <pre className="scrollbar-thin max-h-64 overflow-auto rounded-md border border-border bg-panel-raised p-3 font-mono text-[13px] text-ink">
              {result.payload}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
