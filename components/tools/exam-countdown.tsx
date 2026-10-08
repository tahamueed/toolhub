"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function ExamCountdown() {
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("09:00");
  const now = useNow(1000);

  const remaining = useMemo(() => {
    if (!date || !time) return null;
    const target = new Date(`${date}T${time}:00`).getTime();
    if (Number.isNaN(target)) return null;
    const diff = target - now;
    return diff;
  }, [date, time, now]);

  const breakdown = useMemo(() => {
    if (remaining === null) return null;
    const abs = Math.abs(remaining);
    const days = Math.floor(abs / 86_400_000);
    const hours = Math.floor((abs % 86_400_000) / 3_600_000);
    const minutes = Math.floor((abs % 3_600_000) / 60_000);
    const seconds = Math.floor((abs % 60_000) / 1000);
    return { days, hours, minutes, seconds, isPast: remaining < 0 };
  }, [remaining]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <Label htmlFor="exam-name">Exam name</Label>
          <Input id="exam-name" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Final Exam" />
        </div>
        <div>
          <Label htmlFor="exam-date">Date</Label>
          <Input id="exam-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="exam-time">Time</Label>
          <Input id="exam-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      {breakdown && (
        <div>
          {examName && (
            <p className="mb-3 text-center font-display text-lg font-semibold text-ink sm:text-left">
              {examName}
            </p>
          )}
          {breakdown.isPast && (
            <p className="mb-3 text-sm text-ink-muted">This time has already passed. Showing time elapsed since:</p>
          )}
          <div className="grid grid-cols-4 gap-3">
            {[
              ["Days", breakdown.days],
              ["Hours", breakdown.hours],
              ["Minutes", breakdown.minutes],
              ["Seconds", breakdown.seconds],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md border border-border bg-panel-raised p-4 text-center">
                <p className="font-mono text-3xl font-semibold tabular-nums text-ink">
                  {String(value).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
