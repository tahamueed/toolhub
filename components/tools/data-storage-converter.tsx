"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

const UNITS = ["bit", "byte", "KB", "MB", "GB", "TB", "PB"] as const;
type UnitKey = (typeof UNITS)[number];

function exponent(unit: UnitKey) {
  return { bit: -1, byte: 0, KB: 1, MB: 2, GB: 3, TB: 4, PB: 5 }[unit];
}

export function DataStorageConverter() {
  const [amount, setAmount] = useState("1");
  const [fromUnit, setFromUnit] = useState<UnitKey>("MB");
  const [base, setBase] = useState<1024 | 1000>(1024);

  const results = useMemo(() => {
    const value = parseFloat(amount);
    if (Number.isNaN(value)) return null;

    // Convert to bits first (bit exponent -1 means byte = 8 bits).
    const bits = fromUnit === "bit" ? value : value * 8 * Math.pow(base, exponent(fromUnit));

    return UNITS.map((u) => {
      const divisor = u === "bit" ? 1 : 8 * Math.pow(base, exponent(u));
      return { key: u, value: bits / divisor };
    });
  }, [amount, fromUnit, base]);

  function format(n: number) {
    if (!Number.isFinite(n)) return "\u2014";
    if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return Number(n.toPrecision(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="amount">Value</Label>
          <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32" />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as UnitKey)}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="base">Base</Label>
          <select
            id="base"
            value={base}
            onChange={(e) => setBase(Number(e.target.value) as 1024 | 1000)}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value={1024}>1024 (binary)</option>
            <option value={1000}>1000 (decimal)</option>
          </select>
        </div>
      </div>

      {results ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {results.map((r) => (
            <div key={r.key} className={`rounded-md border p-3 ${r.key === fromUnit ? "border-accent" : "border-border"} bg-panel-raised`}>
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{r.key}</dt>
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
