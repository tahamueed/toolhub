"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function RequiredMarksCalculator() {
  const [currentObtained, setCurrentObtained] = useState("70");
  const [currentTotal, setCurrentTotal] = useState("100");
  const [remainingTotal, setRemainingTotal] = useState("50");
  const [targetPercentage, setTargetPercentage] = useState("80");

  const result = useMemo(() => {
    const obtained = parseFloat(currentObtained);
    const total = parseFloat(currentTotal);
    const remaining = parseFloat(remainingTotal);
    const target = parseFloat(targetPercentage);

    if ([obtained, total, remaining, target].some((v) => Number.isNaN(v)) || total <= 0 || remaining < 0) {
      return null;
    }

    const grandTotal = total + remaining;
    const neededOverall = (target / 100) * grandTotal;
    const neededFromRemaining = neededOverall - obtained;
    const achievable = neededFromRemaining <= remaining;
    const requiredPercentOfRemaining = remaining > 0 ? (neededFromRemaining / remaining) * 100 : null;

    return {
      neededFromRemaining: Math.max(0, neededFromRemaining),
      achievable,
      requiredPercentOfRemaining,
      grandTotal,
    };
  }, [currentObtained, currentTotal, remainingTotal, targetPercentage]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cur-obtained">Marks obtained so far</Label>
          <Input id="cur-obtained" type="number" min={0} value={currentObtained} onChange={(e) => setCurrentObtained(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cur-total">Total marks so far</Label>
          <Input id="cur-total" type="number" min={0} value={currentTotal} onChange={(e) => setCurrentTotal(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rem-total">Remaining marks available</Label>
          <Input id="rem-total" type="number" min={0} value={remainingTotal} onChange={(e) => setRemainingTotal(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="target-pct">Target overall percentage</Label>
          <Input id="target-pct" type="number" min={0} max={100} value={targetPercentage} onChange={(e) => setTargetPercentage(e.target.value)} />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              Marks needed from the remaining {result.grandTotal - parseFloat(currentTotal)}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">
              {result.neededFromRemaining.toFixed(1)}
              {result.requiredPercentOfRemaining !== null && (
                <span className="ml-2 text-base font-normal text-ink-muted">
                  ({result.requiredPercentOfRemaining.toFixed(1)}% of what&rsquo;s left)
                </span>
              )}
            </p>
          </div>
          <p className={`text-sm ${result.achievable ? "text-teal" : "text-danger"}`}>
            {result.achievable
              ? "That target is still achievable with the marks remaining."
              : "That target isn't achievable even with a perfect score on everything remaining, based on these numbers."}
          </p>
        </div>
      )}
    </div>
  );
}
