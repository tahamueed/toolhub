"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

export function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimLines, setTrimLines] = useState(true);

  const { output, removedCount } = useMemo(() => {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const result: string[] = [];
    let removed = 0;

    for (const rawLine of lines) {
      const line = trimLines ? rawLine.trim() : rawLine;
      const key = ignoreCase ? line.toLowerCase() : line;
      if (seen.has(key)) {
        removed += 1;
        continue;
      }
      seen.add(key);
      result.push(line);
    }

    return { output: result.join("\n"), removedCount: removed };
  }, [text, ignoreCase, trimLines]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs text-ink-muted">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="accent-accent" />
          Ignore case
        </label>
        <label className="flex items-center gap-1.5 text-xs text-ink-muted">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="accent-accent" />
          Trim whitespace
        </label>
        <Button type="button" variant="outline" size="sm" onClick={() => setText("")} className="ml-auto">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"apple\nbanana\napple\ncherry"}
          aria-label="Input lines"
          className="min-h-56 font-mono text-[13px]"
        />
        <div>
          <Textarea value={output} readOnly aria-label="Deduplicated output" className="min-h-56 bg-panel-raised font-mono text-[13px]" />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-ink-muted">
              {removedCount > 0 ? `${removedCount} duplicate line${removedCount === 1 ? "" : "s"} removed` : "No duplicates yet"}
            </span>
            <CopyButton value={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
