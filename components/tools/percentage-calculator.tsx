"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

type Mode = "of" | "isWhatPercent" | "change";

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("10");
  const [b, setB] = useState("50");

  const result = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;

    if (mode === "of") return { value: (x / 100) * y, suffix: "" };
    if (mode === "isWhatPercent") return { value: y === 0 ? NaN : (x / y) * 100, suffix: "%" };
    return { value: x === 0 ? NaN : ((y - x) / Math.abs(x)) * 100, suffix: "%" };
  }, [mode, a, b]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={mode === "of" ? "primary" : "secondary"} onClick={() => setMode("of")}>
          X% of Y
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "isWhatPercent" ? "primary" : "secondary"}
          onClick={() => setMode("isWhatPercent")}
        >
          X is what % of Y
        </Button>
        <Button type="button" size="sm" variant={mode === "change" ? "primary" : "secondary"} onClick={() => setMode("change")}>
          % change from X to Y
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="a">{mode === "of" ? "X (%)" : "X"}</Label>
          <Input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-32" />
        </div>
        <div>
          <Label htmlFor="b">Y</Label>
          <Input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-32" />
        </div>
      </div>

      <div className="rounded-md border border-border bg-panel-raised p-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">
          {result && !Number.isNaN(result.value)
            ? `${result.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}${result.suffix}`
            : "\u2014"}
        </p>
      </div>
    </div>
  );
}
