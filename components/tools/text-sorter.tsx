"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

type SortMode = "az" | "za" | "numeric" | "length" | "shuffle";

const labels: Record<SortMode, string> = {
  az: "A \u2192 Z",
  za: "Z \u2192 A",
  numeric: "Numeric",
  length: "By length",
  shuffle: "Shuffle",
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function TextSorter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<SortMode>("az");
  const [shuffledOutput, setShuffledOutput] = useState("");

  const sortedOutput = useMemo(() => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    const sorted = [...lines];

    switch (mode) {
      case "az":
        sorted.sort((a, b) => a.localeCompare(b));
        break;
      case "za":
        sorted.sort((a, b) => b.localeCompare(a));
        break;
      case "numeric":
        sorted.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
        break;
      case "length":
        sorted.sort((a, b) => a.length - b.length);
        break;
    }

    return sorted.join("\n");
  }, [text, mode]);

  // Shuffling is inherently random, so it's triggered explicitly from the
  // button click handler (an event, not render) rather than computed inline.
  function handleShuffle() {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    setShuffledOutput(shuffle(lines).join("\n"));
    setMode("shuffle");
  }

  const output = mode === "shuffle" ? shuffledOutput : sortedOutput;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(labels) as SortMode[]).map((key) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={mode === key ? "primary" : "secondary"}
            onClick={() => (key === "shuffle" ? handleShuffle() : setMode(key))}
          >
            {labels[key]}
          </Button>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setText("")} className="ml-auto">
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"banana\napple\ncherry"}
          aria-label="Input lines"
          className="min-h-56 font-mono text-[13px]"
        />
        <div>
          <Textarea value={output} readOnly aria-label="Sorted output" className="min-h-56 bg-panel-raised font-mono text-[13px]" />
          <div className="mt-2 flex justify-end">
            <CopyButton value={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
