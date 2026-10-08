"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function DateDifferenceCalculator() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });

  const result = useMemo(() => {
    if (!start || !end) return null;
    const from = new Date(start + "T00:00:00");
    const to = new Date(end + "T00:00:00");
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

    const earlier = from <= to ? from : to;
    const later = from <= to ? to : from;

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(later.getFullYear(), later.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86_400_000);
    const totalWeeks = Math.floor(totalDays / 7);

    return { years, months, days, totalDays, totalWeeks, reversed: from > to };
  }, [start, end]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="start">Start date</Label>
          <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="end">End date</Label>
          <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["Years", result.years],
            ["Months", result.months],
            ["Days", result.days],
            ["Total weeks", result.totalWeeks],
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
