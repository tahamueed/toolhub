"use client";

import { useMemo, useState } from "react";
import { Input, Label, Textarea } from "@/components/ui/field";

const FLAG_OPTIONS = [
  { flag: "g", label: "Global" },
  { flag: "i", label: "Case-insensitive" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dot matches newline" },
] as const;

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [text, setText] = useState("");

  function toggleFlag(f: string) {
    setFlags((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  const { error, matches, highlighted } = useMemo(() => {
    if (!pattern) return { error: "", matches: [] as RegExpMatchArray[], highlighted: text };
    try {
      const re = new RegExp(pattern, flags.join(""));
      const found: RegExpMatchArray[] = [];

      if (!text) return { error: "", matches: found, highlighted: "" };

      if (flags.includes("g")) {
        for (const m of text.matchAll(re)) {
          found.push(m);
          if (found.length > 500) break;
        }
      } else {
        const m = text.match(re);
        if (m) found.push(m);
      }

      let cursor = 0;
      const pieces: string[] = [];
      for (const m of found) {
        const start = m.index ?? 0;
        const end = start + m[0].length;
        if (start < cursor) continue;
        pieces.push(escapeHtml(text.slice(cursor, start)));
        pieces.push(`<mark>${escapeHtml(m[0] || " ")}</mark>`);
        cursor = end;
      }
      pieces.push(escapeHtml(text.slice(cursor)));

      return { error: "", matches: found, highlighted: pieces.join("") };
    } catch (e) {
      return { error: (e as Error).message, matches: [], highlighted: text };
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="pattern">Pattern</Label>
          <Input
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-z]+@[a-z]+\.[a-z]{2,}"
            className="font-mono"
          />
        </div>
        <div className="flex flex-wrap gap-3 pb-0.5">
          {FLAG_OPTIONS.map((f) => (
            <label key={f.flag} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={flags.includes(f.flag)}
                onChange={() => toggleFlag(f.flag)}
                className="accent-accent"
              />
              {f.label} ({f.flag})
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}

      <div>
        <Label htmlFor="sample">Sample text</Label>
        <Textarea
          id="sample"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to test your pattern against\u2026"
          className="min-h-32"
        />
      </div>

      <div>
        <Label>Matches ({matches.length})</Label>
        <div
          className="scrollbar-thin min-h-24 max-h-64 overflow-auto rounded-md border border-border bg-panel-raised p-3 font-mono text-[13px] leading-relaxed text-ink [&_mark]:rounded-sm [&_mark]:bg-accent/30 [&_mark]:text-ink [&_mark]:px-0.5"
          dangerouslySetInnerHTML={{ __html: highlighted || "\u2014" }}
        />
      </div>

      {matches.some((m) => m.length > 1) && (
        <div>
          <Label>Capture groups</Label>
          <ul className="space-y-1 font-mono text-xs text-ink-muted">
            {matches.map((m, i) =>
              m.slice(1).map((g, gi) => (
                <li key={`${i}-${gi}`}>
                  Match {i + 1}, group {gi + 1}: <span className="text-ink">{g ?? "(no match)"}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
