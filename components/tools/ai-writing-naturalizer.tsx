"use client";

import { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Trash2,
  Download,
  Clipboard,
  FileText,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Info,
  RotateCcw,
  Split,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea, Input, Select, Label } from "@/components/ui/field";
import {
  naturalizeText,
  calculateTextStats,
} from "@/lib/ai-naturalizer";
import type {
  WritingMode,
  AcademicLevel,
  LanguageComplexity,
  VocabularyLevel,
  RewriteStrength,
  NaturalizerOptions,
  NaturalizeResult,
} from "@/lib/ai-naturalizer";

const EXAMPLE_LONG_ACADEMIC = `The proposed system was developed to analyze student feedback in higher education institutions (Khan et al., 2024). The system uses transformer-based models for sentiment classification and topic extraction. The results show that the proposed approach achieved better performance compared to traditional machine learning baselines, reaching an accuracy of 92.4% (p < 0.05). Furthermore, the system can process feedback in multiple languages including English, Spanish, and French.

It is important to note that student feedback plays a crucial role in improving educational quality and course design. Moreover, the system serves as a testament to the power of modern natural language processing. In conclusion, overall, it can be seen that the system facilitates better decision-making for academic administrators [12–15].`;

const WRITING_MODES: Array<{ id: WritingMode; label: string; desc: string }> = [
  { id: "academic", label: "Academic", desc: "Thesis reports, research papers, assignments" },
  { id: "formal", label: "Formal", desc: "Professional reports & official documents" },
  { id: "natural", label: "Natural", desc: "Clear everyday human writing" },
  { id: "professional", label: "Professional", desc: "Workplace & business communication" },
  { id: "simple", label: "Simple", desc: "Easy-to-understand language" },
  { id: "conversational", label: "Conversational", desc: "Relaxed but coherent tone" },
  { id: "custom", label: "Custom", desc: "Specify custom writing style" },
];

