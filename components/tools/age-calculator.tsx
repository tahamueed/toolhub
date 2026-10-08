"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function diff(from: Date, to: Date) {
  if (to < from) return null;
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86_400_000);
  return { years, months, days, totalDays };
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [asOf, setAsOf] = useState(todayISO());

  const result = useMemo(() => {
    if (!birthDate || !asOf) return null;
    const from = new Date(birthDate + "T00:00:00");
    const to = new Date(asOf + "T00:00:00");
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
    return diff(from, to);
  }, [birthDate, asOf]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="birth">Date of birth</Label>
          <Input id="birth" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="asof">As of</Label>
          <Input id="asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </div>
      </div>

      {result === null ? (
        <p className="text-sm text-danger">The &ldquo;as of&rdquo; date must be on or after the date of birth.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Years", result.years],
            ["Months", result.months],
            ["Days", result.days],
            ["Total days", result.totalDays],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-md border border-border bg-panel-raised p-3">
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
