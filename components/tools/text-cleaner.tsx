"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

interface Rules {
  removeHash: boolean;
  removeAsterisk: boolean;
  removeUnderscore: boolean;
  removeDash: boolean;
  removeTilde: boolean;
  removePipe: boolean;
  removeMarkdown: boolean;
  removeEmojis: boolean;
  removeSpecialChars: boolean;
  removeDuplicatePunctuation: boolean;
  removeExtraSpaces: boolean;
  removeInvisibleChars: boolean;
}

const PRESETS = {
  basic: {
    removeExtraSpaces: true,
    removeInvisibleChars: true,
    removeDuplicatePunctuation: true,
    removeHash: false,
    removeAsterisk: false,
    removeUnderscore: false,
    removeDash: false,
    removeTilde: false,
    removePipe: false,
    removeMarkdown: false,
    removeEmojis: false,
    removeSpecialChars: false,
  },
  symbol: {
    removeExtraSpaces: false,
    removeInvisibleChars: false,
    removeDuplicatePunctuation: false,
    removeHash: true,
    removeAsterisk: true,
    removeUnderscore: true,
    removeDash: false,
    removeTilde: true,
    removePipe: true,
    removeMarkdown: true,
    removeEmojis: false,
    removeSpecialChars: false,
  },
  full: {
    removeExtraSpaces: true,
    removeInvisibleChars: true,
    removeDuplicatePunctuation: true,
    removeHash: true,
    removeAsterisk: true,
    removeUnderscore: true,
    removeDash: true,
    removeTilde: true,
    removePipe: true,
    removeMarkdown: true,
    removeEmojis: true,
    removeSpecialChars: true,
  },
} as const;

const ruleLabels: Record<keyof Rules, string> = {
  removeHash: "Remove #",
  removeAsterisk: "Remove *",
  removeUnderscore: "Remove _",
  removeDash: "Remove -",
  removeTilde: "Remove ~",
  removePipe: "Remove |",
  removeMarkdown: "Remove Markdown formatting",
  removeEmojis: "Remove emojis",
  removeSpecialChars: "Remove special characters (< > ^)",
  removeDuplicatePunctuation: "Remove duplicate punctuation",
  removeExtraSpaces: "Remove extra spaces",
  removeInvisibleChars: "Remove invisible/unwanted characters",
};

function getWordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function getParagraphCount(s: string) {
  return s.split(/\n\s*\n/).filter(Boolean).length;
}

export function TextCleaner() {
  const [text, setText] = useState("");
  const [rules, setRules] = useState<Rules>(PRESETS.basic);

  const output = useMemo(() => {
    let lines = text.split("\n");

    lines = lines.map((line) => {
      let l = line;

      if (rules.removeMarkdown) {
        // Headings (e.g. "### Heading" -> "Heading")
        l = l.replace(/^#{1,6}\s+/g, "");
        // Blockquotes
        l = l.replace(/^>\s+/g, "");
        // Unordered lists (bullet formatting)
        l = l.replace(/^[\*\-\+]\s+/g, "");
        // Bold and Italic (e.g. "**bold text**" -> "bold text")
        l = l.replace(/(\*\*|__)(.*?)\1/g, "$2");
        l = l.replace(/(\*|_)(.*?)\1/g, "$2");
        // Strikethrough
        l = l.replace(/(~~)(.*?)\1/g, "$2");
        // Inline code
        l = l.replace(/`(.*?)`/g, "$1");
      }

      if (rules.removeHash) l = l.replace(/#/g, "");
      if (rules.removeAsterisk) l = l.replace(/\*/g, "");
      if (rules.removeUnderscore) l = l.replace(/_/g, "");
      if (rules.removeDash) l = l.replace(/-/g, "");
      if (rules.removeTilde) l = l.replace(/~/g, "");
      if (rules.removePipe) l = l.replace(/\|/g, "");

      if (rules.removeSpecialChars) {
        l = l.replace(/[<>\^{}\[\]\\]/g, "");
      }

      if (rules.removeEmojis) {
        l = l.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, "");
      }

      if (rules.removeDuplicatePunctuation) {
        l = l.replace(/([!?,.;:])\1+/g, "$1");
      }

      if (rules.removeInvisibleChars) {
        l = l.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\u200B-\u200D\uFEFF]/g, "");
      }

      if (rules.removeExtraSpaces) {
        l = l.replace(/[ \t]{2,}/g, " ");
      }

      return l;
    });

    return lines.join("\n");
  }, [text, rules]);

  const originalCharCount = text.length;
  const cleanedCharCount = output.length;
  const charsRemoved = originalCharCount - cleanedCharCount;

  const originalWordCount = getWordCount(text);
  const cleanedWordCount = getWordCount(output);

  const originalParagraphCount = getParagraphCount(text);
  const cleanedParagraphCount = getParagraphCount(output);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button size="sm" variant="outline" onClick={() => setRules(PRESETS.basic)}>
          Basic Clean
        </Button>
        <Button size="sm" variant="outline" onClick={() => setRules(PRESETS.symbol)}>
          Symbol Clean
        </Button>
        <Button size="sm" variant="outline" onClick={() => setRules(PRESETS.full)}>
          Full Clean
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:grid-cols-3 md:grid-cols-4">
        {(Object.keys(ruleLabels) as (keyof Rules)[]).map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={rules[key]}
              onChange={(e) => setRules((r) => ({ ...r, [key]: e.target.checked }))}
              className="accent-accent"
            />
            {ruleLabels[key]}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Original Text</h3>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste messy text here\u2026"
            aria-label="Input text"
            className="min-h-64 font-sans text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => setText("")}>
            Clear
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Cleaned Text</h3>
          <Textarea
            value={output}
            readOnly
            aria-label="Cleaned output"
            className="min-h-64 bg-panel-raised font-sans text-sm"
          />
          <div className="flex justify-end">
            <CopyButton value={output} />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-panel p-4">
        <h4 className="mb-3 text-sm font-semibold text-ink">Cleaning Stats</h4>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ink-muted">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted/70">Characters Removed</span>
            <span className="mt-1 text-ink">{charsRemoved > 0 ? charsRemoved : 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted/70">Words Preserved</span>
            <span className="mt-1 text-ink">
              {cleanedWordCount} / {originalWordCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted/70">Paragraphs Preserved</span>
            <span className="mt-1 text-ink">
              {cleanedParagraphCount} / {originalParagraphCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted/70">Total Characters</span>
            <span className="mt-1 text-ink">
              {originalCharCount} &rarr; {cleanedCharCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