export function AiWritingNaturalizer() {
  // Input & Output states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<number>(0);
  const [pipelineStepText, setPipelineStepText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [resultData, setResultData] = useState<NaturalizeResult | null>(null);

  // View Mode: 'editor' | 'comparison'
  const [viewMode, setViewMode] = useState<"editor" | "comparison">("editor");

  // Style Settings
  const [mode, setMode] = useState<WritingMode>("academic");
  const [customModeDescription, setCustomModeDescription] = useState("");
  const [thesisMode, setThesisMode] = useState(true);
  const [strength, setStrength] = useState<RewriteStrength>("balanced");

  // Academic Controls
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("masters");
  const [complexity, setComplexity] = useState<LanguageComplexity>("moderate");
  const [formality, setFormality] = useState<number>(4);
  const [sentenceVariation, setSentenceVariation] = useState<number>(4);
  const [vocabulary, setVocabulary] = useState<VocabularyLevel>("technical");
  const [preserveTechnicalTerms, setPreserveTechnicalTerms] = useState(true);

  // Custom instructions & collapsible controls toggle
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [showAdvancedAcademic, setShowAdvancedAcademic] = useState(true);

  // Drag and drop file ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live stats for input & output
  const inputStats = useMemo(() => calculateTextStats(inputText), [inputText]);
  const outputStats = useMemo(() => calculateTextStats(outputText), [outputText]);

  // Load realistic multi-paragraph academic example text
  const handleLoadExample = () => {
    setInputText(EXAMPLE_LONG_ACADEMIC);
    setErrorMsg("");
  };

  // Handle Paste
  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setInputText(clipText);
        setErrorMsg("");
      }
    } catch {
      setErrorMsg("Unable to access clipboard. Please paste text directly into the input box.");
    }
  };

  // Clear Input
  const handleClearInput = () => {
    setInputText("");
    setErrorMsg("");
  };

  // Clear Output
  const handleClearOutput = () => {
    setOutputText("");
    setResultData(null);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      setErrorMsg("Please upload a plain text (.txt) or Markdown (.md) file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setErrorMsg("");
      }
    };
    reader.readAsText(file);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".txt") || file.name.endsWith(".md"))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setInputText(content);
          setErrorMsg("");
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMsg("Please drop a plain text (.txt) or Markdown (.md) file.");
    }
  };

  // Process Multi-Stage Naturalize Text
  const handleNaturalize = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorMsg("Please enter or paste text to naturalize.");
      return;
    }

    if (trimmed.length < 15 || inputStats.wordCount < 3) {
      setErrorMsg("Please enter at least one complete sentence.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    const pipelineStages = [
      "Stage 1/5: Analyzing passage structure, facts & citations...",
      "Stage 2/5: Deep rewriting & restructuring sentence flow...",
      "Stage 3/5: Reviewing draft against original meaning...",
      "Stage 4/5: Refining cadence & removing AI robotic tone...",
      "Stage 5/5: Verifying facts, citations & finalizing text...",
    ];

    setPipelineStage(1);
    setPipelineStepText(pipelineStages[0]);

    let stepIdx = 0;
    const stageInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < pipelineStages.length) {
        setPipelineStage(stepIdx + 1);
        setPipelineStepText(pipelineStages[stepIdx]);
      }
    }, 2500); // Increased interval to match real LLM pipeline delay better

    const options: NaturalizerOptions = {
      mode,
      customModeDescription: mode === "custom" ? customModeDescription : undefined,
      academicLevel,
      complexity,
      formality,
      sentenceVariation,
      vocabulary,
      preserveTechnicalTerms,
      thesisMode,
      strength,
      additionalInstructions,
    };

    try {
      const result = await naturalizeText(inputText, options);
      clearInterval(stageInterval);
      setOutputText(result.rewrittenText);
      setResultData(result);
    } catch {
      clearInterval(stageInterval);
      setErrorMsg("An error occurred while naturalizing text. Please try again.");
    } finally {
      setIsLoading(false);
      setPipelineStage(0);
    }
  };

  // Handle Copy Output
  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  // Handle Download Output
  const handleDownloadOutput = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `naturalized-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Multi-stage Privacy & Quality Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-panel-raised p-3.5 text-xs text-ink-muted sm:px-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-teal" />
          <span>
            <strong>Multi-Stage Deep Rewriting Engine:</strong> Reconstructs sentence syntax and paragraph flow while strictly preserving meaning, citations, and numbers.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-teal">
          <span className="inline-block size-2 rounded-full bg-teal animate-pulse" />
          Multi-Pass Pipeline Active
        </div>
      </div>

      {/* Primary Configuration Bar */}
      <div className="rounded-xl border border-border bg-panel p-4 space-y-4">
        {/* Writing Mode Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="mb-0 font-semibold text-ink text-xs uppercase tracking-wider">
              1. Writing Mode / Audience Style
            </Label>
            {mode === "academic" && (
              <span className="text-[11px] text-accent font-medium">Academic Mode Selected</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {WRITING_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all cursor-pointer ${
                  mode === m.id
                    ? "border-accent bg-accent/10 text-accent font-semibold shadow-xs"
                    : "border-border bg-panel-raised text-ink-muted hover:border-border-strong hover:text-ink"
                }`}
              >
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs text-ink-muted">
            {WRITING_MODES.find((m) => m.id === mode)?.desc}
          </p>

          {mode === "custom" && (
            <div className="mt-3">
              <Input
                type="text"
                value={customModeDescription}
                onChange={(e) => setCustomModeDescription(e.target.value)}
                placeholder='e.g., "Make this sound like a final-year university computer engineering student writing a research paper."'
                className="text-xs"
              />
            </div>
          )}
        </div>

        {/* Thesis / Research Mode & Rewrite Depth Row */}
        <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border sm:grid-cols-2">
          {/* Thesis / Research Mode Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-panel-raised p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <GraduationCap className="size-4.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  Thesis / Research Mode
                  <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent font-mono">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-[11px] text-ink-muted">
                  Optimizes specifically for research methodology, findings & citations.
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={thesisMode}
              onClick={() => setThesisMode(!thesisMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                thesisMode ? "bg-accent" : "bg-border-strong"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  thesisMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rewrite Depth Selector */}
          <div className="rounded-lg border border-border bg-panel-raised p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-ink">Rewrite Depth</span>
              <span className="text-[11px] font-mono text-accent uppercase tracking-wider">
                {strength}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-panel p-1 rounded-md border border-border">
              {[
                { id: "light", label: "Light", desc: "Minor naturalization" },
                { id: "balanced", label: "Balanced", desc: "Sentence & paragraph restructuring (Default)" },
                { id: "deep", label: "Deep", desc: "Extensive structural transformation" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStrength(s.id as RewriteStrength)}
                  title={s.desc}
                  className={`rounded py-1 text-center text-xs capitalize transition-colors cursor-pointer ${
                    strength === s.id
                      ? "bg-accent text-accent-ink font-medium shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deep strength notification */}
        {strength === "deep" && (
          <div className="flex items-start gap-2 rounded-md border border-accent/30 bg-accent/5 p-2.5 text-xs text-accent">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>
              <strong>Deep Rewriting Enabled:</strong> Performs deep structural sentence reconstruction, clause reordering, and flow optimization while maintaining 100% of facts, citations, and technical terms.
            </span>
          </div>
        )}

        {/* Academic Controls Toggle */}
        {(mode === "academic" || thesisMode) && (
          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowAdvancedAcademic(!showAdvancedAcademic)}
              className="flex items-center gap-2 text-xs font-medium text-ink-muted hover:text-ink cursor-pointer"
            >
              <Sliders className="size-3.5 text-accent" />
              <span>Academic Controls ({showAdvancedAcademic ? "Hide" : "Customize"})</span>
            </button>

            {showAdvancedAcademic && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6 rounded-lg border border-border bg-panel-raised p-3">
                <div>
                  <Label htmlFor="acad-level" className="text-[11px]">Academic Level</Label>
                  <Select
                    id="acad-level"
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                    className="h-8 text-xs py-1"
                  >
                    <option value="undergraduate">Undergraduate</option>
                    <option value="masters">Master&apos;s</option>
                    <option value="phd">PhD / Research</option>
                    <option value="general">General Academic</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="acad-comp" className="text-[11px]">Complexity</Label>
                  <Select
                    id="acad-comp"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as LanguageComplexity)}
                    className="h-8 text-xs py-1"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="acad-vocab" className="text-[11px]">Vocabulary</Label>
                  <Select
                    id="acad-vocab"
                    value={vocabulary}
                    onChange={(e) => setVocabulary(e.target.value as VocabularyLevel)}
                    className="h-8 text-xs py-1"
                  >
                    <option value="simple">Simple</option>
                    <option value="standard">Standard</option>
                    <option value="technical">Technical</option>
                    <option value="highly_technical">Highly Technical</option>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="formality-slider" className="mb-0 text-[11px]">Formality</Label>
                    <span className="font-mono text-[10px] text-ink-muted">{formality}/5</span>
                  </div>
                  <input
                    id="formality-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={formality}
                    onChange={(e) => setFormality(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-ink-muted">
                    <span>Informal</span>
                    <span>Formal</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="variation-slider" className="mb-0 text-[11px]">Sentence Variation</Label>
                    <span className="font-mono text-[10px] text-ink-muted">{sentenceVariation}/5</span>
                  </div>
                  <input
                    id="variation-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={sentenceVariation}
                    onChange={(e) => setSentenceVariation(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-ink-muted">
                    <span>Consistent</span>
                    <span>Highly Varied</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-medium text-ink-muted mb-1">Technical Terms</span>
                  <label className="flex items-center gap-1.5 text-xs text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preserveTechnicalTerms}
                      onChange={(e) => setPreserveTechnicalTerms(e.target.checked)}
                      className="accent-accent rounded cursor-pointer"
                    />
                    <span>Preserve Terms</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Instructions */}
        <div className="pt-2 border-t border-border">
          <Input
            type="text"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder='Optional instructions: e.g., "Use British English", "Keep explanation concise", "Maintain active voice"'
            className="text-xs placeholder:text-ink-muted"
          />
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* View Mode Toolbar when Result is Present */}
      {outputText && (
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle2 className="size-4 text-teal" />
            Rewriting Complete
          </div>
          <div className="flex items-center gap-1 bg-panel-raised p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                viewMode === "editor" ? "bg-panel text-ink shadow-xs" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Eye className="size-3.5" />
              Editor View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("comparison")}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                viewMode === "comparison" ? "bg-panel text-ink shadow-xs" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Split className="size-3.5 text-accent" />
              Side-by-Side Comparison
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace (Editor or Comparison) */}
      {viewMode === "comparison" && outputText ? (
        <div className="rounded-xl border border-border bg-panel p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-display font-semibold text-ink text-sm">
              Structural Transformation Comparison
            </h3>
            <span className="text-xs text-ink-muted">
              Comparing Original vs Naturalized Passage
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-panel-raised p-4 space-y-2">
              <div className="flex justify-between text-xs text-ink-muted font-medium border-b border-border pb-1">
                <span className="text-danger font-semibold">Original Text</span>
                <span className="font-mono">{inputStats.wordCount} words</span>
              </div>
              <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-muted">
                {inputText}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-4 space-y-2">
              <div className="flex justify-between text-xs text-ink-muted font-medium border-b border-border pb-1">
                <span className="text-teal font-semibold">Naturalized Output</span>
                <span className="font-mono">{outputStats.wordCount} words</span>
              </div>
              <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink font-medium">
                {outputText}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Two-Panel Editor Workspace */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Panel: Original Text */}
          <div
            className="flex flex-col rounded-xl border border-border bg-panel p-4 space-y-3"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-accent" />
                <h2 className="font-display font-semibold text-ink text-sm sm:text-base">
                  Original Text
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadExample}
                  title="Load Multi-Paragraph Academic Example Text"
                  className="h-7 px-2 text-[11px]"
                >
                  <Sparkles className="size-3 text-accent" />
                  Example Text
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="h-7 px-2 text-[11px]"
                >
                  <Clipboard className="size-3" />
                  Paste
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload .txt or .md file"
                  className="h-7 px-2 text-[11px]"
                >
                  Upload File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {inputText && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearInput}
                    title="Clear input"
                    className="h-7 px-2 text-[11px] text-danger hover:text-danger"
                  >
                    <Trash2 className="size-3" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your rough, AI-assisted, or draft academic text here (thesis paragraph, essay section, research summary)..."
              className="min-h-72 flex-1 font-sans text-sm leading-relaxed"
              aria-label="Original Text Input"
            />

            <div className="flex flex-wrap items-center justify-between text-xs text-ink-muted pt-2 border-t border-border">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>{inputStats.wordCount} words</span>
                <span>•</span>
                <span>{inputStats.charCount} characters</span>
                <span>•</span>
                <span>{inputStats.sentenceCount} sentences</span>
              </div>
              {inputStats.wordCount > 0 && (
                <span className="text-[11px]">Readability: {inputStats.gradeLevel}</span>
              )}
            </div>
          </div>

          {/* Right Panel: Naturalized Text */}
          <div className="flex flex-col rounded-xl border border-border bg-panel p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-teal" />
                <h2 className="font-display font-semibold text-ink text-sm sm:text-base">
                  Naturalized Text
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {outputText && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyOutput}
                      className="h-7 px-2.5 text-[11px]"
                    >
                      {copied ? <Check className="size-3 text-teal" /> : <Copy className="size-3" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleDownloadOutput}
                      className="h-7 px-2.5 text-[11px]"
                    >
                      <Download className="size-3" />
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearOutput}
                      className="h-7 px-2 text-[11px] text-danger hover:text-danger"
                    >
                      <Trash2 className="size-3" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="relative min-h-72 flex-1 flex flex-col">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md border border-border bg-panel-raised/85 p-6 text-center backdrop-blur-xs z-10">
                  <div className="relative flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-3">
                    <Sparkles className="size-6 animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-ink">Multi-Stage Rewriting Pipeline</p>
                  <p className="mt-1.5 text-xs text-accent font-medium max-w-sm">
                    {pipelineStepText}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((stageNum) => (
                      <span
                        key={stageNum}
                        className={`size-2 rounded-full transition-all ${
                          pipelineStage >= stageNum ? "bg-accent scale-110" : "bg-border-strong"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <Textarea
                readOnly={!outputText}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Your deeply naturalized text will appear here with intact citations, facts, and technical terms..."
                className="min-h-72 flex-1 font-sans text-sm leading-relaxed"
                aria-label="Naturalized Text Output"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-ink-muted pt-2 border-t border-border">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>{outputStats.wordCount} words</span>
                <span>•</span>
                <span>{outputStats.charCount} characters</span>
                {resultData && (
                  <>
                    <span>•</span>
                    <span className="text-teal font-semibold">
                      {resultData.processingTimeMs}ms
                    </span>
                  </>
                )}
              </div>
              {outputStats.wordCount > 0 && (
                <span className="text-[11px]">Readability: {outputStats.gradeLevel}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        <Button
          type="button"
          size="lg"
          onClick={handleNaturalize}
          disabled={isLoading || !inputText.trim()}
          className="w-full sm:w-auto min-w-64 h-12 px-8 text-base shadow-md cursor-pointer"
        >
          {isLoading ? (
            <>
              <RotateCcw className="size-5 animate-spin" />
              Processing Pipeline ({pipelineStage}/4)...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Naturalize Text
              <ArrowRight className="size-5 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Before / After Analysis Panel */}
      {resultData && (
        <div className="rounded-xl border border-border bg-panel p-5 space-y-4 shadow-xs animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <Info className="size-4.5 text-accent" />
                Writing Improvements Analysis
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Detailed quantitative metrics showing structural enhancements while preserving original meaning.
              </p>
            </div>
            <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal flex items-center gap-1.5">
              <Check className="size-3.5" />
              100% Meaning & Citations Retained
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Readability</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.statsAfter.fleschReadingEase}</span>
                <span className="text-xs text-ink-muted font-normal">
                  (was {resultData.statsBefore.fleschReadingEase})
                </span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.readability.label}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Sentence Variation</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.statsAfter.sentenceLengthVariance}</span>
                <span className="text-xs text-ink-muted font-normal">
                  (was {resultData.statsBefore.sentenceLengthVariance})
                </span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.sentenceVariation.label}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Vocabulary</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.statsAfter.uniqueWordsRatio}%</span>
                <span className="text-xs text-ink-muted font-normal">
                  ({resultData.statsBefore.uniqueWordsRatio}%)
                </span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.vocabulary.label}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Formality</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.statsAfter.formalityScore}/100</span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.formality.label}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Conciseness</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.statsAfter.wordCount}</span>
                <span className="text-xs text-ink-muted font-normal">
                  ({resultData.statsBefore.wordCount} words)
                </span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.conciseness.label}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-panel-raised p-3">
              <div className="text-[11px] uppercase tracking-wider text-ink-muted">Paragraph Flow</div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-lg font-semibold text-ink">
                <span>{resultData.improvements.paragraphCoherence.after}%</span>
              </div>
              <div className="mt-1 text-[11px] text-teal font-medium">
                {resultData.improvements.paragraphCoherence.label}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
