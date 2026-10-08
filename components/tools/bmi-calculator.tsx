"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type UnitSystem = "metric" | "imperial";

function category(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-accent" };
  if (bmi < 25) return { label: "Healthy weight", color: "text-teal" };
  if (bmi < 30) return { label: "Overweight", color: "text-accent" };
  return { label: "Obesity range", color: "text-danger" };
}

export function BmiCalculator() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightLb, setWeightLb] = useState("155");

  const bmi = useMemo(() => {
    if (units === "metric") {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (!h || !w) return null;
      return w / (h * h);
    }
    const totalIn = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    const w = parseFloat(weightLb);
    if (!totalIn || !w) return null;
    return (703 * w) / (totalIn * totalIn);
  }, [units, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const cat = bmi ? category(bmi) : null;

  return (
    <div className="space-y-5">
      <div className="flex rounded-md border border-border p-0.5 w-fit">
        <Button type="button" size="sm" variant={units === "metric" ? "primary" : "ghost"} onClick={() => setUnits("metric")}>
          Metric
        </Button>
        <Button type="button" size="sm" variant={units === "imperial" ? "primary" : "ghost"} onClick={() => setUnits("imperial")}>
          Imperial
        </Button>
      </div>

      {units === "metric" ? (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="hcm">Height (cm)</Label>
            <Input id="hcm" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-32" />
          </div>
          <div>
            <Label htmlFor="wkg">Weight (kg)</Label>
            <Input id="wkg" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-32" />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="hft">Height (ft)</Label>
            <Input id="hft" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-24" />
          </div>
          <div>
            <Label htmlFor="hin">Height (in)</Label>
            <Input id="hin" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-24" />
          </div>
          <div>
            <Label htmlFor="wlb">Weight (lb)</Label>
            <Input id="wlb" type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} className="w-32" />
          </div>
        </div>
      )}

      <div className="rounded-md border border-border bg-panel-raised p-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">BMI</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">
          {bmi ? bmi.toFixed(1) : "\u2014"}
        </p>
        {cat && <p className={`mt-1 text-sm font-medium ${cat.color}`}>{cat.label}</p>}
      </div>
      <p className="text-xs text-ink-muted">
        BMI is a general screening measure and doesn&rsquo;t account for muscle mass or individual
        health factors. It isn&rsquo;t a diagnosis.
      </p>
    </div>
  );
}
