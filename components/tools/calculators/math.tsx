"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

export function BasicCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      // Basic safe evaluation (using Function to avoid full eval scope, but simple enough)
      // Only allow numbers, basic operators, and decimals
      if (!/^[\d\+\-\*\/\.\(\)\s]*$/.test(expression)) {
        setResult("Invalid input");
        return;
      }
      const res = new Function(`return ${expression}`)();
      setResult(Number.isFinite(res) ? res.toString() : "Error");
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="basic-expr">Expression</Label>
        <Input
          id="basic-expr"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. 5 + 10 * 2"
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={handleCalculate}>Calculate</Button>
        <Button type="button" variant="outline" onClick={() => { setExpression(""); setResult(null); }}>Clear</Button>
      </div>
      {result !== null && (
        <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result}</p>
        </div>
      )}
    </div>
  );
}

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      const expr = expression
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/pi|PI/g, "Math.PI")
        .replace(/e|E/g, "Math.E")
        .replace(/\^/g, "**");

      if (!/^[\w\.\(\)\+\-\*\/\s]*$/.test(expr)) {
        setResult("Invalid input");
        return;
      }
      const res = new Function(`return ${expr}`)();
      setResult(Number.isFinite(res) ? res.toString() : "Error");
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sci-expr">Expression</Label>
        <Input
          id="sci-expr"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. sin(PI/2) + 2^3"
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
        />
        <p className="mt-1 text-xs text-ink-muted">Supported: sin, cos, tan, log, ln, sqrt, ^, pi, e</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={handleCalculate}>Calculate</Button>
        <Button type="button" variant="outline" onClick={() => { setExpression(""); setResult(null); }}>Clear</Button>
      </div>
      {result !== null && (
        <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result}</p>
        </div>
      )}
    </div>
  );
}

export function FractionCalculator() {
  const [n1, setN1] = useState("");
  const [d1, setD1] = useState("");
  const [op, setOp] = useState<"+" | "-" | "*" | "/">("+");
  const [n2, setN2] = useState("");
  const [d2, setD2] = useState("");

  const result = useMemo(() => {
    const num1 = parseInt(n1);
    const den1 = parseInt(d1);
    const num2 = parseInt(n2);
    const den2 = parseInt(d2);

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) return null;
    if (den1 === 0 || den2 === 0) return "Denominator cannot be zero";

    let rn = 0, rd = 1;
    if (op === "+") { rn = num1 * den2 + num2 * den1; rd = den1 * den2; }
    if (op === "-") { rn = num1 * den2 - num2 * den1; rd = den1 * den2; }
    if (op === "*") { rn = num1 * num2; rd = den1 * den2; }
    if (op === "/") { rn = num1 * den2; rd = den1 * num2; }

    if (rd === 0) return "Result denominator is zero";

    const divisor = gcd(rn, rd);
    rn /= divisor;
    rd /= divisor;

    if (rd < 0) { rn = -rn; rd = -rd; }
    return rd === 1 ? `${rn}` : `${rn} / ${rd}`;
  }, [n1, d1, op, n2, d2]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 w-16 text-center">
          <Input value={n1} onChange={(e) => setN1(e.target.value)} type="number" className="text-center" />
          <hr className="border-border" />
          <Input value={d1} onChange={(e) => setD1(e.target.value)} type="number" className="text-center" />
        </div>
        <select value={op} onChange={(e) => setOp(e.target.value as "+" | "-" | "*" | "/")} className="rounded-md border border-border bg-panel px-3 py-2">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <div className="flex flex-col gap-2 w-16 text-center">
          <Input value={n2} onChange={(e) => setN2(e.target.value)} type="number" className="text-center" />
          <hr className="border-border" />
          <Input value={d2} onChange={(e) => setD2(e.target.value)} type="number" className="text-center" />
        </div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result || "\u2014"}</p>
      </div>
    </div>
  );
}

