"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Input, Label } from "@/components/ui/field";

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => generate(5));

  function generate(n: number) {
    return Array.from({ length: n }, () => crypto.randomUUID());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="count">Quantity</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            className="w-28"
          />
        </div>
        <Button type="button" onClick={() => setUuids(generate(count))}>
          <RefreshCw className="size-4" />
          Generate
        </Button>
        <CopyButton value={uuids.join("\n")} label="Copy all" className="ml-auto" />
      </div>

      <ul className="scrollbar-thin max-h-80 space-y-1.5 overflow-y-auto rounded-md border border-border bg-panel-raised p-3">
        {uuids.map((id, i) => (
          <li key={`${id}-${i}`} className="flex items-center justify-between gap-3 font-mono text-sm text-ink">
            <span className="truncate">{id}</span>
            <CopyButton value={id} label="" className="shrink-0 px-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
