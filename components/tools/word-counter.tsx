"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g)?.length ?? (trimmed ? 1 : 0)) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}|\n/).filter((p) => p.trim()).length : 0;
    const readingMinutes = words ? Math.max(1, Math.round(words / 200)) : 0;

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
  }, [text]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: stats.readingMinutes ? `${stats.readingMinutes} min` : "0 min" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => setText("")}>
          Clear
        </Button>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text\u2026"
        aria-label="Text input"
        className="min-h-56 font-sans text-sm"
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-border bg-panel-raised p-3">
            <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{item.label}</dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
