"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

type Mode = "format" | "minify";

function locateError(input: string, message: string): string {
  const match = message.match(/position (\d+)/i);
  if (!match) return message;
  const pos = Number(match[1]);
  const upToError = input.slice(0, pos);
  const line = upToError.split("\n").length;
  const column = pos - upToError.lastIndexOf("\n");
  return `${message} (line ${line}, column ${column})`;
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("format");
  const [indent, setIndent] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      const formatted = mode === "format" ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);
      return { output: formatted, error: "" };
    } catch (e) {
      return { output: "", error: locateError(input, (e as Error).message) };
    }
  }, [input, mode, indent]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-border p-0.5">
          <Button
            type="button"
            size="sm"
            variant={mode === "format" ? "primary" : "ghost"}
            onClick={() => setMode("format")}
          >
            Format
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "minify" ? "primary" : "ghost"}
            onClick={() => setMode("minify")}
          >
            Minify
          </Button>
        </div>
        {mode === "format" && (
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <label htmlFor="indent">Indent</label>
            <select
              id="indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-md border border-border bg-panel px-2 py-1 text-ink focus:border-accent focus:outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Tab</option>
            </select>
          </div>
        )}
        <Button type="button" variant="outline" size="sm" onClick={() => setInput("")} className="ml-auto">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "paste your JSON here"}'
            aria-label="JSON input"
            className="min-h-64"
          />
          {error && (
            <p role="alert" className="mt-2 text-xs text-danger">
              {error}
            </p>
          )}
        </div>
        <div>
          <Textarea
            value={output}
            readOnly
            aria-label="Formatted JSON output"
            placeholder="Result appears here"
            className="min-h-64 bg-panel-raised"
          />
          <div className="mt-2 flex justify-end">
            <CopyButton value={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