export function RatioCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const simplified = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
      const divisor = gcd(x, y);
      return `${x/divisor} : ${y/divisor}`;
    }
    return null;
  }, [a, b]);

  const missing = useMemo(() => {
    const vals = [parseFloat(a), parseFloat(b), parseFloat(c), parseFloat(d)];
    const validCount = vals.filter(v => !isNaN(v)).length;
    if (validCount === 3) {
       if (isNaN(vals[0]) && vals[3] !== 0) return (vals[2] * vals[1]) / vals[3]; // A = C*B / D
       if (isNaN(vals[1]) && vals[2] !== 0) return (vals[0] * vals[3]) / vals[2]; // B = A*D / C
       if (isNaN(vals[2]) && vals[1] !== 0) return (vals[0] * vals[3]) / vals[1]; // C = A*D / B
       if (isNaN(vals[3]) && vals[0] !== 0) return (vals[2] * vals[1]) / vals[0]; // D = C*B / A
    }
    return null;
  }, [a, b, c, d]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>A</Label>
          <Input value={a} onChange={(e) => setA(e.target.value)} type="number" />
        </div>
        <div>
          <Label>B</Label>
          <Input value={b} onChange={(e) => setB(e.target.value)} type="number" />
        </div>
        <div>
          <Label>C</Label>
          <Input value={c} onChange={(e) => setC(e.target.value)} type="number" />
        </div>
        <div>
          <Label>D</Label>
          <Input value={d} onChange={(e) => setD(e.target.value)} type="number" />
        </div>
      </div>
      <p className="text-sm text-ink-muted">A : B = C : D (Leave one empty to find missing)</p>
      
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Missing Value</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{missing !== null ? missing : "\u2014"}</p>
        
        <p className="text-xs uppercase tracking-wider text-ink-muted mt-4">Simplified A:B</p>
        <p className="mt-1 font-mono text-xl font-semibold text-ink">{simplified || "\u2014"}</p>
      </div>
    </div>
  );
}

export function AverageCalculator() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) return null;

    nums.sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    
    let median = 0;
    const mid = Math.floor(nums.length / 2);
    if (nums.length % 2 === 0) {
      median = (nums[mid - 1] + nums[mid]) / 2;
    } else {
      median = nums[mid];
    }

    const freq: Record<number, number> = {};
    nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
    let maxFreq = 0;
    let mode: number[] = [];
    Object.entries(freq).forEach(([n, f]) => {
      if (f > maxFreq) { maxFreq = f; mode = [Number(n)]; }
      else if (f === maxFreq) { mode.push(Number(n)); }
    });

    const range = nums[nums.length - 1] - nums[0];

    return { mean, median, mode: mode.join(", "), range };
  }, [input]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Numbers (comma or space separated)</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 1, 2, 3, 4" />
      </div>
      <div className="grid grid-cols-2 gap-4 rounded-md border border-border bg-panel-raised p-4 mt-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Mean (Average)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{stats?.mean.toFixed(4) || "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Median</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{stats?.median ?? "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Mode</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{stats?.mode || "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Range</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{stats?.range ?? "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDupes, setAllowDupes] = useState(true);
  const [result, setResult] = useState<number[] | null>(null);

  const generate = () => {
    const mn = parseInt(min);
    const mx = parseInt(max);
    const cnt = parseInt(count);
    if (isNaN(mn) || isNaN(mx) || isNaN(cnt) || cnt <= 0 || mn > mx) return;

    if (!allowDupes && cnt > (mx - mn + 1)) return; // Cannot generate more unique numbers than range

    const res: number[] = [];
    if (!allowDupes) {
      const pool = Array.from({length: mx - mn + 1}, (_, i) => i + mn);
      for (let i = 0; i < cnt; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        res.push(pool[idx]);
        pool.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < cnt; i++) {
        res.push(Math.floor(Math.random() * (mx - mn + 1)) + mn);
      }
    }
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Min</Label>
          <Input value={min} onChange={(e) => setMin(e.target.value)} type="number" />
        </div>
        <div>
          <Label>Max</Label>
          <Input value={max} onChange={(e) => setMax(e.target.value)} type="number" />
        </div>
        <div>
          <Label>Count</Label>
          <Input value={count} onChange={(e) => setCount(e.target.value)} type="number" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={allowDupes} onChange={(e) => setAllowDupes(e.target.checked)} className="accent-accent" />
        Allow duplicates
      </label>
      <Button type="button" onClick={generate}>Generate</Button>
      
      {result && (
        <div className="rounded-md border border-border bg-panel-raised p-4 mt-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Results</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{result.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
