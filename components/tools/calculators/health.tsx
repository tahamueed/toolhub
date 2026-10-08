"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function BmrCalorieCalculator() {
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [activity, setActivity] = useState("1.2");

  const results = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight); // kg
    const h = parseFloat(height); // cm
    
    if (isNaN(a) || isNaN(w) || isNaN(h)) return null;

    // Mifflin-St Jeor Equation
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr += gender === "male" ? 5 : -161;

    const tdee = bmr * parseFloat(activity);

    return { bmr, tdee };
  }, [age, gender, weight, height, activity]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Age</Label><Input value={age} onChange={e => setAge(e.target.value)} type="number" /></div>
        <div>
          <Label>Gender</Label>
          <select value={gender} onChange={e => setGender(e.target.value as "male" | "female")} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div><Label>Weight (kg)</Label><Input value={weight} onChange={e => setWeight(e.target.value)} type="number" /></div>
        <div><Label>Height (cm)</Label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" /></div>
        <div className="col-span-2">
          <Label>Activity Level</Label>
          <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="1.2">Sedentary (little to no exercise)</option>
            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
            <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
            <option value="1.9">Extra active (very hard exercise/physical job)</option>
          </select>
        </div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">BMR</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{results ? `${Math.round(results.bmr)} kcal` : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Daily Calories (Maintenance)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{results ? `${Math.round(results.tdee)} kcal` : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [height, setHeight] = useState("");
  const [hip, setHip] = useState("");

  const result = useMemo(() => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hipVal = parseFloat(hip);

    if (isNaN(w) || isNaN(n) || isNaN(h)) return null;
    if (gender === "female" && isNaN(hipVal)) return null;

    // US Navy Method (using cm)
    let bf = 0;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hipVal - n) + 0.22100 * Math.log10(h)) - 450;
    }

    return isNaN(bf) || !isFinite(bf) ? null : bf;
  }, [gender, waist, neck, height, hip]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Gender</Label>
          <select value={gender} onChange={e => setGender(e.target.value as "male" | "female")} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div><Label>Height (cm)</Label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" /></div>
        <div><Label>Waist (cm)</Label><Input value={waist} onChange={e => setWaist(e.target.value)} type="number" /></div>
        <div><Label>Neck (cm)</Label><Input value={neck} onChange={e => setNeck(e.target.value)} type="number" /></div>
        {gender === "female" && (
          <div><Label>Hip (cm)</Label><Input value={hip} onChange={e => setHip(e.target.value)} type="number" /></div>
        )}
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Estimated Body Fat</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result !== null ? `${result.toFixed(1)}%` : "\u2014"}</p>
      </div>
    </div>
  );
}

export function IdealWeightCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("175");

  const result = useMemo(() => {
    const h = parseFloat(height); // cm
    if (isNaN(h)) return null;

    // Robinson formula (in kg)
    const inchesOver5Ft = (h / 2.54) - 60;
    if (inchesOver5Ft < 0) return null; // Formula is for over 5ft

    let weight = 0;
    if (gender === "male") {
      weight = 52 + 1.9 * inchesOver5Ft;
    } else {
      weight = 49 + 1.7 * inchesOver5Ft;
    }
    
    // Healthy BMI range 18.5 - 25
    const minW = 18.5 * (h / 100) * (h / 100);
    const maxW = 25 * (h / 100) * (h / 100);

    return { ideal: weight, min: minW, max: maxW };
  }, [gender, height]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Gender</Label>
          <select value={gender} onChange={e => setGender(e.target.value as "male" | "female")} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div><Label>Height (cm)</Label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Ideal Weight (Robinson)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? `${result.ideal.toFixed(1)} kg` : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Healthy Range (BMI)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? `${result.min.toFixed(1)} - ${result.max.toFixed(1)} kg` : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}
