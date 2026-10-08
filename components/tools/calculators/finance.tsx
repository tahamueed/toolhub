"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function SimpleInterestCalculator() {
  const [p, setP] = useState("1000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("1");

  const result = useMemo(() => {
    const principal = parseFloat(p);
    const rate = parseFloat(r);
    const time = parseFloat(t);
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) return null;

    const interest = (principal * rate * time) / 100;
    return { interest, total: principal + interest };
  }, [p, r, t]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Principal</Label><Input value={p} onChange={e => setP(e.target.value)} type="number" /></div>
        <div><Label>Rate (%)</Label><Input value={r} onChange={e => setR(e.target.value)} type="number" /></div>
        <div><Label>Time (Years)</Label><Input value={t} onChange={e => setT(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Interest</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.interest.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Total Amount</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.total.toFixed(2) : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function CompoundInterestCalculator() {
  const [p, setP] = useState("1000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("1");
  const [n, setN] = useState("12");

  const result = useMemo(() => {
    const principal = parseFloat(p);
    const rate = parseFloat(r);
    const time = parseFloat(t);
    const freq = parseFloat(n);
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(freq)) return null;

    const amount = principal * Math.pow(1 + (rate / 100) / freq, freq * time);
    const interest = amount - principal;
    return { amount, interest };
  }, [p, r, t, n]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Principal</Label><Input value={p} onChange={e => setP(e.target.value)} type="number" /></div>
        <div><Label>Rate (%)</Label><Input value={r} onChange={e => setR(e.target.value)} type="number" /></div>
        <div><Label>Time (Years)</Label><Input value={t} onChange={e => setT(e.target.value)} type="number" /></div>
        <div>
          <Label>Compounding Frequency</Label>
          <select value={n} onChange={e => setN(e.target.value)} className="w-full h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink">
            <option value="1">Annually</option>
            <option value="2">Semi-Annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </select>
        </div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Compound Interest</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.interest.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Total Amount</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.amount.toFixed(2) : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function LoanEmiCalculator() {
  const [p, setP] = useState("10000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("12");
  
  const result = useMemo(() => {
    const principal = parseFloat(p);
    const rate = parseFloat(r);
    const months = parseFloat(t);
    if (isNaN(principal) || isNaN(rate) || isNaN(months) || months <= 0) return null;

    if (rate === 0) {
      const emi = principal / months;
      return { emi, totalInterest: 0, totalPayment: principal };
    }

    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return { emi, totalInterest, totalPayment };
  }, [p, r, t]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Loan Amount</Label><Input value={p} onChange={e => setP(e.target.value)} type="number" /></div>
        <div><Label>Interest Rate (%)</Label><Input value={r} onChange={e => setR(e.target.value)} type="number" /></div>
        <div><Label>Tenure (Months)</Label><Input value={t} onChange={e => setT(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Monthly EMI</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.emi.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Total Interest</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.totalInterest.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Total Payment</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.totalPayment.toFixed(2) : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d)) return null;
    const amount = p * (d / 100);
    return { amount, final: p - amount };
  }, [price, discount]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Original Price</Label><Input value={price} onChange={e => setPrice(e.target.value)} type="number" /></div>
        <div><Label>Discount (%)</Label><Input value={discount} onChange={e => setDiscount(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Discount Amount</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.amount.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Final Price</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.final.toFixed(2) : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function ProfitLossCalculator() {
  const [cp, setCp] = useState("");
  const [sp, setSp] = useState("");

  const result = useMemo(() => {
    const cost = parseFloat(cp);
    const sell = parseFloat(sp);
    if (isNaN(cost) || isNaN(sell)) return null;

    const diff = sell - cost;
    const isProfit = diff >= 0;
    const percent = cost !== 0 ? (Math.abs(diff) / cost) * 100 : 0;
    
    return { diff: Math.abs(diff), isProfit, percent };
  }, [cp, sp]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Cost Price</Label><Input value={cp} onChange={e => setCp(e.target.value)} type="number" /></div>
        <div><Label>Selling Price</Label><Input value={sp} onChange={e => setSp(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">{result?.isProfit === false ? "Loss" : "Profit"}</p>
          <p className={`mt-1 font-mono text-xl font-semibold ${result?.isProfit === false ? 'text-danger' : 'text-teal'}`}>{result ? result.diff.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Percentage</p>
          <p className={`mt-1 font-mono text-xl font-semibold ${result?.isProfit === false ? 'text-danger' : 'text-teal'}`}>{result ? `${result.percent.toFixed(2)}%` : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}

export function TaxCalculator() {
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const t = parseFloat(tax);
    if (isNaN(a) || isNaN(t)) return null;
    const taxAmount = a * (t / 100);
    return { taxAmount, final: a + taxAmount };
  }, [amount, tax]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Amount (Before Tax)</Label><Input value={amount} onChange={e => setAmount(e.target.value)} type="number" /></div>
        <div><Label>Tax (%)</Label><Input value={tax} onChange={e => setTax(e.target.value)} type="number" /></div>
      </div>
      <div className="rounded-md border border-border bg-panel-raised p-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Tax Amount</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.taxAmount.toFixed(2) : "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-muted">Final Amount</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{result ? result.final.toFixed(2) : "\u2014"}</p>
        </div>
      </div>
    </div>
  );
}
