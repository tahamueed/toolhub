"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

const converters: Record<string, (s: string) => string> = {
  UPPERCASE: (s) => s.toUpperCase(),
  lowercase: (s) => s.toLowerCase(),
  "Title Case": (s) =>
    s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
  "Sentence case": (s) =>
    s
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  camelCase: (s) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  "snake_case": (s) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
};

export function CaseConverter() {
  const [text, setText] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const output = active ? converters[active](text) : "";

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setActive(null);
        }}
        placeholder="Paste or type text\u2026"
        aria-label="Text input"
        className="min-h-32 font-sans text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {Object.keys(converters).map((key) => (
          <Button key={key} type="button" size="sm" variant={active === key ? "primary" : "secondary"} onClick={() => setActive(key)}>
            {key}
          </Button>
        ))}
      </div>
      {active && (
        <div>
          <Textarea value={output} readOnly aria-label="Converted output" className="min-h-32 bg-panel-raised font-sans text-sm" />
          <div className="mt-2 flex justify-end">
            <CopyButton value={output} />
          </div>
        </div>
      )}
    </div>
  );
}
