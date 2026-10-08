"use client";

import { useState } from "react";

// Import existing
import { PercentageCalculator } from "./percentage-calculator";
import { DateDifferenceCalculator } from "./date-difference-calculator";
import { AgeCalculator } from "./age-calculator";
import { BmiCalculator } from "./bmi-calculator";
import { GpaCalculator } from "./gpa-calculator";
import { GradeCalculator } from "./grade-calculator";
import { LengthConverter } from "./length-converter";
import { WeightConverter } from "./weight-converter";
import { TemperatureConverter } from "./temperature-converter";
import { DataStorageConverter } from "./data-storage-converter";

// Import new
import {
  BasicCalculator,
  ScientificCalculator,
  FractionCalculator,
  RatioCalculator,
  AverageCalculator,
  RandomNumberGenerator,
} from "./calculators/math";

import {
  SimpleInterestCalculator,
  CompoundInterestCalculator,
  LoanEmiCalculator,
  DiscountCalculator,
  ProfitLossCalculator,
  TaxCalculator,
} from "./calculators/finance";

import {
  TimeDurationCalculator,
  AddSubtractDateCalculator,
  WorkHoursCalculator,
} from "./calculators/datetime";

import {
  BmrCalorieCalculator,
  BodyFatCalculator,
  IdealWeightCalculator,
} from "./calculators/health";

import {
  CgpaPercentageConverter,
  BaseConverter,
  OhmsLawCalculator,
  PowerCalculator,
} from "./calculators/mixed";

const categories = [
  { id: "math", name: "Math" },
  { id: "finance", name: "Finance" },
  { id: "datetime", name: "Date & Time" },
  { id: "health", name: "Health & Fitness" },
  { id: "education", name: "Education" },
  { id: "engineering", name: "Engineering & Technology" },
];

const calculators: Record<string, { name: string; component: React.FC }[]> = {
  math: [
    { name: "Basic Calculator", component: BasicCalculator },
    { name: "Scientific Calculator", component: ScientificCalculator },
    { name: "Fraction Calculator", component: FractionCalculator },
    { name: "Ratio Calculator", component: RatioCalculator },
    { name: "Average Calculator", component: AverageCalculator },
    { name: "Random Number Generator", component: RandomNumberGenerator },
    { name: "Percentage Calculator", component: PercentageCalculator },
  ],
  finance: [
    { name: "Simple Interest", component: SimpleInterestCalculator },
    { name: "Compound Interest", component: CompoundInterestCalculator },
    { name: "Loan & EMI Calculator", component: LoanEmiCalculator },
    { name: "Discount Calculator", component: DiscountCalculator },
    { name: "Profit & Loss", component: ProfitLossCalculator },
    { name: "Tax Calculator", component: TaxCalculator },
  ],
  datetime: [
    { name: "Date Difference", component: DateDifferenceCalculator },
    { name: "Time Duration", component: TimeDurationCalculator },
    { name: "Add/Subtract Date", component: AddSubtractDateCalculator },
    { name: "Work Hours", component: WorkHoursCalculator },
    { name: "Age Calculator", component: AgeCalculator },
  ],
  health: [
    { name: "BMI Calculator", component: BmiCalculator },
    { name: "Calorie & BMR", component: BmrCalorieCalculator },
    { name: "Body Fat %", component: BodyFatCalculator },
    { name: "Ideal Weight", component: IdealWeightCalculator },
  ],
  education: [
    { name: "GPA Calculator", component: GpaCalculator },
    { name: "Percentage Grade", component: GradeCalculator },
    { name: "CGPA ↔ % Converter", component: CgpaPercentageConverter },
  ],
  engineering: [
    { name: "Length Converter", component: LengthConverter },
    { name: "Weight Converter", component: WeightConverter },
    { name: "Temperature Converter", component: TemperatureConverter },
    { name: "Data Storage Converter", component: DataStorageConverter },
    { name: "Base Converter (Bin/Dec/Hex)", component: BaseConverter },
    { name: "Ohm's Law", component: OhmsLawCalculator },
    { name: "Power Calculator", component: PowerCalculator },
  ],
};

export function CalculatorHub() {
  const [activeCategory, setActiveCategory] = useState("math");
  const [activeCalcIndex, setActiveCalcIndex] = useState(0);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveCalcIndex(0);
  };

  const ActiveComponent = calculators[activeCategory][activeCalcIndex].component;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-full shrink-0 md:w-64 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">Categories</h3>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeCategory === cat.id
                  ? "bg-accent text-accent-ink font-medium"
                  : "text-ink hover:bg-panel-raised"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-1 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
            {categories.find((c) => c.id === activeCategory)?.name}
          </h3>
          {calculators[activeCategory].map((calc, idx) => (
            <button
              key={calc.name}
              onClick={() => setActiveCalcIndex(idx)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeCalcIndex === idx
                  ? "bg-panel-raised text-ink font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-panel"
              }`}
            >
              {calc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-ink mb-6">
          {calculators[activeCategory][activeCalcIndex].name}
        </h2>
        <div className="bg-panel rounded-xl border border-border p-6 shadow-sm">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
