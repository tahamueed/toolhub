"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";

type Algo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
const algos: Algo[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

async function hash(text: string, algo: Algo) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [computedHash, setComputedHash] = useState("");

  useEffect(() => {
    if (!input) return;
    let active = true;
    hash(input, algo).then((h) => {
      if (active) setComputedHash(h);
    });
    return () => {
      active = false;
    };
  }, [input, algo]);

  const output = input ? computedHash : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap rounded-md border border-border p-0.5">
          {algos.map((a) => (
            <Button key={a} type="button" size="sm" variant={algo === a ? "primary" : "ghost"} onClick={() => setAlgo(a)}>
              {a}
            </Button>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setInput("")} className="ml-auto">
          Clear
        </Button>
      </div>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash\u2026"
        aria-label="Text to hash"
        className="min-h-32"
      />
      <div>
        <div className="flex items-center justify-between rounded-md border border-border bg-panel-raised px-3 py-2.5">
          <code className="scrollbar-thin overflow-x-auto whitespace-nowrap font-mono text-sm text-ink">
            {output || "Hash appears here"}
          </code>
        </div>
        <div className="mt-2 flex justify-end">
          <CopyButton value={output} />
        </div>
      </div>
    </div>
  );
}
