"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");

  const result = useMemo(() => {
    const n = Number(timestamp);
    if (!timestamp.trim() || Number.isNaN(n)) return null;
    const ms = unit === "seconds" ? n * 1000 : n;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return null;
    return {
      local: date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" }),
      utc: date.toUTCString(),
      iso: date.toISOString(),
    };
  }, [timestamp, unit]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-48">
          <Label htmlFor="ts">Unix timestamp</Label>
          <Input id="ts" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as "seconds" | "milliseconds")}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="seconds">Seconds</option>
            <option value="milliseconds">Milliseconds</option>
          </select>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setTimestamp(unit === "seconds" ? Math.floor(Date.now() / 1000).toString() : Date.now().toString())
          }
        >
          Now
        </Button>
      </div>

      {result ? (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              ["Local time", result.local],
              ["UTC", result.utc],
              ["ISO 8601", result.iso],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-panel-raised p-3">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">{label}</dt>
              <dd className="mt-1 flex items-center justify-between gap-2 text-sm text-ink">
                <span className="truncate">{value}</span>
                <CopyButton value={value} label="" className="shrink-0 px-2" />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-ink-muted">Enter a valid numeric timestamp.</p>
      )}
    </div>
  );
}
