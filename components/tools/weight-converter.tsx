"use client";

import { UnitConverter } from "@/components/tools/unit-converter-base";

const units = [
  { key: "mg", label: "Milligrams", toBase: 0.001 },
  { key: "g", label: "Grams", toBase: 1 },
  { key: "kg", label: "Kilograms", toBase: 1000 },
  { key: "oz", label: "Ounces", toBase: 28.349523125 },
  { key: "lb", label: "Pounds", toBase: 453.59237 },
  { key: "st", label: "Stone", toBase: 6350.29318 },
];

export function WeightConverter() {
  return <UnitConverter units={units} defaultUnitKey="kg" />;
}
