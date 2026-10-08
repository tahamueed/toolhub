"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function CgpaPercentageConverter() {
  const [value, setValue] = useState("8.5");
  const [mode, setMode] = useState<"cgpaToPercent" | "percentToCgpa">("cgpaToPercent");
  const [scale, setScale] = useState("9.5"); // Typical multiplier in some systems

  const result = useMemo(() => {
    const val = parseFloat(value);
    const multiplier = parseFloat(scale);
    if (isNaN(val) || isNaN(multiplier)) return null;

    if (mode === "cgpaToPercent") {
      const percent = val * multiplier;
      return percent > 100 ? 100 : percent;
    } else {
      return val / multiplier;
    }
  }, [value, mode, scale]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Button type="button" size="sm" variant={mode === "cgpaToPercent" ? "primary" : "secondary"} onClick={() => setMode("cgpaToPercent")}>CGPA to %</Button>
        <Button type="button" size="sm" variant={mode === "percentToCgpa" ? "primary" : "secondary"} onClick={() => setMode("percentToCgpa")}>% to CGPA</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{mode === "cgpaToPercent" ? "CGPA" : "Percentage"}</Label>
          <Input value={value} onChange={e => setValue(e.target.value)} type="number" />
        </div>
        <div>
          <Label>Multiplier / Scale</Label>
          <Input value={scale} onChange={e => setScale(e.target.value)} type="number" />
          <p className="mt-1 text-xs text-ink-muted">Often 9.5 for 10-point scale</p>
        </div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">
          {result !== null ? (mode === "cgpaToPercent" ? `${result.toFixed(2)}%` : result.toFixed(2)) : "\u2014"}
        </p>
      </div>
    </div>
  );
}

export function BaseConverter() {
  const [dec, setDec] = useState("");
  const [bin, setBin] = useState("");
  const [oct, setOct] = useState("");
  const [hex, setHex] = useState("");

  const updateAll = (value: string, base: number) => {
    if (!value) {
      setDec(""); setBin(""); setOct(""); setHex("");
      return;
    }
    try {
      const decimal = parseInt(value, base);
      if (isNaN(decimal)) return;
      if (base !== 10) setDec(decimal.toString(10)); else setDec(value);
      if (base !== 2) setBin(decimal.toString(2)); else setBin(value);
      if (base !== 8) setOct(decimal.toString(8)); else setOct(value);
      if (base !== 16) setHex(decimal.toString(16).toUpperCase()); else setHex(value.toUpperCase());
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Decimal (Base 10)</Label>
          <Input value={dec} onChange={e => updateAll(e.target.value, 10)} />
        </div>
        <div>
          <Label>Binary (Base 2)</Label>
          <Input value={bin} onChange={e => updateAll(e.target.value, 2)} />
        </div>
        <div>
          <Label>Octal (Base 8)</Label>
          <Input value={oct} onChange={e => updateAll(e.target.value, 8)} />
        </div>
        <div>
          <Label>Hexadecimal (Base 16)</Label>
          <Input value={hex} onChange={e => updateAll(e.target.value, 16)} />
        </div>
      </div>
    </div>
  );
}

export function OhmsLawCalculator() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");

  const result = useMemo(() => {
    const vol = parseFloat(v);
    const cur = parseFloat(i);
    const res = parseFloat(r);
    let vals = 0;
    if (!isNaN(vol)) vals++;
    if (!isNaN(cur)) vals++;
    if (!isNaN(res)) vals++;
    
    if (vals === 2) {
      if (isNaN(vol)) return { label: "Voltage (V)", value: cur * res, unit: "V" };
      if (isNaN(cur) && res !== 0) return { label: "Current (I)", value: vol / res, unit: "A" };
      if (isNaN(res) && cur !== 0) return { label: "Resistance (R)", value: vol / cur, unit: "Ω" };
    }
    return null;
  }, [v, i, r]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Voltage (V)</Label><Input value={v} onChange={e => setV(e.target.value)} type="number" /></div>
        <div><Label>Current (A)</Label><Input value={i} onChange={e => setI(e.target.value)} type="number" /></div>
        <div><Label>Resistance (Ω)</Label><Input value={r} onChange={e => setR(e.target.value)} type="number" /></div>
      </div>
      <p className="text-sm text-ink-muted">Enter two values to calculate the third.</p>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">{result?.label || "Result"}</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result ? `${result.value.toFixed(4)} ${result.unit}` : "\u2014"}</p>
      </div>
    </div>
  );
}

export function PowerCalculator() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");

  const result = useMemo(() => {
    const vol = parseFloat(v);
    const cur = parseFloat(i);
    const res = parseFloat(r);
    
    // P = VI, P = I^2 R, P = V^2 / R
    if (!isNaN(vol) && !isNaN(cur)) return { power: vol * cur, formula: "P = V × I" };
    if (!isNaN(cur) && !isNaN(res)) return { power: cur * cur * res, formula: "P = I² × R" };
    if (!isNaN(vol) && !isNaN(res) && res !== 0) return { power: (vol * vol) / res, formula: "P = V² / R" };
    
    return null;
  }, [v, i, r]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Voltage (V)</Label><Input value={v} onChange={e => setV(e.target.value)} type="number" /></div>
        <div><Label>Current (A)</Label><Input value={i} onChange={e => setI(e.target.value)} type="number" /></div>
        <div><Label>Resistance (Ω)</Label><Input value={r} onChange={e => setR(e.target.value)} type="number" /></div>
      </div>
      <p className="text-sm text-ink-muted">Enter two values to calculate electrical power (W).</p>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Electrical Power (Watts)</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result ? `${result.power.toFixed(4)} W` : "\u2014"}</p>
        {result && <p className="mt-2 text-xs text-ink-muted">Using {result.formula}</p>}
      </div>
    </div>
  );
}
