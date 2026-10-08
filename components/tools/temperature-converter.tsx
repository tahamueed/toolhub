"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

type Unit = "c" | "f" | "k";

function toCelsius(value: number, unit: Unit) {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(celsius: number, unit: Unit) {
  if (unit === "c") return celsius;
  if (unit === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

const units: { key: Unit; label: string; symbol: string }[] = [
  { key: "c", label: "Celsius", symbol: "\u00b0C" },
  { key: "f", label: "Fahrenheit", symbol: "\u00b0F" },
  { key: "k", label: "Kelvin", symbol: "K" },
];

export function TemperatureConverter() {
  const [amount, setAmount] = useState("0");
  const [fromUnit, setFromUnit] = useState<Unit>("c");

  const results = useMemo(() => {
    const value = parseFloat(amount);
    if (Number.isNaN(value)) return null;
    const celsius = toCelsius(value, fromUnit);
    if (celsius < -273.15) return "below-absolute-zero" as const;
    return units.map((u) => ({ ...u, value: fromCelsius(celsius, u.key) }));
  }, [amount, fromUnit]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="amount">Value</Label>
          <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32" />
        </div>
        <div>
          <Label htmlFor="fromUnit">Unit</Label>
          <select
            id="fromUnit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {units.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results === "below-absolute-zero" && (
        <p role="alert" className="text-sm text-danger">
          That value is below absolute zero (-273.15\u00b0C), which isn&rsquo;t physically possible.
        </p>
      )}

      {results && results !== "below-absolute-zero" && (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.key} className={`rounded-md border p-3 ${r.key === fromUnit ? "border-accent" : "border-border"} bg-panel-raised`}>
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{r.label}</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-ink">
                {r.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {r.symbol}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
