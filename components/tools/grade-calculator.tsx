"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

interface Boundary {
  grade: string;
  min: number;
}

const DEFAULT_BOUNDARIES: Boundary[] = [
  { grade: "A+", min: 90 },
  { grade: "A", min: 80 },
  { grade: "B", min: 70 },
  { grade: "C", min: 60 },
  { grade: "D", min: 50 },
  { grade: "F", min: 0 },
];

const PASS_THRESHOLD_GRADE = "D"; // anything at or above this boundary passes

export function GradeCalculator() {
  const [total, setTotal] = useState("100");
  const [obtained, setObtained] = useState("");
  const [boundaries, setBoundaries] = useState<Boundary[]>(DEFAULT_BOUNDARIES);

  const result = useMemo(() => {
    const t = parseFloat(total);
    const o = parseFloat(obtained);
    if (!t || Number.isNaN(o) || o < 0) return null;

    const percentage = (o / t) * 100;
    const sorted = [...boundaries].sort((a, b) => b.min - a.min);
    const matched = sorted.find((b) => percentage >= b.min) ?? sorted[sorted.length - 1];
    const passThreshold = boundaries.find((b) => b.grade === PASS_THRESHOLD_GRADE)?.min ?? 50;
    const passed = percentage >= passThreshold;

    return { percentage, grade: matched.grade, passed };
  }, [total, obtained, boundaries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="total-marks">Total marks</Label>
          <Input id="total-marks" type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} className="w-32" />
        </div>
        <div>
          <Label htmlFor="obtained-marks">Obtained marks</Label>
          <Input
            id="obtained-marks"
            type="number"
            min={0}
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <details className="rounded-md border border-border">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-ink">
          Edit grade boundaries
        </summary>
        <div className="space-y-2 border-t border-border p-3">
          {boundaries.map((b, i) => (
            <div key={b.grade} className="flex items-center gap-2">
              <span className="w-10 text-xs text-ink-muted">{b.grade}</span>
              <span className="text-xs text-ink-muted">{"\u2265"}</span>
              <Input
                type="number"
                value={b.min}
                onChange={(e) => {
                  const min = Number(e.target.value) || 0;
                  setBoundaries((prev) => prev.map((row, idx) => (idx === i ? { ...row, min } : row)));
                }}
                className="h-8 w-24 text-sm"
              />
              <span className="text-xs text-ink-muted">%</span>
            </div>
          ))}
        </div>
      </details>

      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Percentage</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result.percentage.toFixed(2)}%</p>
          </div>
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Grade</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result.grade}</p>
          </div>
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
            <p className={`mt-1 font-mono text-2xl font-semibold ${result.passed ? "text-teal" : "text-danger"}`}>
              {result.passed ? "Pass" : "Fail"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
