"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function TimeDurationCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const result = useMemo(() => {
    if (!start || !end) return null;
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    const d1 = new Date(2000, 0, 1, h1, m1, 0);
    const d2 = new Date(2000, 0, 1, h2, m2, 0);

    if (d2 < d1) d2.setDate(d2.getDate() + 1); // Crosses midnight

    const diff = d2.getTime() - d1.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return { hours, minutes };
  }, [start, end]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Start Time</Label><Input value={start} onChange={e => setStart(e.target.value)} type="time" /></div>
        <div><Label>End Time</Label><Input value={end} onChange={e => setEnd(e.target.value)} type="time" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Duration</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">
          {result ? `${result.hours}h ${result.minutes}m` : "\u2014"}
        </p>
      </div>
    </div>
  );
}

export function AddSubtractDateCalculator() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState("0");
  const [weeks, setWeeks] = useState("0");
  const [months, setMonths] = useState("0");
  const [years, setYears] = useState("0");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const result = useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const op = operation === "add" ? 1 : -1;
    d.setFullYear(d.getFullYear() + (parseInt(years) || 0) * op);
    d.setMonth(d.getMonth() + (parseInt(months) || 0) * op);
    d.setDate(d.getDate() + (parseInt(days) || 0) * op + (parseInt(weeks) || 0) * 7 * op);

    return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [date, days, weeks, months, years, operation]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1"><Label>Start Date</Label><Input value={date} onChange={e => setDate(e.target.value)} type="date" /></div>
        <div>
          <Label>Operation</Label>
          <select value={operation} onChange={e => setOperation(e.target.value as "add" | "subtract")} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div><Label>Years</Label><Input value={years} onChange={e => setYears(e.target.value)} type="number" /></div>
        <div><Label>Months</Label><Input value={months} onChange={e => setMonths(e.target.value)} type="number" /></div>
        <div><Label>Weeks</Label><Input value={weeks} onChange={e => setWeeks(e.target.value)} type="number" /></div>
        <div><Label>Days</Label><Input value={days} onChange={e => setDays(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Result Date</p>
        <p className="mt-1 font-mono text-xl font-semibold text-ink">{result || "\u2014"}</p>
      </div>
    </div>
  );
}

export function WorkHoursCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [breakMin, setBreakMin] = useState("60");

  const result = useMemo(() => {
    if (!start || !end) return null;
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    const d1 = new Date(2000, 0, 1, h1, m1, 0);
    const d2 = new Date(2000, 0, 1, h2, m2, 0);

    if (d2 < d1) d2.setDate(d2.getDate() + 1);

    const diff = d2.getTime() - d1.getTime();
    let totalMinutes = Math.floor(diff / (1000 * 60));
    totalMinutes -= parseInt(breakMin) || 0;

    if (totalMinutes < 0) totalMinutes = 0;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes };
  }, [start, end, breakMin]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Start Time</Label><Input value={start} onChange={e => setStart(e.target.value)} type="time" /></div>
        <div><Label>End Time</Label><Input value={end} onChange={e => setEnd(e.target.value)} type="time" /></div>
        <div><Label>Break (Minutes)</Label><Input value={breakMin} onChange={e => setBreakMin(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Total Working Hours</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">
          {result ? `${result.hours}h ${result.minutes}m` : "\u2014"}
        </p>
      </div>
    </div>
  );
}
