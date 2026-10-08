"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

interface Course {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

const DEFAULT_SCALE: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

function newCourse(): Course {
  return { id: crypto.randomUUID(), name: "", credits: "3", grade: "A" };
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([newCourse(), newCourse()]);
  const [scale, setScale] = useState<Record<string, number>>(DEFAULT_SCALE);
  const [priorCgpa, setPriorCgpa] = useState("");
  const [priorCredits, setPriorCredits] = useState("");

  function updateCourse(id: string, patch: Partial<Course>) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  const result = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const c of courses) {
      const credits = parseFloat(c.credits);
      const points = scale[c.grade];
      if (!credits || points === undefined) continue;
      totalPoints += credits * points;
      totalCredits += credits;
    }
    const semesterGpa = totalCredits > 0 ? totalPoints / totalCredits : null;

    const pCgpa = parseFloat(priorCgpa);
    const pCredits = parseFloat(priorCredits);
    let cgpa: number | null = null;
    if (!Number.isNaN(pCgpa) && !Number.isNaN(pCredits) && pCredits >= 0 && totalCredits + pCredits > 0) {
      cgpa = (pCgpa * pCredits + totalPoints) / (pCredits + totalCredits);
    }

    return { semesterGpa, cgpa, totalCredits };
  }, [courses, scale, priorCgpa, priorCredits]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="mb-0">Courses</Label>
          <Button type="button" size="sm" variant="secondary" onClick={() => setCourses((p) => [...p, newCourse()])}>
            <Plus className="size-3.5" />
            Add course
          </Button>
        </div>
        <div className="space-y-2">
          {courses.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-panel-raised p-2.5">
              <Input
                value={c.name}
                onChange={(e) => updateCourse(c.id, { name: e.target.value })}
                placeholder="Course name"
                className="min-w-32 flex-1"
              />
              <Input
                type="number"
                min={0}
                value={c.credits}
                onChange={(e) => updateCourse(c.id, { credits: e.target.value })}
                placeholder="Credits"
                className="w-24"
                aria-label="Credit hours"
              />
              <select
                value={c.grade}
                onChange={(e) => updateCourse(c.id, { grade: e.target.value })}
                aria-label="Grade"
                className="h-10 rounded-md border border-border bg-panel px-2 text-sm text-ink focus:border-accent focus:outline-none"
              >
                {Object.keys(scale).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove course"
                onClick={() => removeCourse(c.id)}
                className="px-1.5 text-danger hover:text-danger"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <details className="rounded-md border border-border">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-ink">
          Edit grade-point scale
        </summary>
        <div className="grid grid-cols-3 gap-2 border-t border-border p-3 sm:grid-cols-4">
          {Object.entries(scale).map(([grade, points]) => (
            <div key={grade} className="flex items-center gap-1.5">
              <span className="w-8 text-xs text-ink-muted">{grade}</span>
              <Input
                type="number"
                step="0.1"
                value={points}
                onChange={(e) =>
                  setScale((prev) => ({ ...prev, [grade]: Number(e.target.value) || 0 }))
                }
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </details>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="prior-cgpa">Previous CGPA (optional)</Label>
          <Input id="prior-cgpa" type="number" step="0.01" value={priorCgpa} onChange={(e) => setPriorCgpa(e.target.value)} className="w-32" />
        </div>
        <div>
          <Label htmlFor="prior-credits">Previous total credit hours</Label>
          <Input id="prior-credits" type="number" value={priorCredits} onChange={(e) => setPriorCredits(e.target.value)} className="w-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-panel-raised p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Semester GPA</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">
            {result.semesterGpa !== null ? result.semesterGpa.toFixed(2) : "\u2014"}
          </p>
        </div>
        <div className="rounded-md border border-border bg-panel-raised p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Overall CGPA</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">
            {result.cgpa !== null ? result.cgpa.toFixed(2) : "\u2014"}
          </p>
        </div>
        <div className="rounded-md border border-border bg-panel-raised p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Credit hours (this semester)</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result.totalCredits || "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}
