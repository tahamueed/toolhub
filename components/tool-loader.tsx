"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const loadingFallback = (
  <div className="flex h-40 items-center justify-center text-sm text-ink-muted">
    Loading tool&hellip;
  </div>
);

const registry: Record<string, ComponentType> = {
  CalculatorHub: dynamic(() => import("@/components/tools/calculator-hub").then((m) => m.CalculatorHub), {
    loading: () => loadingFallback,
  }),
  JsonFormatter: dynamic(() => import("@/components/tools/json-formatter").then((m) => m.JsonFormatter), {
    loading: () => loadingFallback,
  }),
  Base64Tool: dynamic(() => import("@/components/tools/base64-tool").then((m) => m.Base64Tool), {
    loading: () => loadingFallback,
  }),
  UrlEncoderTool: dynamic(() => import("@/components/tools/url-encoder-tool").then((m) => m.UrlEncoderTool), {
    loading: () => loadingFallback,
  }),
  UuidGenerator: dynamic(() => import("@/components/tools/uuid-generator").then((m) => m.UuidGenerator), {
    loading: () => loadingFallback,
  }),
  HashGenerator: dynamic(() => import("@/components/tools/hash-generator").then((m) => m.HashGenerator), {
    loading: () => loadingFallback,
  }),
  TimestampConverter: dynamic(
    () => import("@/components/tools/timestamp-converter").then((m) => m.TimestampConverter),
    { loading: () => loadingFallback }
  ),
  JwtDecoder: dynamic(() => import("@/components/tools/jwt-decoder").then((m) => m.JwtDecoder), {
    loading: () => loadingFallback,
  }),
  RegexTester: dynamic(() => import("@/components/tools/regex-tester").then((m) => m.RegexTester), {
    loading: () => loadingFallback,
  }),
  WordCounter: dynamic(() => import("@/components/tools/word-counter").then((m) => m.WordCounter), {
    loading: () => loadingFallback,
  }),
  CaseConverter: dynamic(() => import("@/components/tools/case-converter").then((m) => m.CaseConverter), {
    loading: () => loadingFallback,
  }),
  RemoveDuplicateLines: dynamic(
    () => import("@/components/tools/remove-duplicate-lines").then((m) => m.RemoveDuplicateLines),
    { loading: () => loadingFallback }
  ),
  TextSorter: dynamic(() => import("@/components/tools/text-sorter").then((m) => m.TextSorter), {
    loading: () => loadingFallback,
  }),
  LoremIpsumGenerator: dynamic(
    () => import("@/components/tools/lorem-ipsum-generator").then((m) => m.LoremIpsumGenerator),
    { loading: () => loadingFallback }
  ),
  TextCleaner: dynamic(() => import("@/components/tools/text-cleaner").then((m) => m.TextCleaner), {
    loading: () => loadingFallback,
  }),
  LengthConverter: dynamic(() => import("@/components/tools/length-converter").then((m) => m.LengthConverter), {
    loading: () => loadingFallback,
  }),
  WeightConverter: dynamic(() => import("@/components/tools/weight-converter").then((m) => m.WeightConverter), {
    loading: () => loadingFallback,
  }),
  TemperatureConverter: dynamic(
    () => import("@/components/tools/temperature-converter").then((m) => m.TemperatureConverter),
    { loading: () => loadingFallback }
  ),
  DataStorageConverter: dynamic(
    () => import("@/components/tools/data-storage-converter").then((m) => m.DataStorageConverter),
    { loading: () => loadingFallback }
  ),
  PercentageCalculator: dynamic(
    () => import("@/components/tools/percentage-calculator").then((m) => m.PercentageCalculator),
    { loading: () => loadingFallback }
  ),
  AgeCalculator: dynamic(() => import("@/components/tools/age-calculator").then((m) => m.AgeCalculator), {
    loading: () => loadingFallback,
  }),
  BmiCalculator: dynamic(() => import("@/components/tools/bmi-calculator").then((m) => m.BmiCalculator), {
    loading: () => loadingFallback,
  }),
  DateDifferenceCalculator: dynamic(
    () => import("@/components/tools/date-difference-calculator").then((m) => m.DateDifferenceCalculator),
    { loading: () => loadingFallback }
  ),
  ImageCompressor: dynamic(() => import("@/components/tools/image-compressor").then((m) => m.ImageCompressor), {
    loading: () => loadingFallback,
  }),
  ImageResizer: dynamic(() => import("@/components/tools/image-resizer").then((m) => m.ImageResizer), {
    loading: () => loadingFallback,
  }),
  ImageFormatConverter: dynamic(
    () => import("@/components/tools/image-format-converter").then((m) => m.ImageFormatConverter),
    { loading: () => loadingFallback }
  ),
  Base64ImageConverter: dynamic(
    () => import("@/components/tools/base64-image-converter").then((m) => m.Base64ImageConverter),
    { loading: () => loadingFallback }
  ),
  PdfMerger: dynamic(() => import("@/components/tools/pdf-merger").then((m) => m.PdfMerger), {
    loading: () => loadingFallback,
  }),
  PdfSplitter: dynamic(() => import("@/components/tools/pdf-splitter").then((m) => m.PdfSplitter), {
    loading: () => loadingFallback,
  }),
  PdfToWord: dynamic(() => import("@/components/tools/pdf-to-word").then((m) => m.PdfToWord), {
    loading: () => loadingFallback,
  }),
  WordToPdf: dynamic(() => import("@/components/tools/word-to-pdf").then((m) => m.WordToPdf), {
    loading: () => loadingFallback,
  }),
  PdfToText: dynamic(() => import("@/components/tools/pdf-to-text").then((m) => m.PdfToText), {
    loading: () => loadingFallback,
  }),
  TextToPdf: dynamic(() => import("@/components/tools/text-to-pdf").then((m) => m.TextToPdf), {
    loading: () => loadingFallback,
  }),
  ImagesToPdf: dynamic(() => import("@/components/tools/images-to-pdf").then((m) => m.ImagesToPdf), {
    loading: () => loadingFallback,
  }),
  GpaCalculator: dynamic(() => import("@/components/tools/gpa-calculator").then((m) => m.GpaCalculator), {
    loading: () => loadingFallback,
  }),
  GradeCalculator: dynamic(() => import("@/components/tools/grade-calculator").then((m) => m.GradeCalculator), {
    loading: () => loadingFallback,
  }),
  RequiredMarksCalculator: dynamic(
    () => import("@/components/tools/required-marks-calculator").then((m) => m.RequiredMarksCalculator),
    { loading: () => loadingFallback }
  ),
  AttendanceCalculator: dynamic(
    () => import("@/components/tools/attendance-calculator").then((m) => m.AttendanceCalculator),
    { loading: () => loadingFallback }
  ),
  ExamCountdown: dynamic(() => import("@/components/tools/exam-countdown").then((m) => m.ExamCountdown), {
    loading: () => loadingFallback,
  }),
  PomodoroTimer: dynamic(() => import("@/components/tools/pomodoro-timer").then((m) => m.PomodoroTimer), {
    loading: () => loadingFallback,
  }),
  StudyPlanner: dynamic(() => import("@/components/tools/study-planner").then((m) => m.StudyPlanner), {
    loading: () => loadingFallback,
  }),
  AiWritingNaturalizer: dynamic(
    () => import("@/components/tools/ai-writing-naturalizer").then((m) => m.AiWritingNaturalizer),
    { loading: () => loadingFallback }
  ),
};

export function ToolLoader({ component }: { component: string }) {
  const Component = registry[component];
  if (!Component) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-ink-muted">
        This tool is coming soon.
      </div>
    );
  }
  return <Component />;
}
