"use client";

import { UnitConverter } from "@/components/tools/unit-converter-base";

const units = [
  { key: "mm", label: "Millimeters", toBase: 0.001 },
  { key: "cm", label: "Centimeters", toBase: 0.01 },
  { key: "m", label: "Meters", toBase: 1 },
  { key: "km", label: "Kilometers", toBase: 1000 },
  { key: "in", label: "Inches", toBase: 0.0254 },
  { key: "ft", label: "Feet", toBase: 0.3048 },
  { key: "yd", label: "Yards", toBase: 0.9144 },
  { key: "mi", label: "Miles", toBase: 1609.344 },
];

export function LengthConverter() {
  return <UnitConverter units={units} defaultUnitKey="m" />;
}
