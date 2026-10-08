"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export interface Unit {
  key: string;
  label: string;
  /** Multiplier to convert from this unit into the base unit. */
  toBase: number;
}

export function UnitConverter({
  units,
  defaultUnitKey,
  defaultValue = "1",
  precision = 6,
}: {
  units: Unit[];
  defaultUnitKey: string;
  defaultValue?: string;
  precision?: number;
}) {
  const [amount, setAmount] = useState(defaultValue);
  const [fromKey, setFromKey] = useState(defaultUnitKey);

  const fromUnit = units.find((u) => u.key === fromKey) ?? units[0];

  const results = useMemo(() => {
    const value = parseFloat(amount);
    if (Number.isNaN(value)) return null;
    const base = value * fromUnit.toBase;
    return units.map((u) => ({ ...u, value: base / u.toBase }));
  }, [amount, fromUnit, units]);

  function format(n: number) {
    if (!Number.isFinite(n)) return "\u2014";
    const rounded = Number(n.toPrecision(precision));
    return rounded.toLocaleString(undefined, { maximumFractionDigits: precision });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="amount">Value</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-40"
          />
        </div>
        <div>
          <Label htmlFor="fromUnit">Unit</Label>
          <select
            id="fromUnit"
            value={fromKey}
            onChange={(e) => setFromKey(e.target.value)}
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

      {results ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div
              key={r.key}
              className={`rounded-md border p-3 ${
                r.key === fromKey ? "border-accent bg-panel-raised" : "border-border bg-panel-raised"
              }`}
            >
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{r.label}</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-ink">{format(r.value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-ink-muted">Enter a numeric value.</p>
      )}
    </div>
  );
}
