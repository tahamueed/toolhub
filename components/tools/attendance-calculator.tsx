"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function AttendanceCalculator() {
  const [total, setTotal] = useState("40");
  const [attended, setAttended] = useState("32");
  const [target, setTarget] = useState("75");

  const result = useMemo(() => {
    const t = parseFloat(total);
    const a = parseFloat(attended);
    const p = parseFloat(target);

    if (!t || Number.isNaN(a) || a < 0 || a > t || Number.isNaN(p) || p <= 0 || p > 100) return null;

    const currentPercentage = (a / t) * 100;
    const targetFraction = p / 100;

    if (currentPercentage >= p) {
      // How many additional classes (held, but missed) can be added while
      // staying at or above target: a / (t + x) >= p/100  =>  x <= a/(p/100) - t
      const maxMiss = Math.floor(a / targetFraction - t);
      return { currentPercentage, mode: "can-miss" as const, value: Math.max(0, maxMiss) };
    }

    // How many more classes must be attended (added to both attended and
    // total) to reach target: (a+y)/(t+y) >= p/100
    if (targetFraction >= 1) {
      return { currentPercentage, mode: "unreachable" as const, value: null };
    }
    const needed = (targetFraction * t - a) / (1 - targetFraction);
    return { currentPercentage, mode: "must-attend" as const, value: Math.max(0, Math.ceil(needed)) };
  }, [total, attended, target]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="total-classes">Total classes held</Label>
          <Input id="total-classes" type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="attended-classes">Classes attended</Label>
          <Input id="attended-classes" type="number" min={0} value={attended} onChange={(e) => setAttended(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="target-attendance">Target attendance %</Label>
          <Input id="target-attendance" type="number" min={1} max={100} value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Current attendance</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result.currentPercentage.toFixed(1)}%</p>
          </div>

          {result.mode === "can-miss" && (
            <div className="rounded-md border border-border bg-panel-raised p-4">
              <p className="text-xs uppercase tracking-wider text-ink-muted">
                Classes you can still miss and stay at or above {target}%
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-teal">{result.value}</p>
            </div>
          )}
          {result.mode === "must-attend" && (
            <div className="rounded-md border border-border bg-panel-raised p-4">
              <p className="text-xs uppercase tracking-wider text-ink-muted">
                Classes you need to attend in a row to reach {target}%
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-danger">{result.value}</p>
            </div>
          )}
          {result.mode === "unreachable" && (
            <p className="text-sm text-danger">
              A 100% target can only be reached if you haven&rsquo;t missed a single class yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
